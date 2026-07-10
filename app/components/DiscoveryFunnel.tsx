import {Link} from '@remix-run/react';
import type {Product} from '~/lib/types';
import {ProductCard} from '~/components/ProductCard';

/**
 * Discovery-set funnel section (BRAND_CONTENT §2 row 11):
 * "Commitment issues? Start small." — 3 discovery products + collection CTA.
 */
export function DiscoveryFunnel({products}: {products: Product[]}) {
  return (
    <section className="bg-laurel-100/50 py-16">
      <div className="mx-auto max-w-site px-6 text-center">
        <h2 className="font-display text-3xl text-laurel-900">
          Commitment issues? Start small.
        </h2>
        <p className="mx-auto mt-2 max-w-lg text-sm text-ink/70">
          $18 minis and discovery sets. Find your scent, then graduate to the
          big bottle.
        </p>
        <div className="mt-8 grid grid-cols-1 gap-6 text-left sm:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <Link to="/collections/sampler-sets" className="btn-secondary mt-8">
          Shop Discovery Sets
        </Link>
      </div>
    </section>
  );
}
