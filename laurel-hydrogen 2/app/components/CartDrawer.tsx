import {Link} from '@remix-run/react';
import type {Cart, Product} from '~/lib/types';
import {formatMoney} from '~/lib/types';
import {useCartUI} from '~/components/CartUI';
import {CartLineItem} from '~/components/CartLineItem';
import {FreeShippingBar} from '~/components/FreeShippingBar';
import {ProductCard} from '~/components/ProductCard';

/**
 * Drawer-first cart (BLUEPRINT §0.4, copy deck §5.7): "Your Stash" title,
 * free-shipping progress, line items, empty-state trending recs, checkout
 * with live subtotal, trust row.
 */
export function CartDrawer({
  cart,
  recommendations,
}: {
  cart: Cart | null;
  recommendations: Product[];
}) {
  const {cartOpen, closeCart} = useCartUI();

  if (!cartOpen) return null;

  const subtotal = cart ? parseFloat(cart.cost.subtotalAmount.amount) : 0;
  const isMockCheckout = cart?.checkoutUrl.includes('unavailable-in-mock-mode');

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-label="Cart drawer">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close cart drawer"
        onClick={closeCart}
      />
      <aside className="absolute inset-y-0 right-0 flex w-[26rem] max-w-[92vw] flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-laurel-900/10 px-5 py-4">
          <h2 className="font-display text-xl text-laurel-900">Your Stash</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close cart drawer"
          >
            ✕
          </button>
        </div>

        <FreeShippingBar subtotal={subtotal} />

        <div className="flex-1 overflow-y-auto px-5">
          {cart && cart.lines.length > 0 ? (
            <div className="divide-y divide-laurel-900/10">
              {cart.lines.map((line) => (
                <CartLineItem key={line.id} line={line} />
              ))}
            </div>
          ) : (
            <div className="py-8 text-center">
              <p className="font-display text-lg text-laurel-900">
                Well, this is awkward. Your cart is naked.
              </p>
              {recommendations.length > 0 ? (
                <>
                  <p className="eyebrow mb-4 mt-6">Trending Now</p>
                  <div className="grid grid-cols-2 gap-3 text-left">
                    {recommendations.slice(0, 2).map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        compact
                        onNavigate={closeCart}
                      />
                    ))}
                  </div>
                </>
              ) : null}
              <Link
                to="/collections/all"
                className="btn-primary mt-6"
                onClick={closeCart}
              >
                Dress it up →
              </Link>
            </div>
          )}
        </div>

        {cart && cart.lines.length > 0 ? (
          <div className="border-t border-laurel-900/10 px-5 py-4">
            {isMockCheckout ? (
              <div className="mb-2 w-full">
                <button type="button" className="btn-primary w-full" disabled>
                  Checkout — {formatMoney(cart.cost.subtotalAmount)}
                </button>
                <p className="mt-1 text-center text-[11px] text-ink/50">
                  Checkout activates once store credentials are connected.
                </p>
              </div>
            ) : (
              <a href={cart.checkoutUrl} className="btn-primary mb-2 w-full">
                Checkout — {formatMoney(cart.cost.subtotalAmount)}
              </a>
            )}
            <Link
              to="/collections/all"
              className="block text-center text-xs underline"
              onClick={closeCart}
            >
              or keep shopping
            </Link>
            <p className="mt-3 text-center text-[11px] text-ink/50">
              Free US shipping $29+ · Shipping insurance included · 30-day
              returns
            </p>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
