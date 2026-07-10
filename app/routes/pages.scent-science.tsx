import {Link} from '@remix-run/react';
import type {MetaFunction} from '@shopify/remix-oxygen';
import {BRAND_NAME} from '~/lib/const';
import {SCENT_FAMILIES} from '~/lib/cross-sell';

export const meta: MetaFunction = () => [
  {title: `Scent Science — ${BRAND_NAME}`},
  {
    name: 'description',
    content:
      "Functional fragrance grounded in the University of Geneva's Brain & Behaviour Laboratory research connecting scent and cognitive function.",
  },
];

/**
 * Scent Science page — the impact/values slot (BRAND_CONTENT §1.2).
 * All claims here are verified from LBH's own copy (§0 fact base).
 * NOTE: the third-party dermatologist stats (2.9X / 97% / 80%) are NOT
 * rendered — TBD-CONFIRM substantiation before publishing on new surfaces.
 */
export default function ScentSciencePage() {
  const featured = SCENT_FAMILIES.filter((f) =>
    ['Mourning Wood', 'Rocket Man', 'Cuffed', 'E-Mochi'].includes(f.name),
  );

  return (
    <div>
      <section className="bg-laurel-900 text-cream">
        <div className="mx-auto max-w-3xl px-6 py-16 text-center">
          <p className="eyebrow">Scent Science</p>
          <h1 className="mt-2 font-display text-5xl leading-tight">
            Scents with a job to do.
          </h1>
          <p className="mx-auto mt-6 max-w-xl leading-relaxed text-cream/85">
            Our fine fragrance line is grounded in The University of
            Geneva&rsquo;s Brain &amp; Behaviour Laboratory research connecting
            scent and cognitive function. Translation: what you smell changes
            how you feel — so we compose for the feeling first.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-8 text-center font-display text-3xl text-laurel-900">
          How a functional fragrance gets built
        </h2>
        <ol className="space-y-6">
          {[
            {
              title: 'Start with the state of mind',
              body: 'Calm. Focus. Confidence. Each scent is assigned a job before a single note is picked.',
            },
            {
              title: 'Compose like fine fragrance',
              body: 'Complex natural scent stories in short declarative notes — oud wood, black rose, upcycled cedar — not "fresh linen."',
            },
            {
              title: 'Carry it through the routine',
              body: 'Wash, deodorant, cream, and EdP share a scent family, so the story layers instead of clashing.',
            },
          ].map((step, index) => (
            <li key={step.title} className="flex gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-laurel-900 font-display text-cream">
                {index + 1}
              </span>
              <div>
                <p className="font-semibold text-laurel-900">{step.title}</p>
                <p className="text-sm text-ink/70">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-sand/60 py-16">
        <div className="mx-auto max-w-site px-6">
          <h2 className="mb-8 text-center font-display text-3xl text-laurel-900">
            The families
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {featured.map((family) => (
              <div
                key={family.name}
                className="border border-laurel-900/10 bg-cream p-6"
              >
                <p className="font-display text-xl text-laurel-900">
                  {family.name}
                </p>
                <p className="mt-1 text-sm italic text-ink/60">
                  {family.notes}
                </p>
                {family.edp ? (
                  <Link
                    to={`/products/${family.edp}`}
                    className="mt-3 inline-block text-sm font-semibold underline underline-offset-4 hover:text-laurel-700"
                  >
                    Smell it →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link to="/collections/functional-fragrance" className="btn-primary">
              Shop Fine Fragrance
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
