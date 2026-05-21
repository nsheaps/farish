/**
 * @farish/sdk — dummy publishable package.
 *
 * Fans in from two leaf libraries (`@farish/core`, `@farish/math`). Because it
 * declares both as workspace dependencies, nx orders their `build` targets
 * before this package's `build` (see nx.json `dependsOn: ["^build"]`).
 */
import { greet, PROJECT_NAME } from '@farish/core';
import { add } from '@farish/math';

/** Build a one-line status string combining both libraries. */
export function describeProject(): string {
  const version = add(0, 1);
  return `${greet(PROJECT_NAME)} (sdk v${String(version)})`;
}

export { add, greet, PROJECT_NAME };
