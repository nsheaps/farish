<script setup lang="ts">
/**
 * AboutView — the farish About page.
 *
 * Step 32: improved generation pipeline diagram (using Vuetify chips to
 * represent the flow stages) and overall prose polish.
 *
 * Sections:
 * - Hero: title + tagline
 * - William Farish history (VCard prose + Wikipedia link)
 * - How Generation Works (VCard with stage diagram + prose)
 * - Credential Privacy (VCard with lock icon + prose + Settings CTA)
 *
 * Spec: docs/pages/about/SPEC.md
 * Tag: static — no backend or API key required.
 */

const pipelineStages = [
  { icon: 'mdi-text-box-edit-outline', label: 'Your prompt', color: 'primary' },
  { icon: 'mdi-robot-outline', label: 'Claude SDK', color: 'secondary' },
  { icon: 'mdi-hammer-wrench', label: 'Geometry tools', color: 'secondary' },
  { icon: 'mdi-cube-scan', label: '3D output', color: 'primary' },
  { icon: 'mdi-rotate-3d-variant', label: 'Live viewer', color: 'primary' },
] as const;
</script>

<template>
  <v-container data-testid="about-view" max-width="800">

    <!-- Hero -->
    <section class="text-center py-10" data-testid="about-hero">
      <v-icon icon="mdi-cube-outline" size="48" color="primary" class="mb-4" />
      <h1 class="text-h3 font-weight-bold mb-3">About farish</h1>
      <p class="text-body-1 text-medium-emphasis">
        AI-generated 3D geometry, named for William Farish — the mathematician who
        formalised isometric projection in 1822.
      </p>
    </section>

    <!-- William Farish History -->
    <v-card variant="outlined" class="mb-6 pa-6" data-testid="about-history">
      <div class="d-flex align-center ga-3 mb-4">
        <v-icon icon="mdi-book-open-outline" color="primary" size="28" />
        <h2 class="text-h5 font-weight-bold">William Farish (1759–1837)</h2>
      </div>
      <p class="text-body-1 mb-4">
        William Farish was a British chemist and engineer at Cambridge who in 1822 first
        formalised isometric projection as a technical drawing method — a system that
        represents 3D objects in 2D while preserving equal scale on all three axes.
      </p>
      <p class="text-body-1 mb-4">
        His 1822 paper <em>"On Isometrical Perspective"</em> gave engineers and
        architects a rigorous geometric foundation for communicating three-dimensional
        ideas on flat paper — a breakthrough that predates CAD software by over a century.
        farish honours his legacy by using AI to do the reverse: turning flat text descriptions
        back into three-dimensional geometry.
      </p>
      <v-btn
        variant="outlined"
        href="https://en.wikipedia.org/wiki/William_Farish_(scientist)"
        target="_blank"
        rel="noopener"
        append-icon="mdi-open-in-new"
        size="small"
        data-testid="about-wikipedia-link"
      >
        Read on Wikipedia
      </v-btn>
    </v-card>

    <!-- How Generation Works -->
    <v-card variant="outlined" class="mb-6 pa-6" data-testid="about-how-it-works">
      <div class="d-flex align-center ga-3 mb-4">
        <v-icon icon="mdi-cog-outline" color="primary" size="28" />
        <h2 class="text-h5 font-weight-bold">How Generation Works</h2>
      </div>

      <!-- Generation pipeline diagram -->
      <v-sheet
        color="surface-variant"
        rounded="lg"
        class="pa-5 mb-5"
        data-testid="about-generation-diagram"
      >
        <p class="text-caption text-medium-emphasis text-center mb-4 font-weight-medium text-overline">
          Generation Pipeline
        </p>
        <div class="d-flex align-center justify-center flex-wrap ga-2">
          <template v-for="(stage, i) in pipelineStages" :key="stage.label">
            <div class="text-center" style="min-width: 80px;">
              <v-icon :icon="stage.icon" :color="stage.color" size="28" class="mb-1" />
              <p class="text-caption">{{ stage.label }}</p>
            </div>
            <v-icon
              v-if="i < pipelineStages.length - 1"
              icon="mdi-arrow-right"
              size="18"
              color="medium-emphasis"
            />
          </template>
        </div>
      </v-sheet>

      <p class="text-body-1 mb-3">
        farish passes your prompt to Claude's Agent SDK. The agent reasons over the
        request, asks clarifying questions when the spec is underspecified, then calls
        geometry tools to produce 3D output.
      </p>
      <p class="text-body-1 mb-3">
        The generation loop streams incremental updates to your browser as output is
        produced, so you can see progress in real time — each step from parsing your
        prompt to the final mesh optimisation.
      </p>
      <p class="text-body-1">
        Because all AI requests flow directly from your browser to the Anthropic API,
        no model data ever touches farish's own servers.
      </p>
    </v-card>

    <!-- Credential Privacy -->
    <v-card variant="outlined" class="mb-6 pa-6" data-testid="about-privacy">
      <div class="d-flex align-center ga-3 mb-4">
        <v-icon icon="mdi-lock-outline" color="primary" size="28" />
        <h2 class="text-h5 font-weight-bold">Your keys stay on your device</h2>
      </div>
      <p class="text-body-1 mb-3">
        Your Claude API key or OAuth token is stored in your browser's localStorage
        and is never transmitted to farish servers. All AI requests go directly from
        your browser to the Anthropic API.
      </p>
      <p class="text-body-1 mb-5">
        You can inspect exactly what is stored by opening your browser's DevTools →
        Application → Local Storage. farish stores only what it needs and never
        calls home with your credentials.
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
