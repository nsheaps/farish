/**
 * @farish/math — dummy leaf library.
 *
 * A leaf in the dependency graph: imports nothing from other workspace
 * packages. Exists so the nx task graph has a second terminal node, letting
 * `@farish/sdk` fan in from two libraries.
 */

/** Add two numbers. */
export function add(a: number, b: number): number {
  return a + b;
}

/** Clamp a value into the inclusive `[min, max]` range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
