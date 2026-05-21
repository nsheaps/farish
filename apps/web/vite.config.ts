/**
 * Vite config for @farish/web.
 *
 * - `@vitejs/plugin-vue` compiles Vue single-file components.
 * - `vite-plugin-vuetify` enables Vuetify's automatic component tree-shaking.
 * - `base` is read from `VITE_BASE` so the prod build can be deployed under a
 *   GitHub Pages project sub-path (e.g. `/farish/`); it defaults to `/`.
 * - The dev server proxies `/api` to the local API server so the browser app
 *   calls the API same-origin (no CORS hop) during development. The API's
 *   `/api` prefix is stripped before forwarding.
 * - `resolve.alias` maps every `@farish/*` workspace lib directly to its
 *   TypeScript source entry so `vite build` never needs pre-built `dist/`
 *   artefacts. This is the bulletproof fix for cold CI runners where no
 *   workspace lib has been compiled yet. The deps remain in package.json for
 *   nx-graph correctness and type-checking; Vite just bypasses the `dist/`
 *   redirect at bundle time.
 */
import vue from '@vitejs/plugin-vue';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import vuetify from 'vite-plugin-vuetify';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

/** Local API server port — keep in sync with the Tiltfile `api` resource. */
const API_PORT = process.env.API_PORT ?? '8787';

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue(), vuetify({ autoImport: true })],
  resolve: {
    alias: {
      // Map every @farish/* workspace lib to its TypeScript source entry.
      // Vite bundles from source so `dist/` artefacts are never required —
      // the build is cold-safe on a fresh CI runner with no prior compilation.
      '@farish/api-contract': resolve(__dirname, '../../lib/api-contract/src/index.ts'),
      '@farish/mock-data': resolve(__dirname, '../../lib/mock-data/src/index.ts'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${API_PORT}`,
        changeOrigin: true,
        rewrite: (path: string): string => path.replace(/^\/api/, ''),
      },
    },
  },
  // Explicitly disable the API proxy in preview mode (used by `vite preview`
  // and the Playwright screenshot suite). Vite v8 falls back to `server.proxy`
  // when `preview.proxy` is not set — leaving the proxy active in preview
  // causes every API request to hit ECONNREFUSED (no API server in CI or
  // during the screenshot run) and generates noisy proxy-error logs that can
  // delay `networkidle` detection in Playwright.
  preview: {
    proxy: {},
  },
  build: {
    outDir: 'dist',
  },
});
