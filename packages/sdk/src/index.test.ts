import { describe, expect, test } from 'bun:test';
import { describeProject } from './index.ts';

describe('@farish/sdk', () => {
  test('describeProject combines core + math', () => {
    expect(describeProject()).toBe('Hello, farish, from farish core. (sdk v1)');
  });
});
