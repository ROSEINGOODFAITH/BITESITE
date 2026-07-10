import catalogJson from '~/data/catalog.json';
import type {
  Collection,
  Money,
  Policy,
  Product,
  SellingPlanGroup,
  StoreImage,
} from '~/lib/types';
import {sanitizeDescriptionHtml} from '~/lib/types';
import type {CollectionSummary, DataAdapter} from '~/lib/data';
import {
  COLLECTION_META,
  EXCLUDED_COLLECTIONS,
  EXCLUDED_PRODUCTS,
  HIDDEN_FROM_GRIDS,
} from '~/lib/collections-map';
import {displayTitle} from '~/lib/display-titles';
import {FREE_SHIPPING_THRESHOLD, SUPPORT_EMAIL} from '~/lib/const';

/* ------------------------------------------------------------------ */
/* Raw catalog shapes (Admin API export, app/data/catalog.json)        */
/* ------------------------------------------------------------------ */

interface RawImage {
  url: string;
  altText: string | null;
}

interface RawVariant {
  id: string;
  title: string;
  sku: string | null;
  price: string;
  compareAtPrice: string | null;
  availableForSale: boolean;
  inventoryQuantity: number | null;
  selectedOptions: Array<{name: string; value: string}>;
}

interface RawProduct {
  id: string;
  title: string;
  handle: string;
  status: string;
  specialType: string | null;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  options: Array<{name: string; values: string[]}>;
  featuredImage: RawImage | null;
  images: RawImage[];
  variants: RawVariant[];
  sellingPlanGroups: string[];
  seo: {title: string | null; description: string | null};
}

interface RawCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  publishedOnPublication: boolean;
}

interface RawCatalog {
  exportedAt: string;
  shop: {name: string; domain: string; currency: string};
  products: RawProduct[];
  collections: RawCollection[];
}

const catalog = catalogJson as unknown as RawCatalog;
const CURRENCY = catalog.shop?.currency ?? 'USD';

/* ------------------------------------------------------------------ */
/* Mapping helpers                                                     */
/* ------------------------------------------------------------------ */

function money(amount: string): Money {
  return {amount, currencyCode: CURRENCY};
}

function mapImage(img: RawImage | null): StoreImage | null {
  return img ? {url: img.url, altText: img.altText} : null;
}

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * The export lists selling plan group NAMES only. Synthesize one plan per
 * group so the UI is fully wired for the Selling Plans API; live mode
 * replaces these with real plan ids from the subscription app.
 */
function mapSellingPlanGroups(names: string[], handle: string): SellingPlanGroup[] {
  return names.map((name) => {
    const isPreorder = name.toLowerCase().includes('preorder');
    return {
      name,
      sellingPlans: [
        {
          id: `gid://mock/SellingPlan/${isPreorder ? 'preorder' : 'soap-scribe'}-${handle}`,
          // TBD-CONFIRM: real cadence options come from the subscription app.
          name: isPreorder ? 'Preorder' : 'Regular refill delivery',
        },
      ],
    };
  });
}

function mapProduct(raw: RawProduct): Product {
  const variants = raw.variants.map((v) => ({
    id: v.id,
    title: v.title,
    sku: v.sku,
    price: money(v.price),
    compareAtPrice: v.compareAtPrice ? money(v.compareAtPrice) : null,
    availableForSale: v.availableForSale,
    selectedOptions: v.selectedOptions,
    image: mapImage(raw.featuredImage),
  }));
  const prices = variants.map((v) => parseFloat(v.price.amount));
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return {
    id: raw.id,
    title: raw.title,
    handle: raw.handle,
    descriptionHtml: sanitizeDescriptionHtml(raw.descriptionHtml),
    description: stripHtml(sanitizeDescriptionHtml(raw.descriptionHtml)),
    productType: raw.productType,
    vendor: raw.vendor,
    tags: raw.tags,
    options: raw.options,
    featuredImage: mapImage(raw.featuredImage),
    images: raw.images.map((i) => mapImage(i)!),
    variants,
    sellingPlanGroups: mapSellingPlanGroups(raw.sellingPlanGroups, raw.handle),
    availableForSale: variants.some((v) => v.availableForSale),
    priceRange: {
      minVariantPrice: money(min.toFixed(2)),
      maxVariantPrice: money(max.toFixed(2)),
    },
    seo: raw.seo,
  };
}

/* ------------------------------------------------------------------ */
/* Indexes (built once per worker)                                     */
/* ------------------------------------------------------------------ */

function isActive(raw: RawProduct): boolean {
  return raw.status === 'ACTIVE' && !raw.specialType;
}

function isVisibleInGrids(raw: RawProduct): boolean {
  return (
    isActive(raw) &&
    !EXCLUDED_PRODUCTS.has(raw.handle) &&
    !HIDDEN_FROM_GRIDS.has(raw.handle)
  );
}

const byHandle = new Map<string, RawProduct>();
export const variantIndex = new Map<string, {product: Product; variantId: string}>();
const mappedCache = new Map<string, Product>();

for (const raw of catalog.products) {
  byHandle.set(raw.handle, raw);
}

function getMapped(handle: string): Product | null {
  const cached = mappedCache.get(handle);
  if (cached) return cached;
  const raw = byHandle.get(handle);
  if (!raw) return null;
  const product = mapProduct(raw);
  mappedCache.set(handle, product);
  for (const v of product.variants) {
    variantIndex.set(v.id, {product, variantId: v.id});
  }
  return product;
}

/** Resolve a variant id to its product/variant pair (mock cart hydration). */
export function findVariant(merchandiseId: string) {
  // Ensure every product has been mapped at least once.
  if (!variantIndex.has(merchandiseId)) {
    for (const raw of catalog.products) getMapped(raw.handle);
  }
  const hit = variantIndex.get(merchandiseId);
  if (!hit) return null;
  const variant = hit.product.variants.find((v) => v.id === merchandiseId);
  return variant ? {product: hit.product, variant} : null;
}

/* ------------------------------------------------------------------ */
/* Policies (mock stubs — BRAND_CONTENT §5.9)                          */
/* ------------------------------------------------------------------ */

const MOCK_POLICIES: Policy[] = [
  {
    handle: 'shipping-policy',
    title: 'Shipping Policy',
    // TBD-CONFIRM: dispatch SLA, carriers, international terms.
    body: `<p>Free shipping on US orders over $${FREE_SHIPPING_THRESHOLD}.</p><p>Every order includes shipping insurance, on us, via Shipsurance — 100% coverage in case of loss, damage, or theft. To file a claim, contact ${SUPPORT_EMAIL}.</p><p>Full dispatch, carrier, and international shipping terms will be published here.</p>`,
  },
  {
    handle: 'refund-policy',
    title: 'Return Policy',
    // TBD-CONFIRM: refund method + process from live policy text.
    body: `<p>We offer a 30-day return policy.</p><p>To start a return, contact ${SUPPORT_EMAIL} with your order number. Full condition requirements and refund details will be published here.</p>`,
  },
  {
    handle: 'subscription-policy',
    title: 'Subscription Policy',
    // TBD-CONFIRM: billing cadence + discount terms.
    body: `<p>Soap-scribe &amp; Save subscriptions renew on the cadence you choose at checkout. You can pause, skip, or cancel anytime from your account — log in and choose Manage Subscription before your next renewal.</p>`,
  },
  {
    handle: 'privacy-policy',
    title: 'Privacy Policy',
    // TBD-CONFIRM: carry over the live site's existing policy text.
    body: `<p>Our full privacy policy will be published here. For data-sharing opt-out requests, contact ${SUPPORT_EMAIL}.</p>`,
  },
  {
    handle: 'terms-of-service',
    title: 'Terms of Service',
    // TBD-CONFIRM: carry over the live site's existing terms.
    body: `<p>Our full terms of service will be published here.</p>`,
  },
];

/* ------------------------------------------------------------------ */
/* Adapter                                                             */
/* ------------------------------------------------------------------ */

export class MockAdapter implements DataAdapter {
  mode = 'mock' as const;

  async getProduct(handle: string): Promise<Product | null> {
    const raw = byHandle.get(handle);
    if (!raw || !isActive(raw) || EXCLUDED_PRODUCTS.has(raw.handle)) {
      return null;
    }
    return getMapped(handle);
  }

  async getCollection(handle: string, first = 48): Promise<Collection | null> {
    if (EXCLUDED_COLLECTIONS.has(handle)) return null;
    const meta = COLLECTION_META[handle];
    const rawCollection = catalog.collections.find((c) => c.handle === handle);
    if (!meta && !rawCollection) return null;

    const orderedHandles = meta?.order ?? [];
    const products: Product[] = [];
    for (const h of orderedHandles) {
      const raw = byHandle.get(h);
      if (raw && isVisibleInGrids(raw)) {
        const mapped = getMapped(h);
        if (mapped) products.push(mapped);
      }
      if (products.length >= first) break;
    }

    return {
      id: rawCollection?.id ?? `gid://mock/Collection/${handle}`,
      handle,
      title: meta?.displayName ?? rawCollection?.title ?? handle,
      description: meta?.headline ?? rawCollection?.description ?? '',
      products,
    };
  }

  async listCollections(): Promise<CollectionSummary[]> {
    return Object.values(COLLECTION_META).map((meta) => {
      const firstHandle = meta.order.find((h) => {
        const raw = byHandle.get(h);
        return raw && isVisibleInGrids(raw);
      });
      const image = firstHandle ? getMapped(firstHandle)?.featuredImage : null;
      return {
        handle: meta.handle,
        title: meta.displayName,
        description: meta.headline,
        image,
      };
    });
  }

  async getProductsByHandles(handles: string[]): Promise<Product[]> {
    const out: Product[] = [];
    for (const h of handles) {
      const raw = byHandle.get(h);
      if (raw && isActive(raw) && !EXCLUDED_PRODUCTS.has(h)) {
        const mapped = getMapped(h);
        if (mapped) out.push(mapped);
      }
    }
    return out;
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results: Product[] = [];
    for (const raw of catalog.products) {
      if (!isVisibleInGrids(raw)) continue;
      const haystack = [
        raw.title,
        displayTitle(raw.handle, raw.title),
        raw.handle,
        raw.tags.join(' '),
        stripHtml(raw.descriptionHtml),
      ]
        .join(' ')
        .toLowerCase();
      if (haystack.includes(q)) {
        const mapped = getMapped(raw.handle);
        if (mapped) results.push(mapped);
      }
    }
    return results.slice(0, 24);
  }

  async getPolicy(handle: string): Promise<Policy | null> {
    return MOCK_POLICIES.find((p) => p.handle === handle) ?? null;
  }

  async listPolicies(): Promise<Policy[]> {
    return MOCK_POLICIES;
  }

  async getAllProductHandles(): Promise<string[]> {
    return catalog.products.filter(isVisibleInGrids).map((p) => p.handle);
  }
}
