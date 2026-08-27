const missingConfig = () => new Response(
  'Decap CMS GitHub OAuth 尚未配置。请设置 DECAP_GITHUB_CLIENT_ID 与 DECAP_GITHUB_CLIENT_SECRET。',
  { status: 503, headers: { 'content-type':'text/plain; charset=utf-8' } },
);

export async function GET(request:Request) {
  const clientId = process.env.DECAP_GITHUB_CLIENT_ID;
  if (!clientId) return missingConfig();

  const state = crypto.randomUUID();
  const callback = new URL('/api/decap/callback', request.url).toString();
  const authorize = new URL('https://github.com/login/oauth/authorize');
  authorize.searchParams.set('client_id', clientId);
  authorize.searchParams.set('redirect_uri', callback);
  authorize.searchParams.set('scope', 'repo user');
  authorize.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      location: authorize.toString(),
      'set-cookie': `decap_oauth_state=${state}; Path=/api/decap; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
      'cache-control': 'no-store',
    },
  });
}
