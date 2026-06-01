/**
 * @farish/api — server integration test.
 *
 * Boots a real `Bun.serve` instance on an ephemeral port (port 0) and exercises
 * the API over actual HTTP. This proves the framework wires together
 * end-to-end: router + routes + Bun.serve.
 *
 * Every one of the 8 spec endpoints is smoke-tested here (happy path +
 * the most important error path). Detailed payload-shape testing lives
 * in `routes.test.ts`.
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

// ---------------------------------------------------------------------------
// Infrastructure
// ---------------------------------------------------------------------------

describe('@farish/api — server over HTTP', () => {
  test('GET /health responds 200 ok', async () => {
    const res = await fetch(`${baseUrl}/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe('ok');
    expect(body.service).toBe('api');
  });

  test('an unknown path responds 404 not_found', async () => {
    const res = await fetch(`${baseUrl}/does-not-exist`);
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'not_found' });
  });

  test('CORS preflight OPTIONS returns 204 with origin header', async () => {
    const res = await fetch(`${baseUrl}/models`, { method: 'OPTIONS' });
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });
});

// ---------------------------------------------------------------------------
// List Models — GET /models
// ---------------------------------------------------------------------------

describe('@farish/api — GET /models', () => {
  test('responds 200 with items array and pagination', async () => {
    const res = await fetch(`${baseUrl}/models`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.items)).toBe(true);
    expect(typeof body.total).toBe('number');
    expect(typeof body.page).toBe('number');
    expect(typeof body.totalPages).toBe('number');
  });

  test('invalid sort returns 400 invalid_sort', async () => {
    const res = await fetch(`${baseUrl}/models?sort=nope`);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_sort');
  });

  test('limit exceeding max returns 400 limit_too_large', async () => {
    const res = await fetch(`${baseUrl}/models?limit=999`);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('limit_too_large');
  });
});

// ---------------------------------------------------------------------------
// Get Model — GET /models/:id
// ---------------------------------------------------------------------------

describe('@farish/api — GET /models/:id', () => {
  test('responds 200 with a full model record', async () => {
    const res = await fetch(`${baseUrl}/models/some-test-id`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.id).toBe('string');
    expect(typeof body.prompt).toBe('string');
    expect(typeof body.geometryUrl).toBe('string');
    expect(typeof body.viewCount).toBe('number');
    expect(typeof body.ratingCount).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// Create Model — POST /models
// ---------------------------------------------------------------------------

describe('@farish/api — POST /models', () => {
  test('returns 401 when no auth header', async () => {
    const res = await fetch(`${baseUrl}/models`, { method: 'POST' });
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('unauthorized');
  });

  test('returns 201 with a model record when auth is present', async () => {
    const res = await fetch(`${baseUrl}/models`, {
      method: 'POST',
      headers: { Authorization: 'Bearer test-token' },
    });
    expect(res.status).toBe(201);
    const body = await res.json();
    expect(typeof body.id).toBe('string');
    expect(typeof body.geometryUrl).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// Record View — POST /models/:id/views
// ---------------------------------------------------------------------------

describe('@farish/api — POST /models/:id/views', () => {
  test('returns 204 No Content', async () => {
    const res = await fetch(`${baseUrl}/models/view-test-id/views`, { method: 'POST' });
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });
});

// ---------------------------------------------------------------------------
// Submit Rating — PUT /models/:id/rating
// ---------------------------------------------------------------------------

describe('@farish/api — PUT /models/:id/rating', () => {
  test('returns 401 when no auth header', async () => {
    const res = await fetch(`${baseUrl}/models/abc/rating`, {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ stars: 4 }),
    });
    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe('unauthorized');
  });

  test('returns 400 for out-of-range stars', async () => {
    const res = await fetch(`${baseUrl}/models/abc/rating`, {
      method: 'PUT',
      headers: { Authorization: 'Bearer tok', 'content-type': 'application/json' },
      body: JSON.stringify({ stars: 0 }),
    });
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_stars');
  });

  test('returns 200 with aggregate counters for valid request', async () => {
    const res = await fetch(`${baseUrl}/models/abc/rating`, {
      method: 'PUT',
      headers: { Authorization: 'Bearer tok', 'content-type': 'application/json' },
      body: JSON.stringify({ stars: 4 }),
    });
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(typeof body.ratingAvg).toBe('number');
    expect(typeof body.ratingCount).toBe('number');
    expect(body.userStars).toBe(4);
  });
});

// ---------------------------------------------------------------------------
// Get Leaderboard — GET /leaderboard
// ---------------------------------------------------------------------------

describe('@farish/api — GET /leaderboard', () => {
  test('responds 200 with board, period, and items', async () => {
    const res = await fetch(`${baseUrl}/leaderboard?board=rated&period=1m`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.board).toBe('rated');
    expect(body.period).toBe('1m');
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThan(0);
  });

  test('returns 400 for invalid board', async () => {
    const res = await fetch(`${baseUrl}/leaderboard?board=bad&period=1w`);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_board');
  });

  test('returns 400 for missing period', async () => {
    const res = await fetch(`${baseUrl}/leaderboard?board=viewed`);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('invalid_period');
  });
});

// ---------------------------------------------------------------------------
// Get User Profile — GET /users/:username
// ---------------------------------------------------------------------------

describe('@farish/api — GET /users/:username', () => {
  test('responds 200 with profile fields', async () => {
    const res = await fetch(`${baseUrl}/users/alice`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.username).toBe('alice');
    expect(typeof body.displayName).toBe('string');
    expect(typeof body.modelCount).toBe('number');
    expect(typeof body.totalViews).toBe('number');
  });
});

// ---------------------------------------------------------------------------
// List User Models — GET /users/:username/models
// ---------------------------------------------------------------------------

describe('@farish/api — GET /users/:username/models', () => {
  test('responds 200 with items array and pagination', async () => {
    const res = await fetch(`${baseUrl}/users/alice/models`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body.items)).toBe(true);
    expect(typeof body.total).toBe('number');
    expect(typeof body.page).toBe('number');
    expect(typeof body.totalPages).toBe('number');
  });

  test('limit exceeding max returns 400', async () => {
    const res = await fetch(`${baseUrl}/users/bob/models?limit=999`);
    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe('limit_too_large');
  });

  test('/users/:username/models is matched before /users/:username', async () => {
    // This verifies route ordering in index.ts — without the fix, the more
    // specific sub-path would be swallowed by the profile route.
    const profileRes = await fetch(`${baseUrl}/users/carol`);
    const modelsRes = await fetch(`${baseUrl}/users/carol/models`);
    expect(profileRes.status).toBe(200);
    expect(modelsRes.status).toBe(200);
    const profile = await profileRes.json();
    const models = await modelsRes.json();
    expect(profile.username).toBe('carol');
    expect(Array.isArray(models.items)).toBe(true);
  });
});
