/**
 * Vuetify plugin setup for @farish/web.
 *
 * One `createVuetify` call configures the design system (Vuetify 4 / Material
 * Design 3) for the whole app. A custom `farish` theme moves the palette off
 * the default Material colours, as recommended in the design-system research
 * note (`docs/research/design-system-choice.md`).
 */
import '@mdi/font/css/materialdesignicons.css';
import 'vuetify/styles';
import { createVuetify } from 'vuetify';

/** The shared Vuetify instance — registered on the app in `main.ts`. */
export const vuetify = createVuetify({
  theme: {
    defaultTheme: 'farish',
    themes: {
      farish: {
        dark: false,
        colors: {
          primary: '#5b3fb8',
          secondary: '#00897b',
          surface: '#ffffff',
          background: '#f5f4fa',
        },
      },
    },
  },
});
