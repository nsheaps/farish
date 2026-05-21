<script setup lang="ts">
/**
 * GhostModelGrid — a mock-data model gallery.
 *
 * Step 32: cards updated to use variant="outlined" for consistency with the
 * rest of the app; ratings and view counts formatted with toLocaleString;
 * search bar removed (it belongs in the parent page layout, not the grid).
 *
 * Worked example of ghost-wireframe content for the Coming Soon mechanism.
 * Renders the Explore page's responsive ModelCard grid populated entirely by
 * `@farish/mock-data` — no backend, no network.
 */
import { mockModelSummaries } from '@farish/mock-data';

/** Eight deterministic mock models for the ghost grid. */
const models = mockModelSummaries(8, 13);
</script>

<template>
  <div data-testid="ghost-model-grid">
    <v-row>
      <v-col
        v-for="model in models"
        :key="model.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card variant="outlined">
          <v-img :src="model.thumbnailUrl" :alt="model.title" aspect-ratio="1.33" cover />
          <v-card-title class="text-body-1 pb-1 pt-3">{{ model.title }}</v-card-title>
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
      </v-col>
    </v-row>
  </div>
</template>
