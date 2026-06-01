/**
 * @farish/api — `GET /models` endpoint stub.
 *
 * Returns a paginated, optionally filtered list of publicly shared models.
 * This is a STUB: it serves mock data, not a real model store. The full
 * implementation (real data via a model abstraction, search, auth) is
 * specified in `docs/api/list-models/SPEC.md` and implemented in later
 * prompt steps (35+).
 *
 * Query params handled in the stub:
 * - `page`  — 1-based page number (default 1)
 * - `limit` — results per page (default 24, max 100)
 * - `sort`  — validated but not applied (stub always returns the same data)
 * - `q`     — accepted but not applied (stub does not search)
 * - `filter`— accepted but not applied
 */
import { type ListModelsResponse, ROUTES } from '@farish/api-contract';
import { mockModelCards } from '@farish/mock-data';
import { errorResponse } from '../router.ts';
import type { Route } from '../router.ts';

/** Total number of mock models in the fake dataset. */
const STUB_TOTAL = 48;

/** Valid sort values per spec. */
const VALID_SORT = new Set(['newest', 'rating', 'popular', 'views']);

/** Maximum allowed limit per spec. */
const MAX_LIMIT = 100;

/** Build the stub {@link ListModelsResponse} payload from query params. */
export function listModelsPayload(url: URL): ListModelsResponse | Response {
  const sort = url.searchParams.get('sort') ?? 'newest';
  if (!VALID_SORT.has(sort)) {
    return errorResponse('invalid_sort', 400);
  }

  const rawLimit = url.searchParams.get('limit');
  const limit = rawLimit !== null ? Number(rawLimit) : 24;
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_LIMIT) {
    return errorResponse('limit_too_large', 400);
  }

  const rawPage = url.searchParams.get('page');
  const page = rawPage !== null ? Number(rawPage) : 1;

  const totalPages = Math.ceil(STUB_TOTAL / limit);
  const items = mockModelCards(Math.min(limit, STUB_TOTAL));

  return { items, total: STUB_TOTAL, page, totalPages };
}

/** The mountable list-models route. */
export const listModelsRoute: Route = {
  method: 'GET',
  path: ROUTES.listModels,
  handler: (req) => listModelsPayload(new URL(req.url)),
};
