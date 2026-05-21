---
name: validate-app-progress
description: >
  Validate the farish project's standing CI/Pages requirements still hold:
  CI green, CI codepaths == local tooling, screenshots of every page on main,
  docs/specs published to GitHub Pages. Use after any workflow change, before
  marking a step done, or when asked to "check app progress" / "verify the CI
  pipeline" / "are the standing requirements met".
---

# Validate App Progress

The standing requirements set by initial-prompt step 28[^step28]. These hold
for **every** task from step 28 onward — re-check them whenever a workflow,
mise task, or build script changes, and before marking any step complete.

## Standing requirements

1. **CI is always green.** Every workflow check on the branch must pass. A red
   check means the task is not done — fix locally, re-push, re-verify.

2. **CI codepaths == local dev tooling.** CI must run the *same* commands a
   developer runs locally — `mise run check` / `mise run pages-site` / the
   `e2e` package script — never a CI-only reimplementation. If they diverge,
   CI is not a trustworthy gate (step 24).

3. **Screenshots of every page, on `main`.** On every push to `main`, the
   `pages.yml` workflow runs the Playwright suite to screenshot every built
   page and record a video. The page manifest (`apps/web/e2e/pages.ts`) is the
   source of truth for "every page" — new pages are picked up automatically.

4. **Screenshots committed back: `[skip ci]`, date-based path.** The captured
   PNGs are committed to `docs/screenshots/<YYYY-MM-DD>-<run-id>/`. The commit
   message contains `[skip ci]` and the commit-back runs only on push-to-main
   and only when there is a diff — three guards so it cannot loop.

5. **Screenshots published to GitHub Pages.** The same workflow run publishes
   the screenshot runs to the Pages site under `/screenshots/`.

6. **Specs/docs published to Pages on every `main` push.** `pages.yml` runs
   the `pages-site` mise task to render `docs/**.md` (specs, wireframes, API
   designs — Mermaid-aware, A6) into the Pages site under `/docs/`.

## Verification steps

1. List the workflows: `ls .github/workflows/`. Confirm `ci.yml`,
   `tilt-ci.yml`, and `pages.yml` exist.

2. Confirm CI/local parity: each workflow's build/test step invokes a
   `mise run <task>` or a package script — not an inline reimplementation.

3. Run the local gate: `mise run check` must be green.

4. Exercise the Pages pipeline locally (the exact CI codepath):
   - `nx run web:build`
   - `cd apps/web && bun run e2e` — screenshots land in `e2e/output/screenshots/`.
   - `bun run scripts/publish-screenshots.ts local-check` — copies to a
     date-based path under `docs/screenshots/` (delete the test dir after).
   - `mise run pages-site` — assembles `./_site` (app + docs + screenshots).

5. Confirm `pages.yml` loop-safety: the commit-back step is gated on
   push-to-main, uses a `[skip ci]` message, and no-ops on an empty diff.

6. Confirm A5 dry-run: every workflow runs in full on `pull_request` with only
   irreversible side-effects (commit-back, Pages deploy) gated off.

7. If a workflow changed, also run `Skill(validate-change-ci)`.

## Notes

- This skill is the *what must always be true*; `validate-change-ci` is the
  *how to check one workflow*. Run both when a workflow changes.
- Pipeline details: [`.github/workflows/pages.yml`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/.github/workflows/pages.yml),
  [`scripts/README.md`](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/scripts/README.md).

[^step28]: [docs/INITIAL_PROMPT.md — step 28](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/docs/INITIAL_PROMPT.md#L306)
