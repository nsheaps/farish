/**
 * @farish/api — the minimal routing framework.
 *
 * Microservice architecture, single-process dev: every route is an
 * independent {@link Route} module. `createRouter` composes a list of routes
 * into one `fetch` handler. In development one server mounts every route; in
 * production a route group could be split into its own deployable service
 * without changing any route module — only which routes a server mounts.
 *
 * The router also centralises three concerns every route needs: JSON
 * serialisation, CORS headers (the browser app runs on a different dev port),
 * and uncaught-error handling (a thrown handler becomes a 500 `internal_error`
 * instead of crashing the process).
 */
import type { ApiError } from '@farish/api-contract';

/** HTTP methods the router recognises. */
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

/** A route handler: receives the request, returns any JSON-serialisable value. */
export type RouteHandler = (req: Request) => unknown | Promise<unknown>;

/** A single mountable route. */
export interface Route {
  /** HTTP method this route answers. */
  method: HttpMethod;
  /** Exact path this route answers (no path params in the step-26 skeleton). */
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
 * Compose routes into a single `fetch` handler suitable for `Bun.serve`.
 *
 * Resolution order: CORS preflight → exact method+path match → 404.
 * A handler that throws is caught and returned as `500 internal_error`.
 */
export function createRouter(routes: readonly Route[]): (req: Request) => Promise<Response> {
  return async (req: Request): Promise<Response> => {
    // CORS preflight — answer OPTIONS without hitting a route.
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    const { pathname } = new URL(req.url);
    const route = routes.find((r) => r.method === req.method && r.path === pathname);

    if (route === undefined) {
      return errorResponse('not_found', 404);
    }

    try {
      const payload = await route.handler(req);
      return json(payload);
    } catch (cause) {
      // Surface the cause on the error channel; never crash the process.
      console.error('[api] unhandled route error', cause);
      return errorResponse('internal_error', 500);
    }
  };
}
