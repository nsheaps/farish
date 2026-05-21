import { describe, expect, test } from 'bun:test';
import { createLorem, mockModelSummaries, placeholderImageUrl } from './index.ts';

describe('@farish/mock-data — lorem', () => {
  test('the same seed produces the same words', () => {
    expect(createLorem(42).words(5)).toBe(createLorem(42).words(5));
  });

  test('different seeds produce different words', () => {
    expect(createLorem(1).words(8)).not.toBe(createLorem(2).words(8));
  });

  test('sentence is capitalized and ends with a period', () => {
    const sentence = createLorem(7).sentence(6);
    expect(sentence.endsWith('.')).toBe(true);
    expect(sentence[0]).toBe(sentence[0]?.toUpperCase());
  });

  test('words(0) is an empty string', () => {
    expect(createLorem(1).words(0)).toBe('');
  });
});

describe('@farish/mock-data — placeholder image', () => {
  test('returns an SVG data URI', () => {
    const url = placeholderImageUrl({ width: 100, height: 80 });
    expect(url.startsWith('data:image/svg+xml,')).toBe(true);
  });

  test('encodes the requested dimensions', () => {
    const url = placeholderImageUrl({ width: 123, height: 45 });
    expect(decodeURIComponent(url)).toContain('width="123"');
    expect(decodeURIComponent(url)).toContain('height="45"');
  });
});

describe('@farish/mock-data — mock models', () => {
  test('produces the requested number of summaries', () => {
    expect(mockModelSummaries(6)).toHaveLength(6);
  });

  test('summaries are deterministic for a given seed', () => {
    expect(mockModelSummaries(3, 9)).toEqual(mockModelSummaries(3, 9));
  });

  test('each summary has a data-URI thumbnail and a 0-5 rating', () => {
    for (const model of mockModelSummaries(5)) {
      expect(model.thumbnailUrl.startsWith('data:image/svg+xml,')).toBe(true);
      expect(model.rating).toBeGreaterThanOrEqual(0);
      expect(model.rating).toBeLessThanOrEqual(5);
    }
  });
});
