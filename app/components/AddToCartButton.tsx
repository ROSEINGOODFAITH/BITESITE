import {useEffect, useRef} from 'react';
import {useFetcher} from '@remix-run/react';
import type {CartLineInput} from '~/lib/types';
import {useCartUI} from '~/components/CartUI';

/**
 * Add-to-bag with live price inside the label (BLUEPRINT §C14).
 * Posts to the /cart action; opens the cart drawer on success.
 */
export function AddToCartButton({
  lines,
  label,
  disabled,
  variant = 'primary',
  className = '',
}: {
  lines: CartLineInput[];
  label: string;
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  className?: string;
}) {
  const fetcher = useFetcher<{ok?: boolean}>();
  const {openCart} = useCartUI();
  const submittedAt = useRef<number | null>(null);

  const busy = fetcher.state !== 'idle';

  useEffect(() => {
    if (fetcher.state === 'idle' && fetcher.data && submittedAt.current) {
      submittedAt.current = null;
      openCart();
    }
  }, [fetcher.state, fetcher.data, openCart]);

  return (
    <fetcher.Form
      method="post"
      action="/cart"
      onSubmit={() => {
        submittedAt.current = Date.now();
      }}
      className={className}
    >
      <input type="hidden" name="cartAction" value="LinesAdd" />
      <input type="hidden" name="lines" value={JSON.stringify(lines)} />
      <button
        type="submit"
        disabled={disabled || busy}
        className={`${
          variant === 'primary' ? 'btn-primary' : 'btn-secondary'
        } w-full`}
      >
        {busy ? 'Adding…' : label}
      </button>
    </fetcher.Form>
  );
}
