import {FREE_SHIPPING_THRESHOLD} from '~/lib/const';

/**
 * Free-shipping progress bar for the cart drawer (BLUEPRINT §C8).
 * Threshold: $29 US — verified (BRAND_CONTENT §0). Copy per §5.7.
 */
export function FreeShippingBar({subtotal}: {subtotal: number}) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const unlocked = remaining <= 0;

  return (
    <div className="border-b border-laurel-900/10 px-5 py-4">
      <p className="mb-2 text-sm">
        {unlocked ? (
          <span className="font-semibold text-laurel-800">
            Free shipping unlocked. As you deserve.
          </span>
        ) : (
          <>
            You&rsquo;re{' '}
            <strong className="text-laurel-900">${remaining.toFixed(2)}</strong>{' '}
            from free US shipping.
          </>
        )}
      </p>
      <div
        className="h-1.5 w-full overflow-hidden rounded-full bg-laurel-900/10"
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progress toward free shipping"
      >
        <div
          className="h-full rounded-full bg-laurel-700 transition-all"
          style={{width: `${progress}%`}}
        />
      </div>
      <p className="mt-1 text-[11px] text-ink/50">
        Free US shipping on orders over ${FREE_SHIPPING_THRESHOLD}.
      </p>
    </div>
  );
}
