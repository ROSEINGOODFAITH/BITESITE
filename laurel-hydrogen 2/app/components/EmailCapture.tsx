import {useFetcher} from '@remix-run/react';

/**
 * Pre-footer email capture (BLUEPRINT §0.3, copy deck §5.6).
 * Posts to /api/newsletter. No % incentive shown — none is verified.
 */
export function EmailCapture() {
  const fetcher = useFetcher<{ok: boolean}>();
  const subscribed = fetcher.data?.ok === true;

  return (
    <section className="border-t border-laurel-900/10 bg-sand">
      <div className="mx-auto flex max-w-site flex-col items-center gap-4 px-6 py-14 text-center">
        <h2 className="font-display text-3xl text-laurel-900">
          Get on the list.
        </h2>
        {/* TBD-CONFIRM: signup incentive % — none advertised on current site */}
        <p className="max-w-md text-sm text-ink/70">
          New drops, restocks, and the occasional inappropriate pun.
        </p>
        {subscribed ? (
          <p className="text-sm font-semibold text-laurel-800">
            You&rsquo;re in. Keep an eye on your inbox.
          </p>
        ) : (
          <fetcher.Form
            method="post"
            action="/api/newsletter"
            className="flex w-full max-w-md gap-2"
          >
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <input
              id="newsletter-email"
              type="email"
              name="email"
              required
              placeholder="your@email.com"
              className="w-full border border-laurel-900/30 bg-cream px-4 py-3 text-sm outline-none focus:border-laurel-900"
            />
            <button
              type="submit"
              className="btn-primary shrink-0"
              disabled={fetcher.state !== 'idle'}
            >
              Sign me up
            </button>
          </fetcher.Form>
        )}
        <p className="text-xs text-ink/50">
          Unsubscribe anytime. We&rsquo;ll cry quietly.
        </p>
      </div>
    </section>
  );
}
