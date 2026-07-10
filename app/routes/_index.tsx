import {useState} from 'react';
import {Link, useLoaderData} from '@remix-run/react';
import {defer, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import type {Product} from '~/lib/types';
import {ProductGrid} from '~/components/ProductGrid';
import {HowToSteps, LATHER_RITUAL} from '~/components/HowToSteps';
import {TestimonialRow} from '~/components/TestimonialRow';
import {DiscoveryFunnel} from '~/components/DiscoveryFunnel';
import {FAQAccordion} from '~/components/FAQAccordion';
import {homepageFaqItems} from '~/lib/faq';
import {
  BRAND_NAME,
  INSTAGRAM_URL,
  MISSION_BODY,
  MISSION_HEADLINE,
  POSITIONING_LINE,
  SUBSCRIPTION_PROGRAM_NAME,
} from '~/lib/const';

export const meta: MetaFunction = () => [
  {title: `${BRAND_NAME} — Smell Expensive. Behave Optional.`},
  {name: 'description', content: POSITIONING_LINE},
];

export async function loader({context}: LoaderFunctionArgs) {
  const {data} = context;

  const [hero, trending, bodyWash, deodorant, discovery] = await Promise.all([
    data.getProduct('natural-body-wash'),
    data.getCollection('black-friday', 4),
    data.getCollection('body-wash', 4),
    data.getCollection('solid-serum-deodorant', 5),
    data.getProductsByHandles([
      'new-discovery-set',
      'fine-fragrance-discovery-set',
      '3-pack-discovery-pack',
    ]),
  ]);

  return defer({
    hero,
    tabs: [
      {label: 'Trending Now', products: trending?.products ?? []},
      {label: 'Body Wash', products: bodyWash?.products ?? []},
      {label: 'Serum Deodorant', products: deodorant?.products ?? []},
    ],
    discovery,
  });
}

/** Benefits panel content (BRAND_CONTENT §2 row 6 — verified claims only). */
const BENEFITS: Array<{title: string; body: string}> = [
  {
    title: 'Niacinamide + facial-grade A/C/E',
    body: 'Skincare, but make it shower. The actives your face gets, everywhere else.',
  },
  {
    title: 'Coconut-derived lather',
    body: 'Luxe, creamy, and never stripping. pH balanced for a perfect dry down.',
  },
  {
    title: 'Functional fragrance',
    body: "Scent science grounded in the University of Geneva's Brain & Behaviour Laboratory research.",
  },
  {
    title: 'Vegan & cruelty-free',
    body: 'Minus the nasties: no SLS/SLES, silicones, phthalates, parabens, or PEGs.',
  },
  {
    title: 'Made + sourced in Los Angeles',
    body: 'Ingredients sourced and manufactured locally. Ships from Van Nuys.',
  },
  {
    title: 'Every bottle helps replant trees',
    body: 'Getting dirty should leave things better.',
  },
];

export default function Homepage() {
  const {hero, tabs, discovery} = useLoaderData<typeof loader>();

  return (
    <div>
      <Hero heroImage={hero?.featuredImage?.url ?? null} />
      {/*
        Press logo marquee + press quote row (BLUEPRINT §1.2, §1.7) are
        intentionally not rendered. TBD-CONFIRM: outlet names + usable
        pull-quotes; ship these sections once confirmed.
      */}
      <TabbedGrid tabs={tabs} />
      <RitualSection />
      <ReviewsSection />
      <BenefitsSection />
      <CategoryTiles />
      <MissionSection />
      <SoapScribeBand />
      <DiscoveryFunnel products={discovery as Product[]} />
      <FaqSection />
      <InstagramSection />
    </div>
  );
}

/* ---------------- sections ---------------- */

function Hero({heroImage}: {heroImage: string | null}) {
  return (
    <section className="bg-laurel-900 text-cream">
      <div className="mx-auto grid max-w-site items-center gap-8 px-6 py-14 lg:grid-cols-2 lg:py-20">
        <div className="flex flex-col items-start gap-5">
          {/* Their own claim — no review count appended (TBD-CONFIRM count) */}
          <p className="eyebrow">
            ★★★★★ The Internet&rsquo;s Favorite Body Wash
          </p>
          <h1 className="font-display text-5xl leading-[1.05] lg:text-6xl">
            Smell expensive.
            <br />
            Behave optional.
          </h1>
          <p className="max-w-md text-cream/80">
            Niacinamide body wash, serum deodorant, and fine fragrance — vegan,
            made in LA, and backed by actual scent science. Your shower called;
            it wants a promotion.
          </p>
          <Link
            to="/collections/black-friday"
            className="btn-primary !bg-cream !text-laurel-900 hover:!bg-sand"
          >
            Shop the good stuff →
          </Link>
        </div>
        <div className="order-first lg:order-last">
          {heroImage ? (
            <img
              src={heroImage}
              alt="The Original Mourning Wood body wash by Laurel Bath House"
              className="aspect-square w-full object-cover"
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}

function TabbedGrid({
  tabs,
}: {
  tabs: Array<{label: string; products: Product[]}>;
}) {
  const [active, setActive] = useState(0);
  return (
    <section className="mx-auto max-w-site px-6 py-16">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <h2 className="font-display text-3xl text-laurel-900">Trending Now</h2>
        <p className="text-sm text-ink/60">the stuff that keeps selling out.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {tabs.map((tab, index) => (
            <button
              key={tab.label}
              type="button"
              onClick={() => setActive(index)}
              className={`rounded-full border px-4 py-1.5 text-sm font-semibold transition-colors ${
                index === active
                  ? 'border-laurel-900 bg-laurel-900 text-cream'
                  : 'border-laurel-900/30 hover:border-laurel-900'
              }`}
              aria-pressed={index === active}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      <ProductGrid products={tabs[active]?.products ?? []} />
    </section>
  );
}

function RitualSection() {
  return (
    <section className="bg-sand/60">
      <div className="mx-auto grid max-w-site items-center gap-10 px-6 py-16 lg:grid-cols-2">
        {/* TBD-CONFIRM: product-in-use video asset (Nudie Radio) for this slot */}
        <div className="flex aspect-video items-center justify-center bg-laurel-900/90 text-cream">
          <p className="px-8 text-center font-display text-2xl italic">
            &ldquo;handle your lather with care&rdquo;
          </p>
        </div>
        <div>
          <HowToSteps
            steps={LATHER_RITUAL}
            heading="The Lather Ritual"
            sub="handle your lather with care."
          />
          <Link
            to="/products/natural-body-wash"
            className="mt-6 inline-block text-sm font-semibold underline underline-offset-4 hover:text-laurel-700"
          >
            Meet The Original Mourning Wood →
          </Link>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection() {
  return (
    <section className="mx-auto max-w-site px-6 py-16">
      <div className="mb-8 text-center">
        <h2 className="font-display text-3xl text-laurel-900">
          The reviews are in&hellip;
        </h2>
        <p className="mt-1 text-sm text-ink/60">
          we didn&rsquo;t pay them. we just smell like this.
        </p>
        <Link to="/collections/body-wash" className="btn-secondary mt-5">
          Shop Body Wash
        </Link>
      </div>
      <TestimonialRow />
      <div className="mt-8 text-center">
        <Link to="/collections/body-wash" className="btn-primary">
          Find your scent
        </Link>
      </div>
    </section>
  );
}

function BenefitsSection() {
  return (
    <section className="bg-laurel-950 text-cream">
      <div className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center font-display text-3xl">
          Why LBH hits different
        </h2>
        <div>
          {BENEFITS.map((benefit, i) => (
            <details
              key={benefit.title}
              className="group border-b border-cream/15 py-3"
              open={i === 0}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold [&::-webkit-details-marker]:hidden">
                {benefit.title}
                <span
                  aria-hidden="true"
                  className="text-lg transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="pt-2 text-sm text-cream/70">{benefit.body}</p>
            </details>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            to="/products/natural-body-wash"
            className="text-sm font-semibold underline underline-offset-4"
          >
            Try the flagship →
          </Link>
        </div>
      </div>
    </section>
  );
}

function CategoryTiles() {
  const tiles = [
    {
      eyebrow: 'Fine Fragrance',
      pitch: 'Functional fragrance. Emotional consequences.',
      to: '/collections/functional-fragrance',
      image:
        'https://cdn.shopify.com/s/files/1/0861/9432/3765/files/Artboard4.jpg?v=1762458571',
    },
    {
      eyebrow: 'Serum Deodorant',
      pitch: '72-hour protection with a skincare habit.',
      to: '/collections/solid-serum-deodorant',
      image:
        'https://cdn.shopify.com/s/files/1/0861/9432/3765/files/Artboard1_5cabe3e4-2ad9-4277-af9f-5c6c1846ad98.jpg?v=1762459471',
    },
  ];
  return (
    <section className="mx-auto grid max-w-site gap-6 px-6 py-16 md:grid-cols-2">
      {tiles.map((tile) => (
        <Link key={tile.to} to={tile.to} className="group relative block overflow-hidden">
          <img
            src={tile.image}
            alt={tile.eyebrow}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 flex flex-col items-start justify-end bg-gradient-to-t from-ink/70 to-transparent p-6 text-cream">
            <p className="eyebrow !text-cream/80">{tile.eyebrow}</p>
            <p className="mt-1 font-display text-2xl">{tile.pitch}</p>
            <span className="mt-2 text-sm font-semibold underline underline-offset-4">
              Shop now →
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}

function MissionSection() {
  return (
    <section className="bg-sand/60">
      <div className="mx-auto max-w-3xl px-6 py-16 text-center">
        <h2 className="font-display text-3xl text-laurel-900">
          {MISSION_HEADLINE}
        </h2>
        <p className="mt-4 leading-relaxed text-ink/75">{MISSION_BODY}</p>
        <Link
          to="/pages/about"
          className="mt-6 inline-block text-sm font-semibold underline underline-offset-4 hover:text-laurel-700"
        >
          Learn more about us →
        </Link>
      </div>
    </section>
  );
}

function SoapScribeBand() {
  return (
    <section className="bg-laurel-900 text-cream">
      <div className="mx-auto flex max-w-site flex-col items-center gap-4 px-6 py-14 text-center">
        <h2 className="font-display text-3xl">{SUBSCRIPTION_PROGRAM_NAME}</h2>
        <p className="max-w-lg text-sm text-cream/80">
          Your favorite scent, on a schedule. Pause, skip, or cancel anytime —
          we&rsquo;re clingy, not controlling.
        </p>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <li>✓ Never run dry</li>
          {/* TBD-CONFIRM: subscription discount % */}
          <li>✓ Save on every refill</li>
          <li>✓ Pause or cancel anytime from your account</li>
        </ul>
        <Link
          to="/collections/body-wash"
          className="btn-primary !bg-cream !text-laurel-900 hover:!bg-sand"
        >
          Start your Soap-scription
        </Link>
      </div>
    </section>
  );
}

function FaqSection() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-16">
      <h2 className="mb-6 text-center font-display text-3xl text-laurel-900">
        Questions? Naturally.
      </h2>
      <FAQAccordion items={homepageFaqItems()} withSchema />
      <p className="mt-6 text-center text-sm">
        <Link to="/pages/faq" className="underline hover:text-laurel-700">
          Read the full FAQ →
        </Link>
      </p>
    </section>
  );
}

function InstagramSection() {
  // Brand's own product imagery as stand-ins; links out to the profile.
  const squares = [
    'https://cdn.shopify.com/s/files/1/0861/9432/3765/files/MW.jpg?v=1762458025',
    'https://cdn.shopify.com/s/files/1/0861/9432/3765/files/Artboard1.png?v=1764090302',
    'https://cdn.shopify.com/s/files/1/0861/9432/3765/files/Artboard27_958700fa-1551-4e1b-9edd-2fbcb3dd17d5.jpg?v=1769189124',
    'https://cdn.shopify.com/s/files/1/0861/9432/3765/files/Cover2_f662efe9-b99e-40d0-975e-45221323184c.jpg?v=1764090302',
  ];
  return (
    <section className="mx-auto max-w-site px-6 pb-16">
      <h2 className="mb-6 text-center font-display text-2xl text-laurel-900">
        @laurelbathhouse — tag us. we&rsquo;re watching. lovingly.
      </h2>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {squares.map((src) => (
          <a
            key={src}
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noreferrer"
            aria-label="Laurel Bath House on Instagram"
          >
            <img
              src={src}
              alt=""
              aria-hidden="true"
              className="aspect-square w-full object-cover"
              loading="lazy"
            />
          </a>
        ))}
      </div>
    </section>
  );
}
