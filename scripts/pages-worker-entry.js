import app from './app.js';

const PUBLIC_ASSET_PATH =
  /\.(?:avif|css|gif|ico|jpe?g|js|json|mp4|png|svg|webm|webp|woff2?|ttf)$/i;

export default {
  async fetch(request, env, context) {
    const { pathname } = new URL(request.url);

    if (pathname.startsWith('/_next/static/') || PUBLIC_ASSET_PATH.test(pathname)) {
      const assetResponse = await env.ASSETS.fetch(request);

      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    return app.fetch(request, env, context);
  },
};
