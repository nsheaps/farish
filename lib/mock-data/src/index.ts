/**
 * @farish/mock-data — public surface.
 *
 * Re-exports the lorem-ipsum generator, the offline placeholder-image
 * generator, the mock model-summary builder, the rich mock model detail
 * generator, and the mock generation conversation factory. These power the
 * ghost wireframes rendered behind Coming Soon pages, the Generate page demo
 * mode, and the API server's example endpoint stub (initial prompt step 26).
 */
export { createLorem, type Lorem } from './lorem.ts';
export {
  placeholderImageUrl,
  type PlaceholderImageOptions,
} from './placeholder-image.ts';
export { mockModelSummaries } from './mock-models.ts';
export { mockModelDetail, type MockModelDetail } from './mock-model-detail.ts';
export {
  mockGenerationConversation,
  type MockGenerationConversation,
  type MockClarificationQuestion,
  type MockAgentStep,
} from './mock-conversation.ts';
