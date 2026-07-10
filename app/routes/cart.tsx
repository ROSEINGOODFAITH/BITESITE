import {Link, useLoaderData} from '@remix-run/react';
import {
  json,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import type {
  Cart,
  CartLineInput,
  CartLineUpdateInput,
} from '~/lib/types';
import {formatMoney} from '~/lib/types';
import {BRAND_NAME} from '~/lib/const';
import {CartLineItem} from '~/components/CartLineItem';
import {FreeShippingBar} from '~/components/FreeShippingBar';

export const meta: MetaFunction = () => [{title: `Your Stash — ${BRAND_NAME}`}];

/**
 * Cart mutations action. The drawer is the primary UI (BLUEPRINT §0.4);
 * this route is the mutation endpoint AND the no-JS/full-page fallback.
 */
export async function action({request, context}: ActionFunctionArgs) {
  const formData = await request.formData();
  const cartAction = String(formData.get('cartAction') ?? '');

  let result: {cart: Cart | null; headers: Headers};

  switch (cartAction) {
    case 'LinesAdd': {
      const lines = JSON.parse(
        String(formData.get('lines') ?? '[]'),
      ) as CartLineInput[];
      result = await context.cart.addLines(lines);
      break;
    }
    case 'LinesUpdate': {
      const lines = JSON.parse(
        String(formData.get('lines') ?? '[]'),
      ) as CartLineUpdateInput[];
      result = await context.cart.updateLines(lines);
      break;
    }
    case 'LinesRemove': {
      const lineIds = JSON.parse(
        String(formData.get('lineIds') ?? '[]'),
      ) as string[];
      result = await context.cart.removeLines(lineIds);
      break;
    }
    default:
      throw new Response(`Unknown cart action: ${cartAction}`, {status: 400});
  }

  return json(
    {ok: true, cart: result.cart},
    {headers: result.headers},
  );
}

export async function loader({context}: LoaderFunctionArgs) {
  const cart = await context.cart.get();
  return json({cart});
}

export default function CartPage() {
  const {cart} = useLoaderData<typeof loader>();
  const typedCart = cart as Cart | null;
  const subtotal = typedCart
    ? parseFloat(typedCart.cost.subtotalAmount.amount)
    : 0;
  const isMockCheckout = typedCart?.checkoutUrl.includes(
    'unavailable-in-mock-mode',
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-6 font-display text-4xl text-laurel-900">Your Stash</h1>

      {typedCart && typedCart.lines.length > 0 ? (
        <div className="border border-laurel-900/10 bg-cream">
          <FreeShippingBar subtotal={subtotal} />
          <div className="divide-y divide-laurel-900/10 px-5">
            {typedCart.lines.map((line) => (
              <CartLineItem key={line.id} line={line} />
            ))}
          </div>
          <div className="border-t border-laurel-900/10 px-5 py-4">
            {isMockCheckout ? (
              <>
                <button type="button" className="btn-primary w-full" disabled>
                  Checkout — {formatMoney(typedCart.cost.subtotalAmount)}
                </button>
                <p className="mt-1 text-center text-[11px] text-ink/50">
                  Checkout activates once store credentials are connected.
                </p>
              </>
            ) : (
              <a href={typedCart.checkoutUrl} className="btn-primary w-full">
                Checkout — {formatMoney(typedCart.cost.subtotalAmount)}
              </a>
            )}
            <p className="mt-3 text-center text-[11px] text-ink/50">
              Free US shipping $29+ · Shipping insurance included · 30-day
              returns
            </p>
          </div>
        </div>
      ) : (
        <div className="py-12 text-center">
          <p className="font-display text-xl text-laurel-900">
            Well, this is awkward. Your cart is naked.
          </p>
          <Link to="/collections/all" className="btn-primary mt-6">
            Dress it up →
          </Link>
        </div>
      )}
    </div>
  );
}
