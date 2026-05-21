---
name: do-some-work
description: >
  End-to-end workflow for implementing a Task: pick up a task from
  .claude/tasks/, implement it, validate, commit, push, and confirm CI is
  green. Use when starting work, "pick up a task", "do some work",
  "implement task N", "work on the next task", or resuming in-progress work.
---

# Do Some Work

Sequential checklist for delivering a Task end-to-end. Each phase builds on
the last — do not skip steps.

## Steps

1. **Pick up the task.**
   - `ls .claude/tasks/` — find the next `todo` task. Read its JSON.
   - If creating a new record: `{"id":"...","subject":"...","status":"todo","description":"..."}`.
   - Update `status` to `"in_progress"`, write back to `.claude/tasks/<id>.json`.
   - Re-read `docs/INITIAL_PROMPT.md` to confirm the task maps to the right step number.

2. **Plan the implementation.**
   - Run `Skill(sequential-thinking:sequential-thinking)` to break the change into atomic commits before touching any file.
   - If the task is a spec or page: run `Skill(spec-writing)` first.
   - If the task needs wireframes: run `Skill(page-wireframing)`.
   - If the task produces API requirements: run `Skill(page-to-api-requirements)`.
   - Note which skills apply before writing code.

3. **Implement incrementally.**
   - One logical change per commit (atomic conventional commits — `always-keep-improving.md`).
   - After each file change, update the task record with a short progress note.
   - Never chain Bash commands; turn multi-step operations into scripts.

4. **Write or update automated tests.**
   - New behaviour must have tests in the same commit that introduces it.
   - Playwright tests cover every page; tests must be named to match the page spec.

5. **Validate locally.**
   - Run `Skill(validate-change)` — it routes to the right subskill(s) for your change type.
   - Root gate: `mise run check` (lint → test → build). This is the exact sequence CI runs.
   - Fix every failure before committing.

6. **Commit and push.**
   - Run `Skill(scm-utils:commit)` for each atomic commit.
   - Push: `git push origin HEAD`.

7. **Verify CI — step 28 requirements.**[^step28]
   - All CI checks must be green. If any fail: fix locally (step 5), re-commit, re-push.
   - CI must run the **same codepaths** as local (`mise run check` / nx task graph).
   - On `main`: CI Playwright run screenshots **every page**, commits screenshots with
     `[skip ci]` under a date-based path, and publishes them to GitHub Pages.
   - All specs (pages, APIs, wireframes) are published to GitHub Pages on every push to `main`.
   - No PR is considered done until the CI run on that PR's branch is fully green.

8. **Complete the task.**
   - Update the task record: `"status": "completed"`.
   - Capture any follow-ups as new `.claude/tasks/<id>.json` records or GitHub issues.
   - Run `Skill(validate-change-skill)` if any skill or rule was modified during this task.
   - After completing the task, re-read `docs/INITIAL_PROMPT.md` and confirm the step is done.

## Notes

- Task records live in `.claude/tasks/<id>.json`. The task-utils MCP server
  auto-commits them when available; otherwise write them by hand.
- Keep commits atomic: one reason to change, one commit. Use `feat:`, `fix:`,
  `docs:`, `chore:`, `ci:` prefixes.[^conventional]
- CI screenshot publishing and spec publishing are defined in step 28 of the
  initial prompt and must be validated every time a workflow changes.

[^step28]: Step 28 of `docs/INITIAL_PROMPT.md` — CI always green, same codepaths as local, screenshots of every page on main committed with `[skip ci]` and published to GitHub Pages, specs published to GitHub Pages. See [INITIAL_PROMPT.md](https://github.com/nsheaps/farish/blob/claude/ai-3d-model-generator-XjoUi/docs/INITIAL_PROMPT.md#L307).
[^conventional]: Conventional Commits — <https://www.conventionalcommits.org>
