/**
 * @farish/web — client-side router.
 *
 * Uses hash history (`createWebHashHistory`) so the app works as a static
 * GitHub Pages deployment with no server-side rewrite rules: every route lives
 * under `index.html#/...`.
 *
 * All 11 pages from `docs/pages/INDEX.md` are registered here (step 30).
 * Backend-dependent pages (explore, leaderboards, profile) render via the
 * ComingSoon mechanism at their own routes.
 *
 * Routes:
 *   /                  → HomeView            (static)
 *   /explore           → ExploreComingSoonView (backend → Coming Soon)
 *   /leaderboards      → LeaderboardsComingSoonView (backend → Coming Soon)
 *   /generate          → GenerateView        (browser-only)
 *   /m/:modelId        → ModelDetailView     (browser-only viewer + backend social)
 *   /library           → MyLibraryView       (browser-only)
 *   /u/:username       → ProfileComingSoonView (backend → Coming Soon)
 *   /settings          → SettingsView        (browser-only)
 *   /about             → AboutView           (static)
 *   /coming-soon       → ComingSoonView      (system — direct fallback)
 *   /:pathMatch(.*)*   → NotFoundView        (system — catch-all 404)
 */
import { createRouter, createWebHashHistory } from 'vue-router';
import AboutView from '../views/AboutView.vue';
import ComingSoonView from '../views/ComingSoonView.vue';
import ExploreComingSoonView from '../views/ExploreComingSoonView.vue';
import GenerateView from '../views/GenerateView.vue';
import HomeView from '../views/HomeView.vue';
import LeaderboardsComingSoonView from '../views/LeaderboardsComingSoonView.vue';
import ModelDetailView from '../views/ModelDetailView.vue';
import MyLibraryView from '../views/MyLibraryView.vue';
import NotFoundView from '../views/NotFoundView.vue';
import ProfileComingSoonView from '../views/ProfileComingSoonView.vue';
import SettingsView from '../views/SettingsView.vue';

/** The farish router instance. */
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    // ── Discover ────────────────────────────────────────────────────────────
    { path: '/', name: 'home', component: HomeView },
    { path: '/explore', name: 'explore', component: ExploreComingSoonView },
    { path: '/leaderboards', name: 'leaderboards', component: LeaderboardsComingSoonView },

    // ── Create ───────────────────────────────────────────────────────────────
    { path: '/generate', name: 'generate', component: GenerateView },
    { path: '/m/:modelId', name: 'model-detail', component: ModelDetailView },

    // ── Account ──────────────────────────────────────────────────────────────
    { path: '/library', name: 'my-library', component: MyLibraryView },
    { path: '/u/:username', name: 'profile', component: ProfileComingSoonView },
    { path: '/settings', name: 'settings', component: SettingsView },

    // ── System ───────────────────────────────────────────────────────────────
    { path: '/about', name: 'about', component: AboutView },
    { path: '/coming-soon', name: 'coming-soon', component: ComingSoonView },
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundView },
  ],
});
