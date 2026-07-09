import {Link} from '@remix-run/react';
import type {MetaFunction} from '@shopify/remix-oxygen';
import {BRAND_NAME, MISSION_HEADLINE} from '~/lib/const';

export const meta: MetaFunction = () => [
  {title: `Our Story — ${BRAND_NAME}`},
  {
    name: 'description',
    content:
      'Luxury natural body care made in Los Angeles. Why we put facial-grade skincare in a body wash — and named it what we named it.',
  },
];

/**
 * About page (BLUEPRINT §5). DRAFT STATUS per BRAND_CONTENT §5.3:
 * TBD-CONFIRM — founder name, founding year, timeline dates, and the
 * reforestation impact stat are unverified. Only verifiable beats render;
 * narrative uses verified facts with neutral framing.
 */

const TIMELINE = [
  {
    label: 'The first drop',
    title: 'Mourning Wood deodorant lands',
    body: 'Only 100 in the first drop. They went fast.',
  },
  {
    label: 'The wash',
    title: 'Body wash joins the lineup',
    body: 'Niacinamide and facial-grade vitamins A, C, and E — skincare, but make it shower.',
  },
  {
    label: 'The internet finds us',
    title: '"The Internet\'s Favorite Body Wash"',
    body: 'The viral moment. Sold out in two months.',
  },
  {
    label: 'The science',
    title: 'Fine fragrance, with receipts',
    body: "A functional fragrance line grounded in the University of Geneva's Brain & Behaviour Laboratory research connecting scent and cognitive function.",
  },
  {
    label: 'The new class',
    title: 'E-Mochi and friends',
    body: 'New scents, new formats — deodorant, EdP, and sets.',
  },
  {
    label: 'The mission',
    title: 'Every bottle helps replant trees',
    // TBD-CONFIRM: reforestation partner + tree count for a hard stat here.
    body: 'Getting dirty should leave things better.',
  },
];

export default function AboutPage() {
  return (
    <div>
      {/* Founder letter hero — TBD-CONFIRM founder name/story; neutral draft */}
      <section className="bg-laurel-900 text-cream">
        <div className="mx-auto max-w-3xl px-6 py-16">
          <h1 className="font-display text-5xl leading-tight">
            We came here to clean up.
          </h1>
          <div className="mt-8 space-y-4 leading-relaxed text-cream/85">
            <p>
              Natural body care had a rule: it could work, or it could smell
              incredible. Never both. We didn&rsquo;t like the rule.
            </p>
            <p>
              So we put cosmetic-grade actives — niacinamide, facial-grade
              vitamins A, C, and E — into a body wash, composed the scents like
              fine fragrance, and made all of it in Los Angeles, with
              ingredients sourced and manufactured locally.
            </p>
            <p>
              {MISSION_HEADLINE} Ours starts with you: high-performing daily
              essentials that take care of people and the planet — and each
              scent story is a reminder to enjoy the things that make us happy.
            </p>
            <p>
              And yes, we named it Mourning Wood. No, we&rsquo;re not sorry.
            </p>
          </div>
          {/* TBD-CONFIRM: founder name + title sign-off */}
          <p className="mt-8 font-display text-lg italic text-cream/70">
            — the humans at Laurel Bath House
          </p>
        </div>
      </section>

      {/* Milestone timeline — verifiable beats only, no invented dates */}
      <section className="mx-auto max-w-3xl px-6 py-16">
        <h2 className="mb-10 text-center font-display text-3xl text-laurel-900">
          What we&rsquo;ve gotten into so far
        </h2>
        <ol className="space-y-8 border-l-2 border-laurel-900/15 pl-8">
          {TIMELINE.map((entry) => (
            <li key={entry.title} className="relative">
              <span
                aria-hidden="true"
                className="absolute -left-[2.35rem] top-1 h-3 w-3 rounded-full bg-laurel-700"
              />
              <p className="eyebrow">{entry.label}</p>
              <p className="mt-1 font-semibold text-laurel-900">
                {entry.title}
              </p>
              <p className="text-sm text-ink/70">{entry.body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Impact CTA */}
      <section className="bg-sand/60">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 py-14 text-center">
          <h2 className="font-display text-3xl text-laurel-900">
            Every bottle helps replant trees.
          </h2>
          <p className="text-sm text-ink/70">Get dirty for a good cause.</p>
          <Link to="/collections/all" className="btn-primary">
            Shop All
          </Link>
        </div>
      </section>
    </div>
  );
}
