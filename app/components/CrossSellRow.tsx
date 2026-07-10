import type {Product} from '~/lib/types';
import {ProductCard} from '~/components/ProductCard';

/**
 * "Pairs well with" cross-sell row (BRAND_CONTENT §3.3 scent-family map):
 * up to 3 same-family items ordered EdP → deodorant → cream/bundle,
 * falling back to discovery sets. The loader computes the picks.
 */
export function CrossSellRow({products}: {products: Product[]}) {
  if (products.length === 0) return null;
  return (
    <section className="border-t border-laurel-900/10 py-12">
      <div className="mx-auto max-w-site px-6">
        <p className="eyebrow mb-1">Pairs well with</p>
        <h2 className="mb-6 font-display text-2xl text-laurel-900">
          Complete the scent story.
        </h2>
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
