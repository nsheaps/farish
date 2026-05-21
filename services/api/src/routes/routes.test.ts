import { describe, expect, test } from 'bun:test';
import { healthPayload, healthRoute } from './health.ts';
import { listModelsPayload, listModelsRoute } from './list-models.ts';

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

describe('@farish/api — list-models route', () => {
  test('is GET /models', () => {
    expect(listModelsRoute.method).toBe('GET');
    expect(listModelsRoute.path).toBe('/models');
  });

  test('payload returns mock models with a matching total', () => {
    const payload = listModelsPayload();
    expect(payload.models.length).toBeGreaterThan(0);
    expect(payload.total).toBe(payload.models.length);
  });

  test('every model has the contract fields', () => {
    for (const model of listModelsPayload().models) {
      expect(typeof model.id).toBe('string');
      expect(typeof model.title).toBe('string');
      expect(model.thumbnailUrl.startsWith('data:image/svg+xml,')).toBe(true);
    }
  });
});
