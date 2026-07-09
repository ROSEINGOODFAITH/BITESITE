import type {HydrogenCart} from '@shopify/hydrogen';
import type {
  Cart,
  CartLine,
  CartLineInput,
  CartLineUpdateInput,
} from '~/lib/types';
import type {CartAdapter, CartResult} from '~/lib/data';

/**
 * Wraps Hydrogen's cart handler (real Storefront API cart mutations) behind
 * the mode-agnostic CartAdapter interface. The handler's default cart query
 * includes lines, costs, checkoutUrl and selling plan allocations.
 */
export class LiveCart implements CartAdapter {
  constructor(private handler: HydrogenCart) {}

  async get(): Promise<Cart | null> {
    const cart = await this.handler.get();
    return cart ? mapApiCart(cart) : null;
  }

  async addLines(lines: CartLineInput[]): Promise<CartResult> {
    const result = await this.handler.addLines(
      lines.map((line) => ({
        merchandiseId: line.merchandiseId,
        quantity: line.quantity,
        // Real Selling Plan ids flow straight through to the API.
        ...(line.sellingPlanId ? {sellingPlanId: line.sellingPlanId} : {}),
      })),
    );
    return this.finalize(result);
  }

  async updateLines(lines: CartLineUpdateInput[]): Promise<CartResult> {
    const result = await this.handler.updateLines(
      lines.map((line) => ({id: line.id, quantity: line.quantity})),
    );
    return this.finalize(result);
  }

  async removeLines(lineIds: string[]): Promise<CartResult> {
    const result = await this.handler.removeLines(lineIds);
    return this.finalize(result);
  }

  private finalize(result: {cart: unknown}): CartResult {
    const rawCart = result.cart as {id?: string} | null | undefined;
    const headers =
      rawCart?.id != null
        ? this.handler.setCartId(rawCart.id)
        : new Headers();
    return {
      cart: rawCart ? mapApiCart(rawCart) : null,
      headers,
    };
  }
}

/* ------------------------------------------------------------------ */
/* Defensive mapping from the cart handler's query fragment            */
/* ------------------------------------------------------------------ */

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapApiCart(raw: any): Cart {
  const lineNodes: any[] = raw?.lines?.nodes ?? raw?.lines?.edges?.map((e: any) => e.node) ?? [];

  const lines: CartLine[] = lineNodes.map((node: any): CartLine => {
    const merchandise = node?.merchandise ?? {};
    return {
      id: node?.id ?? '',
      quantity: node?.quantity ?? 0,
      sellingPlanName:
        node?.sellingPlanAllocation?.sellingPlan?.name ?? null,
      merchandise: {
        id: merchandise?.id ?? '',
        title: merchandise?.title ?? '',
        image: merchandise?.image ?? null,
        price: merchandise?.price ?? {amount: '0', currencyCode: 'USD'},
        compareAtPrice: merchandise?.compareAtPrice ?? null,
        product: {
          handle: merchandise?.product?.handle ?? '',
          title: merchandise?.product?.title ?? '',
        },
        selectedOptions: merchandise?.selectedOptions ?? [],
      },
      cost: {
        totalAmount:
          node?.cost?.totalAmount ?? {amount: '0', currencyCode: 'USD'},
      },
    };
  });

  return {
    id: raw?.id ?? '',
    totalQuantity: raw?.totalQuantity ?? 0,
    checkoutUrl: raw?.checkoutUrl ?? '',
    lines,
    cost: {
      subtotalAmount:
        raw?.cost?.subtotalAmount ?? {amount: '0', currencyCode: 'USD'},
      totalAmount:
        raw?.cost?.totalAmount ??
        raw?.cost?.subtotalAmount ?? {amount: '0', currencyCode: 'USD'},
    },
  };
}
