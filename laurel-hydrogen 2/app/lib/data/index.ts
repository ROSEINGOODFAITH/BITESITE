import {
  createCartHandler,
  cartGetIdDefault,
  cartSetIdDefault,
  type Storefront,
} from '@shopify/hydrogen';
import type {
  Cart,
  CartLineInput,
  CartLineUpdateInput,
  Collection,
  Policy,
  Product,
  StoreImage,
} from '~/lib/types';
import type {AppSession} from '~/lib/session';
import {MockAdapter} from '~/lib/data/mock';
import {MockCart} from '~/lib/data/cart-mock';
import {LiveAdapter} from '~/lib/data/live';
import {LiveCart} from '~/lib/data/cart-live';

export interface CollectionSummary {
  handle: string;
  title: string;
  description: string;
  image?: StoreImage | null;
}

/**
 * Single data interface both modes implement. Routes/components only ever
 * talk to this — swapping live/mock is a server.ts concern.
 */
export interface DataAdapter {
  mode: 'live' | 'mock';
  getProduct(handle: string): Promise<Product | null>;
  getCollection(handle: string, first?: number): Promise<Collection | null>;
  listCollections(): Promise<CollectionSummary[]>;
  getProductsByHandles(handles: string[]): Promise<Product[]>;
  searchProducts(query: string): Promise<Product[]>;
  getPolicy(handle: string): Promise<Policy | null>;
  listPolicies(): Promise<Policy[]>;
  getAllProductHandles(): Promise<string[]>;
}

export interface CartResult {
  cart: Cart | null;
  headers: Headers;
}

export interface CartAdapter {
  get(): Promise<Cart | null>;
  addLines(lines: CartLineInput[]): Promise<CartResult>;
  updateLines(lines: CartLineUpdateInput[]): Promise<CartResult>;
  removeLines(lineIds: string[]): Promise<CartResult>;
}

/**
 * Factory used by server.ts.
 * - Live: real Storefront API queries + Hydrogen's cart handler.
 * - Mock: app/data/catalog.json + a session-backed cart. Zero credentials.
 */
export function createDataLayer({
  storefront,
  session,
  request,
}: {
  storefront: Storefront | null;
  session: AppSession;
  request: Request;
}): {data: DataAdapter; cart: CartAdapter} {
  if (storefront) {
    const handler = createCartHandler({
      storefront,
      getCartId: cartGetIdDefault(request.headers),
      setCartId: cartSetIdDefault(),
    });
    return {
      data: new LiveAdapter(storefront),
      cart: new LiveCart(handler),
    };
  }
  return {
    data: new MockAdapter(),
    cart: new MockCart(session),
  };
}
