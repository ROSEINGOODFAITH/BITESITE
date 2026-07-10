/**
 * Scent-family cross-sell map (BRAND_CONTENT.md §3.3).
 * PDP "Pairs well with" = up to 3 same-family items ordered
 * EdP → deodorant → cream/bundle; falls back to Discovery Sets.
 */

export interface ScentFamily {
  name: string;
  notes: string;
  wash?: string;
  edp?: string;
  deodorant?: string;
  cream?: string;
  bundles: string[];
}

export const SCENT_FAMILIES: ScentFamily[] = [
  {
    name: 'Mourning Wood',
    notes: 'Oud wood. Black rose. Upcycled cedar.',
    wash: 'natural-body-wash',
    edp: 'adaptive-eau-de-parfum',
    deodorant: 'mourning-wood-deodorant',
    bundles: ['rise-and-shine-bundle', '2-pack-mourning-wood-1', '3-pack-mourning-wood-1'],
  },
  {
    name: 'Cuffed',
    notes: 'Sun-bleached leather. Tobacco. Raspberry.',
    wash: 'cuffed',
    edp: 'adaptive-eau-de-parfum-3',
    deodorant: 'solid-serum-deodorant',
    cream: 'daily-drench-body-cream-cuffed',
    bundles: ['cuffing-season', '2-pack-cuffed', '3-pack-cuffed-1'],
  },
  {
    name: 'Nudie',
    notes: 'Bergamot. Jasmine sambac. Musk.',
    wash: 'nudie',
    edp: 'nudie-eau-de-parfum',
    cream: 'daily-drench-body-cream', // In The Buff, unscented
    bundles: ['3-pack-nudie'],
  },
  {
    name: 'Banana Hammock',
    notes: 'Coconut. Bergamot. Teak.',
    edp: 'eau-de-parfum-preorder',
    deodorant: 'solid-serum-deodorant-banana-hammock',
    cream: 'daily-drench-body-cream-banana-hammock',
    bundles: ['3-pack-banana-hammock', '2-pack-banana-hammock-deo', '3-pack-banana-hammock-deo'],
  },
  {
    name: 'Araki 40',
    notes: 'Cherry blossom. Almond. Cedarwood.',
    wash: 'natural-body-wash-1',
    edp: 'adaptive-eau-de-parfum-1',
    bundles: ['3-pack-araki-40', '6-pack-araki-40-special', 'launch-special-araki-40'],
  },
  {
    name: 'Cannoli',
    notes: 'Sicilian lemon. Pistachio. Cinnamon milk.',
    edp: 'cannoli-edp',
    deodorant: 'cannoli',
    bundles: ['cannoli-bundle'],
  },
  {
    name: 'Rocket Man',
    notes: 'Honeyed neroli. Watery clean musk.',
    edp: 'adaptive-eau-de-parfum-2',
    cream: 'daily-drench-body-cream-rocket-man',
    bundles: [],
  },
  {
    name: 'E-Mochi',
    notes: 'Mochi marshmallow. Japanese fig. Rice milk.',
    edp: 'e-mochi-edp',
    deodorant: 'e-mochi',
    bundles: ['e-mochi-bundle', '2-pack-e-mochi-deo'],
  },
  {
    name: 'Hayyy',
    notes: 'Palo santo. Aged paper. Red cedar.',
    edp: 'hayyy-eau-de-parfum-pre-release',
    cream: 'hayyy-home-candle',
    bundles: ['boots-the-house-down', 'cowboy-wisdom'],
  },
  {
    name: 'Post Nut Clarity',
    notes: 'Bergamot salt. Haitian vetiver.',
    cream: 'post-nut-clarity-room-spray',
    bundles: ['pnc-gift'],
  },
];

/** Dupes resolve to the same family as their canonical (§7.2). */
const EXTRA_FAMILY_MEMBERS: Record<string, string> = {
  'cuffed-edp': 'Cuffed',
  'cuffed-eau-de-parfum-restock': 'Cuffed',
  'eau-de-parfum-preorder-1': 'Cannoli',
  'e-mochi-eau-de-parfum': 'E-Mochi',
  'e-mochi-eau-de-parfum-new': 'E-Mochi',
  'apres-ski-eau-de-parfum-preorder': 'Après Ski',
  'apres-ski-eau-de-parfum-restock': 'Après Ski',
  'apres-ski-edp': 'Après Ski',
  'not-vanilla': 'Not Vanilla',
  'not-vanilla-edp': 'Not Vanilla',
  'banana-hammock-restock': 'Banana Hammock',
  '3-pack-nudie-1': 'Nudie',
  '3-pack-nudie-2': 'Nudie',
  '2-pack-mourning-wood-1': 'Mourning Wood',
  '3-pack-mourning-wood-1': 'Mourning Wood',
  '2-pack-cuffed': 'Cuffed',
  '3-pack-cuffed-1': 'Cuffed',
  '2-pack-banana-hammock-deo': 'Banana Hammock',
  '3-pack-banana-hammock-deo': 'Banana Hammock',
  '2-pack-e-mochi-deo': 'E-Mochi',
};

/** Discovery-set fallback when a family is thin. */
export const DISCOVERY_FALLBACK = [
  'new-discovery-set',
  'fine-fragrance-discovery-set',
  '3-pack-discovery-pack',
];

export function familyForHandle(handle: string): ScentFamily | null {
  const byMembership = SCENT_FAMILIES.find(
    (f) =>
      f.wash === handle ||
      f.edp === handle ||
      f.deodorant === handle ||
      f.cream === handle ||
      f.bundles.includes(handle),
  );
  if (byMembership) return byMembership;
  const extra = EXTRA_FAMILY_MEMBERS[handle];
  if (extra) return SCENT_FAMILIES.find((f) => f.name === extra) ?? null;
  return null;
}

/**
 * Cross-sell handles for a PDP: same-family EdP → deodorant → cream, then
 * bundles, excluding the product itself; topped up from discovery sets.
 */
export function crossSellHandles(handle: string, max = 3): string[] {
  const family = familyForHandle(handle);
  const picks: string[] = [];
  if (family) {
    for (const candidate of [
      family.edp,
      family.deodorant,
      family.cream,
      ...family.bundles,
      family.wash,
    ]) {
      if (candidate && candidate !== handle && !picks.includes(candidate)) {
        picks.push(candidate);
      }
    }
  }
  for (const fallback of DISCOVERY_FALLBACK) {
    if (picks.length >= max) break;
    if (fallback !== handle && !picks.includes(fallback)) picks.push(fallback);
  }
  return picks.slice(0, max);
}

/**
 * Buy-box sibling text link (§3.3 rules): wash PDPs point to the family EdP,
 * EdP PDPs point back to the family wash.
 */
export function siblingLink(
  handle: string,
): {label: string; to: string} | null {
  const family = familyForHandle(handle);
  if (!family) return null;
  if (family.wash === handle && family.edp) {
    return {
      label: `Want it to last past the towel? Meet the ${family.name} Eau de Parfum.`,
      to: `/products/${family.edp}`,
    };
  }
  if (family.edp === handle && family.wash) {
    return {
      label: `Start the story in the shower — ${family.name} body wash.`,
      to: `/products/${family.wash}`,
    };
  }
  return null;
}

/** Sibling-scent picker across the 4 body-wash PDPs (§3.2). */
export const WASH_SIBLINGS: Array<{label: string; handle: string}> = [
  {label: 'Mourning Wood', handle: 'natural-body-wash'},
  {label: 'Cuffed', handle: 'cuffed'},
  {label: 'Nudie', handle: 'nudie'},
  {label: 'Araki 40', handle: 'natural-body-wash-1'},
];
