/**
 * @farish/api — `GET /leaderboard` endpoint stub.
 *
 * Returns an ordered list of up to 50 ranked models for one of three boards
 * (Best Rated, Most Rated / Popular, Most Viewed) filtered to a chosen time
 * bucket (1 week, 1 month, 1 year, or all time).
 *
 * This is a STUB: it validates `board` and `period`, then returns
 * deterministic mock entries. Real ranking logic is implemented in step 35+.
 * Spec: `docs/api/get-leaderboard/SPEC.md`.
 */
import {
  type GetLeaderboardResponse,
  type LeaderboardBoard,
  type LeaderboardItem,
  type LeaderboardPeriod,
  ROUTES,
} from '@farish/api-contract';
import { mockModelCards } from '@farish/mock-data';
import { errorResponse } from '../router.ts';
import type { Route } from '../router.ts';

/** Valid board values per spec. */
const VALID_BOARDS = new Set<string>(['rated', 'popular', 'viewed']);
/** Valid period values per spec. */
const VALID_PERIODS = new Set<string>(['1w', '1m', '1y', 'all']);
/** Maximum and default result count per spec. */
const MAX_LIMIT = 50;
const DEFAULT_LIMIT = 50;

/**
 * Build the stub {@link GetLeaderboardResponse} payload from query params.
 *
 * Produces plausible metric values based on the board type using mock cards.
 */
export function getLeaderboardPayload(
  board: LeaderboardBoard,
  period: LeaderboardPeriod,
  limit: number,
): GetLeaderboardResponse {
  const cards = mockModelCards(limit, /* seed */ 42);
  const items: LeaderboardItem[] = cards.map((card, index) => {
    // Derive a board-appropriate metric value for each card.
    let metricValue: number;
    if (board === 'rated') {
      metricValue = Math.round((5 - index * 0.05) * 100) / 100;
    } else if (board === 'popular') {
      metricValue = Math.max(1, 500 - index * 10);
    } else {
      // viewed
      metricValue = Math.max(1, 10000 - index * 200);
    }
    return {
      rank: index + 1,
      id: card.id,
      title: card.title,
      thumbnailUrl: card.thumbnailUrl,
      authorName: card.authorName,
      authorId: card.authorId,
      authorUsername: card.authorUsername,
      metricValue,
      createdAt: card.createdAt,
    };
  });
  return { board, period, items };
}

/** The mountable get-leaderboard route. */
export const getLeaderboardRoute: Route = {
  method: 'GET',
  path: ROUTES.getLeaderboard,
  handler: (_req, _params) => {
    const url = new URL(_req.url);
    const board = url.searchParams.get('board');
    const period = url.searchParams.get('period');
    const rawLimit = url.searchParams.get('limit');

    if (board === null || !VALID_BOARDS.has(board)) {
      return errorResponse('invalid_board', 400);
    }
    if (period === null || !VALID_PERIODS.has(period)) {
      return errorResponse('invalid_period', 400);
    }

    const limit =
      rawLimit !== null ? Math.min(Number(rawLimit), MAX_LIMIT) : DEFAULT_LIMIT;

    return getLeaderboardPayload(
      board as LeaderboardBoard,
      period as LeaderboardPeriod,
      limit,
    );
  },
};
