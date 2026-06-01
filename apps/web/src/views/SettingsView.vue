<script setup lang="ts">
/**
 * SettingsView — the farish Settings page.
 *
 * Step 32: improved visual hierarchy and more descriptive mock state.
 *
 * Sections:
 * - Connection: status alert, Connect with Claude button, API key input
 * - Storage Note: credential privacy guarantee
 * - Preferences: theme toggle, default generation params
 * - Danger Zone: Clear All Data
 *
 * Spec: docs/pages/settings/SPEC.md
 * Tag: browser-only — reads/writes only to browser local storage.
 * Route: /settings
 */
import { ref } from 'vue';

const showApiKey = ref(false);
const apiKey = ref('');
const isConnected = ref(false);
const theme = ref('system');
const resolution = ref(60);
const complexity = ref(40);
const style = ref('Realistic');

const styleOptions = [
  { title: 'Realistic', value: 'Realistic' },
  { title: 'Stylized', value: 'Stylized' },
  { title: 'Low-poly', value: 'Low-poly' },
  { title: 'Abstract', value: 'Abstract' },
  { title: 'Architectural', value: 'Architectural' },
];

const connectionStatus = ref<'disconnected' | 'connected' | 'error'>('disconnected');
</script>

<template>
  <v-container data-testid="settings-view" max-width="640">

    <div class="mb-8">
      <h1 class="text-h4 font-weight-bold mb-1">Settings</h1>
      <p class="text-body-2 text-medium-emphasis">
        Manage your API connection, preferences, and data.
      </p>
    </div>

    <!-- Connection Section -->
    <section class="mb-8" data-testid="settings-connection">
      <p class="text-overline text-medium-emphasis mb-3">Connection</p>

      <!-- Connection Status -->
      <v-alert
        v-if="connectionStatus === 'disconnected'"
        type="warning"
        variant="tonal"
        icon="mdi-alert-circle-outline"
        class="mb-4"
        data-testid="settings-connection-status"
      >
        Not connected — you need an API key or Claude login to generate models.
      </v-alert>
      <v-alert
        v-else-if="connectionStatus === 'connected'"
        type="success"
        variant="tonal"
        icon="mdi-check-circle-outline"
        class="mb-4"
        data-testid="settings-connection-status"
      >
        Connected — ready to generate.
      </v-alert>
      <v-alert
        v-else
        type="error"
        variant="tonal"
        icon="mdi-alert-circle-outline"
        class="mb-4"
        data-testid="settings-connection-status"
      >
        Invalid key — check your API key and try again.
      </v-alert>

      <!-- Connect with Claude -->
      <v-btn
        color="primary"
        variant="flat"
        class="mb-4"
        prepend-icon="mdi-account-circle-outline"
        block
        data-testid="settings-connect-claude-btn"
      >
        Connect with Claude (OAuth)
      </v-btn>

      <v-divider class="my-4">
        <span class="text-caption text-medium-emphasis">or enter your API key manually</span>
      </v-divider>

      <!-- API Key Input -->
      <div class="d-flex align-start ga-2 mb-2" data-testid="settings-api-key-section">
        <v-text-field
          v-model="apiKey"
          label="Claude API key"
          placeholder="sk-ant-…"
          variant="outlined"
          density="comfortable"
          :type="showApiKey ? 'text' : 'password'"
          hide-details
          :append-inner-icon="showApiKey ? 'mdi-eye-off' : 'mdi-eye'"
          style="flex: 1;"
          @click:append-inner="showApiKey = !showApiKey"
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
      <p class="text-caption text-medium-emphasis">
        Get a key at
        <a
          href="https://console.anthropic.com"
          target="_blank"
          rel="noopener"
          class="text-primary text-decoration-none"
        >console.anthropic.com ↗</a>
      </p>
    </section>

    <v-divider class="mb-8" />

    <!-- Storage Note -->
    <section class="mb-8" data-testid="settings-storage-note">
      <p class="text-overline text-medium-emphasis mb-3">Privacy & Storage</p>
      <v-card variant="tonal" color="primary" class="pa-4" data-testid="settings-privacy-card">
        <div class="d-flex align-start ga-3">
          <v-icon icon="mdi-lock-outline" color="primary" class="mt-0" size="20" />
          <div>
            <p class="text-body-2 font-weight-medium mb-1">Your credentials stay in your browser</p>
            <p class="text-body-2 text-medium-emphasis mb-2">
              Your API key or OAuth token is stored in your browser's localStorage only.
              Nothing is ever sent to farish servers — all AI calls go directly to Anthropic.
            </p>
            <RouterLink to="/about" class="text-caption text-decoration-none text-primary">
              Learn more on the About page →
            </RouterLink>
          </div>
        </div>
      </v-card>
    </section>

    <v-divider class="mb-8" />

    <!-- Preferences -->
    <section class="mb-8" data-testid="settings-preferences">
      <p class="text-overline text-medium-emphasis mb-4">Preferences</p>

      <!-- Theme Toggle -->
      <div class="mb-6" data-testid="settings-theme-toggle">
        <p class="text-body-2 font-weight-medium mb-1">Theme</p>
        <p class="text-caption text-medium-emphasis mb-3">Choose how farish looks.</p>
        <v-btn-toggle
          v-model="theme"
          mandatory
          variant="outlined"
          divided
          density="comfortable"
        >
          <v-btn value="light" size="small" prepend-icon="mdi-weather-sunny">Light</v-btn>
          <v-btn value="dark" size="small" prepend-icon="mdi-weather-night">Dark</v-btn>
          <v-btn value="system" size="small" prepend-icon="mdi-laptop">System</v-btn>
        </v-btn-toggle>
      </div>

      <!-- Default Generation Parameters -->
      <div data-testid="settings-default-params">
        <p class="text-body-2 font-weight-medium mb-1">Default Generation Parameters</p>
        <p class="text-caption text-medium-emphasis mb-4">
          These values pre-fill the Generate page when you start a new session.
        </p>

        <div class="mb-5">
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

        <div class="mb-5">
          <p class="text-body-2 mb-2">Default Style</p>
          <v-select
            v-model="style"
            :items="styleOptions"
            item-title="title"
            item-value="value"
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
      <p class="text-overline text-error mb-3">Danger Zone</p>
      <v-card variant="outlined" color="error" class="pa-4">
        <p class="text-body-2 mb-3">
          Removes your API key, all library models, and preferences from this browser.
          This cannot be undone.
        </p>
        <v-btn
          color="error"
          variant="flat"
          prepend-icon="mdi-trash-can-outline"
          data-testid="settings-clear-data-btn"
        >
          Clear All Data
        </v-btn>
      </v-card>
    </section>

  </v-container>
</template>
