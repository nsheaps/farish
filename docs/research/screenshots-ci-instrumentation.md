# Screenshots CI Failure Diagnostics Instrumentation

**Date:** 2026-05-21
**Branch:** `claude/ai-3d-model-generator-XjoUi`
**Commit:** `dd83785`
**PR:** nsheaps/farish#1

---

## What Was Added

A single new step — `Capture failure diagnostics and commit back [skip ci]` — was
appended to the `screenshots` job in
[`.github/workflows/pages.yml`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/.github/workflows/pages.yml)
after the existing `Commit screenshots` step.

The step carries `if: ${{ failure() }}` and is otherwise identical in shape to
the existing commit-back pattern already present in the job.

### Diagnostics collected

| File in `ci-debug/<ts>-<run_id>/` | Contents |
|-----------------------------------|----------|
| `environment.txt`                 | `uname -a`, `node --version`, `bun --version`, `bunx playwright --version`, `df -h /dev/shm`, `df -h /`, `free -h`, filtered `env` dump |
| `playwright-install.txt`          | Full stdout+stderr of `playwright install --with-deps chromium` re-run |
| `chromium-probe.txt`              | Binary location under `~/.cache/ms-playwright`, `--version` probe, headless `--dump-dom about:blank` attempt, `ldd` missing-lib scan |
| `test-results/`                   | Copy of `apps/web/test-results/` (Playwright trace files, screenshots of failures) |
| `playwright-report/`              | Copy of `apps/web/playwright-report/` (HTML report) |
| `*.txt` (loose)                   | Any `.txt` files newer than `package.json` found under `apps/web/` (Playwright stderr dumps) |
| `vite-build.txt`                  | Output of `bun run --cwd apps/web build` re-run |
| `e2e-repro.txt`                   | Label of the exact failing command (`bun run --cwd apps/web e2e`) plus tail of its output on re-run |
| `MANIFEST.txt`                    | GitHub context (ref, sha, run_id, run_number, actor) + `find` listing of every collected file |

---

## Where Diagnostics Land

After the next failing `screenshots` run the step commits a directory:

```
ci-debug/<UTC-timestamp>-<github.run_id>/
```

to the **same PR branch** (`claude/ai-3d-model-generator-XjoUi`). Retrieve it with:

```bash
git pull origin claude/ai-3d-model-generator-XjoUi
ls ci-debug/
```

The directory name encodes both the wall-clock time and the Actions run ID, so
multiple failing runs accumulate without collision.

---

## Loop-Safety Analysis

Three independent guards prevent the diagnostics push from re-triggering the
`screenshots` job:

1. **`if: ${{ failure() }}`** — the step is skipped entirely when the job
   succeeds. A passing run never commits anything, never loops.

2. **`[skip ci]` in the commit message** — GitHub natively skips
   push-triggered workflow runs whose head-commit message contains `[skip ci]`
   or `[no ci]`.[^github-skip-ci] The diagnostics commit message is
   `ci(debug): screenshots failure diagnostics run <ID> [skip ci]`.

3. **`git diff --cached --quiet` early exit** — if for any reason the
   diagnostics directory is empty or already committed, the step exits `0`
   before attempting a push.

A diagnostics commit also cannot re-arm the step because it does not run the
screenshot suite; even if `[skip ci]` were somehow ignored, the resulting
run would succeed (no screenshots to take), and `if: failure()` would skip
the step again.

---

## Validation Performed

1. **YAML syntax** — `python3 -c "import yaml; yaml.safe_load(...)"` returned
   clean.
2. **`actionlint`** — not installed on this runner; YAML verified manually
   against the GitHub Actions schema.
3. **Step structure** — every new step has a `run:` key; no new `uses:` actions
   were introduced (no new pinning required).
4. **`if:` expression syntax** — `if: ${{ failure() }}` is valid GHA syntax;
   the `${{ }}` wrapper is optional for status-check functions but accepted
   without error.[^gha-conditions]
5. **Dry-run compatibility (A5)** — the diagnostics step is orthogonal to
   `PAGES_DRY_RUN`. On a PR dry-run that fails, the step fires and pushes
   diagnostics back to the PR branch. This is correct: a failing PR run is
   exactly when you most need diagnostics.
6. **Existing steps unmodified** — the screenshot-taking logic (`Build app +
   run screenshot suite`, `Stage screenshots`, `Upload Playwright artifacts`,
   `Commit screenshots`) was not touched.

---

## References

[^github-skip-ci]: [GitHub Docs — Skipping workflow runs](https://docs.github.com/en/actions/managing-workflow-runs/skipping-workflow-runs)
[^gha-conditions]: [GitHub Docs — Expressions: Status check functions](https://docs.github.com/en/actions/learn-github-actions/expressions#status-check-functions)
