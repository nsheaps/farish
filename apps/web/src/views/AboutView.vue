<script setup lang="ts">
/**
 * AboutView — the farish About page.
 *
 * Step 31: layout matched to the wireframe in docs/pages/about/wireframes/page.ascii.md
 * Sections:
 * - Hero: title + tagline
 * - William Farish history (VCard prose + Wikipedia link)
 * - How Generation Works (VCard with Mermaid diagram placeholder + prose)
 * - Credential Privacy (VCard with lock icon + prose + Settings CTA)
 *
 * Spec: docs/pages/about/SPEC.md
 * Tag: static — no backend or API key required.
 */
</script>

<template>
  <v-container data-testid="about-view" max-width="800">
    <!-- Hero -->
    <section class="text-center py-10" data-testid="about-hero">
      <h1 class="text-h3 font-weight-bold mb-3">About farish</h1>
      <p class="text-body-1 text-medium-emphasis">
        AI-generated 3D geometry, named for William Farish — the mathematician who
        formalized isometric projection in 1822.
      </p>
    </section>

    <!-- William Farish History -->
    <v-card variant="outlined" class="mb-6 pa-6" data-testid="about-history">
      <h2 class="text-h5 mb-3">William Farish (1759–1837)</h2>
      <p class="text-body-1 mb-4">
        William Farish was a British chemist and engineer at Cambridge who in 1822 first
        formalised isometric projection as a technical drawing method — a system that
        represents 3D objects in 2D while preserving equal scale on all three axes.
      </p>
      <p class="text-body-1 mb-4">
        His 1822 paper <em>"On Isometrical Perspective"</em> gave engineers and
        architects a rigorous geometric foundation for communicating three-dimensional
        ideas on flat paper — a breakthrough that predates CAD software by over a century.
      </p>
      <v-btn
        variant="text"
        href="https://en.wikipedia.org/wiki/William_Farish_(scientist)"
        target="_blank"
        rel="noopener"
        append-icon="mdi-open-in-new"
        size="small"
      >
        Wikipedia ↗
      </v-btn>
    </v-card>

    <!-- How Generation Works -->
    <v-card variant="outlined" class="mb-6 pa-6" data-testid="about-how-it-works">
      <h2 class="text-h5 mb-3">How Generation Works</h2>

      <!-- Generation diagram (Mermaid sequence placeholder) -->
      <v-sheet
        color="surface-variant"
        rounded="lg"
        class="pa-4 mb-4 text-center text-medium-emphasis text-caption"
        data-testid="about-generation-diagram"
      >
        <p class="mb-1 font-weight-bold">Generation Pipeline</p>
        <p>User → Prompt → Claude SDK → Tool calls → Geometry output → 3D Viewer</p>
      </v-sheet>

      <p class="text-body-1 mb-2">
        farish passes your prompt to Claude's Agent SDK. The agent reasons over the
        request, calls geometry tools, and streams incremental updates to the viewer
        as 3D output is produced.
      </p>
      <p class="text-body-1">
        Because all AI requests flow directly from your browser to the Anthropic API,
        no model data ever touches farish's own servers.
      </p>
    </v-card>

    <!-- Credential Privacy -->
    <v-card variant="outlined" class="mb-6 pa-6" data-testid="about-privacy">
      <div class="d-flex align-center ga-3 mb-3">
        <v-icon icon="mdi-lock-outline" color="primary" size="32" />
        <h2 class="text-h5">Your keys stay on your device</h2>
      </div>
      <p class="text-body-1 mb-4">
        Your Claude API key or OAuth token is stored in your browser's localStorage
        and is never transmitted to farish servers. All AI requests go directly from
        your browser to the Anthropic API.
      </p>
      <v-btn
        variant="outlined"
        to="/settings"
        prepend-icon="mdi-key-outline"
        data-testid="about-settings-cta"
      >
        Connect your key in Settings →
      </v-btn>
    </v-card>
  </v-container>
</template>
