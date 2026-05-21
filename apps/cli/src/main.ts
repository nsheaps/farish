/**
 * @farish/cli — dummy CLI app.
 *
 * Executes and exits. Depends on `@farish/sdk`, which transitively pulls in
 * both leaf libraries — so `nx build cli` builds core + math + sdk first.
 */
import { describeProject } from '@farish/sdk';

function main(): void {
  // Allowed: `apps/**` is exempt from the noConsole lint rule (see biome.json).
  console.log(describeProject());
}

main();
