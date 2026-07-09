import {Link, useFetcher} from '@remix-run/react';
import {json, type ActionFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {BRAND_NAME, SUPPORT_EMAIL, SUPPORT_PHONE} from '~/lib/const';

export const meta: MetaFunction = () => [
  {title: `Contact — ${BRAND_NAME}`},
];

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim();
  const message = String(formData.get('message') ?? '').trim();
  if (!email || !message) {
    return json({ok: false, error: 'Email and message are required.'}, {status: 400});
  }
  // TODO: forward to support inbox / helpdesk once the alias is confirmed.
  return json({ok: true});
}

export default function ContactPage() {
  const fetcher = useFetcher<{ok: boolean}>();
  const sent = fetcher.data?.ok === true;

  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="font-display text-4xl text-laurel-900">
        Talk dirty to us. (About soap.)
      </h1>
      <p className="mt-3 italic text-ink/60">
        Real humans, Van Nuys, California.
      </p>
      <p className="mt-4 text-sm leading-relaxed">
        Email{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline">
          {SUPPORT_EMAIL}
        </a>{' '}
        or call {SUPPORT_PHONE}.
        {/* TBD-CONFIRM: response SLA + support@ alias */}
      </p>
      <p className="mt-2 text-sm">
        Impatient?{' '}
        <Link to="/pages/faq" className="underline">
          The FAQ answers 90% of everything →
        </Link>
      </p>

      {sent ? (
        <p className="mt-10 border border-laurel-900/20 bg-laurel-100/60 p-4 text-sm font-semibold text-laurel-800">
          Got it. We&rsquo;ll get back to you soon.
        </p>
      ) : (
        <fetcher.Form method="post" className="mt-10 flex flex-col gap-4">
          <label className="text-sm font-semibold">
            Your email
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full border border-laurel-900/30 bg-cream px-4 py-3 text-sm outline-none focus:border-laurel-900"
            />
          </label>
          <label className="text-sm font-semibold">
            What&rsquo;s up
            <textarea
              name="message"
              required
              rows={5}
              className="mt-1 w-full border border-laurel-900/30 bg-cream px-4 py-3 text-sm outline-none focus:border-laurel-900"
            />
          </label>
          <button
            type="submit"
            className="btn-primary self-start"
            disabled={fetcher.state !== 'idle'}
          >
            Send it
          </button>
        </fetcher.Form>
      )}
    </div>
  );
}
