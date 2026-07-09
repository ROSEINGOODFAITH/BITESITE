# Laurel Bath House — Hydrogen Storefront (Project Laurel, Phase 3)

A Shopify Hydrogen (2025.x, Remix/Vite) storefront for **Laurel Bath House**.
Built from `BLUEPRINT.md` (structural patterns) + `BRAND_CONTENT.md` (IA, copy
deck, PDP logic) + `catalog.json` (the approved 73-product / 16-collection
export from the "LBH NEW TEST SITE" channel).

The site is **dual-mode**: it runs fully with zero credentials (mock mode),
and flips to the live Storefront API the moment two env vars are set.

## Quick start

```bash
npm install
npm run dev        # → http://localhost:5173 (mock mode, no credentials needed)
```

Other scripts:

```bash
npm run typecheck  # tsc --noEmit
npm run build      # remix vite:build (client + SSR/Oxygen bundle in dist/)
```

## Mock mode (default)

With no env vars set, the app serves everything from `app/data/catalog.json`
through the same `DataAdapter` interface the live mode uses:

- Products, collections (curated ordering in `app/lib/collections-map.ts`,
  since the export carries no collection membership), search, and sitemap.
- A **session-backed mock cart** (`app/lib/data/cart-mock.ts`) — add/update/
  remove lines, selling-plan lines included. Checkout is intentionally
  disabled and labeled ("activates once store credentials are connected").
- Policy pages render neutral stub text (marked `TBD-CONFIRM` in code).
- Selling plans are synthesized (one plan per group name) so the subscription
  UI is fully wired; live mode replaces them with real Selling Plans API data.

## Connecting the real store (live mode)

1. In Shopify admin, open the **Hydrogen / Headless channel** storefront
   named **"LBH NEW TEST SITE"** and copy the **public Storefront API token**.
2. Create `.env` (see `.env.example`):

   ```bash
   SESSION_SECRET="a-long-random-string"
   PUBLIC_STORE_DOMAIN="laurelbathhouse.myshopify.com"   # TBD: confirm actual myshopify domain
   PUBLIC_STOREFRONT_API_TOKEN="<public token from the channel>"
   # optional: PRIVATE_STOREFRONT_API_TOKEN, PUBLIC_STOREFRONT_ID
   ```

3. Restart `npm run dev`. `server.ts` detects the credentials and swaps in:
   - `app/lib/data/live.ts` — real GraphQL queries (product by handle,
     collection by handle, search, policies, sitemap handles), and
   - Hydrogen's **cart handler** (`createCartHandler`) for real cart
     mutations + a working checkout URL.

   Display-title cleanup, grid exclusions (utility SKUs, non-canonical
   dupes), and collection display names still apply in live mode.

## Subscriptions (Selling Plans) note

The three Soap-scribe products (`cuffed`, `natural-body-wash`, `nudie`)
render a subscription-first buy box; `eau-de-parfum-preorder-1` renders a
preorder buy box. **For live subscriptions the subscription app's selling
plans must be exposed to the Storefront API** — the buy box reads
`product.sellingPlanGroups` and passes real `sellingPlanId`s to the cart.
Discount % and cadence options are not hardcoded anywhere (TBD-CONFIRM);
the UI shows the plan names the API returns.

## Deploying to Oxygen

Install the Shopify CLI (`npm i -g @shopify/cli`), link the storefront, then:

```bash
shopify hydrogen deploy
```

`server.ts` is a standard Oxygen worker entry and `npm run build` emits the
`dist/server/index.js` worker bundle, so the repo deploys to Oxygen without
changes. (Any Workers-compatible host works too.)

## Where things live

```
server.ts                    Oxygen entry — mode detection, session, context
app/lib/data/                DataAdapter + CartAdapter (index), mock, live,
                             cart-mock (session), cart-live (Hydrogen), queries
app/lib/collections-map.ts   Curated collection ordering, exclusions, filter pills
app/lib/display-titles.ts    Display-title cleanup map (handles never change)
app/lib/cross-sell.ts        Scent-family map → "Pairs well with" + sibling links
app/lib/purchase-options.ts  Buy-box branching (subscription / preorder / one-time)
app/lib/faq.ts               18-question FAQ deck (verified facts only)
app/lib/nav.ts               Header mega-menu / mobile / footer IA
app/components/              ~20 components (Header, CartDrawer, BuyBox, …)
app/routes/                  Home, PDP, collections, pages, cart, policies,
                             search, blogs stub, robots/sitemap, 404 splat
app/data/catalog.json        The approved catalog (mock-mode source of truth)
```

## Content status

Anything the brand hasn't verified is marked with a `TBD-CONFIRM` code
comment and renders safe neutral copy (never a user-visible placeholder).
Notables: subscription discount %/cadences, press outlets/quotes (sections
hidden), aggregate review counts (never cited), founder story details,
return-refund method, support email alias, dermatologist-study stats
(not republished). See `BRAND_CONTENT.md` §8 for the consolidated list.
