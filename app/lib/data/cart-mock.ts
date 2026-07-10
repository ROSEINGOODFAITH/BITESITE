import type {
  Cart,
  CartLine,
  CartLineInput,
  CartLineUpdateInput,
  Money,
} from '~/lib/types';
import type {CartAdapter, CartResult} from '~/lib/data';
import type {AppSession} from '~/lib/session';
import {findVariant} from '~/lib/data/mock';

const SESSION_KEY = 'mockCartLines';

interface StoredLine {
  merchandiseId: string;
  quantity: number;
  sellingPlanId: string | null;
}

function lineId(line: StoredLine): string {
  return line.sellingPlanId
    ? `${line.merchandiseId}::${line.sellingPlanId}`
    : line.merchandiseId;
}

function usd(amount: number): Money {
  return {amount: amount.toFixed(2), currencyCode: 'USD'};
}

/**
 * Session-backed cart for mock mode. Mirrors the CartAdapter surface of the
 * live Hydrogen cart handler so routes/components are mode-agnostic.
 * Checkout is a dead-end by design (no credentials, no real checkout).
 */
export class MockCart implements CartAdapter {
  constructor(private session: AppSession) {}

  private read(): StoredLine[] {
    const raw = this.session.get(SESSION_KEY) as StoredLine[] | undefined;
    return Array.isArray(raw) ? raw : [];
  }

  private write(lines: StoredLine[]) {
    this.session.set(
      SESSION_KEY,
      lines.filter((l) => l.quantity > 0),
    );
  }

  private hydrate(lines: StoredLine[]): Cart | null {
    const cartLines: CartLine[] = [];
    let subtotal = 0;

    for (const stored of lines) {
      const hit = findVariant(stored.merchandiseId);
      if (!hit) continue;
      const {product, variant} = hit;
      const unit = parseFloat(variant.price.amount);
      const total = unit * stored.quantity;
      subtotal += total;

      let sellingPlanName: string | null = null;
      if (stored.sellingPlanId) {
        for (const group of product.sellingPlanGroups) {
          const plan = group.sellingPlans.find(
            (p) => p.id === stored.sellingPlanId,
          );
          if (plan) sellingPlanName = group.name;
        }
        sellingPlanName = sellingPlanName ?? 'Soap-scribe & Save';
      }

      cartLines.push({
        id: lineId(stored),
        quantity: stored.quantity,
        sellingPlanName,
        merchandise: {
          id: variant.id,
          title: variant.title,
          image: variant.image ?? product.featuredImage,
          price: variant.price,
          compareAtPrice: variant.compareAtPrice,
          product: {handle: product.handle, title: product.title},
          selectedOptions: variant.selectedOptions,
        },
        cost: {totalAmount: usd(total)},
      });
    }

    if (cartLines.length === 0) return null;

    return {
      id: 'gid://mock/Cart/session',
      totalQuantity: cartLines.reduce((sum, l) => sum + l.quantity, 0),
      // Mock mode has no real checkout — the cart page explains this.
      checkoutUrl: '/cart?checkout=unavailable-in-mock-mode',
      lines: cartLines,
      cost: {subtotalAmount: usd(subtotal), totalAmount: usd(subtotal)},
    };
  }

  private result(): CartResult {
    // Session cookie commit is handled centrally in server.ts (isPending).
    return {cart: this.hydrate(this.read()), headers: new Headers()};
  }

  async get(): Promise<Cart | null> {
    return this.hydrate(this.read());
  }

  async addLines(inputs: CartLineInput[]): Promise<CartResult> {
    const lines = this.read();
    for (const input of inputs) {
      if (!findVariant(input.merchandiseId)) continue;
      const sellingPlanId = input.sellingPlanId ?? null;
      const existing = lines.find(
        (l) =>
          l.merchandiseId === input.merchandiseId &&
          l.sellingPlanId === sellingPlanId,
      );
      if (existing) {
        existing.quantity += input.quantity;
      } else {
        lines.push({
          merchandiseId: input.merchandiseId,
          quantity: input.quantity,
          sellingPlanId,
        });
      }
    }
    this.write(lines);
    return this.result();
  }

  async updateLines(updates: CartLineUpdateInput[]): Promise<CartResult> {
    const lines = this.read();
    for (const update of updates) {
      const target = lines.find((l) => lineId(l) === update.id);
      if (target) target.quantity = update.quantity;
    }
    this.write(lines);
    return this.result();
  }

  async removeLines(lineIds: string[]): Promise<CartResult> {
    const lines = this.read().filter((l) => !lineIds.includes(lineId(l)));
    this.write(lines);
    return this.result();
  }
}
