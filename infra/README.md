# `infra/`

Infrastructure-as-code for deploying farish.

## Status

Placeholder. The deployment targets are known from the initial prompt and its
amendments, but the actual IaC lands with later steps:

| Target                  | Purpose                                   | Prompt reference     |
| ----------------------- | ----------------------------------------- | -------------------- |
| GitHub Pages            | Static browser app + docs site            | steps 24, 27, 28     |
| Vercel (free plan)      | Backend / social layer, if required       | amendment A3         |
| `.github/settings.yml`  | Repo config as code (branch protection)   | amendment A1         |
| ghcr.io                 | Container/package publishing              | step 26              |

## Convention

When IaC packages are added here, each is a normal bun workspace package with
the standard `lint` / `format` / `test` / `build` run-scripts so it appears in
the nx task graph like any other package.

See [`docs/monorepo/`](../docs/monorepo/) for the toolchain guides.
