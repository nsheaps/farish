<script setup lang="ts">
/**
 * ModelDetailView — the farish Model Detail page.
 *
 * Step 32: populated with mock data from @farish/mock-data so the page
 * renders fully without a real backend.
 *
 * Layout:
 * - Left (~65%): 3D Viewer area (placeholder canvas) + ViewerControls overlay + ActionBar
 * - Right (~35%): PromptDisplay, ParamsDisplay (collapsible), MetadataPanel
 * - ComingSoonOverlay: dismissible overlay for Rate and Share (backend-gated)
 *
 * Spec: docs/pages/model-detail/SPEC.md
 * Tags: browser-only (viewer), backend (social actions).
 * Route: /m/:modelId
 */
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { mockModelDetail } from '@farish/mock-data';

const route = useRoute();
const modelId = (route.params['modelId'] as string) || 'mock-detail-1';

/** Rich mock model data derived deterministically from the model ID. */
const model = computed(() => mockModelDetail(modelId));

/** Format an ISO date string as a human-readable date. */
function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/** Which social action triggered the coming-soon overlay: 'rating' | 'sharing' | null */
const comingSoonAction = ref<'rating' | 'sharing' | null>(null);

function openComingSoon(action: 'rating' | 'sharing') {
  comingSoonAction.value = action;
}
function dismissComingSoon() {
  comingSoonAction.value = null;
}
</script>

<template>
  <div data-testid="model-detail-view" style="position: relative;">

    <!-- Main Layout: 65/35 split -->
    <v-row no-gutters>

      <!-- Left: 3D Viewer + Action Bar (~65%) -->
      <v-col cols="12" md="8">

        <!-- 3D Viewer Area -->
        <v-card
          variant="flat"
          class="rounded-0"
          style="min-height: 480px; position: relative;"
          data-testid="model-detail-viewer"
        >
          <!-- Viewer canvas placeholder — uses mock thumbnail for visual context -->
          <v-img
            :src="model.thumbnailUrl"
            :alt="model.title"
            height="480"
            cover
          >
            <template #placeholder>
              <v-sheet
                color="surface-variant"
                height="480"
                class="d-flex align-center justify-center"
              >
                <v-icon icon="mdi-cube-outline" size="80" color="primary" />
              </v-sheet>
            </template>
            <!-- Overlay label -->
            <div
              class="d-flex align-center justify-center"
              style="position: absolute; inset: 0; background: rgba(0,0,0,0.35);"
            >
              <div class="text-center text-white">
                <v-icon icon="mdi-cube-outline" size="64" class="mb-2 opacity-80" />
                <p class="text-body-2">Interactive 3D viewer</p>
                <p class="text-caption opacity-70">orbit · pan · zoom (coming in step 34)</p>
              </div>
            </div>
          </v-img>

          <!-- Viewer Controls (overlaid VBtn group) -->
          <div
            style="position: absolute; bottom: 12px; left: 12px;"
            data-testid="model-detail-viewer-controls"
          >
            <v-btn-group variant="tonal" density="compact">
              <v-btn icon="mdi-rotate-3d" aria-label="Reset view" title="Reset" />
              <v-btn icon="mdi-fullscreen" aria-label="Fullscreen" title="Fullscreen" />
              <v-btn icon="mdi-lightbulb-outline" aria-label="Toggle lights" title="Lights" />
            </v-btn-group>
          </div>
        </v-card>

        <!-- Action Bar -->
        <v-toolbar
          flat
          color="surface-variant"
          class="px-4 border-t"
          data-testid="model-detail-actions"
        >
          <v-btn
            prepend-icon="mdi-download"
            variant="outlined"
            size="small"
            class="mr-1"
            data-testid="model-detail-download"
          >
            Download
          </v-btn>
          <v-btn
            prepend-icon="mdi-content-save-outline"
            variant="outlined"
            size="small"
            class="mr-1"
            data-testid="model-detail-save"
          >
            Save
          </v-btn>
          <v-btn
            prepend-icon="mdi-star-outline"
            variant="outlined"
            size="small"
            class="mr-1"
            data-testid="model-detail-rate"
            @click="openComingSoon('rating')"
          >
            Rate
          </v-btn>
          <v-btn
            prepend-icon="mdi-share-variant-outline"
            variant="outlined"
            size="small"
            class="mr-1"
            data-testid="model-detail-share"
            @click="openComingSoon('sharing')"
          >
            Share
          </v-btn>
          <v-btn
            prepend-icon="mdi-lightning-bolt"
            variant="outlined"
            size="small"
            to="/generate"
            data-testid="model-detail-generate-similar"
          >
            Generate Similar
          </v-btn>
        </v-toolbar>
      </v-col>

      <!-- Right: Info Panel (~35%) -->
      <v-col cols="12" md="4">
        <div class="pa-4" data-testid="model-detail-info">

          <!-- Model Title -->
          <h1 class="text-h5 font-weight-bold mb-4">{{ model.title }}</h1>

          <!-- Prompt Display -->
          <v-card variant="outlined" class="mb-4 pa-4" data-testid="model-detail-prompt">
            <p class="text-caption text-medium-emphasis text-overline mb-2">Prompt</p>
            <p class="text-body-2">
              "{{ model.prompt }}"
            </p>
          </v-card>

          <!-- Generation Parameters (collapsible) -->
          <v-expansion-panels variant="accordion" class="mb-4" data-testid="model-detail-params">
            <v-expansion-panel title="Generation Parameters">
              <v-expansion-panel-text>
                <v-list density="compact">
                  <v-list-item :title="`${model.resolution}%`" subtitle="Resolution" />
                  <v-list-item :title="model.style" subtitle="Style" />
                  <v-list-item :title="`${model.complexity}%`" subtitle="Complexity" />
                </v-list>
              </v-expansion-panel-text>
            </v-expansion-panel>
          </v-expansion-panels>

          <!-- Metadata Panel -->
          <v-card variant="outlined" class="pa-4" data-testid="model-detail-metadata">
            <p class="text-caption text-medium-emphasis text-overline mb-3">Metadata</p>
            <v-list density="compact">
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-account-circle-outline" size="20" class="mr-2" />
                </template>
                <v-list-item-title class="text-body-2">
                  Author: <RouterLink :to="`/u/${model.author}`" class="text-primary text-decoration-none">@{{ model.author }}</RouterLink>
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-calendar-outline" size="20" class="mr-2" />
                </template>
                <v-list-item-title class="text-body-2">
                  Created: {{ formatDate(model.createdAt) }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-eye-outline" size="20" class="mr-2" />
                </template>
                <v-list-item-title class="text-body-2">
                  Views: {{ model.views.toLocaleString() }}
                </v-list-item-title>
              </v-list-item>
              <v-list-item>
                <template #prepend>
                  <v-icon icon="mdi-star-outline" size="20" class="mr-2" />
                </template>
                <v-list-item-title class="text-body-2">
                  Rating: {{ model.rating.toFixed(1) }} / 5
                  <span class="text-medium-emphasis">({{ model.ratingCount }} ratings)</span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>

        </div>
      </v-col>
    </v-row>

    <!-- Coming-Soon Overlay (dismissible) for Rate / Share -->
    <v-overlay
      :model-value="comingSoonAction !== null"
      persistent
      no-click-animation
      class="align-center justify-center"
      style="backdrop-filter: blur(4px);"
      data-testid="model-detail-coming-soon-overlay"
    >
      <v-card max-width="400" class="pa-6 text-center">
        <div class="d-flex justify-end">
          <v-btn
            icon="mdi-close"
            variant="text"
            density="compact"
            aria-label="Close"
            data-testid="model-detail-coming-soon-dismiss"
            @click="dismissComingSoon"
          />
        </div>
        <v-icon
          :icon="comingSoonAction === 'rating' ? 'mdi-star-outline' : 'mdi-share-variant-outline'"
          size="48"
          color="primary"
          class="mb-4"
        />
        <h2 class="text-h5 mb-2">
          {{ comingSoonAction === 'rating' ? 'Rating' : 'Sharing' }} is coming soon
        </h2>
        <p class="text-body-2 text-medium-emphasis mb-6">
          This feature requires the shared backend — launching soon.
        </p>
        <v-btn
          variant="text"
          data-testid="model-detail-coming-soon-continue"
          @click="dismissComingSoon"
        >
          ✕ Continue viewing
        </v-btn>
      </v-card>
    </v-overlay>

  </div>
</template>
