import { flushPromises } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { mountWithVuetify } from '../test/mount.ts';
import HomeView from './HomeView.vue';

/** Build a minimal `fetch` Response stub. */
function jsonResponse(body: unknown, ok = true, status = 200): Response {
  return { ok, status, json: () => Promise.resolve(body) } as Response;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('HomeView — the working end-to-end example', () => {
  test('renders API health and the model list when the API responds', async () => {
    vi.spyOn(globalThis, 'fetch').mockImplementation((input) => {
      const url = String(input);
      if (url.endsWith('/health')) {
        return Promise.resolve(
          jsonResponse({ status: 'ok', service: 'api', version: '0.0.0', uptimeSeconds: 2 }),
        );
      }
      return Promise.resolve(
        jsonResponse({
          models: [
            {
              id: 'm1',
              title: 'Example Model',
              author: 'tester',
              rating: 4,
              views: 10,
              thumbnailUrl: 'data:image/svg+xml,<svg/>',
            },
          ],
          total: 1,
        }),
      );
    });

    const wrapper = mountWithVuetify(HomeView);
    await flushPromises();

    expect(wrapper.find('[data-testid="api-health"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Connected to API');
    expect(wrapper.find('[data-testid="model-list"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('Example Model');
  });

  test('degrades gracefully with a warning when the API is unreachable', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('network down'));

    const wrapper = mountWithVuetify(HomeView);
    await flushPromises();

    expect(wrapper.find('[data-testid="api-error"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('API unreachable');
  });
});
