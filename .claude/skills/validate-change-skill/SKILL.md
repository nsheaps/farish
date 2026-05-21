---
name: validate-change-skill
description: >
  Validate a skill, rule, hook, or agent config change (.claude/skills/,
  .claude/rules/, .claude/hooks/, .claude/settings.json). Use when asked to
  "validate a skill change", "check the rule I added", "verify the hook", or
  from validate-change when changed paths are under .claude/.
---

# Validate Change — Skill / Config

Validation procedure for Claude skill, rule, hook, and agent config changes.

## Steps

1. For skill files (`SKILL.md`):
   - Confirm YAML frontmatter is present with both `name` and `description`.
   - Verify `description` contains trigger phrases (natural language that would
     cause an agent to invoke this skill).
   - Count paragraphs — if more than 5, the skill needs to be split.[^keep-small]
   - Confirm the skill is a numbered instruction list, not free-form prose.
   - If the skill references other skills, confirm those skills exist at
     `.claude/skills/<name>/SKILL.md`.

2. For rule files (`.claude/rules/*.md`):
   - Confirm the rule is genuinely something that must be visible on every API
     call (rules consume context budget).[^rules-context]
   - If it describes "how to do something", move it to a skill instead.
   - Keep the rule concise.

3. For hook scripts:
   - Confirm the script has a shebang line and is executable (`chmod +x`).
   - Verify the script does not suppress errors with `2>/dev/null` for
     significant operations.
   - Test the hook by running it with representative input.

4. For `.claude/settings.json`:
   - Run `Skill(update-config)` for any settings changes.
   - Confirm no sensitive values (secrets, API keys) are stored in the file.
   - Verify hooks reference scripts by absolute path or path relative to the
     repo root.

5. Commit immediately — per the always-keep-improving rule, config/skill changes
   must be committed right after making them.[^commit-rule]

## Notes

- Skills are validated by trying them. If possible, invoke the new/changed skill
  and confirm it produces the expected output.
- **Update this skill** if new config file types are introduced.

[^keep-small]: KEEP SKILLS SMALL rule — `docs/INITIAL_PROMPT.md` step 4, always-keep-improving.md.
[^rules-context]: Rules take up context — prefer skills and hooks per priority order in always-keep-improving.md.
[^commit-rule]: Commit immediately rule — `.claude/rules/always-keep-improving.md`.
