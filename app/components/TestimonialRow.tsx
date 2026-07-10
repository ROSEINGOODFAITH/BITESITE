/**
 * UGC quote row (BLUEPRINT §1.5). Seeded with the 4 verified homepage quotes
 * from the live LBH site (BRAND_CONTENT §2 row 5). No aggregate count cited —
 * TBD-CONFIRM before adding one.
 */

interface Testimonial {
  quote: string;
  name: string;
  product: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'The scent is unreal — it lingers in the best way and the lather feels like a spa.',
    name: 'Arivas L.',
    product: 'Cuffed',
  },
  {
    quote:
      "Mourning Wood lives up to the hype. My whole bathroom smells expensive now.",
    name: 'Steph H.',
    product: 'Mourning Wood',
  },
  {
    quote:
      'Bought one as a joke for the name. Stayed for the softest skin I have ever had.',
    name: 'Sarah T.',
    product: 'Mourning Wood',
  },
  {
    quote: 'Nudie is my daily. Clean, subtle, and my skin stopped feeling tight.',
    name: 'Bay S.',
    product: 'Nudie',
  },
];

export function TestimonialRow() {
  return (
    <div className="grid gap-6 md:grid-cols-4">
      {TESTIMONIALS.map((t) => (
        <figure
          key={t.name}
          className="flex flex-col gap-3 border border-laurel-900/10 bg-cream p-6"
        >
          <span aria-hidden="true" className="text-gold">
            ★★★★★
          </span>
          <blockquote className="text-sm leading-relaxed text-ink/80">
            &ldquo;{t.quote}&rdquo;
          </blockquote>
          <figcaption className="mt-auto text-xs font-semibold uppercase tracking-wider text-ink/50">
            {t.name} · {t.product}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
