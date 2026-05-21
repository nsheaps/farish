/**
 * @farish/api-contract — the shared API contract.
 *
 * A leaf library: it imports nothing from other workspace packages. Both the
 * API server (`services/api`) and the browser app (`apps/web`) depend on it so
 * request/response shapes can never drift apart. When an endpoint changes, the
 * contract changes here once and both sides type-check against it.
 *
 * Step 26 ships only the framework: the `health` endpoint and one example
 * endpoint (`list-models`). The remaining endpoints in `docs/api/` are
 * eventual targets for later prompt steps and are intentionally absent.
 */

/** Route paths the API server exposes. Used by both server and client. */
export const ROUTES = {
  /** Liveness/readiness probe. */
  health: '/health',
  /** Example endpoint — the social model gallery (stubbed in step 26). */
  listModels: '/models',
} as const;

/** A route path value from {@link ROUTES}. */
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Response of `GET /health`. A stable shape Tilt and CI can probe to confirm
 * the API process is up.
 */
export interface HealthResponse {
  /** Always `'ok'` when the service is serving requests. */
  status: 'ok';
  /** Service identifier — useful once the microservices are split apart. */
  service: string;
  /** Package version of the running service. */
  version: string;
  /** Seconds the process has been alive. */
  uptimeSeconds: number;
}

/**
 * A single model summary as shown in gallery/list views.
 *
 * In step 26 these are produced by `@farish/mock-data`; later steps replace
 * the stub with a real data-model abstraction.
 */
export interface ModelSummary {
  /** Stable unique identifier. */
  id: string;
  /** Human-readable model title. */
  title: string;
  /** Author handle (without a leading `@`). */
  author: string;
  /** Average star rating, 0–5. */
  rating: number;
  /** Total view count. */
  views: number;
  /** Thumbnail image URL (a `data:` URI in the stub — no network needed). */
  thumbnailUrl: string;
}

/** Response of `GET /models`. */
export interface ListModelsResponse {
  /** The page of model summaries. */
  models: ModelSummary[];
  /** Total number of models available (for pagination). */
  total: number;
}

/**
 * Shared error body. Every non-2xx API response uses this shape so the client
 * has a single contract to code against (see `docs/api/API-SPEC.md`).
 */
export interface ApiError {
  /** A snake_case error code, e.g. `not_found`, `internal_error`. */
  error: string;
}
