<script setup lang="ts">
/**
 * GenerateView — the farish Generate page.
 *
 * Step 31: layout matched to the wireframe in docs/pages/generate/wireframes/page.ascii.md
 * States: no-key | idle | specifying | generating | complete | error
 *
 * Layout:
 * - No-key banner (VAlert warning) when no API key
 * - Left: ParametersPanel sidebar (~280px)
 *   - Resolution (VSlider), Style (VSelect), Complexity (VSlider)
 * - Right: Generation Workspace
 *   - PromptBar (VTextarea + VBtn Generate)
 *   - Generation Stream + Model Preview (two-column split)
 *   - Result Actions (in `complete` state)
 *
 * Spec: docs/pages/generate/SPEC.md
 * Tag: browser-only — all AI calls originate from the client.
 */
import { ref, computed } from 'vue';

type GenerateState = 'no-key' | 'idle' | 'specifying' | 'generating' | 'complete' | 'error';

const state = ref<GenerateState>('no-key');
const prompt = ref('');
const resolution = ref(60);
const complexity = ref(40);
const style = ref('Realistic');
const styleOptions = ['Realistic', 'Stylized', 'Low-poly', 'Abstract', 'Architectural'];

const isPromptLocked = computed(() => state.value === 'specifying' || state.value === 'generating');
const canGenerate = computed(() => state.value !== 'no-key' && prompt.value.trim().length > 0 && !isPromptLocked.value);
</script>

<template>
  <div data-testid="generate-view">

    <!-- No Key Banner — shown in `no-key` state -->
    <v-alert
      v-if="state === 'no-key'"
      type="warning"
      variant="tonal"
      class="mb-0 rounded-0"
      data-testid="generate-no-key-banner"
    >
      ⚠ No API key connected.
      <RouterLink to="/settings?return=/generate" class="font-weight-bold ml-1">
        Connect your key →
      </RouterLink>
      to start generating.
    </v-alert>

    <div class="d-flex" style="min-height: calc(100vh - 128px);">

      <!-- Parameters Panel (sidebar ~280px) -->
      <v-sheet
        color="surface-variant"
        class="pa-4"
        style="width: 280px; min-width: 280px; border-right: 1px solid rgba(0,0,0,0.12);"
        data-testid="generate-params-panel"
      >
        <p class="text-overline text-medium-emphasis mb-4">PARAMETERS</p>

        <!-- Resolution -->
        <div class="mb-5">
          <div class="d-flex justify-space-between text-body-2 mb-1">
            <span>Resolution</span>
            <span class="text-caption text-medium-emphasis">{{ resolution }}%</span>
          </div>
          <div class="d-flex align-center ga-1 text-caption text-medium-emphasis mb-1">
            <span>Low</span>
            <v-spacer />
            <span>High</span>
          </div>
          <v-slider
            v-model="resolution"
            :min="0"
            :max="100"
            :step="10"
            color="primary"
            hide-details
            density="compact"
          />
        </div>

        <!-- Artistic Style -->
        <div class="mb-5">
          <p class="text-body-2 mb-2">Artistic Style</p>
          <v-select
            v-model="style"
            :items="styleOptions"
            variant="outlined"
            density="compact"
            hide-details
          />
        </div>

        <!-- Complexity -->
        <div class="mb-4">
          <div class="d-flex justify-space-between text-body-2 mb-1">
            <span>Complexity</span>
            <span class="text-caption text-medium-emphasis">{{ complexity }}%</span>
          </div>
          <div class="d-flex align-center ga-1 text-caption text-medium-emphasis mb-1">
            <span>Low</span>
            <v-spacer />
            <span>High</span>
          </div>
          <v-slider
            v-model="complexity"
            :min="0"
            :max="100"
            :step="10"
            color="primary"
            hide-details
            density="compact"
          />
        </div>
      </v-sheet>

      <!-- Generation Workspace -->
      <div class="flex-grow-1 pa-6 d-flex flex-column" data-testid="generate-workspace">

        <!-- Prompt Bar -->
        <div class="mb-4" data-testid="generate-prompt-bar">
          <v-textarea
            v-model="prompt"
            label="Describe the 3D model you want to create…"
            variant="outlined"
            rows="3"
            hide-details
            class="mb-3"
            :disabled="isPromptLocked"
          />
          <div class="d-flex justify-end">
            <v-btn
              color="primary"
              variant="flat"
              prepend-icon="mdi-play"
              :disabled="!canGenerate"
              data-testid="generate-btn"
            >
              Generate
            </v-btn>
          </div>
        </div>

        <v-divider class="mb-4" />

        <!-- Clarification Dialog (specifying state) -->
        <v-card
          v-if="state === 'specifying'"
          variant="outlined"
          class="mb-4 pa-6"
          data-testid="generate-clarification-dialog"
        >
          <div class="d-flex align-center ga-2 mb-4">
            <v-icon icon="mdi-robot-outline" color="primary" />
            <h2 class="text-h6">A few quick questions to refine your model:</h2>
          </div>

          <div class="mb-4">
            <p class="text-body-2 font-weight-medium mb-2">Q1: What scale?</p>
            <v-radio-group inline hide-details>
              <v-radio label="Miniature" value="miniature" />
              <v-radio label="Vehicle" value="vehicle" />
              <v-radio label="Building" value="building" />
            </v-radio-group>
          </div>

          <div class="mb-4">
            <p class="text-body-2 font-weight-medium mb-2">Q2: Interior details?</p>
            <v-radio-group inline hide-details>
              <v-radio label="Yes, include interior" value="yes" />
              <v-radio label="Exterior only" value="no" />
            </v-radio-group>
          </div>

          <div class="mb-6">
            <p class="text-body-2 font-weight-medium mb-2">Q3: Style preference?</p>
            <v-text-field variant="outlined" density="compact" placeholder="free text…" hide-details />
          </div>

          <v-btn color="primary" variant="flat" append-icon="mdi-arrow-right">
            Continue →
          </v-btn>
        </v-card>

        <!-- Generation Stream + Model Preview (generating / complete states) -->
        <v-row
          v-if="state === 'generating' || state === 'complete'"
          class="mb-4"
          data-testid="generate-stream-preview"
        >
          <!-- Progress Feed -->
          <v-col cols="12" md="5">
            <v-card variant="outlined" height="320" class="d-flex flex-column">
              <v-card-title class="text-body-2 py-2 px-3">Generation Progress</v-card-title>
              <v-divider />
              <v-list density="compact" class="flex-grow-1 overflow-y-auto text-body-2">
                <v-list-item title="Parsing prompt…" prepend-icon="mdi-chevron-right" />
                <v-list-item title="Generating geometry…" prepend-icon="mdi-chevron-right" />
                <v-list-item title="Applying materials…" prepend-icon="mdi-chevron-right" />
                <v-list-item title="Optimising mesh…" prepend-icon="mdi-chevron-right" />
              </v-list>
              <v-progress-linear v-if="state === 'generating'" color="primary" indeterminate class="rounded-0" />
            </v-card>
          </v-col>

          <!-- Model Preview -->
          <v-col cols="12" md="7">
            <v-card
              variant="outlined"
              height="320"
              class="d-flex align-center justify-center"
              data-testid="generate-model-preview"
            >
              <div class="text-center text-medium-emphasis">
                <v-icon icon="mdi-cube-outline" size="64" class="mb-2" />
                <p class="text-body-2">3D geometry renders here as it is produced</p>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Result Actions (complete state) -->
        <v-toolbar
          v-if="state === 'complete'"
          flat
          color="surface-variant"
          class="rounded"
          data-testid="generate-result-actions"
        >
          <v-btn prepend-icon="mdi-download" variant="outlined" size="small" class="mr-1">Download</v-btn>
          <v-btn prepend-icon="mdi-content-save-outline" variant="outlined" size="small" class="mr-1">Save to Library</v-btn>
          <v-btn prepend-icon="mdi-share-variant-outline" variant="outlined" size="small" class="mr-1">Share</v-btn>
          <v-btn prepend-icon="mdi-refresh" variant="outlined" size="small">New</v-btn>
        </v-toolbar>

        <!-- Error Panel -->
        <v-card
          v-if="state === 'error'"
          variant="outlined"
          color="error"
          class="pa-6"
          data-testid="generate-error-panel"
        >
          <p class="text-body-2 mb-4">An error occurred during generation. Please try again.</p>
          <v-btn color="error" variant="outlined" prepend-icon="mdi-refresh">Retry</v-btn>
        </v-card>

        <!-- Idle state prompt area -->
        <v-sheet
          v-if="state === 'idle' || state === 'no-key'"
          color="surface-variant"
          rounded="lg"
          class="flex-grow-1 d-flex align-center justify-center"
          min-height="200"
          data-testid="generate-idle-area"
        >
          <div class="text-center text-medium-emphasis pa-8">
            <v-icon icon="mdi-cube-outline" size="48" class="mb-3" />
            <p class="text-body-2">Enter a prompt above and click Generate to create your 3D model.</p>
          </div>
        </v-sheet>

      </div>
    </div>
  </div>
</template>
