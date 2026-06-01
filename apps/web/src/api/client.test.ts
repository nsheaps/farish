import { afterEach, describe, expect, test, vi } from 'vitest';
import { getHealth, listModels } from './client.ts';

/** Build a minimal `fetch` Response stub. */
function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return {
    ok,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('@farish/web — API client', () => {
  test('getHealth requests /health under the /api dev proxy prefix', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(
        jsonResponse({ status: 'ok', service: 'api', version: '0.0.0', uptimeSeconds: 1 }),
      );

    const health = await getHealth();

    expect(fetchMock).toHaveBeenCalledWith('/api/health');
    expect(health.status).toBe('ok');
  });

  test('listModels requests /models and returns the model array', async () => {
    const fetchMock = vi
      .spyOn(globalThis, 'fetch')
      .mockResolvedValue(jsonResponse({ models: [], total: 0 }));

    const result = await listModels();

    expect(fetchMock).toHaveBeenCalledWith('/api/models');
    expect(result.models).toEqual([]);
  });

  test('a non-ok response rejects with a descriptive error', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(jsonResponse({}, false, 500));
    await expect(getHealth()).rejects.toThrow('API request failed: 500');
  });
});
