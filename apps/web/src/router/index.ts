/**
 * @farish/web — client-side router.
 *
 * Uses hash history (`createWebHashHistory`) so the app works as a static
 * GitHub Pages deployment with no server-side rewrite rules: every route lives
 * under `index.html#/...`.
 *
 * Step 26 registers only the two framework-example routes. The 11 real pages
 * from `docs/pages/INDEX.md` are added in later prompt steps (30–32).
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import ExploreComingSoonView from '../views/ExploreComingSoonView.vue';
import HomeView from '../views/HomeView.vue';

/** The farish router instance. */
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/explore', name: 'explore', component: ExploreComingSoonView },
  ],
});
