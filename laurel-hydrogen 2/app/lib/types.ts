/**
 * Storefront-agnostic types. Both data adapters (live Storefront API and the
 * local catalog mock) normalize into these shapes so routes and components
 * never care which mode is running.
 */

export interface Money {
  amount: string;
  currencyCode: string;
}

/**
 * Description HTML is rendered with dangerouslySetInnerHTML, and the source
 * export carries stray theme markup (e.g. an empty `<form action="https://
 * henryrose.com/cart/add">` left behind by a copied theme snippet — QA Phase 4).
 * Strip form/script/iframe tags so no third-party endpoints or executable
 * markup ever reach the DOM. Both adapters run descriptions through this.
 */
export function sanitizeDescriptionHtml(html: string): string {
  return html
    .replace(/<(form|script|iframe)[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<\/?(form|script|iframe)[^>]*>/gi, '');
}

export interface StoreImage {
  url: string;
  altText: string | null;
  width?: number | null;
  height?: number | null;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku?: string | null;
  price: Money;
  compareAtPrice: Money | null;
  availableForSale: boolean;
  selectedOptions: SelectedOption[];
  image?: StoreImage | null;
}

export interface SellingPlan {
  id: string;
  name: string;
}

export interface SellingPlanGroup {
  name: string;
  sellingPlans: SellingPlan[];
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string[];
  options: ProductOption[];
  featuredImage: StoreImage | null;
  images: StoreImage[];
  variants: ProductVariant[];
  sellingPlanGroups: SellingPlanGroup[];
  availableForSale: boolean;
  priceRange: {
    minVariantPrice: Money;
    maxVariantPrice: Money;
  };
  seo?: {
    title: string | null;
    description: string | null;
  };
}

/** Card-sized subset — everything a grid card needs. */
export type ProductCardData = Product;

export interface Collection {
  id: string;
  title: string;
  handle: string;
  description: string;
  products: Product[];
}

export interface CartLine {
  id: string;
  quantity: number;
  sellingPlanName: string | null;
  merchandise: {
    id: string;
    title: string;
    image: StoreImage | null;
    price: Money;
    compareAtPrice: Money | null;
    product: {
      handle: string;
      title: string;
    };
    selectedOptions: SelectedOption[];
  };
  cost: {
    totalAmount: Money;
  };
}

export interface Cart {
  id: string;
  totalQuantity: number;
  checkoutUrl: string;
  lines: CartLine[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
  };
}

export interface CartLineInput {
  merchandiseId: string;
  quantity: number;
  sellingPlanId?: string | null;
}

export interface CartLineUpdateInput {
  id: string;
  quantity: number;
}

export interface Policy {
  handle: string;
  title: string;
  body: string;
}

export function formatMoney(money: Money | null | undefined): string {
  if (!money) return '';
  const value = parseFloat(money.amount);
  if (Number.isNaN(value)) return '';
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  });
  const symbol = money.currencyCode === 'USD' ? '$' : `${money.currencyCode} `;
  return `${symbol}${formatted}`;
}
