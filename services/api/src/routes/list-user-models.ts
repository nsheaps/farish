/**
 * @farish/api — `GET /users/:username/models` endpoint stub.
 *
 * Returns a paginated list of publicly shared models authored by a specific
 * creator. Used by the Profile page to populate the ModelGrid.
 *
 * This is a STUB: the username is used as a seed for deterministic mock
 * data. Real data access is implemented in step 35+.
 * Spec: `docs/api/list-user-models/SPEC.md`.
 */
import { type ListUserModelsResponse, type UserModelCard, ROUTES } from '@farish/api-contract';
import { mockModelCards } from '@farish/mock-data';
import { errorResponse } from '../router.ts';
import type { Route } from '../router.ts';

/** Total stub models per user. */
const STUB_USER_TOTAL = 18;
/** Maximum allowed limit per spec. */
const MAX_LIMIT = 100;

/**
 * Build the stub {@link ListUserModelsResponse} payload for a given username.
 *
 * Derives a seed from the username so each user always returns the same data.
 */
export function listUserModelsPayload(
  username: string,
  page: number,
  limit: number,
): ListUserModelsResponse {
  // Derive a numeric seed from the username for deterministic cards.
  const seed =
    username
      .split('')
      .reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0) >>> 0;

  const totalPages = Math.ceil(STUB_USER_TOTAL / limit);
  const cards = mockModelCards(Math.min(limit, STUB_USER_TOTAL), seed % 1000);

  const items: UserModelCard[] = cards.map((card) => ({
    id: card.id,
    title: card.title,
    thumbnailUrl: card.thumbnailUrl,
    ratingAvg: card.ratingAvg,
    viewCount: card.viewCount,
    createdAt: card.createdAt,
  }));

  return { items, total: STUB_USER_TOTAL, page, totalPages };
}

/** The mountable list-user-models route. */
export const listUserModelsRoute: Route = {
  method: 'GET',
  path: ROUTES.listUserModels,
  handler: (req, params) => {
    const { username } = params;
    if (!username) return errorResponse('user_not_found', 404);

    const url = new URL(req.url);
    const rawLimit = url.searchParams.get('limit');
    const limit = rawLimit !== null ? Number(rawLimit) : 24;
    if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
      return errorResponse('limit_too_large', 400);
    }

    const rawPage = url.searchParams.get('page');
    const page = rawPage !== null ? Number(rawPage) : 1;

    return listUserModelsPayload(username, page, limit);
  },
};
