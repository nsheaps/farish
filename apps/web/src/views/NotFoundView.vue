<script setup lang="ts">
/**
 * NotFoundView — the farish 404 page.
 *
 * Step 31: layout matched to the wireframe in docs/pages/not-found/wireframes/page.ascii.md
 * - Isometric/geometric "404" illustration (SVG with 3D-style cubes)
 * - "Page not found" headline
 * - Path-specific error message
 * - Back to Home (primary VBtn)
 * - Try searching in Explore (secondary VBtn text)
 *
 * Spec: docs/pages/not-found/SPEC.md
 * Tag: system — no data dependency.
 * Route: /:pathMatch(.*)*  — Vue Router catch-all
 */
import { useRoute } from 'vue-router';

const route = useRoute();
const attemptedPath = route.path;
</script>

<template>
  <v-container class="text-center py-16" data-testid="not-found-view">
    <v-card
      max-width="480"
      class="mx-auto pa-8"
      variant="outlined"
    >
      <!-- Isometric 404 Illustration -->
      <div data-testid="not-found-illustration" class="mb-6">
        <svg
          width="160"
          height="100"
          viewBox="0 0 160 100"
          aria-hidden="true"
          style="display: inline-block;"
        >
          <!-- Isometric cube trio -->
          <!-- Cube 1 -->
          <polygon points="20,50 40,40 40,60 20,70" fill="#7986CB" />
          <polygon points="20,50 40,40 60,50 40,60" fill="#9FA8DA" />
          <polygon points="40,60 60,50 60,70 40,80" fill="#5C6BC0" />
          <!-- Cube 2 -->
          <polygon points="60,40 80,30 80,50 60,60" fill="#7986CB" />
          <polygon points="60,40 80,30 100,40 80,50" fill="#9FA8DA" />
          <polygon points="80,50 100,40 100,60 80,70" fill="#5C6BC0" />
          <!-- Cube 3 -->
          <polygon points="100,50 120,40 120,60 100,70" fill="#7986CB" />
          <polygon points="100,50 120,40 140,50 120,60" fill="#9FA8DA" />
          <polygon points="120,60 140,50 140,70 120,80" fill="#5C6BC0" />
          <!-- "404" text styled -->
          <text x="80" y="25" text-anchor="middle" font-weight="bold" font-size="18" fill="#5C6BC0">404</text>
        </svg>
      </div>

      <!-- Headline -->
      <h1 class="text-h4 font-weight-bold mb-3" data-testid="not-found-headline">
        Page not found
      </h1>

      <!-- Message with path -->
      <p class="text-body-1 text-medium-emphasis mb-8" data-testid="not-found-message">
        We couldn't find <code class="text-primary">{{ attemptedPath }}</code>.<br />
        The page may have moved or the URL may be incorrect.
      </p>

      <!-- Home CTA -->
      <v-btn
        color="primary"
        size="large"
        variant="flat"
        to="/"
        class="mb-4"
        block
        data-testid="not-found-home-btn"
      >
        ← Back to Home
      </v-btn>

      <!-- Explore link -->
      <v-btn
        variant="text"
        to="/explore"
        block
        data-testid="not-found-explore-link"
      >
        or Try searching in Explore →
      </v-btn>
    </v-card>
  </v-container>
</template>
