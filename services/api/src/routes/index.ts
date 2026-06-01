/**
 * @farish/api — the route registry.
 *
 * The single list of routes the development server mounts. Adding an endpoint
 * means writing a route module and appending it here. When the API is later
 * split into separate microservices, each service mounts the subset of this
 * list it owns.
 *
 * Route ordering matters for path-param routes that share a path prefix:
 * more-specific patterns (e.g. `/users/:username/models`) must appear before
 * less-specific ones (e.g. `/users/:username`) so the router matches the
 * correct handler first.
 */
import type { Route } from '../router.ts';
import { createModelRoute } from './create-model.ts';
import { getLeaderboardRoute } from './get-leaderboard.ts';
import { getModelRoute } from './get-model.ts';
import { getUserProfileRoute } from './get-user-profile.ts';
import { healthRoute } from './health.ts';
import { listModelsRoute } from './list-models.ts';
import { listUserModelsRoute } from './list-user-models.ts';
import { recordViewRoute } from './record-view.ts';
import { submitRatingRoute } from './submit-rating.ts';

/** Every route the dev server serves. */
export const routes: readonly Route[] = [
  // Infrastructure
  healthRoute,
  // Models — more-specific sub-resource paths before the base /models path.
  recordViewRoute, // POST /models/:id/views
  submitRatingRoute, // PUT  /models/:id/rating
  getModelRoute, // GET  /models/:id
  listModelsRoute, // GET  /models
  createModelRoute, // POST /models
  // Leaderboard
  getLeaderboardRoute, // GET  /leaderboard
  // Users — more-specific /models sub-path before the profile path.
  listUserModelsRoute, // GET  /users/:username/models
  getUserProfileRoute, // GET  /users/:username
];
