/**
 * @farish/api — server integration test.
 *
 * Boots a real `Bun.serve` instance on an ephemeral port (port 0) and exercises
 * the API over actual HTTP. This proves the framework wires together
 * end-to-end: router + routes + Bun.serve.
 */
import { afterAll, beforeAll, describe, expect, test } from 'bun:test';
import type { Server } from 'bun';
import { createRouter } from './router.ts';
import { routes } from './routes/index.ts';

let server: Server;
let baseUrl: string;

beforeAll(() => {
  // Port 0 → the OS assigns a free port, so tests never collide.
  server = Bun.serve({ port: 0, fetch: createRouter(routes) });
  baseUrl = `http://localhost:${String(server.port)}`;
});

afterAll(() => {
  server.stop(true);
});

describe('@farish/api — server over HTTP', () => {
  test('GET /health responds 200 ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('api');
  });

  test('GET /models responds 200 with a list', async () => {
    const res = await fetch(`${baseUrl}/models`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.models)).toBe(true);
    expect(body.total).toBe(body.models.length);
  });

  test('an unknown path responds 404 not_found', async () => {
    const res = await fetch(`${baseUrl}/does-not-exist`);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'not_found' });
  });
});
