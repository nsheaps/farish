/**
 * @farish/api — health endpoint.
 *
 * `GET /health` is the liveness/readiness probe. Tilt's `local_resource`
 * readiness probe and CI smoke tests hit this route to confirm the API
 * process is serving requests.
 */
import { type HealthResponse, ROUTES } from '@farish/api-contract';
import type { Route } from '../router.ts';

/** Process start time — used to report uptime. */
const START_TIME = Date.now();

/** Build the {@link HealthResponse} payload. */
export function healthPayload(): HealthResponse {
  return {
    status: 'ok',
    service: 'api',
    version: '0.0.0',
    uptimeSeconds: Math.round((Date.now() - START_TIME) / 1000),
  };
}

/** The mountable health route. */
export const healthRoute: Route = {
  method: 'GET',
  path: ROUTES.health,
  handler: () => healthPayload(),
};
