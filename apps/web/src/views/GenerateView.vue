<script setup lang="ts">
/**
 * GenerateView — the farish Generate page stub.
 *
 * Step 30: skeleton rendering the major layout regions defined in the spec:
 * - No-key banner (shown when no API key is configured)
 * - Prompt Bar
 * - Parameters Panel (collapsible sidebar)
 * - Live Progress area
 * - Result View area
 *
 * Spec: docs/pages/generate/SPEC.md
 * Tag: browser-only — all AI calls originate from the client.
 *
 * Step 31 will fill in the full wireframe-matching design.
 */
</script>

<template>
  <v-container data-testid="generate-view">
    <h1 class="text-h4 mb-2">Generate</h1>

    <!-- No-key banner: shown when no API key is configured -->
    <v-alert
      type="info"
      variant="tonal"
      class="mb-6"
      data-testid="generate-no-key-banner"
    >
      No API key connected. <RouterLink to="/settings?return=/generate">Connect one in Settings</RouterLink> to start generating.
    </v-alert>

    <!-- Generation Workspace -->
    <v-row data-testid="generate-workspace">
      <!-- Parameters Panel — collapsible sidebar -->
      <v-col cols="12" md="3" data-testid="generate-params-panel">
        <v-card variant="outlined" class="pa-4">
          <h2 class="text-subtitle-1 mb-2">Parameters</h2>
          <p class="text-body-2 text-medium-emphasis">
            Model parameters will appear here.
          </p>
        </v-card>
      </v-col>

      <!-- Main area: Prompt + Progress + Result -->
      <v-col cols="12" md="9">
        <!-- Prompt Bar -->
        <div class="mb-4" data-testid="generate-prompt-bar">
          <v-textarea
            label="Describe your 3D model…"
            variant="outlined"
            rows="3"
            hide-details
            class="mb-2"
          />
          <v-btn color="primary" variant="flat" disabled>Generate</v-btn>
        </div>

        <!-- Live Progress area -->
        <v-card
          variant="outlined"
          class="mb-4 pa-4 text-center text-medium-emphasis"
          data-testid="generate-progress"
        >
          <p class="text-body-2">Live generation progress will appear here.</p>
        </v-card>

        <!-- Result View area -->
        <v-card
          variant="outlined"
          class="pa-4 text-center text-medium-emphasis"
          data-testid="generate-result"
        >
          <p class="text-body-2">3D viewer and download/save/share actions will appear here.</p>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
