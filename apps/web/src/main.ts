/**
 * @farish/web — application entrypoint.
 *
 * Creates the Vue app, registers the Vuetify design system and the router,
 * and mounts it. Vite serves this in development with HMR and bundles it into
 * a static `dist/` for GitHub Pages in production.
 */
import { createApp } from 'vue';
import App from './App.vue';
import { vuetify } from './plugins/vuetify.ts';
import { router } from './router/index.ts';

createApp(App).use(vuetify).use(router).mount('#app');
