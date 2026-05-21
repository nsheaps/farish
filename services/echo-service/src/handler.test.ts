import { describe, expect, test } from 'bun:test';
import { handleEcho } from './handler.ts';

describe('@farish/echo-service', () => {
  test('handleEcho echoes a greeting for the given name', async () => {
    const res = handleEcho('tester');
    expect(await res.text()).toBe('Hello, tester, from farish core.');
  });
});
