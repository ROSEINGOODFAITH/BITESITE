/**
 * Merchandising config (BRAND_CONTENT.md §1.1, §4, §7.2).
 * The catalog export carries no collection membership, so curated ordering
 * lives here and is used by BOTH adapters for pills/H1s (the live adapter
 * uses real collection membership from the API, this map for display meta).
 */

/** Collections that must never render (internal/utility). */
export const EXCLUDED_COLLECTIONS = new Set([
  'globofilter-best-selling-products-index',
  'for-shopify-performance-tracking',
  'frontpage',
  'homepage-collection',
  'bundles', // redundant with sampler-sets → redirect
  'coming-soon',
]);

/** Utility / unlisted products excluded from all grids, search and sitemap. */
export const EXCLUDED_PRODUCTS = new Set([
  'shipping-insurance',
  'laurel-bath-house-cash',
  'pulse-eau-de-parfum-pre-release',
  'hayyy-eau-de-parfum-mini-hidden',
]);

/**
 * Duplicate-product clusters (§7.2): non-canonical dupes are hidden from
 * grids/search but their PDPs still resolve (no dead links).
 * TBD-CONFIRM: canonical choices with client.
 */
export const HIDDEN_FROM_GRIDS = new Set([
  'cuffed-edp',
  'cuffed-eau-de-parfum-restock',
  'eau-de-parfum-preorder-1',
  'e-mochi-eau-de-parfum',
  'e-mochi-eau-de-parfum-new',
  'apres-ski-eau-de-parfum-preorder',
  'apres-ski-eau-de-parfum-restock',
  'not-vanilla',
  'banana-hammock-restock',
  '3-pack-nudie-2',
]);

export interface CollectionMeta {
  handle: string;
  displayName: string;
  headline: string;
  sub?: string;
  order: string[];
}

export const COLLECTION_META: Record<string, CollectionMeta> = {
  all: {
    handle: 'all',
    displayName: 'Shop All',
    headline: 'Everything. Yes, even that.',
    order: [
      'natural-body-wash',
      'cuffed',
      'nudie',
      'natural-body-wash-1',
      'e-mochi',
      'solid-serum-deodorant',
      'solid-serum-deodorant-banana-hammock',
      'mourning-wood-deodorant',
      'cannoli',
      'adaptive-eau-de-parfum',
      'adaptive-eau-de-parfum-3',
      'adaptive-eau-de-parfum-2',
      'adaptive-eau-de-parfum-1',
      'e-mochi-edp',
      'not-vanilla-edp',
      'hayyy-eau-de-parfum-pre-release',
      'cannoli-edp',
      'apres-ski-edp',
      'eau-de-parfum-preorder',
      'nudie-eau-de-parfum',
      'daily-drench-body-cream',
      'daily-drench-body-cream-banana-hammock',
      'daily-drench-body-cream-rocket-man',
      'daily-drench-body-cream-cuffed',
      '1-year-supply-of-lbh',
      'cuffing-season',
      'rise-and-shine-bundle',
      'layer-pack-001',
      'new-discovery-set',
      'fine-fragrance-discovery-set',
      'fine-fragrance-discovery-set-pre-order',
      'fine-fragrance-discovery-set-3-new-scents',
      '3-pack-discovery-pack',
    ],
  },
  'body-wash': {
    handle: 'body-wash',
    displayName: 'Body Wash',
    headline: 'Skincare, but make it shower.',
    order: [
      'natural-body-wash',
      'cuffed',
      'nudie',
      'natural-body-wash-1',
      'new-discovery-set',
      '3-pack-nudie',
      '3-pack-nudie-1',
      '3-pack-araki-40',
      '6-pack-araki-40-special',
    ],
  },
  'solid-serum-deodorant': {
    handle: 'solid-serum-deodorant',
    displayName: 'Serum Deodorant',
    headline: '72 hours. Zero regrets.',
    order: [
      'e-mochi',
      'solid-serum-deodorant',
      'solid-serum-deodorant-banana-hammock',
      'mourning-wood-deodorant',
      'cannoli',
      '3-pack-discovery-pack',
      '2-pack-mourning-wood-1',
      '3-pack-mourning-wood-1',
      '2-pack-cuffed',
      '3-pack-cuffed-1',
      '2-pack-banana-hammock-deo',
      '3-pack-banana-hammock-deo',
      '2-pack-e-mochi-deo',
    ],
  },
  'functional-fragrance': {
    handle: 'functional-fragrance',
    displayName: 'Fine Fragrance',
    headline: 'Scents with a job to do.',
    order: [
      'adaptive-eau-de-parfum',
      'adaptive-eau-de-parfum-3',
      'adaptive-eau-de-parfum-2',
      'adaptive-eau-de-parfum-1',
      'e-mochi-edp',
      'not-vanilla-edp',
      'hayyy-eau-de-parfum-pre-release',
      'cannoli-edp',
      'apres-ski-edp',
      'eau-de-parfum-preorder',
      'nudie-eau-de-parfum',
      'layer-pack-001',
      'fine-fragrance-discovery-set',
      'fine-fragrance-discovery-set-pre-order',
      'fine-fragrance-discovery-set-3-new-scents',
    ],
  },
  'body-cream': {
    handle: 'body-cream',
    displayName: 'Body Care',
    headline: 'The after-party for your skin.',
    order: [
      'daily-drench-body-cream',
      'daily-drench-body-cream-banana-hammock',
      'daily-drench-body-cream-rocket-man',
      'daily-drench-body-cream-cuffed',
      'post-nut-clarity-room-spray',
      'hayyy-home-candle',
      'pnc-gift',
    ],
  },
  'bundles-1': {
    handle: 'bundles-1',
    displayName: 'Bundles & Sets',
    headline: 'More bang. Less buck.',
    order: [
      '1-year-supply-of-lbh',
      'cuffing-season',
      'boots-the-house-down',
      'cowboy-wisdom',
      'layer-pack-001',
      'cannoli-bundle',
      'golden-madonna-pack',
      'apres-day-pass',
      'flow-state',
      'e-mochi-bundle',
      'emochi-2',
      'e-mochi-1',
      'e-mochi-3',
      'rise-and-shine-bundle',
      'launch-special-araki-40',
      '3-pack-banana-hammock',
      'pnc-gift',
      '3-pack-nudie',
      '3-pack-araki-40',
      '6-pack-araki-40-special',
    ],
  },
  'sampler-sets': {
    handle: 'sampler-sets',
    displayName: 'Discovery Sets',
    headline: 'Commitment issues welcome.',
    sub: '$18 minis and discovery sets. Find your scent, then graduate to the big bottle.',
    order: [
      'new-discovery-set',
      'fine-fragrance-discovery-set',
      'fine-fragrance-discovery-set-pre-order',
      'fine-fragrance-discovery-set-3-new-scents',
      '3-pack-discovery-pack',
    ],
  },
  'new-arrivals': {
    handle: 'new-arrivals',
    displayName: 'New Arrivals',
    headline: 'Fresh out the bath.',
    order: [
      'e-mochi-edp',
      'e-mochi',
      '2-pack-e-mochi-deo',
      'e-mochi-bundle',
      'hayyy-eau-de-parfum-pre-release',
      'hayyy-home-candle',
      'not-vanilla-edp',
      'cannoli-edp',
      'cuffed',
    ],
  },
  'black-friday': {
    // Handle stays; display name is "Trending Now" (§4).
    handle: 'black-friday',
    displayName: 'Trending Now',
    headline: 'The stuff that keeps selling out.',
    order: [
      '1-year-supply-of-lbh',
      'new-discovery-set',
      'not-vanilla-edp',
      'daily-drench-body-cream-banana-hammock',
    ],
  },
  'araki-40-bundles': {
    handle: 'araki-40-bundles',
    displayName: 'Araki 40 Shop',
    headline: 'Cherry blossom. Almond. Cedarwood.',
    order: [
      'natural-body-wash-1',
      'adaptive-eau-de-parfum-1',
      '3-pack-araki-40',
      '6-pack-araki-40-special',
      'launch-special-araki-40',
    ],
  },
};

/** Filter-pill row rendered on every collection page (§4). */
export const FILTER_PILLS: Array<{label: string; handle: string}> = [
  {label: 'All', handle: 'all'},
  {label: 'Trending', handle: 'black-friday'},
  {label: 'Body Wash', handle: 'body-wash'},
  {label: 'Deodorant', handle: 'solid-serum-deodorant'},
  {label: 'Fragrance', handle: 'functional-fragrance'},
  {label: 'Body Care', handle: 'body-cream'},
  {label: 'Bundles', handle: 'bundles-1'},
  {label: 'Discovery', handle: 'sampler-sets'},
];

/** Handles rendered with the kit/bundle PDP template (BLUEPRINT §3). */
export const KIT_HANDLES = new Set([
  '1-year-supply-of-lbh',
  'cuffing-season',
  'rise-and-shine-bundle',
  'layer-pack-001',
  'cannoli-bundle',
  'boots-the-house-down',
  'cowboy-wisdom',
  'golden-madonna-pack',
  'apres-day-pass',
  'flow-state',
  'new-discovery-set',
  'launch-special-araki-40',
  'e-mochi-bundle',
  'emochi-2',
  'e-mochi-1',
  'e-mochi-3',
]);
