<script setup lang="ts">
/**
 * ComingSoonView — the direct /coming-soon fallback route.
 *
 * Step 30: system page. Provides a direct route to the Coming Soon placeholder
 * when accessed by URL (e.g., navigated to explicitly). Backend-dependent pages
 * render the Coming Soon mechanism at their own routes; this is the standalone
 * entry point.
 *
 * Spec: docs/pages/coming-soon/SPEC.md
 * Tag: system — no data dependency.
 * Route: /coming-soon
 */
import ComingSoon from '../components/ComingSoon.vue';
</script>

<template>
  <ComingSoon
    target-page-name="This page"
    note="This feature needs a shared backend that is not built yet. The preview behind this card shows the intended design."
    data-testid="coming-soon-view"
  >
    <!-- Generic ghost wireframe for the direct route -->
    <v-container class="text-center py-16">
      <v-icon icon="mdi-cube-outline" size="64" color="medium-emphasis" class="mb-4" />
      <p class="text-h6 text-medium-emphasis">Feature coming soon</p>
    </v-container>
  </ComingSoon>
</template>
