import {
  createCookieSessionStorage,
  type Session,
  type SessionStorage,
} from '@shopify/remix-oxygen';

/**
 * Cookie session used for the mock cart (and anything else session-shaped).
 * Modeled on Hydrogen's HydrogenSession pattern: mutations flip `isPending`
 * and the worker entry commits the cookie once per response.
 */
export class AppSession {
  public isPending = false;

  constructor(
    private sessionStorage: SessionStorage,
    private session: Session,
  ) {}

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        name: 'lbh_session',
        httpOnly: true,
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage
      .getSession(request.headers.get('Cookie'))
      .catch(() => storage.getSession());

    return new AppSession(storage, session);
  }

  get has() {
    return this.session.has;
  }

  get get() {
    return this.session.get;
  }

  get flash() {
    return this.session.flash;
  }

  unset(key: string) {
    this.isPending = true;
    this.session.unset(key);
  }

  set(key: string, value: unknown) {
    this.isPending = true;
    this.session.set(key, value);
  }

  destroy() {
    return this.sessionStorage.destroySession(this.session);
  }

  commit() {
    this.isPending = false;
    return this.sessionStorage.commitSession(this.session);
  }
}
