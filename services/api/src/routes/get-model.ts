/**
 * @farish/api — `GET /models/:id` endpoint stub.
 *
 * Returns the full record for a single publicly shared model, including its
 * prompt, generation params, geometry URL, metadata, and social counters.
 *
 * This is a STUB: the `id` path param is used as a seed for deterministic
 * mock data. Real data access is implemented in step 35+.
 * Spec: `docs/api/get-model/SPEC.md`.
 */
import { type GetModelResponse, ROUTES } from '@farish/api-contract';
import { mockModelDetail } from '@farish/mock-data';
import { errorResponse } from '../router.ts';
import type { Route } from '../router.ts';

/**
 * Build the stub {@link GetModelResponse} payload for a given model ID.
 *
 * Uses `mockModelDetail` (seeded by the ID) to produce deterministic fields.
 */
export function getModelPayload(id: string): GetModelResponse {
  const detail = mockModelDetail(id);
  // Derive author subfields from the single `author` string in the mock.
  const authorSlug = detail.author.toLowerCase().replace(/\s+/g, '-');
  return {
    id: detail.id,
    title: detail.title,
    prompt: detail.prompt,
    params: {
      resolution: detail.resolution,
      style: detail.style,
      complexity: detail.complexity,
    },
    geometryUrl: `https://mock.farish.dev/geometry/${id}.glb`,
    thumbnailUrl: detail.thumbnailUrl,
    authorName: detail.author,
    authorId: `mock-author-${authorSlug}`,
    authorUsername: authorSlug,
    createdAt: `${detail.createdAt}T00:00:00Z`,
    viewCount: detail.views,
    ratingAvg: detail.rating,
    ratingCount: detail.ratingCount,
  };
}

/** The mountable get-model route. */
export const getModelRoute: Route = {
  method: 'GET',
  path: ROUTES.getModel,
  handler: (_req, params) => {
    const { id } = params;
    if (!id) return errorResponse('model_not_found', 404);
    return getModelPayload(id);
  },
};
