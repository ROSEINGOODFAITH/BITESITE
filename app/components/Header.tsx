import {useState} from 'react';
import {Link, NavLink} from '@remix-run/react';
import {
  BEST_SELLER_TOUTS,
  MEGA_MENU_COLUMNS,
  MOBILE_NAV,
  TOP_LEVEL_NAV,
} from '~/lib/nav';
import {BRAND_NAME} from '~/lib/const';
import {useCartUI} from '~/components/CartUI';

/**
 * Header with desktop mega-menu under "Shop" + mobile drawer nav
 * (BLUEPRINT §0.2, IA from BRAND_CONTENT §1.2–1.3).
 */
export function Header({cartCount}: {cartCount: number}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const {openCart} = useCartUI();

  return (
    <header className="sticky top-0 z-40 border-b border-laurel-900/10 bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-site items-center justify-between gap-4 px-4 py-3 lg:px-6">
        {/* Mobile hamburger */}
        <button
          type="button"
          className="lg:hidden"
          aria-label="Open menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen(true)}
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
          <span className="mt-1.5 block h-0.5 w-6 bg-ink" />
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="font-display text-xl font-semibold tracking-wide text-laurel-900 lg:text-2xl"
        >
          {BRAND_NAME}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          <div
            className="relative"
            onMouseEnter={() => setMegaOpen(true)}
            onMouseLeave={() => setMegaOpen(false)}
          >
            <Link
              to="/collections/all"
              className="text-sm font-semibold uppercase tracking-wider hover:text-laurel-700"
              aria-haspopup="true"
              aria-expanded={megaOpen}
              onFocus={() => setMegaOpen(true)}
            >
              Shop
            </Link>
            {megaOpen ? <MegaMenu onNavigate={() => setMegaOpen(false)} /> : null}
          </div>
          {TOP_LEVEL_NAV.slice(1).map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="text-sm font-semibold uppercase tracking-wider hover:text-laurel-700"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Utility icons */}
        <div className="flex items-center gap-4">
          <Link
            to="/search"
            aria-label="Search"
            className="text-sm font-semibold uppercase tracking-wider hover:text-laurel-700"
          >
            <SearchIcon />
          </Link>
          <button
            type="button"
            onClick={openCart}
            aria-label={`Open cart, ${cartCount} items`}
            className="relative"
          >
            <BagIcon />
            {cartCount > 0 ? (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-laurel-900 text-[10px] font-bold text-cream">
                {cartCount}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {mobileOpen ? <MobileDrawer onClose={() => setMobileOpen(false)} /> : null}
    </header>
  );
}

function MegaMenu({onNavigate}: {onNavigate: () => void}) {
  return (
    <div className="absolute left-1/2 top-full w-[52rem] -translate-x-1/2 border border-laurel-900/10 bg-cream p-8 shadow-xl">
      <Link
        to="/collections/all"
        className="mb-6 inline-block text-sm font-bold uppercase tracking-widest text-laurel-900 underline underline-offset-4"
        onClick={onNavigate}
      >
        Shop All →
      </Link>
      <div className="grid grid-cols-4 gap-8">
        {MEGA_MENU_COLUMNS.map((column) => (
          <div key={column.title}>
            <p className="eyebrow mb-3">{column.title}</p>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={`${column.title}-${link.to}-${link.label}`}>
                  <Link
                    to={link.to}
                    className="text-sm hover:text-laurel-700 hover:underline"
                    onClick={onNavigate}
                  >
                    {link.label}
                    {link.badge ? (
                      <span className="ml-2 rounded bg-clay px-1.5 py-0.5 text-[10px] font-bold uppercase text-cream">
                        {link.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        {/* Best-sellers column: 2 image touts (BLUEPRINT §0.2) */}
        <div className="space-y-4">
          <p className="eyebrow mb-3">Best Sellers</p>
          {BEST_SELLER_TOUTS.map((tout) => (
            <Link
              key={tout.to}
              to={tout.to}
              className="group block"
              onClick={onNavigate}
            >
              <img
                src={tout.image}
                alt={tout.title}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <p className="mt-2 text-sm font-semibold group-hover:underline">
                {tout.title}
              </p>
              <p className="text-xs text-ink/60">{tout.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function MobileDrawer({onClose}: {onClose: () => void}) {
  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        className="absolute inset-0 bg-ink/40"
        aria-label="Close menu"
        onClick={onClose}
      />
      <div className="absolute inset-y-0 left-0 flex w-80 max-w-[85vw] flex-col overflow-y-auto bg-cream p-6 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <p className="font-display text-lg text-laurel-900">Menu</p>
          <button type="button" onClick={onClose} aria-label="Close menu">
            ✕
          </button>
        </div>

        <Link
          to="/collections/all"
          className="mb-4 text-base font-bold uppercase tracking-widest"
          onClick={onClose}
        >
          Shop All
        </Link>

        {/* Best-sellers image touts first (BLUEPRINT §0.2 mobile order) */}
        <div className="mb-6 grid grid-cols-2 gap-3">
          {BEST_SELLER_TOUTS.map((tout) => (
            <Link key={tout.to} to={tout.to} onClick={onClose} className="block">
              <img
                src={tout.image}
                alt={tout.title}
                className="aspect-square w-full object-cover"
                loading="lazy"
              />
              <p className="mt-1 text-xs font-semibold">{tout.title}</p>
              <p className="text-[11px] text-ink/60">{tout.tagline}</p>
            </Link>
          ))}
        </div>

        <nav className="flex flex-col gap-3">
          {MOBILE_NAV.slice(1).map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-semibold uppercase tracking-wider"
              onClick={onClose}
            >
              {link.label}
              {link.badge ? (
                <span className="ml-2 rounded bg-clay px-1.5 py-0.5 text-[10px] font-bold uppercase text-cream">
                  {link.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}

function BagIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M6 8h12l-1 13H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}
