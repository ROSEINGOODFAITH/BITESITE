import type {LoaderFunctionArgs} from '@shopify/remix-oxygen';

export async function loader({request}: LoaderFunctionArgs) {
  const origin = new URL(request.url).origin;
  const body = [
    'User-agent: *',
    'Disallow: /cart',
    'Disallow: /search',
    'Disallow: /api/',
    'Allow: /',
    '',
    `Sitemap: ${origin}/sitemap.xml`,
    '',
  ].join('\n');

  return new Response(body, {
    headers: {'Content-Type': 'text/plain'},
  });
}
