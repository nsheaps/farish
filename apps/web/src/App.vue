<script setup lang="ts">
/**
 * App — the root component.
 *
 * Provides the site-wide chrome (NavBar + Footer per docs/pages/INDEX.md) and
 * a `RouterView` for the active page. The framework skeleton keeps the NavBar
 * minimal — full navigation is filled in when the real pages are built.
 */
</script>

<template>
  <v-app>
    <v-app-bar color="primary" flat>
      <v-app-bar-title>
        <RouterLink to="/" class="text-white text-decoration-none">
          farish
        </RouterLink>
      </v-app-bar-title>
      <v-btn variant="text" to="/">Home</v-btn>
      <v-btn variant="text" to="/explore">Explore</v-btn>
    </v-app-bar>

    <v-main>
      <RouterView />
    </v-main>

    <v-footer color="surface" class="justify-center text-caption">
      <span>farish · AI 3D model generator ·</span>
      <a
        href="https://github.com/nsheaps/farish"
        class="ml-1 text-decoration-none"
        target="_blank"
        rel="noopener"
      >
        GitHub
      </a>
    </v-footer>
  </v-app>
</template>
