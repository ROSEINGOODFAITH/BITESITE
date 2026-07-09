/**
 * Display-title cleanup map (BRAND_CONTENT.md §7.1).
 * Handles NEVER change — only what the customer sees is cleaned at render.
 */

const DISPLAY_TITLES: Record<string, string> = {
  cuffed: 'Cuffed Body Wash — 2-Pack',
  'natural-body-wash': 'The Original Mourning Wood',
  'natural-body-wash-1': 'Araki 40 Body Wash',
  'fine-fragrance-discovery-set-3-new-scents':
    'Fine Fragrance Discovery Set — New Scents',
  'fine-fragrance-discovery-set':
    'Fine Fragrance Discovery Set — The Core Four',
  'fine-fragrance-discovery-set-pre-order':
    'Fine Fragrance Discovery Set — Best Sellers',
  'eau-de-parfum-preorder': 'Banana Hammock Eau de Parfum',
  'banana-hammock-restock': 'Banana Hammock Eau de Parfum',
  'apres-ski-eau-de-parfum-restock': 'Après Ski Eau de Parfum',
  'apres-ski-eau-de-parfum-preorder': 'Après Ski Eau de Parfum',
  'apres-ski-edp': 'Après Ski Eau de Parfum',
  'e-mochi-eau-de-parfum-new': 'E-Mochi Eau de Parfum',
  'pulse-eau-de-parfum-pre-release': 'Pulse Eau de Parfum',
  '2-pack-mourning-wood-1': 'Mourning Wood Deodorant — 2-Pack',
  '3-pack-mourning-wood-1': 'Mourning Wood Deodorant — 3-Pack',
  '2-pack-cuffed': 'Cuffed Deodorant — 2-Pack',
  '3-pack-cuffed-1': 'Cuffed Deodorant — 3-Pack',
  '2-pack-banana-hammock-deo': 'Banana Hammock Deodorant — 2-Pack',
  '3-pack-banana-hammock-deo': 'Banana Hammock Deodorant — 3-Pack',
  '2-pack-e-mochi-deo': 'E-Mochi Deodorant — 2-Pack',
  '3-pack-discovery-pack': 'Deodorant Discovery Pack (3 Scents)',
  // Title/handle mismatch upstream: catalog title says 2-pack. Displayed as 2-pack.
  '3-pack-nudie-1': 'Nudie Body Wash — 2-Pack',
  '3-pack-nudie-2': 'Nudie Body Wash — 3-Pack',
  '3-pack-nudie': 'Nudie Body Wash — 3-Pack',
  '3-pack-banana-hammock': 'Banana Hammock Poolside Set',
  '3-pack-araki-40': 'Araki 40 Body Wash — 3-Pack',
  '6-pack-araki-40-special': 'Araki 40 Body Wash — 6-Pack',
  'launch-special-araki-40': 'Araki 40 Launch Set',
  'cuffing-season': 'Cuffing Season Bundle',
  'golden-madonna-pack': 'Golden Madonna Pack',
  'pnc-gift': 'Post Nut Clarity Room Spray — 3-Pack',
  'e-mochi-bundle': 'E-Mochi Bundle',
  // TBD-CONFIRM: contents of the numbered E-Mochi bundles → name by contents.
  'emochi-2': 'E-Mochi Set No. 2',
  'e-mochi-1': 'E-Mochi Set No. 1',
  'e-mochi-3': 'E-Mochi Set No. 3',
  'daily-drench-body-cream-banana-hammock':
    'Daily Drench Body Cream — Banana Hammock',
  'daily-drench-body-cream': 'Daily Drench Body Cream — In The Buff',
  'daily-drench-body-cream-rocket-man':
    'Daily Drench Body Cream — Rocket Man',
  'daily-drench-body-cream-cuffed': 'Daily Drench Body Cream — Cuffed',
  'laurel-bath-house-cash': 'LBH Cash',
  'mourning-wood-deodorant': 'Mourning Wood Deodorant',
  'solid-serum-deodorant': 'Cuffed Deodorant',
  'solid-serum-deodorant-banana-hammock': 'Banana Hammock Deodorant',
  cannoli: 'Cannoli Deodorant',
  'e-mochi': 'E-Mochi Deodorant',
  nudie: 'Nudie Body Wash',
  'adaptive-eau-de-parfum': 'Mourning Wood Eau de Parfum',
  'adaptive-eau-de-parfum-1': 'Araki 40 Eau de Parfum',
  'adaptive-eau-de-parfum-2': 'Rocket Man Eau de Parfum',
  'adaptive-eau-de-parfum-3': 'Cuffed Eau de Parfum',
  'cuffed-eau-de-parfum-restock': 'Cuffed Eau de Parfum',
  'cuffed-edp': 'Cuffed Eau de Parfum',
  'not-vanilla': 'Not Vanilla Eau de Parfum',
  'not-vanilla-edp': 'Not Vanilla Eau de Parfum',
  'nudie-eau-de-parfum': 'Nudie Eau de Parfum',
  'cannoli-edp': 'Cannoli Eau de Parfum',
  'eau-de-parfum-preorder-1': 'Cannoli Eau de Parfum',
  'e-mochi-edp': 'E-Mochi Eau de Parfum',
  'e-mochi-eau-de-parfum': 'E-Mochi Eau de Parfum',
  'hayyy-eau-de-parfum-pre-release': 'Hayyy Eau de Parfum',
  'hayyy-home-candle': 'Hayyy Home Candle',
  'post-nut-clarity-room-spray': 'Post Nut Clarity Room Spray',
  '1-year-supply-of-lbh': '1 Year Supply of LBH',
  'rise-and-shine-bundle': 'Rise & Shine Bundle',
  'cannoli-bundle': 'Cannoli Bundle',
  'boots-the-house-down': 'Boots The House Down',
  'cowboy-wisdom': 'Cowboy Wisdom',
  'apres-day-pass': 'Après Day Pass',
  'flow-state': 'Flow State',
  'layer-pack-001': 'Layer Pack 001',
  'new-discovery-set': 'Body Wash Discovery Set',
};

/** Badges shown next to (not inside) the cleaned title. */
const DISPLAY_BADGES: Record<string, string> = {
  cuffed: 'New lighter scent',
  'e-mochi-edp': 'New',
};

export function displayTitle(handle: string, rawTitle: string): string {
  return DISPLAY_TITLES[handle] ?? rawTitle;
}

export function displayBadge(handle: string): string | null {
  return DISPLAY_BADGES[handle] ?? null;
}

/** In card grids, the flagship gets a category suffix for clarity (§7.1). */
export function cardTitle(handle: string, rawTitle: string): string {
  const title = displayTitle(handle, rawTitle);
  if (handle === 'natural-body-wash') return `${title} Body Wash`;
  return title;
}
