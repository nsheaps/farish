<script setup lang="ts">
/**
 * HomeView — the farish Home page stub.
 *
 * Step 30: skeleton rendering the major layout regions defined in the spec:
 * - Hero section (headline + Generate CTA)
 * - Trending Preview Strip (backend-enhanced, degrades gracefully)
 * - Footer (provided by App.vue)
 *
 * Spec: docs/pages/home/SPEC.md
 * Tag: static — no backend required; trending strip is an enhancement only.
 *
 * Step 31 will fill in the full wireframe-matching design.
 */
</script>

<template>
  <v-container data-testid="home-view">
    <!-- Hero — headline, tagline, primary Generate CTA -->
    <section class="text-center py-12" data-testid="home-hero">
      <h1 class="text-h3 font-weight-bold mb-3">farish</h1>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Generate stunning 3D models from a text prompt — powered by your Claude API key.
      </p>
      <v-btn
        color="primary"
        size="large"
        variant="flat"
        to="/generate"
        data-testid="home-generate-cta"
      >
        Start Generating
      </v-btn>
    </section>

    <v-divider class="mb-8" />

    <!-- Trending Preview Strip — degrades gracefully when backend is absent -->
    <section data-testid="home-trending-strip">
      <h2 class="text-h6 mb-4">Trending Models</h2>
      <p class="text-body-2 text-medium-emphasis">
        <!-- Placeholder: trending models will appear here once the backend is live. -->
        Community trending models will appear here once the shared backend is available.
      </p>
    </section>
  </v-container>
</template>
