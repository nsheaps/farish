/**
 * @farish/api — the minimal routing framework.
 *
 * Microservice architecture, single-process dev: every route is an
 * independent {@link Route} module. `createRouter` composes a list of routes
 * into one `fetch` handler. In development one server mounts every route; in
 * production a route group could be split into its own deployable service
 * without changing any route module — only which routes a server mounts.
 *
 * The router centralises five concerns every route needs:
 * - JSON serialisation
 * - CORS headers (the browser app runs on a different dev port)
 * - Path-parameter extraction (`:param` segments in route patterns)
 * - Auth-token extraction (shared by routes that require authentication)
 * - Uncaught-error handling (a thrown handler becomes a 500 `internal_error`
 *   instead of crashing the process)
 */
import type { ApiError } from '@farish/api-contract';

/** HTTP methods the router recognises. */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/**
 * A route handler.
 *
 * Receives the request and the extracted path params. Returns any
 * JSON-serialisable value or a `Response` directly (e.g. `noContent()`).
 * Handlers may safely ignore either argument if they do not need it.
 */
export type RouteHandler = (
  req: Request,
  params: Record<string, string>,
) => unknown | Promise<unknown>;

/** A single mountable route. */
export interface Route {
  /** HTTP method this route answers. */
  method: HttpMethod;
  /**
   * URL path pattern. Supports `:param` segments, e.g. `/models/:id`.
   * Exact paths (no `:` segments) are also valid.
   */
  path: string;
  /** The handler producing the response payload. */
  handler: RouteHandler;
}

/** CORS headers applied to every response so the browser app can call the API. */
const CORS_HEADERS: Record<string, string> = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
  'access-control-allow-headers': 'content-type,authorization',
};

/** Serialise a payload to a JSON `Response` with CORS headers. */
function json(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json', ...CORS_HEADERS },
  });
}

/** Build a standard {@link ApiError} JSON response. */
export function errorResponse(code: string, status: number): Response {
  const body: ApiError = { error: code };
  return json(body, status);
}

/**
 * Return a `204 No Content` response with CORS headers.
 *
 * Used by fire-and-forget endpoints like `POST /models/:id/views`.
 */
export function noContent(): Response {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * Extract the bearer token from the `Authorization` header.
 *
 * Returns the raw token string when the header is present and starts with
 * `Bearer `, or `null` otherwise. Does NOT validate the token — that is the
 * route's responsibility.
 */
export function extractBearerToken(req: Request): string | null {
  const auth = req.headers.get('authorization');
  if (auth === null || !auth.startsWith('Bearer ')) return null;
  const token = auth.slice(7).trim();
  return token.length > 0 ? token : null;
}

/**
 * Match a URL pathname against a route pattern.
 *
 * Converts `:param` segments to capture groups. Returns a `Record<string,
 * string>` of captured values when the pathname matches, or `null` when it
 * does not.
 *
 * @example
 * matchPath('/models/:id', '/models/abc-123') // → { id: 'abc-123' }
 * matchPath('/models/:id', '/models')         // → null
 */
function matchPath(pattern: string, pathname: string): Record<string, string> | null {
  const keys: string[] = [];
  const regexSrc = pattern.replace(/:([^/]+)/g, (_: string, key: string) => {
    keys.push(key);
    return '([^/]+)';
  });
  const m = pathname.match(new RegExp(`^${regexSrc}$`));
  if (m === null) return null;
  return Object.fromEntries(
    keys.map((k, i) => [k, decodeURIComponent(m[i + 1] ?? '')] as [string, string]),
  );
}

/**
 * Compose routes into a single `fetch` handler suitable for `Bun.serve`.
 *
 * Resolution order: CORS preflight → method + path pattern match → 404.
 * A handler that throws is caught and returned as `500 internal_error`.
 * A handler that returns a `Response` directly is forwarded as-is (e.g.
 * `noContent()`, `errorResponse()`).
 */
export function createRouter(routes: readonly Route[]): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    // CORS preflight — answer OPTIONS without hitting a route.
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const { pathname } = new URL(req.url);

    // Find the first route whose method and path pattern both match.
    let matchedRoute: Route | undefined;
    let matchedParams: Record<string, string> = {};

    for (const route of routes) {
      if (route.method !== req.method) continue;
      const params = matchPath(route.path, pathname);
      if (params !== null) {
        matchedRoute = route;
        matchedParams = params;
        break;
      }
    }

    if (matchedRoute === undefined) {
      return errorResponse('not_found', 404);
    }

    try {
      const payload = await matchedRoute.handler(req, matchedParams);
      // If the handler already built a Response (e.g. noContent, errorResponse),
      // pass it through without re-wrapping.
      if (payload instanceof Response) return payload;
      return json(payload);
    } catch (cause) {
      // Surface the cause on the error channel; never crash the process.
      console.error('[api] unhandled route error', cause);
      return errorResponse('internal_error', 500);
    }
  };
}
