/**
 * Navigation IA (BRAND_CONTENT.md §1.2–1.4).
 */

export interface NavLink {
  label: string;
  to: string;
  badge?: string;
}

export interface MegaMenuColumn {
  title: string;
  links: NavLink[];
}

export interface ImageTout {
  title: string;
  tagline: string;
  to: string;
  image: string;
}

export const TOP_LEVEL_NAV: NavLink[] = [
  {label: 'Shop', to: '/collections/all'}, // mega-menu trigger
  {label: 'Discovery Sets', to: '/collections/sampler-sets'},
  {label: 'Our Story', to: '/pages/about'},
  {label: 'Scent Science', to: '/pages/scent-science'},
];

export const MEGA_MENU_COLUMNS: MegaMenuColumn[] = [
  {
    title: 'Body Wash',
    links: [
      {label: 'The Original Mourning Wood', to: '/products/natural-body-wash'},
      {label: 'Cuffed 2-Pack', to: '/products/cuffed'},
      {label: 'Nudie', to: '/products/nudie'},
      {label: 'Araki 40', to: '/products/natural-body-wash-1'},
      {label: 'Body Wash Discovery Set', to: '/products/new-discovery-set'},
      {label: 'Shop Body Wash', to: '/collections/body-wash'},
    ],
  },
  {
    title: 'Deodorant',
    links: [
      {label: 'Mourning Wood', to: '/products/mourning-wood-deodorant'},
      {label: 'Cuffed', to: '/products/solid-serum-deodorant'},
      {label: 'Banana Hammock', to: '/products/solid-serum-deodorant-banana-hammock'},
      {label: 'Cannoli', to: '/products/cannoli'},
      {label: 'E-Mochi', to: '/products/e-mochi'},
      {label: 'Shop Deodorant', to: '/collections/solid-serum-deodorant'},
    ],
  },
  {
    title: 'Fragrance & Sets',
    links: [
      {label: 'Fine Fragrance', to: '/collections/functional-fragrance'},
      {label: 'E-Mochi EdP', to: '/products/e-mochi-edp', badge: 'NEW'},
      {label: 'Bundles', to: '/collections/bundles-1'},
      {label: 'Discovery Sets', to: '/collections/sampler-sets'},
      {label: 'Layer Pack 001', to: '/products/layer-pack-001'},
      {label: 'Body Care', to: '/collections/body-cream'},
    ],
  },
];

export const BEST_SELLER_TOUTS: ImageTout[] = [
  {
    title: 'The Original Mourning Wood',
    tagline: "The internet's favorite body wash.",
    to: '/products/natural-body-wash',
    image:
      'https://cdn.shopify.com/s/files/1/0861/9432/3765/files/MW.jpg?v=1762458025',
  },
  {
    title: 'Cuffed',
    tagline: 'Back in stock. Behave accordingly.',
    to: '/products/cuffed',
    image:
      'https://cdn.shopify.com/s/files/1/0861/9432/3765/files/CUFFED2PACK.png?v=1759769202',
  },
];

/** Mobile drawer order (§1.3). */
export const MOBILE_NAV: NavLink[] = [
  {label: 'Shop All', to: '/collections/all'},
  {label: 'Body Wash', to: '/collections/body-wash'},
  {label: 'Serum Deodorant', to: '/collections/solid-serum-deodorant'},
  {label: 'Fine Fragrance', to: '/collections/functional-fragrance'},
  {label: 'Body Care', to: '/collections/body-cream'},
  {label: 'Bundles & Sets', to: '/collections/bundles-1'},
  {label: 'New Arrivals', to: '/collections/new-arrivals', badge: 'NEW'},
  {label: 'Discovery Sets', to: '/collections/sampler-sets'},
  {label: 'Our Story', to: '/pages/about'},
];

export const FOOTER_COLUMNS: Array<{title: string; links: NavLink[]}> = [
  {
    title: 'Shop',
    links: [
      {label: 'Shop All', to: '/collections/all'},
      {label: 'Body Wash', to: '/collections/body-wash'},
      {label: 'Serum Deodorant', to: '/collections/solid-serum-deodorant'},
      {label: 'Fine Fragrance', to: '/collections/functional-fragrance'},
      {label: 'Daily Drench Body Cream', to: '/collections/body-cream'},
      {label: 'Bundles & Sets', to: '/collections/bundles-1'},
      {label: 'Discovery Sets', to: '/collections/sampler-sets'},
    ],
  },
  {
    title: 'Learn',
    links: [
      {label: 'Our Story', to: '/pages/about'},
      {label: 'Scent Science', to: '/pages/scent-science'},
      {label: 'The Journal', to: '/blogs'},
      {label: 'FAQ', to: '/pages/faq'},
      // TBD-CONFIRM: stockists page content (exists on live site)
      {label: 'Stockists', to: '/pages/faq#rewards'},
    ],
  },
  {
    title: 'Help',
    links: [
      {label: 'Contact', to: '/pages/contact'},
      {label: 'Search', to: '/search'},
      {label: 'Shipping Policy', to: '/policies/shipping-policy'},
      {label: 'Return Policy', to: '/policies/refund-policy'},
      {label: 'Subscription Policy', to: '/policies/subscription-policy'},
      // TBD-CONFIRM: affiliate + wholesale URLs
    ],
  },
];
