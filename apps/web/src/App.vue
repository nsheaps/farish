<script setup lang="ts">
/**
 * App — the root component.
 *
 * Step 32: improved NavBar (active-link highlight) and footer (border-top,
 * copyright line, consistent spacing).
 *
 * Per docs/pages/INDEX.md cross-page notes: all 11 pages include this global
 * NavBar and Footer.
 *
 * NavBar links: Generate · Explore · Leaderboards · Library · ⚙ Settings icon
 * Footer links: About · Settings · GitHub · © farish
 */
</script>

<template>
  <v-app>
    <!-- Global NavBar — links to the four primary destinations + settings icon -->
    <v-app-bar
      color="primary"
      flat
      elevation="0"
      data-testid="nav-bar"
      style="border-bottom: 1px solid rgba(255,255,255,0.12);"
    >
      <v-app-bar-title>
        <RouterLink
          to="/"
          class="text-white text-decoration-none font-weight-bold d-flex align-center ga-2"
        >
          <v-icon icon="mdi-cube-outline" size="20" />
          farish
        </RouterLink>
      </v-app-bar-title>
      <template #append>
        <v-btn
          variant="text"
          to="/generate"
          class="text-white"
          active-class="nav-active"
          data-testid="nav-generate"
        >
          Generate
        </v-btn>
        <v-btn
          variant="text"
          to="/explore"
          class="text-white"
          active-class="nav-active"
          data-testid="nav-explore"
        >
          Explore
        </v-btn>
        <v-btn
          variant="text"
          to="/leaderboards"
          class="text-white"
          active-class="nav-active"
          data-testid="nav-leaderboards"
        >
          Leaderboards
        </v-btn>
        <v-btn
          variant="text"
          to="/library"
          class="text-white"
          active-class="nav-active"
          data-testid="nav-library"
        >
          Library
        </v-btn>
        <v-btn
          icon="mdi-cog"
          variant="text"
          to="/settings"
          class="text-white"
          aria-label="Settings"
          data-testid="nav-settings-icon"
        />
      </template>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <!-- Global Footer — About · Settings · GitHub per INDEX.md cross-page notes -->
    <v-footer
      color="surface"
      class="py-5"
      data-testid="footer"
      style="border-top: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));"
    >
      <v-container>
        <div class="d-flex flex-wrap align-center justify-center ga-4">
          <RouterLink
            to="/about"
            class="text-decoration-none text-medium-emphasis text-body-2"
          >
            About
          </RouterLink>
          <RouterLink
            to="/settings"
            class="text-decoration-none text-medium-emphasis text-body-2"
          >
            Settings
          </RouterLink>
          <a
            href="https://github.com/nsheaps/farish"
            class="text-decoration-none text-medium-emphasis text-body-2"
            target="_blank"
            rel="noopener"
          >
            GitHub ↗
          </a>
          <span class="text-caption text-disabled">·</span>
          <span class="text-caption text-medium-emphasis">
            © 2026 farish — named after
            <a
              href="https://en.wikipedia.org/wiki/William_Farish_(scientist)"
              class="text-decoration-none text-primary"
              target="_blank"
              rel="noopener"
            >William Farish</a>
          </span>
        </div>
      </v-container>
    </v-footer>
  </v-app>
</template>

<style>
/* Active nav link: slightly brighter + underline indicator */
.nav-active.v-btn {
  opacity: 1 !important;
  border-bottom: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 0;
}
</style>
