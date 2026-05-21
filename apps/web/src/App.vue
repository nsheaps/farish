<script setup lang="ts">
/**
 * App — the root component.
 *
 * Provides the site-wide chrome (NavBar + Footer per docs/pages/INDEX.md) and
 * a `RouterView` for the active page.
 *
 * NavBar links: Generate · Explore · Leaderboards · Library · ⚙ Settings icon
 * Footer links: About · Settings · GitHub
 *
 * Per INDEX.md cross-page notes: all 11 pages include this global NavBar and Footer.
 */
</script>

<template>
  <v-app>
    <!-- Global NavBar — links to the four primary destinations + settings icon -->
    <v-app-bar color="primary" flat data-testid="nav-bar">
      <v-app-bar-title>
        <RouterLink to="/" class="text-white text-decoration-none font-weight-bold">
          farish
        </RouterLink>
      </v-app-bar-title>
      <template #append>
        <v-btn variant="text" to="/generate" data-testid="nav-generate">Generate</v-btn>
        <v-btn variant="text" to="/explore" data-testid="nav-explore">Explore</v-btn>
        <v-btn variant="text" to="/leaderboards" data-testid="nav-leaderboards">Leaderboards</v-btn>
        <v-btn variant="text" to="/library" data-testid="nav-library">Library</v-btn>
        <v-btn
          icon="mdi-cog"
          variant="text"
          to="/settings"
          aria-label="Settings"
          data-testid="nav-settings-icon"
        />
      </template>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <!-- Global Footer — About · Settings · GitHub per INDEX.md cross-page notes -->
    <v-footer color="surface" class="justify-center text-caption ga-4" data-testid="footer">
      <RouterLink to="/about" class="text-decoration-none text-medium-emphasis">About</RouterLink>
      <RouterLink to="/settings" class="text-decoration-none text-medium-emphasis">Settings</RouterLink>
      <a
        href="https://github.com/nsheaps/farish"
        class="text-decoration-none text-medium-emphasis"
        target="_blank"
        rel="noopener"
      >
        GitHub ↗
      </a>
    </v-footer>
  </v-app>
</template>
