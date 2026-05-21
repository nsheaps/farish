<script setup lang="ts">
/**
 * MyLibraryView — the farish My Library page.
 *
 * Step 31: layout matched to the wireframe in docs/pages/my-library/wireframes/page.ascii.md
 * - Library Header: title, sort selector, Clear All button
 * - Model Grid (VRow/VCol md=4 lg=3) with LibraryModelCard + actions VMenu
 * - Empty State when no models
 *
 * Spec: docs/pages/my-library/SPEC.md
 * Tag: browser-only — reads/writes only to browser local storage.
 * Route: /library
 */
import { ref, computed } from 'vue';
import { mockModelSummaries } from '@farish/mock-data';

/** Placeholder library models for step 31 (step 34 will wire to real localStorage). */
const models = ref(mockModelSummaries(6));

const sortOptions = [
  { title: 'Newest first', value: 'newest' },
  { title: 'Oldest first', value: 'oldest' },
  { title: 'Name (A–Z)', value: 'name' },
];
const selectedSort = ref('newest');

const hasModels = computed(() => models.value.length > 0);

/** Track which card's menu is open */
const menuOpen = ref<Record<string, boolean>>({});

function openMenu(id: string) {
  menuOpen.value = { [id]: true };
}
</script>

<template>
  <v-container data-testid="my-library-view">

    <!-- Library Header -->
    <v-toolbar flat class="mb-6 px-0" data-testid="library-header">
      <h1 class="text-h4">My Library</h1>
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
          class="mr-2"
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
    </v-toolbar>

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
        <!-- LibraryModelCard (VCard with VMenu actions) -->
        <v-card data-testid="library-model-card">
          <v-img
            :src="model.thumbnailUrl"
            :alt="model.title"
            aspect-ratio="1.33"
            cover
          />
          <v-card-title class="text-body-1 pb-0">{{ model.title }}</v-card-title>
          <v-card-subtitle class="text-caption">Jan 12, 2026</v-card-subtitle>

          <v-card-actions class="justify-end">
            <!-- Actions menu -->
            <v-menu :model-value="!!menuOpen[model.id]" @update:model-value="v => menuOpen[model.id] = v">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-dots-horizontal"
                  variant="text"
                  density="compact"
                  aria-label="Actions"
                  data-testid="library-card-actions-btn"
                  @click="openMenu(model.id)"
                />
              </template>
              <v-list density="compact">
                <v-list-item
                  prepend-icon="mdi-eye"
                  :to="`/m/${model.id}`"
                  title="View"
                  data-testid="library-card-view"
                />
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
        Generate your first model to get started.
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
