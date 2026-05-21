<script setup lang="ts">
/**
 * ModelDetailView — the farish Model Detail page stub.
 *
 * Step 30: skeleton rendering the major layout regions defined in the spec:
 * - 3D Viewer (interactive canvas)
 * - Info Panel (prompt, parameters, metadata, author)
 * - Action Bar (Download, Save, Rate, Share, Generate Similar)
 *
 * Spec: docs/pages/model-detail/SPEC.md
 * Tag: browser-only (viewer); social actions are backend (partial).
 * Route: /m/:modelId
 *
 * Step 31 will fill in the full wireframe-matching design.
 */
import { useRoute } from 'vue-router';

const route = useRoute();
const modelId = route.params['modelId'] as string;
</script>

<template>
  <v-container data-testid="model-detail-view">
    <h1 class="text-h4 mb-2">Model Detail</h1>
    <p class="text-caption text-medium-emphasis mb-6">Model ID: {{ modelId }}</p>

    <v-row>
      <!-- 3D Viewer -->
      <v-col cols="12" md="8">
        <v-card
          variant="outlined"
          class="pa-4 text-center"
          style="min-height: 360px;"
          data-testid="model-detail-viewer"
        >
          <v-icon icon="mdi-cube-outline" size="64" color="primary" class="mt-8" />
          <p class="text-body-2 text-medium-emphasis mt-2">3D viewer canvas will appear here.</p>
        </v-card>

        <!-- Action Bar -->
        <div class="d-flex ga-2 mt-3" data-testid="model-detail-actions">
          <v-btn variant="outlined" prepend-icon="mdi-download" disabled>Download</v-btn>
          <v-btn variant="outlined" prepend-icon="mdi-content-save-outline" disabled>Save</v-btn>
          <v-btn variant="outlined" prepend-icon="mdi-star-outline" disabled>Rate</v-btn>
          <v-btn variant="outlined" prepend-icon="mdi-share-variant-outline" disabled>Share</v-btn>
          <v-btn variant="outlined" prepend-icon="mdi-refresh" to="/generate">Generate Similar</v-btn>
        </div>
      </v-col>

      <!-- Info Panel -->
      <v-col cols="12" md="4">
        <v-card variant="outlined" class="pa-4" data-testid="model-detail-info">
          <h2 class="text-subtitle-1 mb-3">Model Info</h2>
          <p class="text-body-2 text-medium-emphasis mb-1">
            <strong>Prompt:</strong> Model prompt will appear here.
          </p>
          <p class="text-body-2 text-medium-emphasis mb-1">
            <strong>Parameters:</strong> Generation parameters will appear here.
          </p>
          <p class="text-body-2 text-medium-emphasis mb-1">
            <strong>Author:</strong> Author info will appear here.
          </p>
          <p class="text-body-2 text-medium-emphasis">
            <strong>Created:</strong> Date will appear here.
          </p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
