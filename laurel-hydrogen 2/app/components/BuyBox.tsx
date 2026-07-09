import {useState} from 'react';
import {Link} from '@remix-run/react';
import type {Product, ProductVariant} from '~/lib/types';
import {formatMoney} from '~/lib/types';
import {displayBadge, displayTitle} from '~/lib/display-titles';
import {
  defaultSellingPlan,
  getBuyBoxMode,
  hasSizeVariants,
} from '~/lib/purchase-options';
import {familyForHandle, siblingLink, WASH_SIBLINGS} from '~/lib/cross-sell';
import {SUBSCRIPTION_PROGRAM_NAME} from '~/lib/const';
import {AddToCartButton} from '~/components/AddToCartButton';
import {VariantSelector} from '~/components/VariantSelector';
import {BuyBoxTrustRow} from '~/components/TrustBadges';

type PurchaseChoice = 'subscribe' | 'one-time';

/**
 * PDP buy box (BLUEPRINT §2.2) with three-way branching (BRAND_CONTENT §3.1):
 * - subscription-first for the 3 Soap-scribe washes (subscribe = default)
 * - preorder messaging for products carrying a Preorder selling plan
 * - straightforward one-time for everything else
 */
export function BuyBox({product}: {product: Product}) {
  const mode = getBuyBoxMode(product);
  const [variant, setVariant] = useState<ProductVariant>(
    product.variants.find((v) => v.availableForSale) ?? product.variants[0],
  );
  const [choice, setChoice] = useState<PurchaseChoice>(
    mode === 'subscription' ? 'subscribe' : 'one-time',
  );
  const [quantity, setQuantity] = useState(1);

  const title = displayTitle(product.handle, product.title);
  const badge = displayBadge(product.handle);
  const family = familyForHandle(product.handle);
  const sibling = siblingLink(product.handle);
  const sellingPlan = defaultSellingPlan(product);
  const subscribing = mode === 'subscription' && choice === 'subscribe';

  const compareAt =
    variant.compareAtPrice &&
    parseFloat(variant.compareAtPrice.amount) >
      parseFloat(variant.price.amount)
      ? variant.compareAtPrice
      : null;

  const isWash = WASH_SIBLINGS.some((w) => w.handle === product.handle);

  const atcLabel = !product.availableForSale
    ? 'Sold out'
    : mode === 'preorder'
      ? `Preorder — ${formatMoney(variant.price)}`
      : `Add to Bag — ${formatMoney(variant.price)}`;

  return (
    <div className="flex flex-col gap-5">
      <div>
        {/* Rating anchor — no fabricated counts; links to review module */}
        <a
          href="#reviews"
          className="text-xs uppercase tracking-widest text-ink/50 hover:text-ink"
        >
          ★★★★★ Reviews
        </a>
        <h1 className="mt-1 font-display text-3xl leading-tight text-laurel-900 lg:text-4xl">
          {title}
        </h1>
        {badge ? (
          <span className="mt-2 inline-block rounded bg-laurel-100 px-2 py-0.5 text-xs font-semibold text-laurel-800">
            {badge}
          </span>
        ) : null}
        {family ? (
          <p className="mt-2 font-display text-lg italic text-ink/70">
            {family.notes}
          </p>
        ) : null}
      </div>

      {/* Benefit chips — verified formula claims only (BRAND_CONTENT §0) */}
      <ul className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-wide text-laurel-800">
        {[
          'Niacinamide + A/C/E',
          'Vegan & cruelty-free',
          'No SLS · No parabens',
          'pH balanced',
          'Made in LA',
        ].map((chip) => (
          <li key={chip} className="rounded-full bg-laurel-100 px-3 py-1">
            {chip}
          </li>
        ))}
      </ul>

      {/* Sibling scent picker for the wash line (§3.2) */}
      {isWash ? (
        <fieldset>
          <legend className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink/60">
            Choose your Body Wash
          </legend>
          <div className="flex flex-wrap gap-2">
            {WASH_SIBLINGS.map((wash) =>
              wash.handle === product.handle ? (
                <span
                  key={wash.handle}
                  className="border border-laurel-900 bg-laurel-900 px-4 py-2 text-sm text-cream"
                >
                  {wash.label}
                </span>
              ) : (
                <Link
                  key={wash.handle}
                  to={`/products/${wash.handle}`}
                  className="border border-laurel-900/30 px-4 py-2 text-sm hover:border-laurel-900"
                >
                  {wash.label}
                </Link>
              ),
            )}
          </div>
        </fieldset>
      ) : null}

      {hasSizeVariants(product) ? (
        <VariantSelector
          product={product}
          selectedVariantId={variant.id}
          onSelect={(v) => setVariant(v)}
        />
      ) : null}

      {/* Purchase-option selector */}
      {mode === 'subscription' ? (
        <fieldset className="flex flex-col gap-2">
          <legend className="sr-only">Purchase options</legend>

          {/* Subscribe card — visually default/primary (BLUEPRINT §2.2) */}
          <label
            className={`cursor-pointer border-2 p-4 transition-colors ${
              subscribing
                ? 'border-laurel-900 bg-laurel-100/60'
                : 'border-laurel-900/20'
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-2">
                <input
                  type="radio"
                  name="purchase-option"
                  checked={subscribing}
                  onChange={() => setChoice('subscribe')}
                />
                <span className="font-semibold">
                  {SUBSCRIPTION_PROGRAM_NAME}
                </span>
              </span>
              {/* TBD-CONFIRM: subscription discount % — shown once confirmed */}
              <span className="rounded-full bg-laurel-900 px-2 py-0.5 text-[11px] font-bold uppercase text-cream">
                Save on every refill
              </span>
            </div>
            {subscribing ? (
              <div className="mt-3 space-y-2 pl-6">
                <label className="block text-xs text-ink/60">
                  Delivery cadence
                  {/* TBD-CONFIRM: real cadence options come from the
                      subscription app's Selling Plans via the Storefront API */}
                  <select className="mt-1 w-full border border-laurel-900/30 bg-cream px-3 py-2 text-sm">
                    <option>{sellingPlan?.name ?? 'Regular refill delivery'}</option>
                  </select>
                </label>
                <ul className="space-y-1 text-xs text-ink/70">
                  <li>✓ Never run dry</li>
                  <li>✓ Save on every refill</li>
                  <li>✓ Pause, skip, or cancel anytime — no hostage negotiations</li>
                </ul>
              </div>
            ) : null}
          </label>

          {/* One-time card */}
          <label
            className={`cursor-pointer border-2 p-4 transition-colors ${
              !subscribing
                ? 'border-laurel-900 bg-laurel-100/60'
                : 'border-laurel-900/20'
            }`}
          >
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="purchase-option"
                checked={!subscribing}
                onChange={() => setChoice('one-time')}
              />
              <span className="font-semibold">One-Time Purchase</span>
              <span className="ml-auto text-sm">
                {formatMoney(variant.price)}
              </span>
            </span>
          </label>
        </fieldset>
      ) : null}

      {mode === 'preorder' ? (
        <div className="border-2 border-gold/60 bg-gold/10 p-4 text-sm">
          <p className="font-semibold text-laurel-900">Preorder</p>
          <p className="mt-1 text-ink/70">
            This scent is brewing. Order now and it ships as soon as the batch
            is ready — we&rsquo;ll email you the moment it leaves Van Nuys.
          </p>
        </div>
      ) : null}

      {/* Quantity stepper — one-time purchases only (BLUEPRINT §2.2) */}
      {!subscribing ? (
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-ink/60">
            Qty
          </span>
          <div className="flex items-center border border-laurel-900/20">
            <button
              type="button"
              aria-label="Decrease quantity"
              className="px-3 py-2 disabled:opacity-40"
              disabled={quantity <= 1}
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            >
              −
            </button>
            <span className="min-w-8 text-center">{quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              className="px-3 py-2"
              onClick={() => setQuantity((q) => q + 1)}
            >
              +
            </button>
          </div>
        </div>
      ) : null}

      <div>
        <AddToCartButton
          lines={[
            {
              merchandiseId: variant.id,
              quantity: subscribing ? 1 : quantity,
              sellingPlanId:
                subscribing && sellingPlan ? sellingPlan.id : undefined,
            },
          ]}
          disabled={!variant.availableForSale}
          label={atcLabel}
        />
        {compareAt ? (
          <p className="mt-2 text-center text-sm text-ink/50">
            <s>{formatMoney(compareAt)}</s>{' '}
            <span className="font-semibold text-clay">
              {formatMoney(variant.price)}
            </span>{' '}
            — save $
            {(
              parseFloat(compareAt.amount) - parseFloat(variant.price.amount)
            ).toFixed(2)}
          </p>
        ) : null}
      </div>

      <BuyBoxTrustRow />

      {sibling ? (
        <p className="text-sm">
          <Link to={sibling.to} className="underline hover:text-laurel-700">
            {sibling.label}
          </Link>
        </p>
      ) : null}
    </div>
  );
}
