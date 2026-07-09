import type {Product} from '~/lib/types';

/**
 * Buy-box branching (BRAND_CONTENT.md §3.1):
 * - subscription: the 3 Soap-scribe products (cuffed, natural-body-wash, nudie)
 * - preorder:     products carrying a "Preorder" selling plan group
 * - one-time:     everything else
 * Derived from selling plan group names so the live API stays authoritative.
 */
export type BuyBoxMode = 'subscription' | 'preorder' | 'one-time';

export function getBuyBoxMode(product: Product): BuyBoxMode {
  const groups = product.sellingPlanGroups.map((g) => g.name.toLowerCase());
  if (groups.some((name) => name.includes('preorder'))) return 'preorder';
  if (groups.some((name) => name.includes('soap-scribe') || name.includes('soap scribe'))) {
    return 'subscription';
  }
  return 'one-time';
}

export function isSubscribable(product: Product): boolean {
  return getBuyBoxMode(product) === 'subscription';
}

/**
 * First available selling plan for the subscribe option.
 * In mock mode the adapter synthesizes a single plan; in live mode this is
 * the real Selling Plans API data (requires the subscription app to expose
 * its selling plans to the Storefront API).
 */
export function defaultSellingPlan(product: Product) {
  for (const group of product.sellingPlanGroups) {
    const name = group.name.toLowerCase();
    if (name.includes('soap')) {
      if (group.sellingPlans[0]) return group.sellingPlans[0];
    }
  }
  return product.sellingPlanGroups[0]?.sellingPlans[0] ?? null;
}

/** True when the EdP-style 50ml/5ml size selector should render (§3.2). */
export function hasSizeVariants(product: Product): boolean {
  return (
    product.variants.length > 1 &&
    product.options.some((o) => o.name.toLowerCase().includes('size'))
  );
}

/** Label cleanup for size options: "50ml Bottle" / "5ml Mini". */
export function sizeLabel(value: string): string {
  const v = value.toLowerCase();
  if (v.includes('5ml') || v.includes('5 ml') || v.includes('mini')) {
    return '5ml Mini — try it for $18';
  }
  if (v.includes('50ml') || v.includes('50 ml')) return '50ml Bottle';
  return value;
}
