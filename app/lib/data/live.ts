import {CacheLong, CacheShort, type Storefront} from '@shopify/hydrogen';
import type {Collection, Policy, Product} from '~/lib/types';
import {sanitizeDescriptionHtml} from '~/lib/types';
import type {CollectionSummary, DataAdapter} from '~/lib/data';
import {
  ALL_HANDLES_QUERY,
  COLLECTIONS_QUERY,
  COLLECTION_QUERY,
  POLICIES_QUERY,
  PRODUCT_QUERY,
  SEARCH_QUERY,
} from '~/lib/data/queries';
import {
  COLLECTION_META,
  EXCLUDED_COLLECTIONS,
  EXCLUDED_PRODUCTS,
  HIDDEN_FROM_GRIDS,
} from '~/lib/collections-map';

/* ---------- minimal response typings for the queries above ---------- */

interface ApiMoney {
  amount: string;
  currencyCode: string;
}

interface ApiImage {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
}

interface ApiProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  availableForSale: boolean;
  options: Array<{name: string; optionValues: Array<{name: string}>}>;
  featuredImage: ApiImage | null;
  images: {nodes: ApiImage[]};
  priceRange: {minVariantPrice: ApiMoney; maxVariantPrice: ApiMoney};
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      sku: string | null;
      availableForSale: boolean;
      price: ApiMoney;
      compareAtPrice: ApiMoney | null;
      selectedOptions: Array<{name: string; value: string}>;
      image: ApiImage | null;
    }>;
  };
  sellingPlanGroups: {
    nodes: Array<{
      name: string;
      sellingPlans: {nodes: Array<{id: string; name: string}>};
    }>;
  };
  seo: {title: string | null; description: string | null};
}

interface ApiPolicy {
  handle: string;
  title: string;
  body: string;
}

function mapApiProduct(p: ApiProduct): Product {
  return {
    id: p.id,
    title: p.title,
    handle: p.handle,
    description: p.description,
    descriptionHtml: sanitizeDescriptionHtml(p.descriptionHtml),
    productType: p.productType,
    vendor: p.vendor,
    tags: p.tags,
    options: p.options.map((o) => ({
      name: o.name,
      values: o.optionValues.map((v) => v.name),
    })),
    featuredImage: p.featuredImage,
    images: p.images.nodes,
    variants: p.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      sku: v.sku,
      price: v.price,
      compareAtPrice: v.compareAtPrice,
      availableForSale: v.availableForSale,
      selectedOptions: v.selectedOptions,
      image: v.image,
    })),
    sellingPlanGroups: p.sellingPlanGroups.nodes.map((g) => ({
      name: g.name,
      sellingPlans: g.sellingPlans.nodes,
    })),
    availableForSale: p.availableForSale,
    priceRange: p.priceRange,
    seo: p.seo,
  };
}

/** Grid-level exclusions apply in live mode too (utility SKUs + dupes). */
function visibleInGrids(product: Product): boolean {
  return (
    !EXCLUDED_PRODUCTS.has(product.handle) &&
    !HIDDEN_FROM_GRIDS.has(product.handle)
  );
}

export class LiveAdapter implements DataAdapter {
  mode = 'live' as const;

  constructor(private storefront: Storefront) {}

  async getProduct(handle: string): Promise<Product | null> {
    if (EXCLUDED_PRODUCTS.has(handle)) return null;
    const result = await this.storefront.query<{product: ApiProduct | null}>(
      PRODUCT_QUERY,
      {
        variables: {handle},
        cache: CacheShort(),
      },
    );
    return result.product ? mapApiProduct(result.product) : null;
  }

  async getCollection(handle: string, first = 48): Promise<Collection | null> {
    if (EXCLUDED_COLLECTIONS.has(handle)) return null;
    const result = await this.storefront.query<{
      collection:
        | {
            id: string;
            title: string;
            handle: string;
            description: string;
            products: {nodes: ApiProduct[]};
          }
        | null;
    }>(COLLECTION_QUERY, {
      variables: {handle, first},
      cache: CacheShort(),
    });
    if (!result.collection) return null;
    const meta = COLLECTION_META[handle];
    return {
      id: result.collection.id,
      handle: result.collection.handle,
      // Display-name override (e.g. black-friday renders as "Trending Now").
      title: meta?.displayName ?? result.collection.title,
      description: meta?.headline ?? result.collection.description,
      products: result.collection.products.nodes
        .map(mapApiProduct)
        .filter(visibleInGrids),
    };
  }

  async listCollections(): Promise<CollectionSummary[]> {
    const result = await this.storefront.query<{
      collections: {
        nodes: Array<{
          id: string;
          title: string;
          handle: string;
          description: string;
          image: ApiImage | null;
        }>;
      };
    }>(COLLECTIONS_QUERY, {cache: CacheLong()});
    return result.collections.nodes
      .filter((c) => !EXCLUDED_COLLECTIONS.has(c.handle))
      .map((c) => {
        const meta = COLLECTION_META[c.handle];
        return {
          handle: c.handle,
          title: meta?.displayName ?? c.title,
          description: meta?.headline ?? c.description,
          image: c.image,
        };
      });
  }

  async getProductsByHandles(handles: string[]): Promise<Product[]> {
    const results = await Promise.all(
      handles.map((handle) => this.getProduct(handle)),
    );
    return results.filter((p): p is Product => Boolean(p));
  }

  async searchProducts(query: string): Promise<Product[]> {
    const q = query.trim();
    if (!q) return [];
    const result = await this.storefront.query<{
      products: {nodes: ApiProduct[]};
    }>(SEARCH_QUERY, {
      variables: {query: q, first: 24},
      cache: CacheShort(),
    });
    return result.products.nodes.map(mapApiProduct).filter(visibleInGrids);
  }

  async getPolicy(handle: string): Promise<Policy | null> {
    const policies = await this.listPolicies();
    return policies.find((p) => p.handle === handle) ?? null;
  }

  async listPolicies(): Promise<Policy[]> {
    const result = await this.storefront.query<{
      shop: {
        privacyPolicy: ApiPolicy | null;
        shippingPolicy: ApiPolicy | null;
        refundPolicy: ApiPolicy | null;
        termsOfService: ApiPolicy | null;
        subscriptionPolicy: ApiPolicy | null;
      };
    }>(POLICIES_QUERY, {cache: CacheLong()});
    return [
      result.shop.shippingPolicy,
      result.shop.refundPolicy,
      result.shop.subscriptionPolicy,
      result.shop.privacyPolicy,
      result.shop.termsOfService,
    ].filter((p): p is ApiPolicy => Boolean(p));
  }

  async getAllProductHandles(): Promise<string[]> {
    const result = await this.storefront.query<{
      products: {nodes: Array<{handle: string}>};
    }>(ALL_HANDLES_QUERY, {cache: CacheLong()});
    return result.products.nodes
      .map((n) => n.handle)
      .filter(
        (h) => !EXCLUDED_PRODUCTS.has(h) && !HIDDEN_FROM_GRIDS.has(h),
      );
  }
}
