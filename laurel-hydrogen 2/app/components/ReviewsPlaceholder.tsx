/**
 * Review module slot (BLUEPRINT §2.11). Anchor target for the buy-box rating
 * link. TBD-CONFIRM: aggregate review source — wire the review platform here
 * (summary stats + photo reviews) before citing counts anywhere.
 */
export function ReviewsPlaceholder() {
  return (
    <section
      id="reviews"
      className="border-t border-laurel-900/10 bg-sand/50 py-14"
    >
      <div className="mx-auto max-w-site px-6 text-center">
        <p className="eyebrow mb-2">Reviews</p>
        <h2 className="font-display text-2xl text-laurel-900">
          The reviews are in&hellip; almost.
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink/60">
          We&rsquo;re plumbing in our review platform. In the meantime, the
          internet has opinions — see what people are saying on{' '}
          <a
            href="https://www.instagram.com/laurelbathhouse"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            @laurelbathhouse
          </a>
          .
        </p>
      </div>
    </section>
  );
}
