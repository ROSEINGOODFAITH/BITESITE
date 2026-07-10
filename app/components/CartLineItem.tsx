import {Link, useFetcher} from '@remix-run/react';
import type {CartLine} from '~/lib/types';
import {formatMoney} from '~/lib/types';
import {displayTitle} from '~/lib/display-titles';
import {useCartUI} from '~/components/CartUI';

export function CartLineItem({line}: {line: CartLine}) {
  const updateFetcher = useFetcher();
  const removeFetcher = useFetcher();
  const {closeCart} = useCartUI();

  const {merchandise} = line;
  const title = displayTitle(merchandise.product.handle, merchandise.product.title);
  const showVariant =
    merchandise.title && merchandise.title.toLowerCase() !== 'default title';

  const setQuantity = (quantity: number) => {
    updateFetcher.submit(
      {
        cartAction: 'LinesUpdate',
        lines: JSON.stringify([{id: line.id, quantity}]),
      },
      {method: 'post', action: '/cart'},
    );
  };

  return (
    <div className="flex gap-3 py-4">
      {merchandise.image ? (
        <Link
          to={`/products/${merchandise.product.handle}`}
          onClick={closeCart}
          className="shrink-0"
        >
          <img
            src={merchandise.image.url}
            alt={merchandise.image.altText ?? title}
            className="h-20 w-20 object-cover"
            loading="lazy"
          />
        </Link>
      ) : null}

      <div className="flex flex-1 flex-col gap-1">
        <Link
          to={`/products/${merchandise.product.handle}`}
          onClick={closeCart}
          className="text-sm font-semibold hover:underline"
        >
          {title}
        </Link>
        {showVariant ? (
          <p className="text-xs text-ink/60">{merchandise.title}</p>
        ) : null}
        {line.sellingPlanName ? (
          <p className="text-xs font-semibold text-laurel-700">
            {line.sellingPlanName}
          </p>
        ) : null}

        <div className="mt-1 flex items-center gap-3">
          <div className="flex items-center border border-laurel-900/20">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="px-2 py-1 text-sm disabled:opacity-40"
              disabled={line.quantity <= 1 || updateFetcher.state !== 'idle'}
              onClick={() => setQuantity(line.quantity - 1)}
            >
              −
            </button>
            <span className="min-w-6 px-1 text-center text-sm">
              {line.quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="px-2 py-1 text-sm disabled:opacity-40"
              disabled={updateFetcher.state !== 'idle'}
              onClick={() => setQuantity(line.quantity + 1)}
            >
              +
            </button>
          </div>
          <button
            type="button"
            className="text-xs text-ink/50 underline hover:text-ink"
            disabled={removeFetcher.state !== 'idle'}
            onClick={() =>
              removeFetcher.submit(
                {cartAction: 'LinesRemove', lineIds: JSON.stringify([line.id])},
                {method: 'post', action: '/cart'},
              )
            }
          >
            Remove
          </button>
        </div>
      </div>

      <p className="text-sm font-semibold">{formatMoney(line.cost.totalAmount)}</p>
    </div>
  );
}
