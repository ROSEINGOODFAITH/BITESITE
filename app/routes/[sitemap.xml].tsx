import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';
import {COLLECTION_META} from '~/lib/collections-map';

/** XML sitemap built from the data adapter (mock or live). */
export async function loader({request, context}: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;

  const productHandles = await context.data.getAllProductHandles();

  const staticPaths = [
    '/',
    '/collections/all',
    '/pages/about',
    '/pages/scent-science',
    '/pages/faq',
    '/pages/contact',
    '/blogs',
    '/policies',
  ];

  const collectionPaths = Object.keys(COLLECTION_META).map(
    (handle) => `/collections/${handle}`,
  );
  const productPaths = productHandles.map((handle) => `/products/${handle}`);

  const urls = [...staticPaths, ...collectionPaths, ...productPaths]
    .map(
      (path) =>
        `  <url><loc>${origin}${path}</loc></url>`,
    )
    .join('\n');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;

  return new Response(xml, {
    headers: {'Content-Type': 'application/xml'},
  });
}
