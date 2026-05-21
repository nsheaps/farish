<script setup lang="ts">
/**
 * ExploreComingSoonView — the worked Coming Soon example.
 *
 * Composes the reusable `ComingSoon` mechanism with `GhostModelGrid` content.
 * Explore is backend-dependent (see docs/pages/explore/SPEC.md); until the
 * shared backend exists it ships as a Coming Soon page whose ghost wireframe
 * is the future Explore gallery rendered with mock data.
 *
 * One worked example is enough for the step-26 skeleton — the other
 * backend-gated pages reuse the same `ComingSoon` component in later steps.
 */
import ComingSoon from '../components/ComingSoon.vue';
import GhostModelGrid from '../components/GhostModelGrid.vue';
</script>

<template>
  <ComingSoon
    target-page-name="Explore"
    note="The community model gallery needs a shared backend. The preview behind this card is the intended Explore layout, rendered with mock data."
  >
    <GhostModelGrid />
  </ComingSoon>
</template>
