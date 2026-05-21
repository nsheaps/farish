<script setup lang="ts">
/**
 * ProfileComingSoonView — the Profile page stub.
 *
 * Step 30: backend-dependent page (tag: backend). Ships as a Coming Soon
 * overlay using the reusable ComingSoon component. The ghost wireframe
 * shows the intended Profile layout rendered with skeleton content.
 *
 * Spec: docs/pages/profile/SPEC.md
 * Route: /u/:username
 *
 * Step 31 will fill the ghost wireframe with the proper layout.
 */
import { useRoute } from 'vue-router';
import ComingSoon from '../components/ComingSoon.vue';
import GhostModelGrid from '../components/GhostModelGrid.vue';

const route = useRoute();
const username = route.params['username'] as string;
</script>

<template>
  <ComingSoon
    target-page-name="Profile"
    note="Public profiles need a shared backend and user account system. The preview behind this card shows the intended layout."
    data-testid="profile-coming-soon"
  >
    <!-- Ghost wireframe: skeleton of the Profile layout -->
    <v-container>
      <!-- Profile Header -->
      <div class="d-flex align-center ga-4 mb-6" data-testid="profile-header">
        <v-avatar color="primary" size="72">
          <v-icon icon="mdi-account" size="40" />
        </v-avatar>
        <div>
          <h1 class="text-h5">{{ username || 'username' }}</h1>
          <p class="text-body-2 text-medium-emphasis">Member · 0 models shared</p>
        </div>
      </div>

      <!-- Model Grid -->
      <GhostModelGrid />
    </v-container>
  </ComingSoon>
</template>
