<script setup lang="ts">
/**
 * GenerateView — the farish Generate page.
 *
 * Step 32: populated with a full mock generation conversation so the page
 * demonstrates the complete flow — prompt → spec-clarification Q&A → live
 * agent-loop steps → 3D result — without requiring a real API key.
 *
 * States: no-key | idle | specifying | generating | complete | error
 * Demo mode: page loads in `complete` state with mock data pre-filled.
 *
 * Layout:
 * - Demo banner (info) when in demo mode
 * - No-key banner (warning) when no key and not in demo mode
 * - Left: ParametersPanel sidebar (~280px)
 * - Right: Generation Workspace
 *   - PromptBar
 *   - Clarification Q&A (shown in specifying + complete)
 *   - Generation Stream + Model Preview (generating + complete)
 *   - Result Actions (complete)
 *
 * Spec: docs/pages/generate/SPEC.md
 * Tag: browser-only — all AI calls originate from the client.
 */
import { ref, computed } from 'vue';
import { mockGenerationConversation } from '@farish/mock-data';

type GenerateState = 'no-key' | 'idle' | 'specifying' | 'generating' | 'complete' | 'error';

// ----- Mock conversation data (loaded once) --------------------------------
const mockConvo = mockGenerationConversation(1);

// ----- State ---------------------------------------------------------------
/** Demo mode: page starts showing a complete mock generation. */
const demoMode = ref(true);
const state = ref<GenerateState>('complete');

// Prompt bar
const prompt = ref(mockConvo.promptText);

// Parameters panel
const resolution = ref(60);
const complexity = ref(40);
const style = ref('Low-poly');
const styleOptions = ['Realistic', 'Stylized', 'Low-poly', 'Abstract', 'Architectural'];

// Clarification answers (pre-filled from mock)
const clarificationAnswers = ref<Record<string, string>>(
  Object.fromEntries(mockConvo.clarificationQuestions.map((q) => [q.id, q.mockAnswer])),
);

// ----- Computed ------------------------------------------------------------
const isPromptLocked = computed(
  () => state.value === 'specifying' || state.value === 'generating',
);
const canGenerate = computed(
  () =>
    state.value !== 'no-key' &&
    prompt.value.trim().length > 0 &&
    !isPromptLocked.value,
);
const showClarification = computed(
  () => state.value === 'specifying' || state.value === 'complete',
);
const showStream = computed(
  () => state.value === 'generating' || state.value === 'complete',
);

// ----- Actions -------------------------------------------------------------
function exitDemo() {
  demoMode.value = false;
  state.value = 'no-key';
  prompt.value = '';
  clarificationAnswers.value = {};
}
</script>

<template>
  <div data-testid="generate-view">

    <!-- Demo Mode Banner -->
    <v-alert
      v-if="demoMode"
      type="info"
      variant="tonal"
      class="mb-0 rounded-0"
      data-testid="generate-demo-banner"
    >
      <span class="font-weight-medium">Demo mode</span> — this is a pre-built example showing the full generation flow.
      <v-btn
        variant="text"
        size="small"
        to="/settings"
        class="ml-2 font-weight-bold"
        data-testid="generate-demo-connect-link"
      >
        Connect your API key →
      </v-btn>
      <template #append>
        <v-btn
          icon="mdi-close"
          variant="text"
          density="compact"
          aria-label="Exit demo mode"
          data-testid="generate-demo-dismiss"
          @click="exitDemo"
        />
      </template>
    </v-alert>

    <!-- No Key Banner — shown in `no-key` state when not in demo -->
    <v-alert
      v-else-if="state === 'no-key'"
      type="warning"
      variant="tonal"
      class="mb-0 rounded-0"
      data-testid="generate-no-key-banner"
    >
      No API key connected.
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
        style="width: 280px; min-width: 280px; border-right: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));"
        data-testid="generate-params-panel"
      >
        <p class="text-overline text-medium-emphasis mb-4">Parameters</p>

        <!-- Resolution -->
        <div class="mb-5">
          <div class="d-flex justify-space-between text-body-2 mb-1">
            <span>Resolution</span>
            <span class="text-caption text-medium-emphasis">{{ resolution }}%</span>
          </div>
          <div class="d-flex align-center text-caption text-medium-emphasis mb-1">
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
          <div class="d-flex align-center text-caption text-medium-emphasis mb-1">
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

        <v-divider class="my-4" />

        <!-- About demo params -->
        <p class="text-caption text-medium-emphasis">
          Parameters shown above were used for this demo generation.
          Adjust them before clicking Generate on your own prompt.
        </p>
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

        <!-- Clarification Q&A (specifying + complete states) -->
        <v-card
          v-if="showClarification"
          variant="outlined"
          class="mb-4"
          data-testid="generate-clarification-dialog"
        >
          <v-card-item>
            <template #prepend>
              <v-icon icon="mdi-robot-outline" color="primary" />
            </template>
            <v-card-title class="text-body-1">
              Spec clarification — a few quick questions to refine your model:
            </v-card-title>
          </v-card-item>
          <v-divider />

          <v-card-text class="pt-4">
            <div
              v-for="(q, qi) in mockConvo.clarificationQuestions"
              :key="q.id"
              :class="qi < mockConvo.clarificationQuestions.length - 1 ? 'mb-5' : 'mb-2'"
            >
              <p class="text-body-2 font-weight-medium mb-2">
                Q{{ qi + 1 }}: {{ q.question }}
              </p>

              <!-- Radio options -->
              <v-radio-group
                v-if="q.answerType === 'radio'"
                v-model="clarificationAnswers[q.id]"
                inline
                hide-details
                density="compact"
                :disabled="state === 'complete'"
              >
                <v-radio
                  v-for="opt in q.options"
                  :key="opt"
                  :label="opt"
                  :value="opt"
                />
              </v-radio-group>

              <!-- Free text -->
              <v-text-field
                v-else
                v-model="clarificationAnswers[q.id]"
                variant="outlined"
                density="compact"
                hide-details
                :disabled="state === 'complete'"
              />

              <!-- Answer indicator in complete state -->
              <div
                v-if="state === 'complete'"
                class="d-flex align-center ga-1 mt-1 text-caption text-success"
              >
                <v-icon icon="mdi-check-circle-outline" size="14" />
                <span>{{ clarificationAnswers[q.id] }}</span>
              </div>
            </div>
          </v-card-text>

          <v-card-actions v-if="state === 'specifying'" class="px-4 pb-4">
            <v-btn color="primary" variant="flat" append-icon="mdi-arrow-right">
              Continue →
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Generation Stream + Model Preview (generating / complete states) -->
        <v-row
          v-if="showStream"
          class="mb-4"
          data-testid="generate-stream-preview"
        >
          <!-- Progress Feed -->
          <v-col cols="12" md="5">
            <v-card variant="outlined" height="320" class="d-flex flex-column">
              <v-card-item class="py-2">
                <v-card-title class="text-body-2">Generation Progress</v-card-title>
              </v-card-item>
              <v-divider />
              <v-list density="compact" class="flex-grow-1 overflow-y-auto">
                <v-list-item
                  v-for="step in mockConvo.agentSteps"
                  :key="step.id"
                  :data-testid="`generate-step-${step.id}`"
                >
                  <template #prepend>
                    <v-icon
                      :icon="state === 'complete' ? 'mdi-check-circle-outline' : 'mdi-chevron-right'"
                      :color="state === 'complete' ? 'success' : undefined"
                      size="18"
                    />
                  </template>
                  <v-list-item-title class="text-body-2">{{ step.label }}</v-list-item-title>
                  <v-list-item-subtitle
                    v-if="step.detail && state === 'complete'"
                    class="text-caption"
                  >
                    {{ step.detail }}
                  </v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <v-progress-linear
                v-if="state === 'generating'"
                color="primary"
                indeterminate
                class="rounded-0"
              />
              <v-sheet
                v-if="state === 'complete'"
                color="success"
                class="px-3 py-2 text-caption font-weight-medium text-white rounded-0 rounded-b"
              >
                ✓ Generation complete
              </v-sheet>
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
              <div class="text-center text-medium-emphasis pa-4">
                <v-icon icon="mdi-cube-outline" size="64" color="primary" class="mb-3" />
                <p class="text-body-2 font-weight-medium mb-1">
                  {{ mockConvo.resultSummary }}
                </p>
                <p class="text-caption">Interactive 3D viewer — coming in step 34</p>
              </div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Result Actions (complete state) -->
        <v-toolbar
          v-if="state === 'complete'"
          flat
          color="surface-variant"
          class="rounded mb-4"
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

        <!-- Idle / No-key placeholder area -->
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
