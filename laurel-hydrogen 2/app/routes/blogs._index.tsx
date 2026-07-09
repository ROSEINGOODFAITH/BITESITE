import {Link} from '@remix-run/react';
import type {MetaFunction} from '@shopify/remix-oxygen';
import {BRAND_NAME} from '~/lib/const';

export const meta: MetaFunction = () => [
  {title: `The Journal — ${BRAND_NAME}`},
];

/**
 * Blog index stub (BLUEPRINT §7). Articles will come from Shopify's blog
 * API (live mode) once content exists — the reference pattern is a featured
 * post + card grid with category tags, all funneling to PDPs.
 */
export default function BlogIndex() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 px-6 py-20 text-center">
      <p className="eyebrow">The Journal</p>
      <h1 className="font-display text-4xl text-laurel-900">
        Words are coming.
      </h1>
      <p className="max-w-md text-sm leading-relaxed text-ink/70">
        Scent science explainers, ingredient deep-dives, and shower thoughts
        (the literal kind). First posts are in the tub — until then, the
        products speak for themselves.
      </p>
      <div className="flex gap-3">
        <Link to="/pages/scent-science" className="btn-secondary">
          Read the Scent Science
        </Link>
        <Link to="/collections/all" className="btn-primary">
          Shop All
        </Link>
      </div>
    </div>
  );
}
