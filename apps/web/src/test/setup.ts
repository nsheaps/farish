/**
 * @farish/web — Vitest global setup.
 *
 * jsdom does not implement every browser API that Vuetify components touch
 * (`ResizeObserver`, `visualViewport`, `matchMedia`). These no-op polyfills let
 * Vuetify components mount under jsdom without throwing. They are test-only —
 * a real browser supplies the genuine implementations.
 */

// ResizeObserver — used by Vuetify layout/size composables.
if (!('ResizeObserver' in globalThis)) {
  class ResizeObserverStub {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  }
  globalThis.ResizeObserver = ResizeObserverStub as unknown as typeof ResizeObserver;
}

// visualViewport — read by Vuetify's overlay location strategies.
if (!('visualViewport' in window) || window.visualViewport === null) {
  Object.defineProperty(window, 'visualViewport', {
    configurable: true,
    value: {
      width: 1024,
      height: 768,
      offsetLeft: 0,
      offsetTop: 0,
      scale: 1,
      addEventListener: (): void => {},
      removeEventListener: (): void => {},
    },
  });
}

// matchMedia — used by Vuetify's display/breakpoint composable.
if (typeof window.matchMedia !== 'function') {
  Object.defineProperty(window, 'matchMedia', {
    configurable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: (): void => {},
        removeEventListener: (): void => {},
        addListener: (): void => {},
        removeListener: (): void => {},
        dispatchEvent: (): boolean => false,
      }) as unknown as MediaQueryList,
  });
}
