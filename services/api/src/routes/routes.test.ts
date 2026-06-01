/**
 * @farish/api — unit tests for every route module.
 *
 * Each test suite covers:
 * 1. The route descriptor (method + path)
 * 2. Payload / handler output shape matches the contract spec
 * 3. Error paths (invalid params, missing auth)
 *
 * These are unit tests — they exercise the payload builder functions and
 * handler calls in isolation, without starting a real HTTP server.
 */
import { describe, expect, test } from 'bun:test';
import { createModelRoute } from './create-model.ts';
import { getLeaderboardPayload, getLeaderboardRoute } from './get-leaderboard.ts';
import { getModelPayload, getModelRoute } from './get-model.ts';
import { getUserProfilePayload, getUserProfileRoute } from './get-user-profile.ts';
import { healthPayload, healthRoute } from './health.ts';
import { listModelsPayload, listModelsRoute } from './list-models.ts';
import { listUserModelsPayload, listUserModelsRoute } from './list-user-models.ts';
import { recordViewRoute } from './record-view.ts';
import { submitRatingPayload, submitRatingRoute } from './submit-rating.ts';

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------

describe('@farish/api — health route', () => {
  test('is GET /health', () => {
    expect(healthRoute.method).toBe('GET');
    expect(healthRoute.path).toBe('/health');
  });

  test('payload reports ok status and the service name', () => {
    const payload = healthPayload();
    expect(payload.status).toBe('ok');
    expect(payload.service).toBe('api');
    expect(payload.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });
});

// ---------------------------------------------------------------------------
// List Models — GET /models
// ---------------------------------------------------------------------------

describe('@farish/api — list-models route', () => {
  test('is GET /models', () => {
    expect(listModelsRoute.method).toBe('GET');
    expect(listModelsRoute.path).toBe('/models');
  });

  test('payload returns items array with pagination fields', () => {
    const result = listModelsPayload(new URL('http://localhost/models'));
    // Should not be an error Response
    expect(result instanceof Response).toBe(false);
    const payload = result as { items: unknown[]; total: number; page: number; totalPages: number };
    expect(Array.isArray(payload.items)).toBe(true);
    expect(payload.items.length).toBeGreaterThan(0);
    expect(typeof payload.total).toBe('number');
    expect(typeof payload.page).toBe('number');
    expect(typeof payload.totalPages).toBe('number');
    expect(payload.total).toBeGreaterThanOrEqual(payload.items.length);
  });

  test('every item has spec-required fields', () => {
    const result = listModelsPayload(new URL('http://localhost/models'));
    const payload = result as { items: Record<string, unknown>[] };
    for (const item of payload.items) {
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(typeof item.authorName).toBe('string');
      expect(typeof item.authorId).toBe('string');
      expect(typeof item.authorUsername).toBe('string');
      expect(typeof item.viewCount).toBe('number');
      expect(typeof item.createdAt).toBe('string');
      // thumbnailUrl and ratingAvg may be null
    }
  });

  test('invalid sort returns 400 error Response', () => {
    const result = listModelsPayload(new URL('http://localhost/models?sort=invalid'));
    expect(result instanceof Response).toBe(true);
    expect((result as Response).status).toBe(400);
  });

  test('limit exceeding max returns 400 error Response', () => {
    const result = listModelsPayload(new URL('http://localhost/models?limit=999'));
    expect(result instanceof Response).toBe(true);
    expect((result as Response).status).toBe(400);
  });

  test('custom limit and page are reflected in the response', () => {
    const result = listModelsPayload(new URL('http://localhost/models?limit=10&page=2'));
    const payload = result as { items: unknown[]; page: number; totalPages: number };
    expect(payload.page).toBe(2);
    expect(payload.items.length).toBeLessThanOrEqual(10);
  });
});

// ---------------------------------------------------------------------------
// Get Model — GET /models/:id
// ---------------------------------------------------------------------------

describe('@farish/api — get-model route', () => {
  test('is GET /models/:id', () => {
    expect(getModelRoute.method).toBe('GET');
    expect(getModelRoute.path).toBe('/models/:id');
  });

  test('payload returns all spec-required fields', () => {
    const payload = getModelPayload('test-id-abc');
    expect(typeof payload.id).toBe('string');
    expect(typeof payload.title).toBe('string');
    expect(typeof payload.prompt).toBe('string');
    expect(typeof payload.params).toBe('object');
    expect(typeof payload.params.resolution).toBe('number');
    expect(typeof payload.params.style).toBe('string');
    expect(typeof payload.params.complexity).toBe('number');
    expect(typeof payload.geometryUrl).toBe('string');
    expect(typeof payload.authorName).toBe('string');
    expect(typeof payload.authorId).toBe('string');
    expect(typeof payload.authorUsername).toBe('string');
    expect(typeof payload.createdAt).toBe('string');
    expect(typeof payload.viewCount).toBe('number');
    expect(typeof payload.ratingCount).toBe('number');
    // ratingAvg may be null or number
    expect(payload.ratingAvg === null || typeof payload.ratingAvg === 'number').toBe(true);
  });

  test('same id always returns the same data (deterministic)', () => {
    const a = getModelPayload('determinism-test');
    const b = getModelPayload('determinism-test');
    expect(a.title).toBe(b.title);
    expect(a.viewCount).toBe(b.viewCount);
  });
});

// ---------------------------------------------------------------------------
// Create Model — POST /models
// ---------------------------------------------------------------------------

describe('@farish/api — create-model route', () => {
  test('is POST /models', () => {
    expect(createModelRoute.method).toBe('POST');
    expect(createModelRoute.path).toBe('/models');
  });

  test('handler returns 401 when Authorization is missing', async () => {
    const req = new Request('http://localhost/models', { method: 'POST' });
    const res = await createModelRoute.handler(req, {});
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(401);
    const body = await (res as Response).json();
    expect(body.error).toBe('unauthorized');
  });

  test('handler returns 201 when a bearer token is present', async () => {
    const req = new Request('http://localhost/models', {
      method: 'POST',
      headers: { Authorization: 'Bearer test-token' },
    });
    const res = await createModelRoute.handler(req, {});
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(201);
    const body = await (res as Response).json();
    expect(typeof body.id).toBe('string');
    expect(typeof body.title).toBe('string');
    expect(typeof body.geometryUrl).toBe('string');
    expect(typeof body.createdAt).toBe('string');
  });
});

// ---------------------------------------------------------------------------
// Record View — POST /models/:id/views
// ---------------------------------------------------------------------------

describe('@farish/api — record-view route', () => {
  test('is POST /models/:id/views', () => {
    expect(recordViewRoute.method).toBe('POST');
    expect(recordViewRoute.path).toBe('/models/:id/views');
  });

  test('handler returns 204 No Content for a valid model id', async () => {
    const req = new Request('http://localhost/models/some-id/views', { method: 'POST' });
    const res = await recordViewRoute.handler(req, { id: 'some-id' });
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(204);
  });

  test('handler returns 404 when id param is missing', async () => {
    const req = new Request('http://localhost/models//views', { method: 'POST' });
    const res = await recordViewRoute.handler(req, { id: '' });
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(404);
  });
});

// ---------------------------------------------------------------------------
// Submit Rating — PUT /models/:id/rating
// ---------------------------------------------------------------------------

describe('@farish/api — submit-rating route', () => {
  test('is PUT /models/:id/rating', () => {
    expect(submitRatingRoute.method).toBe('PUT');
    expect(submitRatingRoute.path).toBe('/models/:id/rating');
  });

  test('payload returns spec-required aggregate fields', () => {
    const payload = submitRatingPayload('model-abc', 4);
    expect(typeof payload.ratingAvg).toBe('number');
    expect(typeof payload.ratingCount).toBe('number');
    expect(payload.ratingCount).toBeGreaterThan(0);
    expect(payload.userStars).toBe(4);
  });

  test('handler returns 401 when Authorization is missing', async () => {
    const req = new Request('http://localhost/models/abc/rating', {
      method: 'PUT',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ stars: 4 }),
    });
    const res = await submitRatingRoute.handler(req, { id: 'abc' });
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(401);
  });

  test('handler returns 400 for out-of-range stars', async () => {
    const req = new Request('http://localhost/models/abc/rating', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer tok',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ stars: 7 }),
    });
    const res = await submitRatingRoute.handler(req, { id: 'abc' });
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(400);
  });

  test('handler returns 200 with aggregate counters for valid request', async () => {
    const req = new Request('http://localhost/models/abc/rating', {
      method: 'PUT',
      headers: {
        Authorization: 'Bearer tok',
        'content-type': 'application/json',
      },
      body: JSON.stringify({ stars: 5 }),
    });
    const res = await submitRatingRoute.handler(req, { id: 'abc' });
    // Should return a plain object (JSON-serializable), not a Response
    if (res instanceof Response) {
      // If it IS a Response it must be 200
      expect(res.status).toBe(200);
    } else {
      const body = res as { ratingAvg: number; ratingCount: number; userStars: number };
      expect(typeof body.ratingAvg).toBe('number');
      expect(body.userStars).toBe(5);
    }
  });
});

// ---------------------------------------------------------------------------
// Get Leaderboard — GET /leaderboard
// ---------------------------------------------------------------------------

describe('@farish/api — get-leaderboard route', () => {
  test('is GET /leaderboard', () => {
    expect(getLeaderboardRoute.method).toBe('GET');
    expect(getLeaderboardRoute.path).toBe('/leaderboard');
  });

  test('payload echoes board and period, returns ordered items', () => {
    const payload = getLeaderboardPayload('rated', '1m', 10);
    expect(payload.board).toBe('rated');
    expect(payload.period).toBe('1m');
    expect(Array.isArray(payload.items)).toBe(true);
    expect(payload.items.length).toBeLessThanOrEqual(10);
  });

  test('every item has spec-required fields', () => {
    const payload = getLeaderboardPayload('viewed', 'all', 5);
    for (const item of payload.items) {
      expect(typeof item.rank).toBe('number');
      expect(item.rank).toBeGreaterThan(0);
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(typeof item.authorName).toBe('string');
      expect(typeof item.authorId).toBe('string');
      expect(typeof item.authorUsername).toBe('string');
      expect(typeof item.metricValue).toBe('number');
      expect(typeof item.createdAt).toBe('string');
    }
  });

  test('items are rank-ordered starting at 1', () => {
    const payload = getLeaderboardPayload('popular', '1w', 5);
    payload.items.forEach((item, i) => {
      expect(item.rank).toBe(i + 1);
    });
  });

  test('handler returns 400 for invalid board', async () => {
    const req = new Request('http://localhost/leaderboard?board=bad&period=1w');
    const res = await getLeaderboardRoute.handler(req, {});
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(400);
  });

  test('handler returns 400 for invalid period', async () => {
    const req = new Request('http://localhost/leaderboard?board=rated&period=bad');
    const res = await getLeaderboardRoute.handler(req, {});
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(400);
  });

  test('handler returns 400 when board param is missing', async () => {
    const req = new Request('http://localhost/leaderboard?period=1w');
    const res = await getLeaderboardRoute.handler(req, {});
    expect(res instanceof Response).toBe(true);
    expect((res as Response).status).toBe(400);
  });
});

// ---------------------------------------------------------------------------
// Get User Profile — GET /users/:username
// ---------------------------------------------------------------------------

describe('@farish/api — get-user-profile route', () => {
  test('is GET /users/:username', () => {
    expect(getUserProfileRoute.method).toBe('GET');
    expect(getUserProfileRoute.path).toBe('/users/:username');
  });

  test('payload returns all spec-required fields', () => {
    const payload = getUserProfilePayload('testuser');
    expect(payload.username).toBe('testuser');
    expect(typeof payload.displayName).toBe('string');
    expect(typeof payload.joinDate).toBe('string');
    expect(typeof payload.modelCount).toBe('number');
    expect(payload.modelCount).toBeGreaterThan(0);
    expect(typeof payload.totalViews).toBe('number');
    // avatarUrl and avgRating may be null
    expect(payload.avatarUrl === null || typeof payload.avatarUrl === 'string').toBe(true);
    expect(payload.avgRating === null || typeof payload.avgRating === 'number').toBe(true);
  });

  test('same username always returns the same data (deterministic)', () => {
    const a = getUserProfilePayload('alice');
    const b = getUserProfilePayload('alice');
    expect(a.displayName).toBe(b.displayName);
    expect(a.modelCount).toBe(b.modelCount);
  });
});

// ---------------------------------------------------------------------------
// List User Models — GET /users/:username/models
// ---------------------------------------------------------------------------

describe('@farish/api — list-user-models route', () => {
  test('is GET /users/:username/models', () => {
    expect(listUserModelsRoute.method).toBe('GET');
    expect(listUserModelsRoute.path).toBe('/users/:username/models');
  });

  test('payload returns items array with pagination fields', () => {
    const payload = listUserModelsPayload('alice', 1, 24);
    expect(Array.isArray(payload.items)).toBe(true);
    expect(payload.items.length).toBeGreaterThan(0);
    expect(typeof payload.total).toBe('number');
    expect(typeof payload.page).toBe('number');
    expect(typeof payload.totalPages).toBe('number');
  });

  test('every item has spec-required fields', () => {
    const payload = listUserModelsPayload('bob', 1, 10);
    for (const item of payload.items) {
      expect(typeof item.id).toBe('string');
      expect(typeof item.title).toBe('string');
      expect(typeof item.viewCount).toBe('number');
      expect(typeof item.createdAt).toBe('string');
    }
  });

  test('page number is reflected in the response', () => {
    const payload = listUserModelsPayload('carol', 3, 5);
    expect(payload.page).toBe(3);
  });
});
