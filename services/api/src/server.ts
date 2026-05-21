/**
 * @farish/api — server entrypoint.
 *
 * Bootstraps the development API server: composes every registered route into
 * one `fetch` handler and binds it with `Bun.serve`. Started by `bun run start`
 * and orchestrated by the repo `Tiltfile` for local development.
 *
 * The port is read from `PORT` (default 8787) so Tiltfile and CI can pick a
 * free port. Kept thin: all behaviour lives in `router.ts` and `routes/`.
 */
import { createRouter } from './router.ts';
import { routes } from './routes/index.ts';

/** Port the dev server binds. Override with the `PORT` env var. */
const PORT = Number(process.env.PORT ?? '8787');

const fetch = createRouter(routes);

const server = Bun.serve({ port: PORT, fetch });

// Services obey biome's noConsole rule; the error channel is permitted and is
// the right place for a one-time startup notice.
console.error(
  `[api] farish API server listening on http://localhost:${String(server.port)}`,
);
console.error(
  `[api] routes: ${routes.map((r) => `${r.method} ${r.path}`).join(', ')}`,
);
