import { describe, expect, test } from 'bun:test';
import { greet, PROJECT_NAME } from './index.ts';

describe('@farish/core', () => {
  test('greet interpolates the name', () => {
    expect(greet('world')).toBe('Hello, world, from farish core.');
  });

  test('PROJECT_NAME is farish', () => {
    expect(PROJECT_NAME).toBe('farish');
  });
});
