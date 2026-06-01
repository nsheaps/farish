/**
 * @farish/mock-data — mock model summaries and model cards.
 *
 * Provides two generators:
 * - {@link mockModelCards}    — spec-compliant `ModelCard` objects used by the
 *   step-33 API stubs (`GET /models`, `GET /leaderboard`, etc.).
 * - {@link mockModelSummaries} — legacy `ModelSummary` objects kept for
 *   backward compatibility with the browser app's ghost wireframes.
 */
import type { ModelCard, ModelSummary } from '@farish/api-contract';
import { createLorem } from './lorem.ts';
import { placeholderImageUrl } from './placeholder-image.ts';

/** A small palette so successive mock cards do not all look identical. */
const THUMB_COLORS: readonly [string, ...string[]] = [
  '#b3e5fc',
  '#c8e6c9',
  '#ffe0b2',
  '#d1c4e9',
  '#f8bbd0',
];

/** ISO 8601 dates used as deterministic `createdAt` values. */
const CREATED_DATES: readonly string[] = [
  '2026-01-10T12:00:00Z',
  '2026-01-22T15:30:00Z',
  '2026-02-05T09:45:00Z',
  '2026-02-18T17:00:00Z',
  '2026-03-03T11:15:00Z',
  '2026-03-19T08:30:00Z',
  '2026-04-07T14:00:00Z',
  '2026-04-25T10:45:00Z',
];

/**
 * Generate `count` deterministic mock {@link ModelCard} records.
 *
 * Each card matches the spec-compliant shape expected by `GET /models`,
 * `GET /leaderboard`, and similar list endpoints.
 *
 * @param count - How many cards to produce.
 * @param seed  - Seed for the underlying generators; same seed → same data.
 */
export function mockModelCards(count: number, seed = 1): ModelCard[] {
  const lorem = createLorem(seed);
  return Array.from({ length: Math.max(0, count) }, (_unused, index): ModelCard => {
    const color = THUMB_COLORS[index % THUMB_COLORS.length] ?? THUMB_COLORS[0];
    const authorSlug = lorem.words(1).toLowerCase();
    const createdAt = CREATED_DATES[index % CREATED_DATES.length] ?? CREATED_DATES[0];
    return {
      id: `mock-${String(seed)}-${String(index)}`,
      title: lorem.title(3),
      thumbnailUrl: placeholderImageUrl({
        width: 320,
        height: 240,
        label: `model ${String(index + 1)}`,
        background: color,
      }),
      authorName: lorem.title(1),
      authorId: `mock-author-${String(seed)}-${String(index)}`,
      authorUsername: authorSlug,
      ratingAvg: index % 5 === 0 ? null : 2.5 + ((index * 3) % 6) / 2,
      viewCount: 100 + ((index * 137) % 9900),
      createdAt: createdAt ?? '2026-01-10T12:00:00Z',
    };
  });
}

/**
 * Generate `count` deterministic mock {@link ModelSummary} records.
 *
 * @deprecated Use {@link mockModelCards} for spec-compliant shapes.
 *
 * Kept for backward compatibility with the browser app's ghost wireframes.
 *
 * @param count - How many summaries to produce.
 * @param seed  - Seed for the underlying generators; same seed → same data.
 */
export function mockModelSummaries(count: number, seed = 1): ModelSummary[] {
  const lorem = createLorem(seed);
  return Array.from({ length: Math.max(0, count) }, (_unused, index): ModelSummary => {
    const color = THUMB_COLORS[index % THUMB_COLORS.length] ?? THUMB_COLORS[0];
    return {
      id: `mock-${String(seed)}-${String(index)}`,
      title: lorem.title(3),
      author: lorem.words(1),
      // A repeatable-looking 2.5–5 rating and view count derived from the index.
      rating: 2.5 + ((index * 3) % 6) / 2,
      views: 100 + ((index * 137) % 9900),
      thumbnailUrl: placeholderImageUrl({
        width: 320,
        height: 240,
        label: `model ${String(index + 1)}`,
        background: color,
      }),
    };
  });
}
