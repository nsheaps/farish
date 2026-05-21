<script setup lang="ts">
/**
 * ProfileComingSoonView — the Profile page (Coming Soon).
 *
 * Step 31: ghost wireframe updated to match docs/pages/profile/wireframes/page.ascii.md
 * The ghost shows: ProfileHeader (avatar, name, @handle, stats row),
 * ModelGrid of the user's shared models.
 *
 * Spec: docs/pages/profile/SPEC.md
 * Tag: backend — ships as Coming Soon until the shared backend is built.
 * Route: /u/:username
 */
import { useRoute } from 'vue-router';
import ComingSoon from '../components/ComingSoon.vue';
import GhostModelGrid from '../components/GhostModelGrid.vue';

const route = useRoute();
const username = (route.params['username'] as string) || 'alice';
</script>

<template>
  <ComingSoon
    target-page-name="Profile"
    note="Public profiles need a shared backend and user account system. The preview behind this card shows the intended layout."
    data-testid="profile-coming-soon"
  >
    <!-- Ghost wireframe: full Profile layout -->
    <v-container>
      <!-- Profile Header (VCard banner) -->
      <v-card variant="outlined" class="mb-6 pa-6" data-testid="ghost-profile-header">
        <div class="d-flex align-center ga-4">
          <!-- Avatar -->
          <v-avatar color="primary" size="72">
            <v-icon icon="mdi-account" size="40" />
          </v-avatar>

          <!-- Name + handle -->
          <div class="flex-grow-1">
            <h1 class="text-h5 font-weight-bold">{{ username }}</h1>
            <p class="text-body-2 text-medium-emphasis">@{{ username }}</p>
            <p class="text-caption text-medium-emphasis">Joined January 2025</p>
          </div>

          <!-- Stats Row -->
          <div class="d-flex ga-3">
            <v-card variant="tonal" class="pa-3 text-center" min-width="70">
              <p class="text-h6 font-weight-bold mb-0">42</p>
              <p class="text-caption text-medium-emphasis">models</p>
            </v-card>
            <v-card variant="tonal" class="pa-3 text-center" min-width="70">
              <p class="text-h6 font-weight-bold mb-0">4.8★</p>
              <p class="text-caption text-medium-emphasis">avg</p>
            </v-card>
            <v-card variant="tonal" class="pa-3 text-center" min-width="70">
              <p class="text-h6 font-weight-bold mb-0">12.3k</p>
              <p class="text-caption text-medium-emphasis">views</p>
            </v-card>
          </div>
        </div>
      </v-card>

      <!-- Model Grid — user's public models -->
      <GhostModelGrid />
    </v-container>
  </ComingSoon>
</template>
