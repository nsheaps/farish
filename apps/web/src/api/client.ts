/**
 * @farish/web — typed API client.
 *
 * A thin `fetch` wrapper, typed end-to-end against `@farish/api-contract` so
 * the browser app and the API server can never disagree about a payload shape.
 *
 * Base URL resolution:
 * - Development: defaults to `/api`, which the Vite dev server proxies to the
 *   local API process (see `vite.config.ts`).
 * - Production: set `VITE_API_BASE_URL` at build time to the deployed API
 *   origin. While farish is a browser-only GitHub Pages site with no backend,
 *   callers handle a failed request gracefully (the example view shows this).
 */
import {
  type HealthResponse,
  type ListModelsResponse,
  ROUTES,
} from '@farish/api-contract';

/** Resolve the API base URL from the build-time env, defaulting to the dev proxy. */
function apiBaseUrl(): string {
  const fromEnv = import.meta.env.VITE_API_BASE_URL;
  return typeof fromEnv === 'string' && fromEnv.length > 0 ? fromEnv : '/api';
}

/** Perform a GET request and parse the JSON body as `T`. */
async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${apiBaseUrl()}${path}`);
  if (!res.ok) {
    throw new Error(`API request failed: ${String(res.status)} ${path}`);
  }
  return (await res.json()) as T;
}

/** `GET /health` — liveness probe. */
export function getHealth(): Promise<HealthResponse> {
  return getJson<HealthResponse>(ROUTES.health);
}

/** `GET /models` — the example model list (stubbed server-side in step 26). */
export function listModels(): Promise<ListModelsResponse> {
  return getJson<ListModelsResponse>(ROUTES.listModels);
}
