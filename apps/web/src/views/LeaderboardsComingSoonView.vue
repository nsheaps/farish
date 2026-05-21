<script setup lang="ts">
/**
 * LeaderboardsComingSoonView — the Leaderboards page stub.
 *
 * Step 30: backend-dependent page (tag: backend). Ships as a Coming Soon
 * overlay using the reusable ComingSoon component. The ghost wireframe
 * shows the intended Leaderboards layout rendered with skeleton content.
 *
 * Spec: docs/pages/leaderboards/SPEC.md
 * Route: /leaderboards
 *
 * Step 31 will fill the ghost wireframe with the proper layout.
 */
import ComingSoon from '../components/ComingSoon.vue';
</script>

<template>
  <ComingSoon
    target-page-name="Leaderboards"
    note="The leaderboards need a shared backend to track ratings, views, and rankings. The preview behind this card shows the intended layout."
    data-testid="leaderboards-coming-soon"
  >
    <!-- Ghost wireframe: skeleton of the Leaderboards layout -->
    <v-container>
      <!-- Board Tabs: Best Rated · Most Rated · Most Viewed -->
      <v-tabs class="mb-4">
        <v-tab>Best Rated</v-tab>
        <v-tab>Most Rated</v-tab>
        <v-tab>Most Viewed</v-tab>
      </v-tabs>

      <!-- Time Bucket Selector -->
      <div class="d-flex ga-2 mb-6">
        <v-chip>1W</v-chip>
        <v-chip>1M</v-chip>
        <v-chip>1Y</v-chip>
        <v-chip variant="flat" color="primary">All</v-chip>
      </div>

      <!-- Ranked Model List skeleton -->
      <v-list>
        <v-list-item v-for="i in 5" :key="i" :title="`Model ${i}`" :subtitle="`@author · ${i * 100} views`">
          <template #prepend>
            <v-avatar color="primary" rounded="lg">{{ i }}</v-avatar>
          </template>
        </v-list-item>
      </v-list>
    </v-container>
  </ComingSoon>
</template>
