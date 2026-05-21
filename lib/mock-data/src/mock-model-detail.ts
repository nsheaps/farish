/**
 * @farish/mock-data — rich mock model detail.
 *
 * Produces a `MockModelDetail` record (a richer shape than `ModelSummary`)
 * for use on the Model Detail page when no real backend data is available.
 * Deterministic: the same modelId always returns the same fields.
 */
import type { ModelSummary } from '@farish/api-contract';
import { createLorem } from './lorem.ts';
import { placeholderImageUrl } from './placeholder-image.ts';

/** Extended model detail beyond the list summary. */
export interface MockModelDetail extends ModelSummary {
  /** The original generation prompt text. */
  prompt: string;
  /** ISO 8601 date string the model was created. */
  createdAt: string;
  /** Resolution setting used (0–100). */
  resolution: number;
  /** Artistic style chosen. */
  style: string;
  /** Complexity setting used (0–100). */
  complexity: number;
  /** Number of ratings submitted. */
  ratingCount: number;
}

/** Pre-defined palette entries so successive models differ. */
const DETAIL_COLORS: readonly string[] = [
  '#b3e5fc',
  '#c8e6c9',
  '#ffe0b2',
  '#d1c4e9',
  '#f8bbd0',
  '#b2ebf2',
  '#fff9c4',
  '#d7ccc8',
];

const STYLES = ['Low-poly', 'Realistic', 'Stylized', 'Abstract', 'Architectural'] as const;

const PROMPTS: readonly string[] = [
  'A low-poly dragon perched on a rocky spire, wings spread wide',
  'A futuristic spaceship with glowing ion engines, sleek hull',
  'A medieval stone castle on a cliffside at sunset',
  'An abstract geometric sphere made of interlocking triangles',
  'A bioluminescent deep-sea creature, tentacles unfurled',
  'A brutalist tower block with exposed concrete and narrow windows',
  'A floating island with waterfalls cascading into clouds below',
  'An ancient Mayan pyramid surrounded by jungle foliage',
];

const DATES: readonly string[] = [
  '2026-01-12',
  '2026-02-03',
  '2026-02-18',
  '2026-03-05',
  '2026-03-21',
  '2026-04-10',
  '2026-04-28',
  '2026-05-15',
];

/**
 * Generate a rich mock model detail record from a model ID.
 *
 * The ID is used as a seed so the same ID always returns the same record.
 *
 * @param modelId - The model identifier (typically from the route param).
 */
export function mockModelDetail(modelId: string): MockModelDetail {
  // Derive a numeric seed from the modelId string.
  const seed =
    modelId
      .split('')
      .reduce((acc, ch) => ((acc << 5) - acc + ch.charCodeAt(0)) | 0, 0) >>> 0;

  const index = seed % 8;
  const lorem = createLorem(seed);
  const color = DETAIL_COLORS[index % DETAIL_COLORS.length] ?? '#cfd8dc';
  const style = STYLES[index % STYLES.length] ?? 'Realistic';
  const prompt = PROMPTS[index % PROMPTS.length] ?? 'A 3D model';
  const createdAt = DATES[index % DATES.length] ?? '2026-01-01';

  return {
    id: modelId,
    title: lorem.title(3),
    author: lorem.words(1),
    rating: 3.5 + ((index * 3) % 5) / 3,
    views: 200 + ((index * 137) % 12000),
    thumbnailUrl: placeholderImageUrl({
      width: 800,
      height: 600,
      label: lorem.title(2),
      background: color,
    }),
    prompt,
    createdAt,
    resolution: 30 + ((index * 17) % 70),
    style,
    complexity: 20 + ((index * 23) % 60),
    ratingCount: 5 + ((index * 13) % 200),
  };
}
