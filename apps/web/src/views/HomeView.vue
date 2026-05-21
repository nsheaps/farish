<script setup lang="ts">
/**
 * HomeView — the farish Home page.
 *
 * Step 31: layout matched to the wireframe in docs/pages/home/wireframes/page.ascii.md
 * - Hero section: headline, tagline, Start Generating CTA, secondary Explore/Leaderboards links
 * - Trending Strip: horizontally-scrollable row of ModelCards (mock data; degrades gracefully)
 *
 * Spec: docs/pages/home/SPEC.md
 * Tag: static — no backend required; trending strip is backend-enhanced only.
 */
import { mockModelSummaries } from '@farish/mock-data';

/** Five mock models for the trending strip. */
const trendingModels = mockModelSummaries(5);
</script>

<template>
  <v-container data-testid="home-view">
    <!-- Hero Section -->
    <section class="text-center py-16" data-testid="home-hero">
      <h1 class="text-h3 font-weight-bold mb-4">AI-generated 3D models, instantly.</h1>
      <p class="text-body-1 text-medium-emphasis mb-8">
        farish turns your words into interactive 3D geometry — no modelling skills needed.
      </p>
      <v-btn
        color="primary"
        size="large"
        variant="flat"
        prepend-icon="mdi-play"
        to="/generate"
        data-testid="home-generate-cta"
        class="mb-6"
      >
        Start Generating
      </v-btn>

      <div class="d-flex justify-center ga-4 text-medium-emphasis">
        <RouterLink to="/explore" class="text-decoration-none">
          Explore community →
        </RouterLink>
        <RouterLink to="/leaderboards" class="text-decoration-none">
          Leaderboards →
        </RouterLink>
      </div>
    </section>

    <v-divider class="mb-8" />

    <!-- Trending Strip — degrades gracefully when backend is absent -->
    <section data-testid="home-trending-strip">
      <h2 class="text-h6 mb-4">Trending Models</h2>

      <!-- Horizontal scroll row of ModelCards -->
      <div
        class="d-flex ga-4 overflow-x-auto pb-2"
        style="scroll-snap-type: x mandatory;"
      >
        <v-card
          v-for="model in trendingModels"
          :key="model.id"
          :to="`/m/${model.id}`"
          min-width="200"
          max-width="220"
          style="scroll-snap-align: start; flex-shrink: 0;"
          data-testid="home-trending-card"
        >
          <v-img
            :src="model.thumbnailUrl"
            :alt="model.title"
            aspect-ratio="1.777"
            cover
          />
          <v-card-title class="text-body-2 pb-0">{{ model.title }}</v-card-title>
          <v-card-subtitle>@{{ model.author }}</v-card-subtitle>
        </v-card>
      </div>
    </section>
  </v-container>
</template>
