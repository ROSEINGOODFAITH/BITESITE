import {Link, useLoaderData} from '@remix-run/react';
import {
  json,
  redirect,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import type {Product} from '~/lib/types';
import {COLLECTION_META, FILTER_PILLS} from '~/lib/collections-map';
import {BRAND_NAME} from '~/lib/const';
import {ProductGrid} from '~/components/ProductGrid';

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data ? `${data.title} — ${BRAND_NAME}` : BRAND_NAME},
  {name: 'description', content: data?.headline ?? ''},
];

export async function loader({params, context}: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle) throw new Response('Not found', {status: 404});

  // Redundant internal collection redirects to the canonical funnel (§4).
  if (handle === 'bundles') {
    return redirect('/collections/sampler-sets', 301);
  }

  const collection = await context.data.getCollection(handle, 48);
  if (!collection) throw new Response('Not found', {status: 404});

  const meta = COLLECTION_META[handle];

  return json({
    handle,
    title: collection.title,
    headline: meta?.headline ?? collection.description,
    sub: meta?.sub ?? null,
    products: collection.products,
  });
}

export default function CollectionPage() {
  const {handle, title, headline, sub, products} =
    useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-site px-6 py-10">
      <header className="mb-8 text-center">
        <p className="eyebrow mb-1">{title}</p>
        <h1 className="font-display text-4xl text-laurel-900">{headline}</h1>
        {sub ? <p className="mt-2 text-sm text-ink/60">{sub}</p> : null}
      </header>

      {/* Filter pill row — links between sibling collections (BLUEPRINT §4) */}
      <nav
        aria-label="Browse collections"
        className="mb-10 flex gap-2 overflow-x-auto pb-2"
      >
        {FILTER_PILLS.map((pill) => (
          <Link
            key={pill.handle}
            to={`/collections/${pill.handle}`}
            className={`shrink-0 rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
              pill.handle === handle
                ? 'border-laurel-900 bg-laurel-900 text-cream'
                : 'border-laurel-900/30 hover:border-laurel-900'
            }`}
            aria-current={pill.handle === handle ? 'page' : undefined}
          >
            {pill.label}
          </Link>
        ))}
      </nav>

      <ProductGrid products={products as Product[]} />
    </div>
  );
}
