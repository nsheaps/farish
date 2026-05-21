<script setup lang="ts">
/**
 * ComingSoon — the reusable Coming Soon mechanism.
 *
 * Renders the page's eventual content (passed via the default slot) as a
 * dimmed, blurred "ghost wireframe", then layers a non-dismissible Coming Soon
 * card on top. Backend-dependent pages (Explore, Leaderboards, Profile) use
 * this so the user sees what the page will become before the backend exists.
 *
 * Spec: docs/pages/coming-soon/SPEC.md
 */
import { useRouter } from 'vue-router';

defineProps<{
  /** Human-readable name of the page being previewed, e.g. "Explore". */
  targetPageName: string;
  /** One-sentence explanation shown under the headline. */
  note?: string;
}>();

const router = useRouter();
</script>

<template>
  <div class="coming-soon" data-testid="coming-soon">
    <!-- Ghost wireframe: the real page content, dimmed + blurred. -->
    <div class="coming-soon__ghost" aria-hidden="true" data-testid="ghost-wireframe">
      <slot />
    </div>

    <!-- Coming Soon overlay card — not dismissible. -->
    <v-overlay
      :model-value="true"
      persistent
      no-click-animation
      contained
      class="align-center justify-center"
    >
      <v-card class="coming-soon__card pa-6 text-center" max-width="480">
        <v-icon icon="mdi-rocket-launch-outline" size="56" color="primary" />
        <h2 class="text-h5 mt-4 mb-2">{{ targetPageName }} is coming soon</h2>
        <p class="text-body-2 text-medium-emphasis mb-6">
          {{
            note ??
            'This page needs a shared backend that is not built yet. The preview behind this card shows the intended design.'
          }}
        </p>
        <v-btn color="primary" variant="flat" @click="router.push('/')">
          Back to Home
        </v-btn>
      </v-card>
    </v-overlay>
  </div>
</template>

<style scoped>
.coming-soon {
  position: relative;
  min-height: 60vh;
}

.coming-soon__ghost {
  filter: blur(3px);
  opacity: 0.35;
  pointer-events: none;
  user-select: none;
}
</style>
