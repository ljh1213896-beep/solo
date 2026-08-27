function cookieValue(request:Request, name:string) {
  const cookies = request.headers.get('cookie') ?? '';
  const item = cookies.split(';').map(value => value.trim()).find(value => value.startsWith(`${name}=`));
  return item ? decodeURIComponent(item.slice(name.length + 1)) : null;
}

function messagePage(message:string, ok = true) {
  const payload = ok
    ? `authorization:github:success:${JSON.stringify({ provider:'github', token:message })}`
    : `authorization:github:error:${JSON.stringify({ message })}`;
  const safePayload = JSON.stringify(payload).replace(/</g, '\\u003c');
  return new Response(`<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><title>Decap CMS 登录</title></head><body><p>${ok ? '登录成功，正在返回内容后台…' : '登录失败，请关闭窗口后重试。'}</p><script>(function(){var payload=${safePayload};function receive(event){window.opener.postMessage(payload,event.origin);window.close()}window.addEventListener('message',receive,{once:true});window.opener.postMessage('authorizing:github','*')})()</script></body></html>`, {
    status: ok ? 200 : 400,
    headers: {
      'content-type':'text/html; charset=utf-8',
      'cache-control':'no-store',
      'content-security-policy':"default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'",
      'set-cookie':'decap_oauth_state=; Path=/api/decap; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
}

export async function GET(request:Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState = cookieValue(request, 'decap_oauth_state');
  const clientId = process.env.DECAP_GITHUB_CLIENT_ID;
  const clientSecret = process.env.DECAP_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) return messagePage('OAuth 环境变量尚未配置', false);
  if (!code || !state || !storedState || state !== storedState) return messagePage('OAuth state 校验失败', false);

  const callback = new URL('/api/decap/callback', request.url).toString();
  const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
    method:'POST',
    headers:{ accept:'application/json', 'content-type':'application/json', 'user-agent':'ljh-decap-cms' },
    body:JSON.stringify({ client_id:clientId, client_secret:clientSecret, code, redirect_uri:callback }),
  });
  const tokenResult = await tokenResponse.json() as { access_token?:string; error_description?:string; error?:string };
  if (!tokenResponse.ok || !tokenResult.access_token) {
    return messagePage(tokenResult.error_description ?? tokenResult.error ?? 'GitHub 未返回访问令牌', false);
  }
  return messagePage(tokenResult.access_token);
}
