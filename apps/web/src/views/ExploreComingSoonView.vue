<script setup lang="ts">
/**
 * ExploreComingSoonView — the Explore page (Coming Soon).
 *
 * Step 31: ghost wireframe updated to match docs/pages/explore/wireframes/page.ascii.md
 * The ghost shows the full Explore layout (SearchBar, ControlsRow, FilterPanel sidebar,
 * ModelGrid) rendered with mock data behind the ComingSoon overlay.
 *
 * Spec: docs/pages/explore/SPEC.md
 * Tag: backend — ships as Coming Soon until the shared backend is built.
 * Route: /explore
 */
import ComingSoon from '../components/ComingSoon.vue';
import GhostModelGrid from '../components/GhostModelGrid.vue';
</script>

<template>
  <ComingSoon
    target-page-name="Explore"
    note="The community model gallery needs a shared backend. The preview behind this card is the intended Explore layout, rendered with mock data."
    data-testid="explore-coming-soon"
  >
    <!-- Ghost wireframe: full Explore layout -->
    <v-container>
      <!-- Search Bar -->
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        label="Search models..."
        variant="outlined"
        density="comfortable"
        hide-details
        class="mb-3"
        clearable
        data-testid="ghost-search-bar"
      />

      <!-- Controls Row: Sort + active filter chips -->
      <div class="d-flex align-center ga-2 mb-4" data-testid="ghost-controls-row">
        <v-select
          label="Sort"
          :items="['Newest', 'Most Rated', 'Most Viewed']"
          model-value="Newest"
          variant="outlined"
          density="compact"
          hide-details
          style="max-width: 140px;"
        />
        <v-chip closable size="small">geometric</v-chip>
        <v-chip closable size="small">abstract</v-chip>
      </div>

      <v-row no-gutters>
        <!-- Filter Panel sidebar -->
        <v-col cols="2" class="pr-4" data-testid="ghost-filter-panel">
          <p class="text-caption text-medium-emphasis mb-2">Categories</p>
          <v-checkbox label="Geometric" model-value="true" density="compact" hide-details />
          <v-checkbox label="Abstract" model-value="true" density="compact" hide-details />
          <v-checkbox label="Organic" density="compact" hide-details />
          <v-checkbox label="Architectural" density="compact" hide-details />

          <p class="text-caption text-medium-emphasis mt-3 mb-2">Style</p>
          <v-radio-group density="compact" hide-details>
            <v-radio label="Realistic" />
            <v-radio label="Stylized" />
            <v-radio label="Low-poly" />
          </v-radio-group>

          <v-btn size="small" variant="outlined" block class="mt-3">Apply</v-btn>
        </v-col>

        <!-- Model Grid -->
        <v-col cols="10">
          <GhostModelGrid />
        </v-col>
      </v-row>
    </v-container>
  </ComingSoon>
</template>
