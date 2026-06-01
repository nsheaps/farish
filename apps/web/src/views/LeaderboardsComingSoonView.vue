<script setup lang="ts">
/**
 * LeaderboardsComingSoonView — the Leaderboards page (Coming Soon).
 *
 * Step 32: ghost entries populated from @farish/mock-data with realistic
 * ratings and view counts.
 *
 * Ghost wireframe shows: Board Tabs, Time Bucket Selector, Ranked Model List.
 *
 * Spec: docs/pages/leaderboards/SPEC.md
 * Tag: backend — ships as Coming Soon until the shared backend is built.
 * Route: /leaderboards
 */
import ComingSoon from '../components/ComingSoon.vue';
import { mockModelSummaries } from '@farish/mock-data';

const ghostModels = mockModelSummaries(10, 99);

// Compute display ratings descending so #1 has highest
const ghostEntries = ghostModels.map((m, i) => ({
  rank: i + 1,
  title: m.title,
  author: m.author,
  thumbnailUrl: m.thumbnailUrl,
  rating: (5.0 - i * 0.04).toFixed(2),
  views: m.views,
  medal: i < 3,
  medalColor:
    i === 0
      ? 'amber-darken-2'
      : i === 1
        ? 'grey-lighten-1'
        : i === 2
          ? 'brown-lighten-2'
          : 'surface-variant',
}));
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
          :data-testid="`ghost-rank-${entry.rank}`"
        >
          <template #prepend>
            <v-avatar
              :color="entry.medalColor"
              size="40"
              class="mr-3 text-body-2 font-weight-bold"
            >
              #{{ entry.rank }}
            </v-avatar>
          </template>

          <v-list-item-title class="text-body-2 font-weight-medium">
            {{ entry.title }}
          </v-list-item-title>
          <v-list-item-subtitle class="text-caption">
            @{{ entry.author }}
          </v-list-item-subtitle>

          <template #append>
            <div class="text-right">
              <div class="d-flex align-center ga-1 text-caption text-amber-darken-2">
                <v-icon icon="mdi-star" size="14" />
                <span class="font-weight-medium">{{ entry.rating }}</span>
              </div>
              <div class="text-caption text-medium-emphasis">
                {{ entry.views.toLocaleString() }} views
              </div>
            </div>
          </template>
        </v-list-item>
      </v-list>
    </v-container>
  </ComingSoon>
</template>
