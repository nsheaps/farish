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
 */
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import vuetify from 'vite-plugin-vuetify';

/** Local API server port — keep in sync with the Tiltfile `api` resource. */
const API_PORT = process.env.API_PORT ?? '8787';

export default defineConfig({
  base: process.env.VITE_BASE ?? '/',
  plugins: [vue(), vuetify({ autoImport: true })],
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
  build: {
    outDir: 'dist',
  },
});
