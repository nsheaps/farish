/**
 * @farish/web — shared test mounting helper.
 *
 * Vuetify components require the Vuetify plugin to be installed on the app, and
 * many also need a router. This helper wires both so individual component
 * tests stay terse.
 */
import { mount, type VueWrapper } from '@vue/test-utils';
import type { Component } from 'vue';
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { createRouter, createWebHashHistory, type Router } from 'vue-router';

/** Build a throwaway router with the two framework routes for tests. */
function testRouter(): Router {
  return createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/', name: 'home', component: { template: '<div />' } },
      { path: '/explore', name: 'explore', component: { template: '<div />' } },
    ],
  });
}

/** Mount a component with Vuetify + a router installed. */
export function mountWithVuetify(component: Component): VueWrapper {
  const vuetify = createVuetify({ components, directives });
  return mount(component, {
    global: { plugins: [vuetify, testRouter()] },
  });
}
