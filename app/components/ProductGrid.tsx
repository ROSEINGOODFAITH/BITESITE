import type {Product} from '~/lib/types';
import {ProductCard} from '~/components/ProductCard';

export function ProductGrid({
  products,
  columns = 4,
}: {
  products: Product[];
  columns?: 3 | 4;
}) {
  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-ink/60">
        Nothing here yet — check back after the next drop.
      </p>
    );
  }
  return (
    <div
      className={`grid grid-cols-2 gap-x-4 gap-y-8 ${
        columns === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
      }`}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
