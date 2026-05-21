/**
 * @farish/echo-service — server entrypoint.
 *
 * A long-running service (contrast with `apps/cli`, which exits). Started with
 * `bun run start`. Kept thin: all logic lives in `handler.ts`.
 */
import { handleEcho } from './handler.ts';

const PORT = 3001;

const server = Bun.serve({
  port: PORT,
  fetch(req): Response {
    const name = new URL(req.url).searchParams.get('name') ?? 'anonymous';
    return handleEcho(name);
  },
});

// Allowed in services? No — services obey noConsole. Use the error channel,
// which biome.json permits, for a one-time startup notice.
console.error(`echo-service listening on http://localhost:${String(server.port)}`);
