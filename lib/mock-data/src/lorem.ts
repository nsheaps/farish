/**
 * @farish/mock-data — deterministic lorem-ipsum generator.
 *
 * "Deterministic" matters: a seed produces the same text every time, so tests
 * that assert on generated content are stable and snapshots do not churn.
 */

/** The classic lorem-ipsum word pool. */
const WORD_POOL = [
  'lorem',
  'ipsum',
  'dolor',
  'sit',
  'amet',
  'consectetur',
  'adipiscing',
  'elit',
  'sed',
  'do',
  'eiusmod',
  'tempor',
  'incididunt',
  'labore',
  'magna',
  'aliqua',
  'enim',
  'minim',
  'veniam',
  'quis',
  'nostrud',
  'exercitation',
  'ullamco',
  'laboris',
  'aliquip',
  'commodo',
  'consequat',
] as const;

/**
 * A tiny seeded pseudo-random number generator (mulberry32).
 *
 * Not cryptographically secure — it only needs to be repeatable. Returns a
 * function yielding numbers in [0, 1).
 */
function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A seeded lorem-ipsum generator. Create one with {@link createLorem}. */
export interface Lorem {
  /** Return `count` random lowercase words joined by spaces. */
  words(count: number): string;
  /** Return one capitalized sentence of `wordCount` words ending in a period. */
  sentence(wordCount?: number): string;
  /** Return a short Title Case string suitable for a card heading. */
  title(wordCount?: number): string;
}

/**
 * Create a deterministic lorem-ipsum generator.
 *
 * @param seed - Any integer. The same seed always yields the same sequence.
 */
export function createLorem(seed = 1): Lorem {
  const rand = mulberry32(seed);
  const pick = (): string => {
    const index = Math.floor(rand() * WORD_POOL.length);
    return WORD_POOL[index] ?? WORD_POOL[0];
  };
  const capitalize = (word: string): string =>
    word.charAt(0).toUpperCase() + word.slice(1);

  const words = (count: number): string =>
    Array.from({ length: Math.max(0, count) }, pick).join(' ');

  const sentence = (wordCount = 8): string => {
    const text = words(wordCount);
    return `${capitalize(text)}.`;
  };

  const title = (wordCount = 3): string =>
    Array.from({ length: Math.max(1, wordCount) }, () => capitalize(pick())).join(
      ' ',
    );

  return { words, sentence, title };
}
