import { describe, expect, test } from 'vitest';
import { mountWithVuetify } from '../test/mount.ts';
import GhostModelGrid from './GhostModelGrid.vue';

describe('GhostModelGrid', () => {
  test('renders a card for each of the eight mock models', () => {
    const wrapper = mountWithVuetify(GhostModelGrid);
    expect(wrapper.findAllComponents({ name: 'VCard' })).toHaveLength(8);
  });

  test('thumbnails use offline data-URI placeholder images', () => {
    const wrapper = mountWithVuetify(GhostModelGrid);
    const images = wrapper.findAllComponents({ name: 'VImg' });
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(String(img.props('src')).startsWith('data:image/svg+xml,')).toBe(true);
    }
  });
});
