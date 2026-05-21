---
name: validate-change
description: >
  Validate a change just made to the farish repo. Use when asked to "validate
  this change", "check my change", "run validation", "verify what I just did",
  or after any commit before pushing. Identifies the change type and routes to
  the matching type-specific validation subskill.
---

# Validate Change

Drilldown router: identifies what kind of change was just made and runs the
right validation procedure for each type.

## Steps

1. Identify changed files:
   ```
   git diff --name-only HEAD
   ```
   Use staged-only if not yet committed: `git diff --name-only --cached`

2. Map each changed path to one or more change types using this table:

   | Changed path matches                              | Type   | Subskill                     |
   |---------------------------------------------------|--------|------------------------------|
   | `apps/`, `services/`, `lib/`, `packages/`        | code   | `validate-change-code`       |
   | `infra/`, `.github/settings.yml`, `renovate.json` | infra  | `validate-change-infra`      |
   | `.github/workflows/`                              | ci     | `validate-change-ci`         |
   | `docs/` (non-spec), root `*.md`                   | docs   | `validate-change-docs`       |
   | `.claude/skills/`, `.claude/rules/`, `.claude/hooks/` | skill | `validate-change-skill`  |
   | `docs/pages/**/SPEC.md`, `docs/api/**/SPEC.md`    | spec   | `validate-change-spec`       |

3. For each matched type, run the corresponding subskill in order.
   Multiple types may match for a single change — run all of them.

4. If any subskill reports a failure, fix it before pushing.

## Notes

- This skill and its subskills are intentionally lean — tooling is added in
  steps 22+. **Update the relevant subskill whenever new tooling is confirmed.**
- When unsure of the type, err toward running more subskills rather than fewer.
- Source: step 21 of `docs/INITIAL_PROMPT.md`[^prompt-21].

[^prompt-21]: [docs/INITIAL_PROMPT.md — step 21](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/docs/INITIAL_PROMPT.md#L245)
