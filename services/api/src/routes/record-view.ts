/**
 * @farish/api — `POST /models/:id/views` endpoint stub.
 *
 * Increments the view counter for a shared model. Fire-and-forget: the
 * client ignores the response body. Auth is optional — deduplication uses
 * user identity when available, IP+time-window otherwise.
 *
 * This is a STUB: it returns `204 No Content` after confirming the model ID
 * is non-empty. Real deduplication logic is implemented in step 35+.
 * Spec: `docs/api/record-view/SPEC.md`.
 */
import { ROUTES } from '@farish/api-contract';
import { errorResponse, noContent } from '../router.ts';
import type { Route } from '../router.ts';

/** The mountable record-view route. */
export const recordViewRoute: Route = {
  method: 'POST',
  path: ROUTES.recordView,
  handler: (_req, params) => {
    const { id } = params;
    // Stub validation: a missing ID means the model path didn't match —
    // treat as not found. (In practice the router only calls this handler
    // when `:id` captured a non-empty segment.)
    if (!id) return errorResponse('model_not_found', 404);
    // Stub: silently succeed — real dedup logic is step 35+.
    return noContent();
  },
};
