---
name: validate-change-ci
description: >
  Validate a CI/GitHub Actions workflow change (.github/workflows/). Use when
  asked to "validate a workflow change", "check the CI config", "review a
  GitHub Actions workflow", or from validate-change when changed paths are
  under .github/workflows/.
---

# Validate Change — CI

Validation procedure for GitHub Actions workflow changes.

> **Keep up to date.** Update this skill as new workflows are added and CI
> patterns solidify in steps 22–28 of the initial prompt.

## Steps

1. Confirm the workflow YAML is syntactically valid:
   - Use `actionlint` if available, otherwise manually verify YAML structure.
   - Every job must have `runs-on`, every step must have `uses` or `run`.

2. Verify dry-run mode exists (amendment A5[^a5]):
   - Every workflow **must** support a dry-run mode gated by an environment
     variable (e.g. `DRY_RUN: true`).
   - Confirm the dry-run path exercises the workflow's core logic without
     making irreversible changes.

3. Check action references:
   - All `uses:` actions must be pinned to a commit SHA or a specific tag
     (not floating `@main` or `@master`).
   - Prefer off-the-shelf actions over custom ones (step 22 guidance).

4. Verify triggers are appropriate:
   - `push` / `pull_request` workflows should not fire on every branch unless
     intentional.
   - Scheduled workflows should have a sensible cron interval.
   - Confirm the workflow does not run on `main` until the PR is merged (or
     uses dry-run on PRs per A5).

5. Confirm secrets and environment variables are accessed correctly:
   - Secrets use `${{ secrets.NAME }}`, not hardcoded values.
   - Any new secret references are documented in the PR description.

6. For screenshot/artifact workflows (step 28 requirement):
   - Verify the workflow uploads artifacts using `actions/upload-artifact`.
   - Confirm artifact paths are deterministic and do not include timestamps
     in directory names (use a date-named path per step 28).

## Notes

- Amendment A5 requires all workflows to support dry-run on the dev branch.[^a5]
- `[no ci]` commit messages must be used for doc-update commits from CI (step 28).
- **Update this skill** when step 27 adds the `tilt ci` workflow and when step 28
  finalises screenshot upload patterns.

[^a5]: Amendment A5, `docs/INITIAL_PROMPT.md` — <https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/docs/INITIAL_PROMPT.md#L418>
