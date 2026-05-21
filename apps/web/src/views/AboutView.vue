<script setup lang="ts">
/**
 * AboutView — the farish About page stub.
 *
 * Step 30: skeleton rendering the major layout regions defined in the spec:
 * - Hero (project name + tagline)
 * - William Farish history section
 * - How Generation Works section
 * - Credential Privacy section
 * - Settings CTA
 *
 * Spec: docs/pages/about/SPEC.md
 * Tag: static — no backend or API key required.
 * Route: /about
 *
 * Step 31 will fill in the full wireframe-matching design.
 */
</script>

<template>
  <v-container data-testid="about-view" max-width="800">
    <!-- Hero -->
    <section class="text-center py-10" data-testid="about-hero">
      <h1 class="text-h3 font-weight-bold mb-3">About farish</h1>
      <p class="text-body-1 text-medium-emphasis">
        AI-powered 3D model generation, named after William Farish.
      </p>
    </section>

    <v-divider class="mb-8" />

    <!-- William Farish history -->
    <section class="mb-8" data-testid="about-history">
      <h2 class="text-h5 mb-4">William Farish &amp; Isometric Projection</h2>
      <p class="text-body-1 text-medium-emphasis">
        William Farish (1759–1837) was an English clergyman and academic who
        formalized isometric projection in 1822, enabling precise 3D-to-2D
        technical drawing. farish is named in his honour.
      </p>
    </section>

    <v-divider class="mb-8" />

    <!-- How Generation Works -->
    <section class="mb-8" data-testid="about-how-it-works">
      <h2 class="text-h5 mb-4">How Generation Works</h2>
      <p class="text-body-1 text-medium-emphasis">
        An explanation of the agent loop and 3D generation process will appear here.
      </p>
    </section>

    <v-divider class="mb-8" />

    <!-- Credential Privacy -->
    <section class="mb-8" data-testid="about-privacy">
      <h2 class="text-h5 mb-4">Credential Privacy</h2>
      <p class="text-body-1 text-medium-emphasis">
        Your Claude API key is stored only in your browser's local storage.
        It never leaves your device and is never sent to farish servers.
      </p>
    </section>

    <!-- Settings CTA -->
    <div class="text-center" data-testid="about-settings-cta">
      <v-btn color="primary" variant="flat" to="/settings">
        Connect a key in Settings
      </v-btn>
    </div>
  </v-container>
</template>
