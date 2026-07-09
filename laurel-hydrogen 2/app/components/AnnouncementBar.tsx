import {useState} from 'react';
import {Link} from '@remix-run/react';
import {ANNOUNCEMENT_MESSAGES} from '~/lib/const';

/**
 * Dismissible marquee announcement bar (BLUEPRINT §0.1).
 * Repeats the promo line so the marquee loops seamlessly.
 */
export function AnnouncementBar() {
  const [dismissed, setDismissed] = useState(false);
  const message = ANNOUNCEMENT_MESSAGES[0];

  if (dismissed) return null;

  const repeated = Array.from({length: 6}, (_, i) => (
    <span key={i} className="mx-8 inline-block">
      {message.text}
    </span>
  ));

  return (
    <div className="relative overflow-hidden bg-laurel-900 text-cream">
      <Link
        to={message.to}
        className="block whitespace-nowrap py-2 text-xs font-semibold uppercase tracking-widest"
        aria-label={message.text}
      >
        <div className="inline-block animate-marquee">
          {repeated}
          {repeated}
        </div>
      </Link>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-2 text-cream/70 hover:text-cream"
      >
        ✕
      </button>
    </div>
  );
}
