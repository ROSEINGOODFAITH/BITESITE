// Oxygen worker entry for the Laurel Bath House storefront.
// Dual-mode: live Storefront API when credentials exist, local catalog otherwise.

// Virtual entry point for the app
// @ts-expect-error - virtual module provided by the Remix/Hydrogen build
import * as remixBuild from 'virtual:remix/server-build';
import {createRequestHandler, getStorefrontHeaders} from '@shopify/remix-oxygen';
import {createStorefrontClient, type Storefront} from '@shopify/hydrogen';
import {AppSession} from '~/lib/session';
import {createDataLayer} from '~/lib/data';

export default {
  async fetch(
    request: Request,
    env: Env,
    executionContext: ExecutionContext,
  ): Promise<Response> {
    try {
      const waitUntil = executionContext.waitUntil.bind(executionContext);

      // Mock mode must run with zero credentials, so a dev fallback secret is
      // used when SESSION_SECRET is absent. Always set a real one in prod.
      const sessionSecret = env.SESSION_SECRET ?? 'laurel-mock-mode-secret';

      const [cache, session] = await Promise.all([
        caches.open('hydrogen'),
        AppSession.init(request, [sessionSecret]),
      ]);

      const isLive = Boolean(
        env.PUBLIC_STORE_DOMAIN && env.PUBLIC_STOREFRONT_API_TOKEN,
      );

      let storefront: Storefront | null = null;
      if (isLive) {
        storefront = createStorefrontClient({
          cache,
          waitUntil,
          i18n: {language: 'EN', country: 'US'},
          publicStorefrontToken: env.PUBLIC_STOREFRONT_API_TOKEN!,
          privateStorefrontToken: env.PRIVATE_STOREFRONT_API_TOKEN,
          storeDomain: `https://${env.PUBLIC_STORE_DOMAIN}`,
          storefrontId: env.PUBLIC_STOREFRONT_ID,
          storefrontHeaders: getStorefrontHeaders(request),
        }).storefront;
      }

      const {data, cart} = createDataLayer({storefront, session, request});

      const handleRequest = createRequestHandler({
        build: remixBuild,
        mode: process.env.NODE_ENV,
        getLoadContext: () => ({
          env,
          mode: isLive ? ('live' as const) : ('mock' as const),
          data,
          cart,
          session,
          storefront,
          waitUntil,
        }),
      });

      const response = await handleRequest(request);

      if (session.isPending) {
        response.headers.set('Set-Cookie', await session.commit());
      }

      if (response.status === 404) {
        // Let the splat route render the branded 404 (handled by Remix).
        return response;
      }

      return response;
    } catch (error) {
      console.error(error);
      return new Response('An unexpected error occurred', {status: 500});
    }
  },
};
