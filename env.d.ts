/// <reference types="vite/client" />
/// <reference types="@remix-run/react" />
/// <reference types="@shopify/remix-oxygen" />
/// <reference types="@shopify/oxygen-workers-types" />

import type {Storefront} from '@shopify/hydrogen';
import type {CartAdapter, DataAdapter} from '~/lib/data';
import type {AppSession} from '~/lib/session';

declare global {
  /**
   * Environment variables. The site runs with ZERO of these set (mock mode).
   * Set PUBLIC_STORE_DOMAIN + PUBLIC_STOREFRONT_API_TOKEN to switch to the
   * live Storefront API ("LBH NEW TEST SITE" Headless channel).
   */
  interface Env {
    SESSION_SECRET?: string;
    PUBLIC_STORE_DOMAIN?: string;
    PUBLIC_STOREFRONT_API_TOKEN?: string;
    PRIVATE_STOREFRONT_API_TOKEN?: string;
    PUBLIC_STOREFRONT_ID?: string;
  }
}

declare module '@shopify/remix-oxygen' {
  interface AppLoadContext {
    env: Env;
    mode: 'live' | 'mock';
    data: DataAdapter;
    cart: CartAdapter;
    session: AppSession;
    storefront: Storefront | null;
    waitUntil: ExecutionContext['waitUntil'];
  }
}

export {};
