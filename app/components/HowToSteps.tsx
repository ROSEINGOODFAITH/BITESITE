/**
 * Numbered ritual steps (BLUEPRINT §C19). Homepage uses the verified
 * 3-step wash ritual (BRAND_CONTENT §2 row 4).
 */
export interface RitualStep {
  title: string;
  body: string;
}

export const LATHER_RITUAL: RitualStep[] = [
  {
    title: 'Lather & Cleanse',
    body: 'A creamy, coconut-derived lather that cleans without stripping. Handle your lather with care.',
  },
  {
    title: 'Rinse & Hydrate',
    body: 'Niacinamide and facial-grade vitamins A, C, and E stay behind. The scent does too.',
  },
  {
    title: 'Repeat & Replenish',
    body: 'Feel good knowing your bottle helps replant trees.',
  },
];

export function HowToSteps({
  steps,
  heading,
  sub,
}: {
  steps: RitualStep[];
  heading?: string;
  sub?: string;
}) {
  return (
    <div>
      {heading ? (
        <h2 className="font-display text-3xl text-laurel-900">{heading}</h2>
      ) : null}
      {sub ? <p className="mt-1 text-sm italic text-ink/60">{sub}</p> : null}
      <ol className="mt-6 space-y-5">
        {steps.map((step, index) => (
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
    </div>
  );
}
