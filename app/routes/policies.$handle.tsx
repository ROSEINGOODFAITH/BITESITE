import {useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {BRAND_NAME} from '~/lib/const';

export const meta: MetaFunction<typeof loader> = ({data}) => [
  {title: data ? `${data.policy.title} — ${BRAND_NAME}` : BRAND_NAME},
];

export async function loader({params, context}: LoaderFunctionArgs) {
  const handle = params.handle;
  if (!handle) throw new Response('Not found', {status: 404});

  const policy = await context.data.getPolicy(handle);
  if (!policy) throw new Response('Not found', {status: 404});

  return json({policy});
}

export default function PolicyPage() {
  const {policy} = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-2xl px-6 py-14">
      <h1 className="mb-8 font-display text-4xl text-laurel-900">
        {policy.title}
      </h1>
      <div
        className="prose-policy text-sm text-ink/80"
        dangerouslySetInnerHTML={{__html: policy.body}}
      />
    </div>
  );
}
