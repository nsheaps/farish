import { describe, expect, test } from 'bun:test';
import {
  type ApiError,
  type HealthResponse,
  type ListModelsResponse,
  type ModelSummary,
  ROUTES,
} from './index.ts';

describe('@farish/api-contract', () => {
  test('ROUTES exposes the framework endpoints', () => {
    expect(ROUTES.health).toBe('/health');
    expect(ROUTES.listModels).toBe('/models');
  });

  test('HealthResponse shape is satisfiable', () => {
    const health: HealthResponse = {
      status: 'ok',
      service: 'api',
      version: '0.0.0',
      uptimeSeconds: 0,
    };
    expect(health.status).toBe('ok');
  });

  test('ListModelsResponse shape is satisfiable', () => {
    const model: ModelSummary = {
      id: 'm1',
      title: 'Example',
      author: 'tester',
      rating: 4,
      views: 10,
      thumbnailUrl: 'data:image/svg+xml,<svg/>',
    };
    const response: ListModelsResponse = { models: [model], total: 1 };
    expect(response.models).toHaveLength(1);
    expect(response.total).toBe(1);
  });

  test('ApiError shape is satisfiable', () => {
    const err: ApiError = { error: 'not_found' };
    expect(err.error).toBe('not_found');
  });
});
