<script setup lang="ts">
/**
 * NotFoundView — the farish 404 page.
 *
 * Step 30: skeleton rendering the major layout regions defined in the spec:
 * - 404 illustration (geometric/isometric icon)
 * - Headline and friendly message
 * - Home button (primary CTA)
 * - Explore link (secondary suggestion)
 *
 * Spec: docs/pages/not-found/SPEC.md
 * Tag: system — no data dependency.
 * Route: /:pathMatch(.*)*  — Vue Router catch-all
 *
 * Step 31 will fill in the full wireframe-matching design.
 */
import { useRoute } from 'vue-router';

const route = useRoute();
const attemptedPath = route.path;
</script>

<template>
  <v-container class="text-center py-16" data-testid="not-found-view">
    <!-- 404 Illustration -->
    <v-icon
      icon="mdi-cube-outline"
      size="96"
      color="medium-emphasis"
      class="mb-6"
      data-testid="not-found-illustration"
    />

    <!-- Headline -->
    <h1 class="text-h3 font-weight-bold mb-3" data-testid="not-found-headline">
      Page not found
    </h1>

    <!-- Message -->
    <p class="text-body-1 text-medium-emphasis mb-8" data-testid="not-found-message">
      The page <code>{{ attemptedPath }}</code> doesn't exist.
    </p>

    <!-- Home CTA -->
    <v-btn
      color="primary"
      size="large"
      variant="flat"
      to="/"
      class="mb-4"
      data-testid="not-found-home-btn"
    >
      Back to Home
    </v-btn>

    <div>
      <!-- Explore link -->
      <RouterLink
        to="/explore"
        class="text-decoration-none text-medium-emphasis"
        data-testid="not-found-explore-link"
      >
        Browse the community gallery
      </RouterLink>
    </div>
  </v-container>
</template>
