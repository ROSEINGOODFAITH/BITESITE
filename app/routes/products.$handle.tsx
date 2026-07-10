import {useLoaderData} from '@remix-run/react';
import {
  defer,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import type {Product} from '~/lib/types';
import {displayTitle} from '~/lib/display-titles';
import {crossSellHandles} from '~/lib/cross-sell';
import {KIT_HANDLES} from '~/lib/collections-map';
import {BRAND_NAME} from '~/lib/const';
import {MediaGallery} from '~/components/MediaGallery';
import {BuyBox} from '~/components/BuyBox';
import {Accordion} from '~/components/Accordion';
import {CrossSellRow} from '~/components/CrossSellRow';
import {ReviewsPlaceholder} from '~/components/ReviewsPlaceholder';
import {FAQAccordion} from '~/components/FAQAccordion';
import {FAQ_GROUPS} from '~/lib/faq';

export const meta: MetaFunction<typeof loader> = ({data}) => {
  if (!data?.product) return [{title: `Not found — ${BRAND_NAME}`}];
  const p = data.product as Product;
  const title = p.seo?.title ?? `${displayTitle(p.handle, p.title)} — ${BRAND_NAME}`;
  const description = p.seo?.description ?? p.description.slice(0, 155);
  return [
    {title},
    {name: 'description', content: description},
    {property: 'og:type', content: 'product'},
    {property: 'og:title', content: title},
    {property: 'og:price:amount', content: p.priceRange.minVariantPrice.amount},
    {
      property: 'og:price:currency',
      content: p.priceRange.minVariantPrice.currencyCode,
    },
  ];
};

export async function loader({params, context}: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle) throw new Response('Not found', {status: 404});

  const product = await context.data.getProduct(handle);
  if (!product) throw new Response('Not found', {status: 404});

  const crossSells = await context.data.getProductsByHandles(
    crossSellHandles(handle),
  );

  return defer({product, crossSells, isKit: KIT_HANDLES.has(handle)});
}

/** PDP FAQ: objection-handling picks tuned per BLUEPRINT §2.10. */
const PDP_FAQ_IDS = ['q3', 'q4', 'q6', 'q10', 'q13', 'q14', 'q15'];

export default function ProductPage() {
  const {product, crossSells, isKit} = useLoaderData<typeof loader>();
  const p = product as Product;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: displayTitle(p.handle, p.title),
    description: p.description,
    image: p.featuredImage?.url,
    brand: {'@type': 'Brand', name: BRAND_NAME},
    offers: p.variants.map((v) => ({
      '@type': 'Offer',
      price: v.price.amount,
      priceCurrency: v.price.currencyCode,
      availability: v.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    })),
  };

  const faqItems = FAQ_GROUPS.flatMap((g) => g.items).filter((item) =>
    PDP_FAQ_IDS.includes(item.id),
  );

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
      />

      {/* Gallery + buy box */}
      <section className="mx-auto grid max-w-site gap-10 px-6 py-10 lg:grid-cols-2 lg:py-14">
        <MediaGallery images={p.images} alt={displayTitle(p.handle, p.title)} />
        <BuyBox product={p} />
      </section>

      {/* Description + accordion cluster (BLUEPRINT §2.3–2.4 / §3 for kits) */}
      <section className="mx-auto max-w-3xl px-6 pb-12">
        {isKit ? (
          <h2 className="mb-4 font-display text-2xl text-laurel-900">
            What&rsquo;s in the set
          </h2>
        ) : null}
        <div
          className="prose-pdp text-sm text-ink/80"
          dangerouslySetInnerHTML={{__html: p.descriptionHtml}}
        />
        <div className="mt-8">
          <Accordion title="How to use" defaultOpen>
            <ol className="list-decimal space-y-1 pl-5">
              <li>Start the water. Get in. You know this part.</li>
              <li>Lather generously — coconut-derived, so go wild.</li>
              <li>Rinse; the niacinamide and vitamins stay behind.</li>
              <li>Re-up whenever the scent tells you to.</li>
            </ol>
          </Accordion>
          <Accordion title="Ingredients">
            <p>
              Formulated with niacinamide and facial-grade Vitamins A, C, and E
              on a coconut-derived surfactant base. pH balanced, tested on all
              skin types and tones. All ingredients sourced and manufactured in
              Los Angeles.
              {/* TBD-CONFIRM: full INCI list per product before launch */}
            </p>
          </Accordion>
          <Accordion title="What's NOT inside">
            <ul className="list-disc space-y-1 pl-5">
              <li>No SLS / SLES</li>
              <li>No silicones</li>
              <li>No phthalates</li>
              <li>No parabens</li>
              <li>No PEGs</li>
              <li>No animal-derived ingredients — vegan &amp; cruelty-free</li>
            </ul>
          </Accordion>
          <Accordion title="Shipping & returns">
            <p>
              Free US shipping over $29. Shipping insurance included on every
              order (by Shipsurance) — 100% coverage for loss, damage, or
              theft. 30-day return policy.
            </p>
          </Accordion>
        </div>
      </section>

      <CrossSellRow products={crossSells as Product[]} />

      {/* Long-form objection-handling FAQ (BLUEPRINT §2.10) */}
      <section className="mx-auto max-w-3xl px-6 py-12">
        <h2 className="mb-6 text-center font-display text-2xl text-laurel-900">
          Everything else you&rsquo;re wondering
        </h2>
        <FAQAccordion items={faqItems} />
      </section>

      <ReviewsPlaceholder />
    </div>
  );
}
