/**
 * @farish/core — dummy leaf library.
 *
 * A leaf in the dependency graph: it imports nothing from other workspace
 * packages. Exists so the nx task graph has a real terminal node.
 */

/** Greet a named subject. */
export function greet(name: string): string {
  return `Hello, ${name}, from farish core.`;
}

/** The project name, re-exported as a typed constant. */
export const PROJECT_NAME = 'farish' as const;
