<script setup lang="ts">
/**
 * LeaderboardsComingSoonView — the Leaderboards page (Coming Soon).
 *
 * Step 31: ghost wireframe updated to match docs/pages/leaderboards/wireframes/page.ascii.md
 * The ghost shows: Board Tabs (Best Rated / Most Rated / Most Viewed),
 * Time Bucket Selector (1W / 1M / 1Y / All), Ranked Model List.
 *
 * Spec: docs/pages/leaderboards/SPEC.md
 * Tag: backend — ships as Coming Soon until the shared backend is built.
 * Route: /leaderboards
 */
import ComingSoon from '../components/ComingSoon.vue';

const ghostEntries = [
  { rank: 1, title: 'Crystalline Spire', author: '@alice', metric: '★★★★★  4.95', medal: 'mdi-medal' },
  { rank: 2, title: 'Neon Octahedron', author: '@bob', metric: '★★★★★  4.91', medal: 'mdi-medal' },
  { rank: 3, title: 'Organic Flow Sculpture', author: '@carol', metric: '★★★★☆  4.87', medal: 'mdi-medal' },
  { rank: 4, title: 'Low-poly Dragon', author: '@dan', metric: '★★★★☆  4.82', medal: '' },
  { rank: 5, title: 'Tessellated Sphere', author: '@eve', metric: '★★★★☆  4.79', medal: '' },
  { rank: 6, title: 'Brutalist Tower', author: '@frank', metric: '★★★★☆  4.76', medal: '' },
  { rank: 7, title: 'Floating Island', author: '@grace', metric: '★★★★☆  4.74', medal: '' },
];
</script>

<template>
  <ComingSoon
    target-page-name="Leaderboards"
    note="The leaderboards need a shared backend to track ratings, views, and rankings. The preview behind this card shows the intended layout."
    data-testid="leaderboards-coming-soon"
  >
    <!-- Ghost wireframe: full Leaderboards layout -->
    <v-container>
      <!-- Board Tabs -->
      <v-tabs class="mb-2" data-testid="ghost-board-tabs">
        <v-tab value="best-rated">Best Rated</v-tab>
        <v-tab value="most-rated">Most Rated</v-tab>
        <v-tab value="most-viewed">Most Viewed</v-tab>
      </v-tabs>

      <v-divider class="mb-4" />

      <!-- Time Bucket Selector -->
      <v-btn-toggle
        mandatory
        variant="outlined"
        divided
        density="compact"
        class="mb-6"
        data-testid="ghost-time-bucket"
      >
        <v-btn value="1w" size="small">1W</v-btn>
        <v-btn value="1m" size="small">1M</v-btn>
        <v-btn value="1y" size="small">1Y</v-btn>
        <v-btn value="all" size="small" color="primary">All</v-btn>
      </v-btn-toggle>

      <!-- Ranked Model List -->
      <v-list lines="two" data-testid="ghost-ranked-list">
        <v-list-item
          v-for="entry in ghostEntries"
          :key="entry.rank"
        >
          <template #prepend>
            <v-avatar
              :color="entry.rank <= 3 ? (entry.rank === 1 ? 'amber-darken-2' : entry.rank === 2 ? 'grey-lighten-1' : 'brown-lighten-2') : 'surface-variant'"
              size="40"
              class="mr-3 text-body-2 font-weight-bold"
            >
              #{{ entry.rank }}
            </v-avatar>
          </template>
          <v-list-item-title class="text-body-2 font-weight-medium">{{ entry.title }}</v-list-item-title>
          <v-list-item-subtitle class="text-caption">{{ entry.author }}</v-list-item-subtitle>
          <template #append>
            <span class="text-caption text-medium-emphasis">{{ entry.metric }}</span>
          </template>
        </v-list-item>
      </v-list>
    </v-container>
  </ComingSoon>
</template>
