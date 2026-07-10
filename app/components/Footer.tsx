import {Link} from '@remix-run/react';
import {FOOTER_COLUMNS} from '~/lib/nav';
import {
  BRAND_NAME,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  MISSION_HEADLINE,
  SUPPORT_EMAIL,
  YOUTUBE_URL,
} from '~/lib/const';
import {TrustBadgeRow} from '~/components/TrustBadges';

export function Footer({mode}: {mode: 'live' | 'mock'}) {
  return (
    <footer className="bg-laurel-950 text-cream">
      <div className="mx-auto max-w-site px-6 py-14">
        <p className="mb-10 font-display text-2xl text-cream/90">
          {MISSION_HEADLINE}
        </p>

        <div className="grid gap-10 md:grid-cols-4">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="eyebrow mb-4">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={`${column.title}-${link.label}`}>
                    <Link
                      to={link.to}
                      className="text-sm text-cream/80 hover:text-cream hover:underline"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="eyebrow mb-4">Follow</p>
            <ul className="space-y-2">
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-cream/80 hover:text-cream hover:underline"
                >
                  Instagram @{INSTAGRAM_HANDLE}
                </a>
              </li>
              <li>
                <a
                  href={YOUTUBE_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-cream/80 hover:text-cream hover:underline"
                >
                  YouTube — Nudie Radio
                </a>
              </li>
              {/* TBD-CONFIRM: TikTok + X/Threads handles */}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-8">
          <TrustBadgeRow />
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-cream/10 pt-6 text-xs text-cream/60 md:flex-row md:flex-wrap md:items-center md:gap-x-5">
          <span>© 2026 {BRAND_NAME}</span>
          <Link to="/policies/privacy-policy" className="hover:text-cream">
            Privacy Policy
          </Link>
          <Link to="/policies/terms-of-service" className="hover:text-cream">
            Terms of Service
          </Link>
          <Link to="/policies/shipping-policy" className="hover:text-cream">
            Shipping Policy
          </Link>
          <Link to="/policies/refund-policy" className="hover:text-cream">
            Return Policy
          </Link>
          <Link to="/policies/subscription-policy" className="hover:text-cream">
            Subscription Policy
          </Link>
          {/* TBD-CONFIRM: replace with support@ alias before launch */}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="hover:text-cream">
            {SUPPORT_EMAIL}
          </a>
          {mode === 'mock' ? (
            <span className="rounded bg-cream/10 px-2 py-0.5">
              Preview mode — local catalog data
            </span>
          ) : null}
        </div>

        <div className="mt-6">
          <a href="#main" className="text-xs text-cream/50 hover:text-cream">
            ↑ Back to top
          </a>
        </div>
      </div>
    </footer>
  );
}
