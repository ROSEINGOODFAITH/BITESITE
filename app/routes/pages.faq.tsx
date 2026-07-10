import type {MetaFunction} from '@shopify/remix-oxygen';
import {FAQ_GROUPS} from '~/lib/faq';
import {FAQAccordion} from '~/components/FAQAccordion';
import {BRAND_NAME} from '~/lib/const';

export const meta: MetaFunction = () => [
  {title: `FAQ — ${BRAND_NAME}`},
  {
    name: 'description',
    content:
      'Formulas, Soap-scribe & Save subscriptions, shipping, returns, and LBH Cash — answered.',
  },
];

/**
 * FAQ page (BLUEPRINT §6): grouped accordions under H2s, in-page topic
 * jump nav, FAQPage JSON-LD (emitted once via the first group).
 */
export default function FaqPage() {
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-center font-display text-4xl text-laurel-900">
        Questions? Naturally.
      </h1>
      <p className="mt-2 text-center text-sm text-ink/60">
        The FAQ answers 90% of everything. The other 10% is what the contact
        page is for.
      </p>

      {/* Topic jump nav */}
      <nav
        aria-label="FAQ topics"
        className="mt-8 flex flex-wrap justify-center gap-2"
      >
        {FAQ_GROUPS.map((group) => (
          <a
            key={group.id}
            href={`#${group.id}`}
            className="rounded-full border border-laurel-900/30 px-4 py-1.5 text-sm font-semibold hover:border-laurel-900"
          >
            {group.title}
          </a>
        ))}
      </nav>

      <div className="mt-12 space-y-12">
        {FAQ_GROUPS.map((group, index) => (
          <section key={group.id} id={group.id}>
            <h2 className="mb-4 font-display text-2xl text-laurel-900">
              {group.title}
            </h2>
            <FAQAccordion items={group.items} withSchema={index === 0} />
          </section>
        ))}
      </div>
    </div>
  );
}
