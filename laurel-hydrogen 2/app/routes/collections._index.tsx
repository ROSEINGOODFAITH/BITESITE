import {Link, useLoaderData} from '@remix-run/react';
import {json, type LoaderFunctionArgs, type MetaFunction} from '@shopify/remix-oxygen';
import {BRAND_NAME} from '~/lib/const';

export const meta: MetaFunction = () => [
  {title: `Collections — ${BRAND_NAME}`},
];

export async function loader({context}: LoaderFunctionArgs) {
  const collections = await context.data.listCollections();
  return json({collections});
}

export default function CollectionsIndex() {
  const {collections} = useLoaderData<typeof loader>();

  return (
    <div className="mx-auto max-w-site px-6 py-12">
      <h1 className="mb-10 text-center font-display text-4xl text-laurel-900">
        Browse the whole bathhouse.
      </h1>
      <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.handle}
            to={`/collections/${collection.handle}`}
            className="group block"
          >
            {collection.image ? (
              <img
                src={collection.image.url}
                alt={collection.image.altText ?? collection.title}
                className="aspect-square w-full bg-sand object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                loading="lazy"
              />
            ) : (
              <div className="flex aspect-square w-full items-center justify-center bg-sand font-display text-laurel-900">
                {collection.title}
              </div>
            )}
            <p className="mt-2 font-semibold group-hover:underline">
              {collection.title}
            </p>
            <p className="text-xs text-ink/60">{collection.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
