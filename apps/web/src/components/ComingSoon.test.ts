import { describe, expect, test } from 'vitest';
import { h } from 'vue';
import { mountWithVuetify } from '../test/mount.ts';
import ComingSoon from './ComingSoon.vue';

describe('ComingSoon', () => {
  test('renders the target page name in the headline', () => {
    const wrapper = mountWithVuetify({
      render: () => h(ComingSoon, { targetPageName: 'Explore' }),
    });
    expect(wrapper.text()).toContain('Explore is coming soon');
  });

  test('renders the default note when none is given', () => {
    const wrapper = mountWithVuetify({
      render: () => h(ComingSoon, { targetPageName: 'Leaderboards' }),
    });
    expect(wrapper.text()).toContain('needs a shared backend');
  });

  test('renders a custom note when provided', () => {
    const wrapper = mountWithVuetify({
      render: () =>
        h(ComingSoon, { targetPageName: 'Profile', note: 'Custom note here.' }),
    });
    expect(wrapper.text()).toContain('Custom note here.');
  });

  test('renders the ghost wireframe slot content', () => {
    const wrapper = mountWithVuetify({
      render: () =>
        h(ComingSoon, { targetPageName: 'Explore' }, () =>
          h('p', { class: 'ghost-marker' }, 'ghost content'),
        ),
    });
    expect(wrapper.find('.ghost-marker').exists()).toBe(true);
    expect(wrapper.find('[data-testid="ghost-wireframe"]').exists()).toBe(true);
  });
});
