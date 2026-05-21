<script setup lang="ts">
/**
 * ComingSoonView — the direct /coming-soon fallback route.
 *
 * Step 31: generic Coming Soon page for the direct URL route.
 * Shows the ComingSoon overlay with a generic ghost wireframe
 * (a model card grid to give a sense of what the site will look like).
 *
 * Spec: docs/pages/coming-soon/SPEC.md
 * Tag: system — no data dependency.
 * Route: /coming-soon
 */
import ComingSoon from '../components/ComingSoon.vue';
import GhostModelGrid from '../components/GhostModelGrid.vue';
</script>

<template>
  <ComingSoon
    target-page-name="This page"
    note="This feature needs a shared backend that is not built yet. The preview behind this card shows the intended design."
    data-testid="coming-soon-view"
  >
    <!-- Generic ghost wireframe for the direct route — shows a model gallery -->
    <v-container>
      <v-text-field
        prepend-inner-icon="mdi-magnify"
        label="Search models..."
        variant="outlined"
        density="comfortable"
        hide-details
        class="mb-4"
      />
      <GhostModelGrid />
    </v-container>
  </ComingSoon>
</template>
