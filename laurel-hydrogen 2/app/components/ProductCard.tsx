import {Link} from '@remix-run/react';
import type {Product} from '~/lib/types';
import {formatMoney} from '~/lib/types';
import {cardTitle, displayBadge} from '~/lib/display-titles';
import {isSubscribable} from '~/lib/purchase-options';
import {familyForHandle} from '~/lib/cross-sell';
import {AddToCartButton} from '~/components/AddToCartButton';

/**
 * Grid product card (BLUEPRINT §C9): image + save badge, cleaned title,
 * scent-note line, Soap-scribe pill (3 wash products only), compare-at
 * strikethrough, quick ATC with price inside the label.
 * Review counts intentionally omitted — no verified review data yet.
 */
export function ProductCard({
  product,
  compact = false,
  onNavigate,
}: {
  product: Product;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  const title = cardTitle(product.handle, product.title);
  const badge = displayBadge(product.handle);
  const variant = product.variants[0];
  const singleVariant = product.variants.length === 1;
  const family = familyForHandle(product.handle);

  const compareAt =
    variant?.compareAtPrice &&
    parseFloat(variant.compareAtPrice.amount) >
      parseFloat(variant.price.amount)
      ? variant.compareAtPrice
      : null;
  const saveAmount = compareAt
    ? parseFloat(compareAt.amount) - parseFloat(variant.price.amount)
    : 0;

  return (
    <div className="group flex flex-col">
      <Link
        to={`/products/${product.handle}`}
        onClick={onNavigate}
        className="relative block overflow-hidden bg-sand"
      >
        {product.featuredImage ? (
          <img
            src={product.featuredImage.url}
            alt={product.featuredImage.altText ?? title}
            className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex aspect-square w-full items-center justify-center text-ink/30">
            {title}
          </div>
        )}
        {saveAmount > 0 ? (
          <span className="absolute left-2 top-2 bg-clay px-2 py-1 text-[11px] font-bold uppercase text-cream">
            Save ${saveAmount.toFixed(0)}
          </span>
        ) : null}
        {badge ? (
          <span className="absolute right-2 top-2 bg-laurel-900 px-2 py-1 text-[11px] font-bold uppercase text-cream">
            {badge}
          </span>
        ) : null}
        {!product.availableForSale ? (
          <span className="absolute bottom-2 left-2 bg-ink/70 px-2 py-1 text-[11px] font-bold uppercase text-cream">
            Sold out
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col gap-1 pt-3">
        <Link
          to={`/products/${product.handle}`}
          onClick={onNavigate}
          className="text-sm font-semibold leading-snug hover:underline"
        >
          {title}
        </Link>
        {!compact && family ? (
          <p className="text-xs italic text-ink/60">{family.notes}</p>
        ) : null}
        {isSubscribable(product) ? (
          <p className="mt-0.5 inline-flex w-fit items-center gap-1 rounded-full bg-laurel-100 px-2 py-0.5 text-[11px] font-semibold text-laurel-800">
            Soap-scribe &amp; Save
          </p>
        ) : null}

        <div className="mt-auto pt-2">
          {singleVariant && variant ? (
            <AddToCartButton
              lines={[{merchandiseId: variant.id, quantity: 1}]}
              disabled={!product.availableForSale}
              label={
                product.availableForSale
                  ? `Add | ${formatMoney(variant.price)}`
                  : 'Sold out'
              }
              variant="secondary"
            />
          ) : (
            <Link
              to={`/products/${product.handle}`}
              onClick={onNavigate}
              className="btn-secondary w-full"
            >
              Options from {formatMoney(product.priceRange.minVariantPrice)}
            </Link>
          )}
          {compareAt ? (
            <p className="mt-1 text-center text-xs text-ink/50">
              <s>{formatMoney(compareAt)}</s>{' '}
              <span className="font-semibold text-clay">
                {formatMoney(variant.price)}
              </span>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
}
