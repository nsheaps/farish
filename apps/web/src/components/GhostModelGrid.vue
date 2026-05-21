<script setup lang="ts">
/**
 * GhostModelGrid — a mock-data model gallery.
 *
 * Worked example of ghost-wireframe content for the Coming Soon mechanism.
 * It renders the Explore page's responsive ModelCard grid populated entirely
 * by `@farish/mock-data` (lorem-ipsum titles, offline placeholder thumbnails)
 * — no backend, no network. Placed behind the ComingSoon overlay it makes the
 * future Explore page tangible.
 */
import { mockModelSummaries } from '@farish/mock-data';

/** Eight deterministic mock models for the ghost grid. */
const models = mockModelSummaries(8);
</script>

<template>
  <v-container data-testid="ghost-model-grid">
    <v-text-field
      prepend-inner-icon="mdi-magnify"
      label="Search models..."
      variant="outlined"
      density="comfortable"
      hide-details
      class="mb-4"
    />
    <v-row>
      <v-col
        v-for="model in models"
        :key="model.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-img :src="model.thumbnailUrl" :alt="model.title" aspect-ratio="1.33" cover />
          <v-card-title class="text-body-1">{{ model.title }}</v-card-title>
          <v-card-subtitle>@{{ model.author }}</v-card-subtitle>
          <v-card-text class="d-flex align-center justify-space-between">
            <v-rating
              :model-value="model.rating"
              color="amber"
              density="compact"
              size="small"
              half-increments
              readonly
            />
            <span class="text-caption">{{ model.views }} views</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
