/**
 * @farish/api-contract — the shared API contract.
 *
 * A leaf library: it imports nothing from other workspace packages. Both the
 * API server (`services/api`) and the browser app (`apps/web`) depend on it so
 * request/response shapes can never drift apart. When an endpoint changes, the
 * contract changes here once and both sides type-check against it.
 *
 * Step 26 ships only the framework: the `health` endpoint and one example
 * endpoint (`list-models`). Step 33 adds the full set of 8 endpoints from
 * `docs/api/`.
 */

/** Route paths the API server exposes. Used by both server and client. */
export const ROUTES = {
  /** Liveness/readiness probe. */
  health: '/health',
  /** `GET /models` — paginated public model gallery. */
  listModels: '/models',
  /** `POST /models` — publish a generated model. */
  createModel: '/models',
  /** `GET /models/:id` — fetch a single model record. */
  getModel: '/models/:id',
  /** `POST /models/:id/views` — record a view (fire-and-forget). */
  recordView: '/models/:id/views',
  /** `PUT /models/:id/rating` — upsert the authenticated user's star rating. */
  submitRating: '/models/:id/rating',
  /** `GET /leaderboard` — ranked model list for a board + period. */
  getLeaderboard: '/leaderboard',
  /** `GET /users/:username` — public creator profile. */
  getUserProfile: '/users/:username',
  /** `GET /users/:username/models` — paginated list of a creator's models. */
  listUserModels: '/users/:username/models',
} as const;

/** A route path value from {@link ROUTES}. */
export type RoutePath = (typeof ROUTES)[keyof typeof ROUTES];

// ---------------------------------------------------------------------------
// Shared shapes
// ---------------------------------------------------------------------------

/**
 * Shared error body. Every non-2xx API response uses this shape so the client
 * has a single contract to code against (see `docs/api/API-SPEC.md`).
 */
export interface ApiError {
  /** A snake_case error code, e.g. `not_found`, `internal_error`. */
  error: string;
}

/**
 * Validation error body — used for 400 responses that fail field validation.
 * A specialisation of {@link ApiError} with an additional `fields` array.
 */
export interface ApiValidationError {
  error: 'validation_error';
  /** Names of the fields that failed validation. */
  fields: string[];
}

/**
 * Generation parameters stored on a model.
 * Matches the `params` object in `GET /models/:id` and `POST /models`.
 */
export interface ModelParams {
  /** Geometry resolution setting (0–100). */
  resolution: number;
  /** Artistic style label (e.g. "Low-poly", "Realistic"). */
  style: string;
  /** Complexity setting (0–100). */
  complexity: number;
}

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

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

// ---------------------------------------------------------------------------
// List Models — GET /models
// ---------------------------------------------------------------------------

/**
 * A model card as returned in list views (gallery, leaderboard, profile).
 * The spec-compliant shape for all paginated model lists.
 */
export interface ModelCard {
  /** Stable unique identifier (UUID or mock ID). */
  id: string;
  /** Human-readable model title. */
  title: string;
  /** Preview thumbnail URL; null when no thumbnail was submitted. */
  thumbnailUrl: string | null;
  /** Creator's display name. */
  authorName: string;
  /** Creator's internal UUID. */
  authorId: string;
  /** Creator's public username handle (used to build `/u/:username` links). */
  authorUsername: string;
  /** Average star rating 1–5; null when no ratings have been submitted. */
  ratingAvg: number | null;
  /** Total view count. */
  viewCount: number;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
}

/**
 * @deprecated Use {@link ModelCard} for spec-compliant shapes.
 * Kept for backward compatibility with existing mock-data consumers.
 *
 * A single model summary as shown in gallery/list views.
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
  /** Array of model card objects for the current page. */
  items: ModelCard[];
  /** Total matching records (for pagination UI). */
  total: number;
  /** Current 1-based page number. */
  page: number;
  /** Total number of pages. */
  totalPages: number;
}

// ---------------------------------------------------------------------------
// Get Model — GET /models/:id
// ---------------------------------------------------------------------------

/** Response of `GET /models/:id`. Full single-model record. */
export interface GetModelResponse {
  /** Unique model identifier. */
  id: string;
  /** Model title (derived from prompt if not explicitly set). */
  title: string;
  /** Natural language prompt used to generate it. */
  prompt: string;
  /** Generation parameters. */
  params: ModelParams;
  /** URL to the GLB geometry file. */
  geometryUrl: string;
  /** URL to the preview thumbnail; null when absent. */
  thumbnailUrl: string | null;
  /** Creator's display name. */
  authorName: string;
  /** Creator's internal UUID. */
  authorId: string;
  /** Creator's public username handle. */
  authorUsername: string;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
  /** Total view count. */
  viewCount: number;
  /** Average star rating 1–5; null when no ratings. */
  ratingAvg: number | null;
  /** Number of ratings submitted. */
  ratingCount: number;
}

// ---------------------------------------------------------------------------
// Create Model — POST /models
// ---------------------------------------------------------------------------

/** Response of `POST /models` (201 Created). */
export interface CreateModelResponse {
  /** Newly assigned model identifier. */
  id: string;
  /** Resolved title (provided by client or derived from prompt). */
  title: string;
  /** Public URL to the stored GLB file. */
  geometryUrl: string;
  /** Public URL to the stored thumbnail; null when absent. */
  thumbnailUrl: string | null;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Record View — POST /models/:id/views
// ---------------------------------------------------------------------------

// This endpoint returns `204 No Content` — no response body type needed.

// ---------------------------------------------------------------------------
// Submit Rating — PUT /models/:id/rating
// ---------------------------------------------------------------------------

/** Response of `PUT /models/:id/rating` (200 OK). */
export interface SubmitRatingResponse {
  /** Updated average rating (1–5, two decimal places). */
  ratingAvg: number;
  /** Updated total number of ratings. */
  ratingCount: number;
  /** The star value just recorded for this user. */
  userStars: number;
}

// ---------------------------------------------------------------------------
// Get Leaderboard — GET /leaderboard
// ---------------------------------------------------------------------------

/**
 * Valid board identifiers for `GET /leaderboard`.
 * - `rated`   — ordered by average star rating
 * - `popular` — ordered by number of ratings (most rated)
 * - `viewed`  — ordered by view count
 */
export type LeaderboardBoard = 'rated' | 'popular' | 'viewed';

/**
 * Valid time-period identifiers for `GET /leaderboard`.
 */
export type LeaderboardPeriod = '1w' | '1m' | '1y' | 'all';

/** A single ranked entry in a leaderboard response. */
export interface LeaderboardItem {
  /** 1-based rank position. */
  rank: number;
  /** Unique model identifier. */
  id: string;
  /** Model title. */
  title: string;
  /** URL to the preview thumbnail; null when absent. */
  thumbnailUrl: string | null;
  /** Creator's display name. */
  authorName: string;
  /** Creator's internal UUID. */
  authorId: string;
  /** Creator's public username handle. */
  authorUsername: string;
  /** Board metric value: avg rating, rating count, or view count. */
  metricValue: number;
  /** ISO 8601 creation timestamp (used for tie-break display). */
  createdAt: string;
}

/** Response of `GET /leaderboard`. */
export interface GetLeaderboardResponse {
  /** Active board value echoed back. */
  board: LeaderboardBoard;
  /** Active period value echoed back. */
  period: LeaderboardPeriod;
  /** Ordered array of ranked model entries. */
  items: LeaderboardItem[];
}

// ---------------------------------------------------------------------------
// Get User Profile — GET /users/:username
// ---------------------------------------------------------------------------

/** Response of `GET /users/:username`. */
export interface GetUserProfileResponse {
  /** Public username handle. */
  username: string;
  /** Human-readable display name. */
  displayName: string;
  /** URL to the user's avatar; null when not set. */
  avatarUrl: string | null;
  /** ISO 8601 date the account was created. */
  joinDate: string;
  /** Total number of publicly shared models. */
  modelCount: number;
  /** Average rating across all shared models; null when no ratings. */
  avgRating: number | null;
  /** Cumulative view count across all shared models. */
  totalViews: number;
}

// ---------------------------------------------------------------------------
// List User Models — GET /users/:username/models
// ---------------------------------------------------------------------------

/** A model card in a user profile list (subset of {@link ModelCard}). */
export interface UserModelCard {
  /** Unique model identifier. */
  id: string;
  /** Model title. */
  title: string;
  /** URL to the preview thumbnail; null when absent. */
  thumbnailUrl: string | null;
  /** Average star rating; null when no ratings. */
  ratingAvg: number | null;
  /** Total view count. */
  viewCount: number;
  /** ISO 8601 creation timestamp. */
  createdAt: string;
}

/** Response of `GET /users/:username/models`. */
export interface ListUserModelsResponse {
  /** Array of model card objects for the current page. */
  items: UserModelCard[];
  /** Total number of public models for this user. */
  total: number;
  /** Current 1-based page number. */
  page: number;
  /** Total number of pages. */
  totalPages: number;
}
