/**
 * @farish/api — example endpoint stub: `GET /models`.
 *
 * This is the ONE worked example endpoint for the step-26 framework skeleton.
 * It returns a stubbed {@link ListModelsResponse} built from `@farish/mock-data`
 * so the browser app has a real endpoint to call end-to-end.
 *
 * It is a STUB: it serves mock data, not a real model store. The full endpoint
 * (real data via a model abstraction, pagination, auth) is specified in
 * `docs/api/list-models/SPEC.md` and implemented in later prompt steps
 * (33–35). The remaining seven endpoints in `docs/api/` are not built here.
 */
import { type ListModelsResponse, ROUTES } from '@farish/api-contract';
import { mockModelSummaries } from '@farish/mock-data';
import type { Route } from '../router.ts';

/** How many mock models the stub returns. */
const STUB_MODEL_COUNT = 8;

/** Build the stubbed {@link ListModelsResponse} payload. */
export function listModelsPayload(): ListModelsResponse {
  const models = mockModelSummaries(STUB_MODEL_COUNT);
  return { models, total: models.length };
}

/** The mountable list-models route. */
export const listModelsRoute: Route = {
  method: 'GET',
  path: ROUTES.listModels,
  handler: () => listModelsPayload(),
};
