<script setup lang="ts">
/**
 * MyLibraryView — the farish My Library page stub.
 *
 * Step 30: skeleton rendering the major layout regions defined in the spec:
 * - Library Header (title, sort selector, Clear All button)
 * - Model Grid (LibraryModelCard per saved model)
 * - Empty State (illustration + Generate CTA)
 *
 * Spec: docs/pages/my-library/SPEC.md
 * Tag: browser-only — reads and writes only to browser local storage.
 * Route: /library
 *
 * Step 31 will fill in the full wireframe-matching design.
 */
</script>

<template>
  <v-container data-testid="my-library-view">
    <!-- Library Header -->
    <div class="d-flex align-center justify-space-between mb-6" data-testid="library-header">
      <h1 class="text-h4">My Library</h1>
      <div class="d-flex align-center ga-2">
        <v-select
          label="Sort by"
          variant="outlined"
          density="compact"
          hide-details
          style="min-width: 140px;"
          :items="['Newest', 'Oldest', 'Name']"
        />
        <v-btn variant="outlined" color="error" disabled>Clear All</v-btn>
      </div>
    </div>

    <!-- Empty State — shown when no models are saved -->
    <div class="text-center py-16" data-testid="library-empty-state">
      <v-icon icon="mdi-cube-outline" size="64" color="medium-emphasis" class="mb-4" />
      <h2 class="text-h6 mb-2">No saved models yet</h2>
      <p class="text-body-2 text-medium-emphasis mb-6">
        Models you generate and save will appear here — stored locally in your browser.
      </p>
      <v-btn color="primary" variant="flat" to="/generate">Start Generating</v-btn>
    </div>

    <!-- Model Grid — will replace the empty state when models exist -->
    <!-- Step 31 will wire this to local storage -->
    <v-row data-testid="library-grid" style="display: none;" />
  </v-container>
</template>
