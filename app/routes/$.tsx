import {Link, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import type {Product} from '~/lib/types';
import {BRAND_NAME} from '~/lib/const';
import {ProductGrid} from '~/components/ProductGrid';

export const meta: MetaFunction = () => [
  {title: `Page not found — ${BRAND_NAME}`},
];

/** 404 splat with trending-products recovery module (BLUEPRINT §13). */
export async function loader({context}: LoaderFunctionArgs) {
  const trending = await context.data.getCollection('black-friday', 4);
  return json(
    {trending: trending?.products ?? []},
    {status: 404},
  );
}

export default function NotFound() {
  const {trending} = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-site px-6 py-16 text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-2 font-display text-4xl text-laurel-900">
        This page went down the drain.
      </h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink/70">
        Whatever you were after isn&rsquo;t here. These are, though — and they
        keep selling out.
      </p>
      <Link to="/collections/all" className="btn-primary mt-6">
        Shop All
      </Link>

      {trending.length > 0 ? (
        <div className="mt-14 text-left">
          <p className="eyebrow mb-6 text-center">Trending Now</p>
          <ProductGrid products={trending as Product[]} />
        </div>
      ) : null}
    </div>
  );
}
