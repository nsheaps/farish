/**
 * Vitest config for @farish/web.
 *
 * Vue components must be compiled before they can be unit-tested, so the test
 * runner is Vitest (which reuses the Vite/Vue transform pipeline) rather than
 * `bun test`. A jsdom environment provides the DOM that Vuetify components and
 * `@vue/test-utils` mounting require.
 */
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.test.ts'],
    // Polyfill the browser APIs Vuetify needs that jsdom lacks.
    setupFiles: ['src/test/setup.ts'],
    // Vuetify ships untranspiled ESM; let Vitest transform it.
    server: { deps: { inline: ['vuetify'] } },
  },
});
