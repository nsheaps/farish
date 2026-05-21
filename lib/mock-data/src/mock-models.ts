/**
 * @farish/mock-data — mock model summaries.
 *
 * Builds `ModelSummary` objects (the shape from `@farish/api-contract`) out of
 * the lorem-ipsum and placeholder-image generators. Used by the ghost
 * wireframe behind the Coming Soon overlay and by the API server's example
 * `list-models` stub.
 */
import type { ModelSummary } from '@farish/api-contract';
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

/**
 * Generate `count` deterministic mock {@link ModelSummary} records.
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
      // A repeatable-looking 0–5 rating and view count derived from the index.
      rating: 2 + ((index * 7) % 7) / 2,
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
