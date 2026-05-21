/**
 * @farish/echo-service — request handler.
 *
 * Split from the server entrypoint so it is unit-testable without binding a
 * port. Depends on `@farish/core`.
 */
import { greet } from '@farish/core';

/** Build the HTTP response for an echo request. */
export function handleEcho(name: string): Response {
  return new Response(greet(name), {
    headers: { 'content-type': 'text/plain' },
  });
}
