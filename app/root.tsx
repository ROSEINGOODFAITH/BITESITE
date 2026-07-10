import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from '@remix-run/react';
import {
  defer,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from '@shopify/remix-oxygen';
import tailwindCss from '~/styles/tailwind.css?url';
import {AnnouncementBar} from '~/components/AnnouncementBar';
import {Header} from '~/components/Header';
import {Footer} from '~/components/Footer';
import {CartDrawer} from '~/components/CartDrawer';
import {CartUIProvider} from '~/components/CartUI';
import {EmailCapture} from '~/components/EmailCapture';
import {BRAND_NAME, POSITIONING_LINE} from '~/lib/const';

export const links: LinksFunction = () => [
  {rel: 'stylesheet', href: tailwindCss},
  {rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg'},
];

export const meta: MetaFunction = () => [
  {title: `${BRAND_NAME} — Luxury Natural Body Care, Made in LA`},
  {name: 'description', content: POSITIONING_LINE},
];

export async function loader({context}: LoaderFunctionArgs) {
  const cart = await context.cart.get();

  // Cart-drawer recommendations pull from "Trending Now" (BRAND_CONTENT §3.3),
  // including the empty state.
  const trending = await context.data.getCollection('black-friday', 4);

  return defer({
    cart,
    drawerRecs: trending?.products.slice(0, 4) ?? [],
    mode: context.mode,
  });
}

export default function App() {
  const {cart, drawerRecs, mode} = useLoaderData<typeof loader>();

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <CartUIProvider>
          <AnnouncementBar />
          <Header cartCount={cart?.totalQuantity ?? 0} />
          <main id="main">
            <Outlet />
          </main>
          <EmailCapture />
          <Footer mode={mode} />
          <CartDrawer cart={cart} recommendations={drawerRecs} />
        </CartUIProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  const heading = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : 'Something went sideways';

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>{`${heading} — ${BRAND_NAME}`}</title>
        <Meta />
        <Links />
      </head>
      <body>
        <div className="mx-auto flex min-h-screen max-w-site flex-col items-center justify-center gap-6 px-6 text-center">
          <p className="eyebrow">Well, this is awkward</p>
          <h1 className="font-display text-4xl text-laurel-900">{heading}</h1>
          <p className="max-w-md text-ink/70">
            Whatever you were looking for slipped down the drain. Head back to
            the good stuff.
          </p>
          <a href="/collections/all" className="btn-primary">
            Shop All
          </a>
        </div>
        <Scripts />
      </body>
    </html>
  );
}
