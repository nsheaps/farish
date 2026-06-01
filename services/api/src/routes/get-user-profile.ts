/**
 * @farish/api — `GET /users/:username` endpoint stub.
 *
 * Returns the public profile record for a creator: display name, avatar,
 * join date, and aggregate stats.
 *
 * This is a STUB: the username is used as a seed for deterministic mock
 * data. Real data access is implemented in step 35+.
 * Spec: `docs/api/get-user-profile/SPEC.md`.
 */
import { type GetUserProfileResponse, ROUTES } from '@farish/api-contract';
import { createLorem } from '@farish/mock-data';
import { errorResponse } from '../router.ts';
import type { Route } from '../router.ts';

/** Join dates used in stub responses — deterministically picked by username seed. */
const JOIN_DATES: readonly string[] = [
  '2025-06-15',
  '2025-08-02',
  '2025-09-20',
  '2025-11-07',
  '2026-01-14',
  '2026-02-28',
  '2026-03-18',
  '2026-04-05',
];

/**
 * Build a stub {@link GetUserProfileResponse} payload for a given username.
 *
 * Derives a numeric seed from the username string so the same username
 * always returns the same profile data.
 */
export function getUserProfilePayload(username: string): GetUserProfileResponse {
  // Derive a stable numeric seed from the username characters.
  const seed =
    username
      .split('')
      .reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0) >>> 0;

  const lorem = createLorem(seed);
  const index = seed % 8;
  const joinDate = JOIN_DATES[index % JOIN_DATES.length] ?? '2025-06-15';
  const modelCount = 5 + (seed % 45);
  const totalViews = 500 + (seed % 49500);
  const avgRating = index % 6 === 0 ? null : 3 + ((seed % 4) * 0.5);

  return {
    username,
    displayName: lorem.title(2),
    avatarUrl: null,
    joinDate: joinDate ?? '2025-06-15',
    modelCount,
    avgRating,
    totalViews,
  };
}

/** The mountable get-user-profile route. */
export const getUserProfileRoute: Route = {
  method: 'GET',
  path: ROUTES.getUserProfile,
  handler: (_req, params) => {
    const { username } = params;
    if (!username) return errorResponse('user_not_found', 404);
    return getUserProfilePayload(username);
  },
};
