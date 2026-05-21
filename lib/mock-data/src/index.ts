/**
 * @farish/mock-data — public surface.
 *
 * Re-exports the lorem-ipsum generator, the offline placeholder-image
 * generator, and the mock model-summary builder. These power the ghost
 * wireframes rendered behind Coming Soon pages and the API server's example
 * endpoint stub (initial prompt step 26).
 */
export { createLorem, type Lorem } from './lorem.ts';
export {
  placeholderImageUrl,
  type PlaceholderImageOptions,
} from './placeholder-image.ts';
export { mockModelSummaries } from './mock-models.ts';
