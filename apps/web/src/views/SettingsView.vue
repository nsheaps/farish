<script setup lang="ts">
/**
 * SettingsView — the farish Settings page.
 *
 * Step 31: layout matched to the wireframe in docs/pages/settings/wireframes/page.ascii.md
 * Sections:
 * - Connection: status alert, Connect with Claude button, API key input with show/hide
 * - Storage Note: credential privacy guarantee
 * - Preferences: theme toggle (VBtnToggle), default generation params (VSlider/VSelect)
 * - Danger Zone: Clear All Data (VBtn error)
 *
 * Spec: docs/pages/settings/SPEC.md
 * Tag: browser-only — reads/writes only to browser local storage.
 * Route: /settings
 */
import { ref } from 'vue';

const showApiKey = ref(false);
const apiKey = ref('');
const theme = ref('dark');
const resolution = ref(50);
const complexity = ref(30);
const style = ref('Realistic');

const styleOptions = ['Realistic', 'Stylized', 'Low-poly', 'Abstract'];
</script>

<template>
  <v-container data-testid="settings-view" max-width="640">
    <h1 class="text-h4 mb-8">Settings</h1>

    <!-- Connection Section -->
    <section class="mb-8" data-testid="settings-connection">
      <p class="text-overline text-medium-emphasis mb-3">CONNECTION</p>

      <!-- Connection Status -->
      <v-alert
        type="info"
        variant="tonal"
        icon="mdi-circle-outline"
        class="mb-4"
        data-testid="settings-connection-status"
      >
        Not connected
      </v-alert>

      <!-- Connect with Claude -->
      <v-btn
        color="primary"
        variant="flat"
        class="mb-4"
        prepend-icon="mdi-account-circle-outline"
        data-testid="settings-connect-claude-btn"
      >
        Connect with Claude
      </v-btn>

      <v-divider class="my-4">
        <span class="text-caption text-medium-emphasis">or enter your API key manually</span>
      </v-divider>

      <!-- API Key Input -->
      <div class="d-flex align-start ga-2" data-testid="settings-api-key-section">
        <v-text-field
          v-model="apiKey"
          label="Claude API key"
          placeholder="sk-ant-…"
          variant="outlined"
          density="comfortable"
          :type="showApiKey ? 'text' : 'password'"
          hide-details
          :append-inner-icon="showApiKey ? 'mdi-eye-off' : 'mdi-eye'"
          @click:append-inner="showApiKey = !showApiKey"
          style="flex: 1;"
        />
        <v-btn
          color="primary"
          variant="outlined"
          height="48"
          :disabled="!apiKey"
          data-testid="settings-save-key-btn"
        >
          Save
        </v-btn>
      </div>
    </section>

    <v-divider class="mb-8" />

    <!-- Storage Note -->
    <section class="mb-8" data-testid="settings-storage-note">
      <p class="text-overline text-medium-emphasis mb-3">STORAGE NOTE</p>
      <div class="d-flex align-start ga-3">
        <v-icon icon="mdi-lock-outline" color="primary" class="mt-1" />
        <div>
          <p class="text-body-2 mb-1">
            Your credentials are stored in your browser only and are never sent to
            farish servers.
          </p>
          <RouterLink to="/about" class="text-caption text-decoration-none text-primary">
            Learn more → /about
          </RouterLink>
        </div>
      </div>
    </section>

    <v-divider class="mb-8" />

    <!-- Preferences -->
    <section class="mb-8" data-testid="settings-preferences">
      <p class="text-overline text-medium-emphasis mb-4">PREFERENCES</p>

      <!-- Theme Toggle -->
      <div class="mb-6" data-testid="settings-theme-toggle">
        <p class="text-body-2 font-weight-medium mb-2">Theme</p>
        <v-btn-toggle
          v-model="theme"
          mandatory
          variant="outlined"
          divided
          density="comfortable"
        >
          <v-btn value="light" size="small">Light</v-btn>
          <v-btn value="dark" size="small">Dark</v-btn>
          <v-btn value="system" size="small">System</v-btn>
        </v-btn-toggle>
      </div>

      <!-- Default Generation Parameters -->
      <div data-testid="settings-default-params">
        <p class="text-body-2 font-weight-medium mb-4">Default Generation Parameters</p>

        <div class="mb-4">
          <div class="d-flex justify-space-between text-body-2 mb-1">
            <span>Resolution</span>
            <span class="text-medium-emphasis">{{ resolution }}%</span>
          </div>
          <v-slider
            v-model="resolution"
            :min="0"
            :max="100"
            :step="10"
            thumb-label
            color="primary"
            hide-details
          />
        </div>

        <div class="mb-4">
          <p class="text-body-2 mb-2">Style</p>
          <v-select
            v-model="style"
            :items="styleOptions"
            variant="outlined"
            density="comfortable"
            hide-details
          />
        </div>

        <div class="mb-4">
          <div class="d-flex justify-space-between text-body-2 mb-1">
            <span>Complexity</span>
            <span class="text-medium-emphasis">{{ complexity }}%</span>
          </div>
          <v-slider
            v-model="complexity"
            :min="0"
            :max="100"
            :step="10"
            thumb-label
            color="primary"
            hide-details
          />
        </div>
      </div>
    </section>

    <v-divider class="mb-8" />

    <!-- Danger Zone -->
    <section data-testid="settings-danger-zone">
      <p class="text-overline text-error mb-3">DANGER ZONE</p>
      <v-btn
        color="error"
        variant="outlined"
        prepend-icon="mdi-trash-can-outline"
        data-testid="settings-clear-data-btn"
      >
        Clear All Data
      </v-btn>
      <p class="text-caption text-medium-emphasis mt-2">
        Removes credentials, library, and all preferences from this browser.
      </p>
    </section>
  </v-container>
</template>
