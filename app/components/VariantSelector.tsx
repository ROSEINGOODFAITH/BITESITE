import type {Product, ProductVariant} from '~/lib/types';
import {formatMoney} from '~/lib/types';
import {sizeLabel} from '~/lib/purchase-options';

/**
 * Size selector for two-size EdPs — "50ml Bottle / 5ml Mini" framing
 * (BRAND_CONTENT §3.2: mini = "Try it for $18" secondary option).
 */
export function VariantSelector({
  product,
  selectedVariantId,
  onSelect,
}: {
  product: Product;
  selectedVariantId: string;
  onSelect: (variant: ProductVariant) => void;
}) {
  if (product.variants.length <= 1) return null;

  return (
    <fieldset>
      <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/60">
        Size
      </legend>
      <div className="flex flex-wrap gap-2">
        {product.variants.map((variant) => {
          const selected = variant.id === selectedVariantId;
          return (
            <label
              key={variant.id}
              className={`cursor-pointer border px-4 py-2 text-sm transition-colors ${
                selected
                  ? 'border-laurel-900 bg-laurel-900 text-cream'
                  : 'border-laurel-900/30 hover:border-laurel-900'
              } ${!variant.availableForSale ? 'opacity-50' : ''}`}
            >
              <input
                type="radio"
                name={`variant-${product.handle}`}
                value={variant.id}
                checked={selected}
                onChange={() => onSelect(variant)}
                className="sr-only"
              />
              {sizeLabel(variant.title)}
              <span className={selected ? 'text-cream/80' : 'text-ink/50'}>
                {' '}
                · {formatMoney(variant.price)}
              </span>
              {!variant.availableForSale ? ' · sold out' : ''}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
