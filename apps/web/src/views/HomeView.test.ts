import { describe, expect, test } from 'vitest';
import { mountWithVuetify } from '../test/mount.ts';
import HomeView from './HomeView.vue';

describe('HomeView — Home page stub', () => {
  test('renders the hero section', () => {
    const wrapper = mountWithVuetify(HomeView);
    expect(wrapper.find('[data-testid="home-hero"]').exists()).toBe(true);
    expect(wrapper.text()).toContain('farish');
  });

  test('renders the Generate CTA that links to /generate', () => {
    const wrapper = mountWithVuetify(HomeView);
    const cta = wrapper.find('[data-testid="home-generate-cta"]');
    expect(cta.exists()).toBe(true);
  });

  test('renders the trending preview strip', () => {
    const wrapper = mountWithVuetify(HomeView);
    expect(wrapper.find('[data-testid="home-trending-strip"]').exists()).toBe(true);
  });
});
