/**
 * @farish/api — the route registry.
 *
 * The single list of routes the development server mounts. Adding an endpoint
 * means writing a route module and appending it here. When the API is later
 * split into separate microservices, each service mounts the subset of this
 * list it owns.
 */
import type { Route } from '../router.ts';
import { healthRoute } from './health.ts';
import { listModelsRoute } from './list-models.ts';

/** Every route the dev server serves. */
export const routes: readonly Route[] = [healthRoute, listModelsRoute];
