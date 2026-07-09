import {Link, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {BRAND_NAME} from '~/lib/const';

export const meta: MetaFunction = () => [{title: `Policies — ${BRAND_NAME}`}];

export async function loader({context}: LoaderFunctionArgs) {
  const policies = await context.data.listPolicies();
  return json({policies});
}

export default function PoliciesIndex() {
  const {policies} = useLoaderData<typeof loader>();
  return (
    <div className="mx-auto max-w-xl px-6 py-14">
      <h1 className="mb-8 font-display text-4xl text-laurel-900">
        The fine print.
      </h1>
      <ul className="space-y-3">
        {policies.map((policy) => (
          <li key={policy.handle}>
            <Link
              to={`/policies/${policy.handle}`}
              className="text-lg underline underline-offset-4 hover:text-laurel-700"
            >
              {policy.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
