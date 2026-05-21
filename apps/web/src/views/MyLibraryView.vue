<script setup lang="ts">
/**
 * MyLibraryView — the farish My Library page.
 *
 * Step 32: enriched with mock data (realistic dates, ratings) from
 * @farish/mock-data so the grid renders fully without a real backend.
 *
 * Layout:
 * - Library Header: title, sort selector, Clear All button
 * - Model Grid (VRow/VCol) with model cards + VMenu actions
 * - Empty State when no models
 *
 * Spec: docs/pages/my-library/SPEC.md
 * Tag: browser-only — reads/writes only to browser local storage.
 * Route: /library
 */
import { ref, computed } from 'vue';
import { mockModelSummaries, mockModelDetail } from '@farish/mock-data';

/** Sample creation dates for mock library entries (most recent first). */
const MOCK_DATES: readonly string[] = [
  'May 20, 2026',
  'May 18, 2026',
  'May 15, 2026',
  'May 10, 2026',
  'May 3, 2026',
  'Apr 28, 2026',
  'Apr 21, 2026',
  'Apr 14, 2026',
];

interface LibraryEntry {
  id: string;
  title: string;
  author: string;
  thumbnailUrl: string;
  rating: number;
  views: number;
  createdLabel: string;
  prompt: string;
}

/** Placeholder library models populated from mock-data. */
const models = ref<LibraryEntry[]>(
  mockModelSummaries(6, 7).map((m, i) => {
    const detail = mockModelDetail(m.id);
    return {
      id: m.id,
      title: m.title,
      author: m.author,
      thumbnailUrl: m.thumbnailUrl,
      rating: m.rating,
      views: m.views,
      createdLabel: MOCK_DATES[i % MOCK_DATES.length] ?? 'May 2026',
      prompt: detail.prompt,
    };
  }),
);

const sortOptions = [
  { title: 'Newest first', value: 'newest' },
  { title: 'Oldest first', value: 'oldest' },
  { title: 'Name (A–Z)', value: 'name' },
];
const selectedSort = ref('newest');

const hasModels = computed(() => models.value.length > 0);

/** Track which card's menu is open */
const menuOpen = ref<Record<string, boolean>>({});

function toggleMenu(id: string, v: boolean) {
  menuOpen.value = v ? { [id]: true } : {};
}
</script>

<template>
  <v-container data-testid="my-library-view">

    <!-- Library Header -->
    <div class="d-flex align-center mb-6" data-testid="library-header">
      <div>
        <h1 class="text-h4 font-weight-bold">My Library</h1>
        <p class="text-body-2 text-medium-emphasis mt-1">
          {{ models.length }} model{{ models.length === 1 ? '' : 's' }} generated on this device
        </p>
      </div>
      <v-spacer />
      <template v-if="hasModels">
        <v-select
          v-model="selectedSort"
          :items="sortOptions"
          item-title="title"
          item-value="value"
          variant="outlined"
          density="compact"
          hide-details
          style="min-width: 160px;"
          class="mr-3"
          data-testid="library-sort"
        />
        <v-btn
          color="error"
          variant="outlined"
          prepend-icon="mdi-trash-can-outline"
          data-testid="library-clear-all"
        >
          Clear All
        </v-btn>
      </template>
    </div>

    <!-- Model Grid -->
    <v-row v-if="hasModels" data-testid="library-grid">
      <v-col
        v-for="model in models"
        :key="model.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card variant="outlined" data-testid="library-model-card">
          <v-img
            :src="model.thumbnailUrl"
            :alt="model.title"
            aspect-ratio="1.33"
            cover
          />
          <v-card-title class="text-body-1 pb-1 pt-3">{{ model.title }}</v-card-title>
          <v-card-subtitle class="pb-0 text-caption">{{ model.createdLabel }}</v-card-subtitle>
          <v-card-text class="pt-2 pb-2">
            <p class="text-caption text-medium-emphasis text-truncate">{{ model.prompt }}</p>
            <div class="d-flex align-center ga-1 mt-1 text-caption text-medium-emphasis">
              <v-icon icon="mdi-star" size="13" color="amber-darken-2" />
              <span>{{ model.rating.toFixed(1) }}</span>
              <span class="mx-1">·</span>
              <v-icon icon="mdi-eye-outline" size="13" />
              <span>{{ model.views.toLocaleString() }}</span>
            </div>
          </v-card-text>

          <v-card-actions class="justify-end pt-0">
            <v-btn
              variant="outlined"
              size="small"
              :to="`/m/${model.id}`"
              prepend-icon="mdi-eye"
              data-testid="library-card-view"
            >
              View
            </v-btn>
            <!-- Actions menu -->
            <v-menu
              :model-value="!!menuOpen[model.id]"
              @update:model-value="(v) => toggleMenu(model.id, v)"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-vertical"
                  variant="text"
                  density="compact"
                  aria-label="More actions"
                  data-testid="library-card-actions-btn"
                />
              </template>
              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-download"
                  title="Download"
                  data-testid="library-card-download"
                />
                <v-divider />
                <v-list-item
                  prepend-icon="mdi-trash-can-outline"
                  title="Delete"
                  class="text-error"
                  data-testid="library-card-delete"
                />
              </v-list>
            </v-menu>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Empty State -->
    <div v-else class="text-center py-16" data-testid="library-empty-state">
      <v-icon icon="mdi-package-variant-closed" size="80" color="medium-emphasis" class="mb-6" />
      <h2 class="text-h5 mb-2">Your library is empty.</h2>
      <p class="text-body-1 text-medium-emphasis mb-8">
        Generate your first model to get started. Your creations are stored
        locally in this browser.
      </p>
      <v-btn
        color="primary"
        size="large"
        variant="flat"
        prepend-icon="mdi-play"
        to="/generate"
        data-testid="library-empty-generate-cta"
      >
        Start Generating
      </v-btn>
    </div>

  </v-container>
</template>
