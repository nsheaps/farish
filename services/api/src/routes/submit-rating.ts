/**
 * @farish/api — `PUT /models/:id/rating` endpoint stub.
 *
 * Creates or replaces the authenticated user's star rating for a shared
 * model. PUT semantics ensure repeated calls update rather than duplicate.
 *
 * This is a STUB: it validates auth and the `stars` field, then returns
 * deterministic mock aggregate counters. Real storage is implemented in
 * step 35+.
 * Spec: `docs/api/submit-rating/SPEC.md`.
 */
import { type SubmitRatingResponse, ROUTES } from '@farish/api-contract';
import { errorResponse, extractBearerToken } from '../router.ts';
import type { Route } from '../router.ts';

/**
 * Build a stub {@link SubmitRatingResponse} payload.
 *
 * The averages and counts are derived from `stars` to produce plausible but
 * deterministic values without real storage.
 */
export function submitRatingPayload(id: string, stars: number): SubmitRatingResponse {
  // Derive a stable seed from the model ID string for determinism.
  const seed =
    id.split('').reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0) >>> 0;
  const existingCount = 10 + (seed % 90);
  const existingSum = 3.5 * existingCount;
  const newSum = existingSum + stars;
  const newCount = existingCount + 1;
  const ratingAvg = Math.round((newSum / newCount) * 100) / 100;
  return { ratingAvg, ratingCount: newCount, userStars: stars };
}

/** The mountable submit-rating route. */
export const submitRatingRoute: Route = {
  method: 'PUT',
  path: ROUTES.submitRating,
  handler: async (req, params) => {
    // Auth is required — reject unauthenticated requests with 401.
    const token = extractBearerToken(req);
    if (token === null) {
      return errorResponse('unauthorized', 401);
    }

    const { id } = params;
    if (!id) return errorResponse('model_not_found', 404);

    // Parse the JSON body and validate `stars`.
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return errorResponse('invalid_stars', 400);
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      !('stars' in body) ||
      typeof (body as Record<string, unknown>).stars !== 'number'
    ) {
      return errorResponse('invalid_stars', 400);
    }

    const stars = (body as Record<string, unknown>).stars as number;
    if (!Number.isInteger(stars) || stars < 1 || stars > 5) {
      return errorResponse('invalid_stars', 400);
    }

    return submitRatingPayload(id, stars);
  },
};
