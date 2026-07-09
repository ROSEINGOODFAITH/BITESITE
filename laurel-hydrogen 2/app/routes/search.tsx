import {Form, useLoaderData, useSearchParams} from '@remix-run/react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import type {Product} from '~/lib/types';
import {BRAND_NAME} from '~/lib/const';
import {ProductGrid} from '~/components/ProductGrid';

export const meta: MetaFunction = () => [{title: `Search — ${BRAND_NAME}`}];

export async function loader({request, context}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q') ?? '';
  const results = query ? await context.data.searchProducts(query) : [];
  return json({query, results});
}

export default function SearchPage() {
  const {query, results} = useLoaderData<typeof loader>();
  const [params] = useSearchParams();

  return (
    <div className="mx-auto max-w-site px-6 py-12">
      <h1 className="mb-6 text-center font-display text-4xl text-laurel-900">
        Looking for something?
      </h1>
      <Form method="get" className="mx-auto mb-10 flex max-w-md gap-2">
        <label htmlFor="search-input" className="sr-only">
          Search products
        </label>
        <input
          id="search-input"
          type="search"
          name="q"
          defaultValue={params.get('q') ?? ''}
          placeholder="mourning wood, deodorant, minis…"
          className="w-full border border-laurel-900/30 bg-cream px-4 py-3 text-sm outline-none focus:border-laurel-900"
        />
        <button type="submit" className="btn-primary shrink-0">
          Search
        </button>
      </Form>

      {query ? (
        <>
          <p className="mb-6 text-center text-sm text-ink/60">
            {results.length} result{results.length === 1 ? '' : 's'} for
            &ldquo;{query}&rdquo;
          </p>
          <ProductGrid products={results as Product[]} />
        </>
      ) : (
        <p className="text-center text-sm text-ink/60">
          Try a scent, a product, or a mood.
        </p>
      )}
    </div>
  );
}
