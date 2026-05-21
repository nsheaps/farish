<script setup lang="ts">
/**
 * HomeView — the working end-to-end example.
 *
 * On mount the view calls the farish API (`GET /health` and `GET /models`)
 * through the typed client and renders the results. This proves the framework
 * skeleton wires together: Vue app → API client → API server → mock data.
 *
 * It is NOT the real Home page (initial prompt step 30 builds that). It exists
 * only to demonstrate the framework working as a whole.
 */
import type { HealthResponse, ModelSummary } from '@farish/api-contract';
import { onMounted, ref } from 'vue';
import { getHealth, listModels } from '../api/client.ts';

/** API health, once fetched. */
const health = ref<HealthResponse | null>(null);
/** The example model list from the API. */
const models = ref<ModelSummary[]>([]);
/** Error message if the API is unreachable (graceful offline degradation). */
const apiError = ref<string | null>(null);
/** True while the initial fetch is in flight. */
const loading = ref(true);

onMounted(async () => {
  try {
    health.value = await getHealth();
    models.value = (await listModels()).models;
  } catch (cause) {
    apiError.value = cause instanceof Error ? cause.message : 'API unreachable';
  } finally {
    loading.value = false;
  }
});
</script>

<template>
  <v-container data-testid="home-view">
    <h1 class="text-h4 mb-2">farish</h1>
    <p class="text-body-1 text-medium-emphasis mb-6">
      Framework skeleton — this page calls the farish API to prove the app and
      server work together.
    </p>

    <v-progress-circular v-if="loading" indeterminate color="primary" />

    <v-alert
      v-else-if="apiError"
      type="warning"
      variant="tonal"
      data-testid="api-error"
    >
      API unreachable: {{ apiError }}. The app still loads — backend calls
      degrade gracefully.
    </v-alert>

    <template v-else>
      <v-alert
        type="success"
        variant="tonal"
        class="mb-6"
        data-testid="api-health"
      >
        Connected to API <strong>{{ health?.service }}</strong> v{{
          health?.version
        }}
        (status: {{ health?.status }}).
      </v-alert>

      <h2 class="text-h6 mb-3">
        Example endpoint — {{ models.length }} models from
        <code>GET /models</code>
      </h2>
      <v-list data-testid="model-list" lines="two">
        <v-list-item
          v-for="model in models"
          :key="model.id"
          :title="model.title"
          :subtitle="`@${model.author} · ${model.views} views`"
        >
          <template #prepend>
            <v-avatar rounded="lg" size="48">
              <v-img :src="model.thumbnailUrl" :alt="model.title" />
            </v-avatar>
          </template>
        </v-list-item>
      </v-list>

      <v-btn class="mt-4" color="primary" variant="outlined" to="/explore">
        See the Coming Soon mechanism
      </v-btn>
    </template>
  </v-container>
</template>
