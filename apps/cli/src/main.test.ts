import { describe, expect, test } from 'bun:test';
import { describeProject } from '@farish/sdk';

describe('@farish/cli', () => {
  test('renders the SDK status line it would print', () => {
    expect(describeProject()).toContain('farish');
  });
});
