import {json, type ActionFunctionArgs} from '@shopify/remix-oxygen';

/**
 * Email capture endpoint (BLUEPRINT §13). Stub: validates and acknowledges.
 * Wire to the ESP (Klaviyo etc.) when credentials/land are decided.
 */
export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = String(formData.get('email') ?? '').trim();

  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
  if (!valid) {
    return json({ok: false, error: 'Invalid email'}, {status: 400});
  }

  // TODO: forward to ESP list. Intentionally not logging PII in the stub.
  return json({ok: true});
}

export async function loader() {
  return json({ok: false}, {status: 405});
}
