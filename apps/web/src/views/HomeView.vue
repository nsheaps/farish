<script setup lang="ts">
/**
 * HomeView — the farish Home page.
 *
 * Step 32: enriched with mock data (ratings, author names, rich cards) and
 * visual polish (hero gradient, card consistency).
 *
 * Layout:
 * - Hero section: headline, tagline, Start Generating CTA, secondary links
 * - Feature highlights strip
 * - Trending Strip: horizontally-scrollable row of ModelCards (mock data)
 *
 * Spec: docs/pages/home/SPEC.md
 * Tag: static — no backend required; trending strip uses mock data.
 */
import { mockModelSummaries } from '@farish/mock-data';

/** Five mock models for the trending strip. */
const trendingModels = mockModelSummaries(5, 42);
</script>

<template>
  <div data-testid="home-view">

    <!-- Hero Section -->
    <section
      class="text-center py-16 px-4"
      style="background: linear-gradient(135deg, rgb(var(--v-theme-background)) 0%, rgb(91 63 184 / 8%) 100%);"
      data-testid="home-hero"
    >
      <div class="mx-auto" style="max-width: 640px;">
        <v-chip
          color="primary"
          variant="tonal"
          size="small"
          class="mb-4"
          prepend-icon="mdi-cube-outline"
        >
          AI-Powered 3D Generation
        </v-chip>

        <h1 class="text-h3 font-weight-bold mb-4">
          Turn words into<br />interactive 3D models
        </h1>

        <p class="text-body-1 text-medium-emphasis mb-8">
          farish uses the Claude AI SDK to transform your text prompt into exportable 3D geometry —
          no modelling skills, no subscription. Just your idea and an API key.
        </p>

        <v-btn
          color="primary"
          size="large"
          variant="flat"
          prepend-icon="mdi-play"
          to="/generate"
          data-testid="home-generate-cta"
          class="mr-3 mb-3"
        >
          Start Generating
        </v-btn>

        <v-btn
          variant="outlined"
          size="large"
          to="/about"
          class="mb-3"
          data-testid="home-learn-more-btn"
        >
          Learn how it works
        </v-btn>
      </div>
    </section>

    <!-- Feature Highlights -->
    <section class="py-12 px-4" data-testid="home-features">
      <v-container>
        <v-row>
          <v-col cols="12" sm="4">
            <div class="text-center pa-4">
              <v-icon icon="mdi-robot-outline" size="40" color="primary" class="mb-3" />
              <h3 class="text-h6 mb-2">Prompt-driven</h3>
              <p class="text-body-2 text-medium-emphasis">
                Describe what you want in plain language. The AI clarifies
                ambiguous details before generating.
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="text-center pa-4">
              <v-icon icon="mdi-lock-outline" size="40" color="primary" class="mb-3" />
              <h3 class="text-h6 mb-2">Your key, your data</h3>
              <p class="text-body-2 text-medium-emphasis">
                Your Claude API key stays in your browser. Nothing is sent to
                farish servers — all AI calls go directly to Anthropic.
              </p>
            </div>
          </v-col>
          <v-col cols="12" sm="4">
            <div class="text-center pa-4">
              <v-icon icon="mdi-export-variant" size="40" color="primary" class="mb-3" />
              <h3 class="text-h6 mb-2">Export-ready</h3>
              <p class="text-body-2 text-medium-emphasis">
                Download your model as OBJ/GLB for use in Blender, Unity,
                Unreal, or any 3D tool you already use.
              </p>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </section>

    <v-divider />

    <!-- Trending Strip — degrades gracefully when backend is absent -->
    <section class="py-10 px-4" data-testid="home-trending-strip">
      <v-container>
        <div class="d-flex align-center mb-5">
          <h2 class="text-h5 font-weight-bold">Trending Models</h2>
          <v-spacer />
          <v-btn
            variant="text"
            size="small"
            to="/explore"
            append-icon="mdi-arrow-right"
            data-testid="home-explore-link"
          >
            See all
          </v-btn>
        </div>

        <!-- Horizontal scroll row of ModelCards -->
        <div
          class="d-flex ga-4 overflow-x-auto pb-3"
          style="scroll-snap-type: x mandatory;"
          data-testid="home-trending-scroll"
        >
          <v-card
            v-for="model in trendingModels"
            :key="model.id"
            :to="`/m/${model.id}`"
            min-width="220"
            max-width="240"
            variant="outlined"
            style="scroll-snap-align: start; flex-shrink: 0;"
            data-testid="home-trending-card"
          >
            <v-img
              :src="model.thumbnailUrl"
              :alt="model.title"
              aspect-ratio="1.33"
              cover
            />
            <v-card-title class="text-body-2 pb-1 pt-3">{{ model.title }}</v-card-title>
            <v-card-subtitle class="pb-0">@{{ model.author }}</v-card-subtitle>
            <v-card-text class="pt-2 pb-3">
              <div class="d-flex align-center ga-1 text-caption text-medium-emphasis">
                <v-icon icon="mdi-star" size="14" color="amber-darken-2" />
                <span>{{ model.rating.toFixed(1) }}</span>
                <span class="mx-1">·</span>
                <v-icon icon="mdi-eye-outline" size="14" />
                <span>{{ model.views.toLocaleString() }}</span>
              </div>
            </v-card-text>
          </v-card>
        </div>
      </v-container>
    </section>

    <!-- CTA footer strip -->
    <section
      class="py-12 text-center px-4"
      style="background: rgb(var(--v-theme-surface-variant));"
      data-testid="home-cta-strip"
    >
      <h2 class="text-h5 mb-3">Ready to build something?</h2>
      <p class="text-body-1 text-medium-emphasis mb-6">
        Connect your Claude API key in Settings and generate your first model in seconds.
      </p>
      <v-btn
        color="primary"
        size="large"
        variant="flat"
        prepend-icon="mdi-play"
        to="/generate"
        data-testid="home-cta-generate-btn"
      >
        Start Generating
      </v-btn>
    </section>

  </div>
</template>
