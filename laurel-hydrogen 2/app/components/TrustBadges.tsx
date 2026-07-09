/**
 * Verified-claims-only trust badges (BRAND_CONTENT §1.4 + §5.8).
 * No invented certifications, no "money-back guarantee" language.
 */

const FOOTER_BADGES = [
  {icon: '🌿', label: 'Vegan & Cruelty-Free'},
  {icon: '🚫', label: 'No SLS · No Parabens · No Phthalates'},
  {icon: '☀️', label: 'Made in Los Angeles'},
  {icon: '📦', label: 'Shipping Insurance Included (by Shipsurance)'},
];

const BUYBOX_BADGES = [
  'Free US shipping $29+',
  '30-day return policy',
  'Shipping insurance included',
  'Vegan & cruelty-free',
];

export function TrustBadgeRow() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {FOOTER_BADGES.map((badge) => (
        <div
          key={badge.label}
          className="flex items-center gap-2 text-xs text-cream/80"
        >
          <span aria-hidden="true" className="text-base">
            {badge.icon}
          </span>
          <span>{badge.label}</span>
        </div>
      ))}
    </div>
  );
}

export function BuyBoxTrustRow() {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
      {BUYBOX_BADGES.map((label) => (
        <li key={label} className="flex items-center gap-1">
          <span aria-hidden="true" className="text-laurel-700">
            ✓
          </span>
          {label}
        </li>
      ))}
    </ul>
  );
}
