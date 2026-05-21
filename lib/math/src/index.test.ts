import { describe, expect, test } from 'bun:test';
import { add, clamp } from './index.ts';

describe('@farish/math', () => {
  test('add sums two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });

  test('clamp bounds a value', () => {
    expect(clamp(15, 0, 10)).toBe(10);
    expect(clamp(-5, 0, 10)).toBe(0);
    expect(clamp(7, 0, 10)).toBe(7);
  });
});
