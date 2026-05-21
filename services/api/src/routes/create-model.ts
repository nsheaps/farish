/**
 * @farish/api — `POST /models` endpoint stub.
 *
 * Publishes a locally generated model to the shared backend, making it
 * discoverable via Explore, Leaderboards, and Profile.
 *
 * This is a STUB: it validates that an `Authorization` header is present,
 * then returns a deterministic mock 201 Created response. Real data storage
 * is implemented in step 35+.
 * Spec: `docs/api/create-model/SPEC.md`.
 */
import { type CreateModelResponse, ROUTES } from '@farish/api-contract';
import { createLorem } from '@farish/mock-data';
import { errorResponse, extractBearerToken } from '../router.ts';
import type { Route } from '../router.ts';

/** Build a stub {@link CreateModelResponse} (201 Created) payload. */
export function createModelPayload(): CreateModelResponse {
  const lorem = createLorem(Date.now() % 1000);
  const id = `mock-new-${String(Date.now() % 100000)}`;
  return {
    id,
    title: lorem.title(3),
    geometryUrl: `https://mock.farish.dev/geometry/${id}.glb`,
    thumbnailUrl: null,
    createdAt: new Date().toISOString(),
  };
}

/** The mountable create-model route. */
export const createModelRoute: Route = {
  method: 'POST',
  path: ROUTES.createModel,
  handler: (req) => {
    // Auth is required — reject unauthenticated requests with 401.
    const token = extractBearerToken(req);
    if (token === null) {
      return errorResponse('unauthorized', 401);
    }
    // Stub: return a mock 201 response; real body parsing is step 35+.
    return new Response(JSON.stringify(createModelPayload()), {
      status: 201,
      headers: {
        'content-type': 'application/json',
        'access-control-allow-origin': '*',
        'access-control-allow-methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'access-control-allow-headers': 'content-type,authorization',
      },
    });
  },
};
