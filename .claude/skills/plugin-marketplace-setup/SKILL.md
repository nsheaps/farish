---
name: plugin-marketplace-setup
description: Install Claude Code plugin marketplaces and plugins for the farish repo. Use when adding or updating marketplaces/plugins, onboarding the repo, or when a private nsheaps marketplace fails to resolve from a sub-agent.
---

# Plugin & marketplace setup

The `claude plugin` CLI authenticates through the local git proxy, so it CAN
clone and install from **private** `nsheaps/*` repos. A sub-agent's `WebFetch`
against github.com is unauthenticated and CANNOT — never use `WebFetch` to read
a private marketplace repo, and never conclude a private marketplace is
inaccessible because `WebFetch` failed. Use the CLI.

## Steps

1. Add a marketplace from a GitHub repo:
   `claude plugin marketplace add <owner>/<repo>`
   The marketplace name is the repo name (`nsheaps/agents` becomes `agents`).
2. Install a plugin at **project** scope so it is committed to
   `.claude/settings.json`. Do NOT use `local` scope — that writes
   `.claude/settings.local.json`, which is gitignored and not saved:
   `claude plugin install <plugin>@<marketplace> -s project`
3. Verify with `claude plugin list` (each should show `Status: enabled`).
4. Plugins installed mid-session load fully (skills/agents/hooks/MCP servers)
   only on the next session start. There is no in-session reload tool exposed to
   the agent.
5. `.claude/settings.json` must declare `extraKnownMarketplaces` for every
   non-default marketplace so a fresh checkout can resolve plugins. The official
   `claude-plugins-official` marketplace is a default and need not be declared.

## farish marketplaces & plugins

- Marketplaces: `agents` (`nsheaps/agents`), `ai-mktpl` (`nsheaps/ai-mktpl`).
- The authoritative enabled-plugin list lives in `.claude/settings.json` under
  `enabledPlugins`.
