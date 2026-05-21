<script setup lang="ts">
/**
 * SettingsView — the farish Settings page stub.
 *
 * Step 30: skeleton rendering the major layout regions defined in the spec:
 * - Connection Section (OAuth button, API key input, status)
 * - Storage Note (credential privacy guarantee)
 * - Preferences (theme toggle, default generation params)
 * - Danger Zone (Clear All Data)
 *
 * Spec: docs/pages/settings/SPEC.md
 * Tag: browser-only — reads/writes only to browser local storage.
 * Route: /settings (accepts ?return= for deep-link back after connect)
 *
 * Step 31 will fill in the full wireframe-matching design.
 */
</script>

<template>
  <v-container data-testid="settings-view" max-width="720">
    <h1 class="text-h4 mb-8">Settings</h1>

    <!-- Connection Section -->
    <section class="mb-8" data-testid="settings-connection">
      <h2 class="text-h6 mb-4">API Connection</h2>
      <v-btn color="primary" variant="flat" class="mb-4" prepend-icon="mdi-account-circle-outline">
        Connect with Claude
      </v-btn>
      <p class="text-body-2 text-medium-emphasis mb-3">Or enter an API key manually:</p>
      <v-text-field
        label="Claude API key"
        variant="outlined"
        density="comfortable"
        type="password"
        hide-details
        class="mb-2"
        style="max-width: 480px;"
      />
      <v-btn variant="outlined" disabled>Save Key</v-btn>
    </section>

    <v-divider class="mb-8" />

    <!-- Storage Note -->
    <section class="mb-8" data-testid="settings-storage-note">
      <h2 class="text-h6 mb-2">Privacy & Storage</h2>
      <p class="text-body-2 text-medium-emphasis">
        Your API key and all generated models are stored only in this browser.
        Nothing leaves your device — no credentials are sent to farish servers.
      </p>
    </section>

    <v-divider class="mb-8" />

    <!-- Preferences -->
    <section class="mb-8" data-testid="settings-preferences">
      <h2 class="text-h6 mb-4">Preferences</h2>
      <v-switch label="Dark mode" hide-details class="mb-2" />
      <p class="text-body-2 text-medium-emphasis">Default generation parameters will appear here.</p>
    </section>

    <v-divider class="mb-8" />

    <!-- Danger Zone -->
    <section data-testid="settings-danger-zone">
      <h2 class="text-h6 mb-2 text-error">Danger Zone</h2>
      <p class="text-body-2 text-medium-emphasis mb-4">
        This will permanently delete all saved models and clear your stored API key.
      </p>
      <v-btn color="error" variant="outlined" disabled>Clear All Data</v-btn>
    </section>
  </v-container>
</template>
