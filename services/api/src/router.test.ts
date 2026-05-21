import { describe, expect, test } from 'bun:test';
import { createRouter, errorResponse, type Route } from './router.ts';

const okRoute: Route = {
  method: 'GET',
  path: '/ok',
  handler: () => ({ ok: true }),
};

const boomRoute: Route = {
  method: 'GET',
  path: '/boom',
  handler: () => {
    throw new Error('handler exploded');
  },
};

const router = createRouter([okRoute, boomRoute]);

describe('@farish/api — router', () => {
  test('matched route returns its JSON payload', async () => {
    const res = await router(new Request('http://localhost/ok'));
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toBe('application/json');
    expect(await res.json()).toEqual({ ok: true });
  });

  test('unknown route returns 404 not_found', async () => {
    const res = await router(new Request('http://localhost/missing'));
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: 'not_found' });
  });

  test('wrong method on a known path returns 404', async () => {
    const res = await router(
      new Request('http://localhost/ok', { method: 'POST' }),
    );
    expect(res.status).toBe(404);
  });

  test('a throwing handler becomes 500 internal_error', async () => {
    const res = await router(new Request('http://localhost/boom'));
    expect(res.status).toBe(500);
    expect(await res.json()).toEqual({ error: 'internal_error' });
  });

  test('OPTIONS preflight returns 204 with CORS headers', async () => {
    const res = await router(
      new Request('http://localhost/ok', { method: 'OPTIONS' }),
    );
    expect(res.status).toBe(204);
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  test('every response carries the CORS origin header', async () => {
    const res = await router(new Request('http://localhost/ok'));
    expect(res.headers.get('access-control-allow-origin')).toBe('*');
  });

  test('errorResponse builds the standard error body', async () => {
    const res = errorResponse('teapot', 418);
    expect(res.status).toBe(418);
    expect(await res.json()).toEqual({ error: 'teapot' });
  });
});
