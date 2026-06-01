#!/usr/bin/env bun
import { existsSync } from 'node:fs';
/**
 * publish-screenshots.ts — copy a Playwright screenshot run onto a
 * date-based path under docs/screenshots/.
 *
 * Initial prompt step 28 requires that CI, on every push to `main`, commits
 * the captured page screenshots back to the repo under a date-based path so
 * progress can be tracked as a visual changelog. This script does the copy +
 * per-run index; the CI workflow (`.github/workflows/pages.yml`) does the
 * `git commit` with the loop-safe `[skip ci]` message.
 *
 * It is also runnable locally so a developer can reproduce exactly what CI
 * does (initial prompt step 24 — CI and local share codepaths):
 *
 *   cd apps/web && bun run e2e          # produces e2e/output/screenshots/*.png
 *   bun run scripts/publish-screenshots.ts <run-id>
 *
 * Source : apps/web/e2e/output/screenshots/   (raw PNGs from the suite)
 * Dest   : docs/screenshots/<YYYY-MM-DD>-<run-id>/
 *
 * The destination directory name is the UTC date plus a caller-supplied run
 * id (the GitHub Actions run id in CI, or any token locally). Each run path
 * is immutable — the script refuses to overwrite an existing run directory.
 *
 * Docs: scripts/README.md
 */
import { cp, mkdir, readdir, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';

/** Repo root — this file lives in <root>/scripts/. */
const ROOT = resolve(dirname(new URL(import.meta.url).pathname), '..');

/** Raw screenshot output from the Playwright suite. */
const SRC = join(ROOT, 'apps', 'web', 'e2e', 'output', 'screenshots');

/** Committed-screenshots root. */
const DEST_ROOT = join(ROOT, 'docs', 'screenshots');

/** UTC date stamp `YYYY-MM-DD` for the run directory name. */
function utcDate(): string {
  return new Date().toISOString().slice(0, 10);
}

async function main(): Promise<void> {
  const runId = process.argv[2];
  if (!runId) {
    process.stderr.write(
      'usage: bun run scripts/publish-screenshots.ts <run-id>\n' +
        '  <run-id> — CI run id (GitHub Actions) or any local token.\n',
    );
    process.exit(1);
  }

  if (!existsSync(SRC)) {
    process.stderr.write(
      `no screenshots found at ${SRC} — run the e2e suite first ` +
        '(cd apps/web && bun run e2e).\n',
    );
    process.exit(1);
  }

  const pngs = (await readdir(SRC)).filter((f) => f.endsWith('.png')).sort();
  if (pngs.length === 0) {
    process.stderr.write(`no .png files in ${SRC} — nothing to publish.\n`);
    process.exit(1);
  }

  const runName = `${utcDate()}-${runId}`;
  const dest = join(DEST_ROOT, runName);
  if (existsSync(dest)) {
    process.stderr.write(`run directory already exists: ${dest} — refusing to overwrite.\n`);
    process.exit(1);
  }

  await mkdir(dest, { recursive: true });
  await cp(SRC, dest, { recursive: true });

  // Per-run README so each run directory is self-describing on GitHub.
  const list = pngs.map((p) => `- \`${p}\``).join('\n');
  const readme = `# Screenshot run ${runName}

Captured by the CI Playwright suite (initial prompt step 28).

Pages in this run:

${list}
`;
  await writeFile(join(dest, 'README.md'), readme);

  // Emit the run path on stdout so the CI workflow can capture it.
  process.stdout.write(`${runName}\n`);
}

main().catch((err) => {
  process.stderr.write(`publish-screenshots failed: ${(err as Error).message}\n`);
  process.exit(1);
});
