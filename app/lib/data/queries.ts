/**
 * Storefront API GraphQL (live mode). Written against the 2025-01 schema.
 */

export const PRODUCT_FRAGMENT = `#graphql
  fragment MoneyFields on MoneyV2 {
    amount
    currencyCode
  }
  fragment ImageFields on Image {
    url
    altText
    width
    height
  }
  fragment ProductFields on Product {
    id
    title
    handle
    description
    descriptionHtml
    productType
    vendor
    tags
    availableForSale
    options {
      name
      optionValues {
        name
      }
    }
    featuredImage {
      ...ImageFields
    }
    images(first: 12) {
      nodes {
        ...ImageFields
      }
    }
    priceRange {
      minVariantPrice {
        ...MoneyFields
      }
      maxVariantPrice {
        ...MoneyFields
      }
    }
    variants(first: 50) {
      nodes {
        id
        title
        sku
        availableForSale
        price {
          ...MoneyFields
        }
        compareAtPrice {
          ...MoneyFields
        }
        selectedOptions {
          name
          value
        }
        image {
          ...ImageFields
        }
      }
    }
    sellingPlanGroups(first: 5) {
      nodes {
        name
        sellingPlans(first: 10) {
          nodes {
            id
            name
          }
        }
      }
    }
    seo {
      title
      description
    }
  }
` as const;

export const PRODUCT_QUERY = `#graphql
  query ProductByHandle($handle: String!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    product(handle: $handle) {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export const COLLECTION_QUERY = `#graphql
  query CollectionByHandle($handle: String!, $first: Int!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collection(handle: $handle) {
      id
      title
      handle
      description
      products(first: $first) {
        nodes {
          ...ProductFields
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export const COLLECTIONS_QUERY = `#graphql
  query AllCollections($country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    collections(first: 30) {
      nodes {
        id
        title
        handle
        description
        image {
          url
          altText
        }
      }
    }
  }
` as const;

export const SEARCH_QUERY = `#graphql
  query SearchProducts($query: String!, $first: Int!, $country: CountryCode, $language: LanguageCode)
  @inContext(country: $country, language: $language) {
    products(first: $first, query: $query) {
      nodes {
        ...ProductFields
      }
    }
  }
  ${PRODUCT_FRAGMENT}
` as const;

export const ALL_HANDLES_QUERY = `#graphql
  query AllProductHandles {
    products(first: 250) {
      nodes {
        handle
      }
    }
  }
` as const;

export const POLICIES_QUERY = `#graphql
  query ShopPolicies {
    shop {
      privacyPolicy {
        handle
        title
        body
      }
      shippingPolicy {
        handle
        title
        body
      }
      refundPolicy {
        handle
        title
        body
      }
      termsOfService {
        handle
        title
        body
      }
      subscriptionPolicy {
        handle
        title
        body
      }
    }
  }
` as const;
