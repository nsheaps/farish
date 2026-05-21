---
name: validate-change-infra
description: >
  Validate an infrastructure change (infra/ directory, .github/settings.yml,
  renovate.json, Vercel config). Use when asked to "validate infra changes",
  "check the infra config", or from validate-change when changed paths are under
  infra/, .github/settings.yml, or renovate.json.
---

# Validate Change — Infra

Validation procedure for infrastructure-as-code changes.

> **Keep up to date.** Infra tooling is decided in step 26 of the initial
> prompt (Vercel for backend, `repository-settings` GitHub App for repo config,
> Renovate for dependency updates). Update this skill as tooling is confirmed.

## Steps

1. Identify which infra file(s) changed:
   - `infra/` — IaC definitions (tooling TBD at step 26)
   - `.github/settings.yml` — repo settings via `repository-settings` app[^repo-settings]
   - `renovate.json` / `renovate.json5` — Renovate dependency config[^renovate]

2. For `.github/settings.yml`:
   - Verify YAML syntax is valid.
   - Confirm branch protection rules include the `claude/ai-3d-model-generator-XjoUi`
     branch as appropriate (amendment A5).
   - Check no required status checks reference non-existent workflows.

3. For `renovate.json` / `renovate.json5`:
   - Confirm it extends `github>nsheaps/renovate-config`[^nsheaps-renovate]
     (amendment A2).
   - Validate JSON/JSON5 syntax.

4. For `infra/` changes (IaC):
   - Run the plan/validate command for the chosen tool (TBD at step 26).
   - Confirm no secrets or credentials are hardcoded.
   - Verify any environment variables referenced exist in the deployment target.

5. If changes affect Vercel deployment (amendment A3):
   - Confirm free-plan constraints are respected (no paid features).
   - Verify environment variable names match what the app expects.

## Notes

- Amendment A1 mandates `repository-settings` app for all repo config.[^repo-settings]
- Amendment A3 allows Vercel on the free plan only.[^vercel]
- **Update this skill** when step 26 finalises the IaC tooling choice.

[^repo-settings]: Repository Settings App — <https://github.com/repository-settings/app>
[^renovate]: Renovate documentation — <https://docs.renovatebot.com>
[^nsheaps-renovate]: nsheaps/renovate-config — <https://github.com/nsheaps/renovate-config>
[^vercel]: Vercel free plan — <https://vercel.com/pricing>
