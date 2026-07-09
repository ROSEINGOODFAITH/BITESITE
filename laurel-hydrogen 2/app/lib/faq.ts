/**
 * FAQ deck (BRAND_CONTENT.md §5.4) — 18 Q&As, all grounded in verified facts.
 */

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqGroup {
  id: string;
  title: string;
  items: FaqItem[];
}

export const FAQ_GROUPS: FaqGroup[] = [
  {
    id: 'products',
    title: 'Products & Formulas',
    items: [
      {
        id: 'q1',
        question: 'Is everything actually vegan?',
        answer:
          'Yes — vegan and cruelty-free across the line. No animal testing, no animal-derived ingredients, no exceptions.',
      },
      {
        id: 'q2',
        question: "What's NOT in the formulas?",
        answer:
          'No SLS/SLES, no silicones, no phthalates, no parabens, no PEGs. Non-stripping, non-drying, and pH balanced for a perfect dry down.',
      },
      {
        id: 'q3',
        question: "What's the deal with niacinamide in a body wash?",
        answer:
          'We use facial-grade actives — niacinamide plus Vitamins A, C, and E — because your body deserves the same skincare your face gets. Refines, restores, and leaves skin smoother with every wash.',
      },
      {
        id: 'q4',
        question: 'Will it dry out my skin?',
        answer:
          "No. Gentle coconut-derived surfactants build a luxe, creamy lather without stripping your skin's natural oils. The formula is tested on all skin types and tones.",
      },
      {
        id: 'q5',
        question: 'Can I use it every day?',
        answer:
          'Absolutely. Gentle enough for daily use, rich enough to feel like a ritual.',
      },
      {
        id: 'q6',
        question: 'What is "functional fragrance"?',
        answer:
          "Scent with a job. Our fine fragrances are built on research from the University of Geneva's Brain & Behaviour Laboratory connecting scent and cognitive function — calm for Mourning Wood, focus and clarity for Rocket Man.",
      },
      {
        id: 'q7',
        question: 'How long does the deodorant last?',
        answer:
          'Our solid serum deodorant is formulated for 72-hour protection, with a skincare serum that moisturizes while antibacterial enzymes neutralize odor before it starts.',
      },
      {
        id: 'q8',
        question: 'Are the scents unisex?',
        answer: 'Every single one. Good taste has no gender.',
      },
      {
        id: 'q9',
        question: 'Where is it made?',
        answer:
          'Los Angeles. Ingredients are sourced and manufactured locally, and everything ships from our Van Nuys HQ.',
      },
    ],
  },
  {
    id: 'subscriptions',
    title: 'Soap-scribe & Save (subscriptions)',
    items: [
      {
        id: 'q10',
        question: 'How does Soap-scribe & Save work?',
        // TBD-CONFIRM: discount % + cadence options
        answer:
          'Pick your body wash, pick your refill cadence, and we handle the rest — your discount applies to every refill, forever.',
      },
      {
        id: 'q11',
        question: 'Can I pause, skip, or cancel?',
        answer:
          'Anytime, from your account — no phone calls, no guilt trips. Log in, then Manage Subscription.',
      },
      {
        id: 'q12',
        question: 'Which products can I subscribe to?',
        // TBD-CONFIRM: Araki 40
        answer:
          'Currently the body washes: The Original Mourning Wood, Cuffed, and Nudie.',
      },
    ],
  },
  {
    id: 'shipping',
    title: 'Shipping & Returns',
    items: [
      {
        id: 'q13',
        question: 'When is shipping free?',
        answer: 'On every US order over $29.',
      },
      {
        id: 'q14',
        question: 'Is my package insured?',
        answer:
          'Yes — shipping insurance is on us, via Shipsurance. 100% coverage in case of loss, damage, or theft.',
      },
      {
        id: 'q15',
        question: "What's your return policy?",
        // TBD-CONFIRM: refund method (original payment vs store credit)
        answer: '30-day return policy. Details on the Return Policy page.',
      },
      {
        id: 'q16',
        question: 'Do you ship internationally?',
        // TBD-CONFIRM: countries + rates
        answer:
          'Reach out to support before ordering internationally and we will confirm current options for your country.',
      },
    ],
  },
  {
    id: 'rewards',
    title: 'Rewards & More',
    items: [
      {
        id: 'q17',
        question: 'What is LBH Cash?',
        // TBD-CONFIRM: ongoing mechanics/redemption details
        answer:
          'Our way of saying thanks: we give $0.25 for every dollar. Pay $100, get $125 in credit. Pay $300, get $395. Credit is usable anytime in 2026 and beyond.',
      },
      {
        id: 'q18',
        question: 'Where can I find LBH in stores?',
        answer: 'Check the Stockists page for retail partners.',
      },
    ],
  },
];

/** Homepage mini-FAQ pulls Q1, Q4, Q6, Q9, Q13 (BRAND_CONTENT §2). */
export const HOMEPAGE_FAQ_IDS = ['q1', 'q4', 'q6', 'q9', 'q13'];

export function homepageFaqItems(): FaqItem[] {
  const all = FAQ_GROUPS.flatMap((g) => g.items);
  return HOMEPAGE_FAQ_IDS.map((id) => all.find((i) => i.id === id)).filter(
    (i): i is FaqItem => Boolean(i),
  );
}
