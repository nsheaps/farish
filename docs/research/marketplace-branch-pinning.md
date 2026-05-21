# Marketplace Branch Pinning in Claude Code

## Summary

**Branch-pinning a marketplace _source_ is NOT supported** — the `github` marketplace source type does not accept a `ref` field in `extraKnownMarketplaces`, and marketplaces resolve from their default branch. **But the goal — using a plugin from a non-default branch — IS achievable** via a different mechanism: register a **local git checkout** (kept on the target branch) as a `directory`-source marketplace. See [Working strategy](#working-strategy--local-checkout-directory-marketplace) below; full details in [`local-marketplace-setup.md`](local-marketplace-setup.md).

## Detailed Findings

### Marketplace Sources vs Plugin Sources (Critical Distinction)

Claude Code distinguishes between two independent pinning mechanisms:

1. **Marketplace source** — where to fetch the `marketplace.json` catalog itself (declared in `extraKnownMarketplaces` in settings or via `/plugin marketplace add`)
2. **Plugin source** — where to fetch individual plugins listed inside the marketplace catalog (declared in the `source` field of each plugin entry inside `marketplace.json`)

**Marketplace sources do NOT support `ref` pinning.** Only plugin sources do.

### Marketplace Source Fields (No Branch Support)

When declaring a marketplace in `extraKnownMarketplaces`, the official schema is:[^1]

```json
{
  "extraKnownMarketplaces": {
    "agents": {
      "source": {
        "source": "github",
        "repo": "nsheaps/agents"
      }
    }
  }
}
```

The `github` marketplace source accepts only:
- `source`: `"github"` (required)
- `repo`: `"owner/repo"` format (required)
- No `ref`, `sha`, `branch`, or `tag` fields are documented or accepted.

Other marketplace source types (`url`, `git-subdir`) also do not support `ref` at the marketplace level.[^1]

### Plugin Sources DO Support Branch Pinning (Different Config)

Individual plugins listed IN a marketplace can be pinned to branches:

```json
{
  "name": "my-plugin",
  "source": {
    "source": "github",
    "repo": "owner/plugin-repo",
    "ref": "v2.0.0",
    "sha": "a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0"
  }
}
```

But this is configured in the `plugins` array inside `marketplace.json` itself, NOT in the project's `settings.json`.[^1]

### CLI Confirmation

Running `claude plugin marketplace add --help` shows no `--ref`, `--branch`, or `--tag` flag.[^2] The command accepts only `--scope` and `--sparse`.

Running `claude plugin marketplace --help` shows no ref-related options.[^2]

### What You Need to Do

To use a plugin from a non-default branch:

1. **EITHER** — Merge the feature branch to the default branch of the marketplace repo
2. **OR** — Create a **new marketplace** that points to the same repo but is configured differently (workaround; not scalable)
3. **OR** — Maintain the plugin source manually in your own marketplace manifest and pin it there (requires hosting your own marketplace catalog)

## Tested and Failed Approaches

The user confirmed these do NOT work:[^3]

1. Adding `"ref": "branch-name"` to the `source` object in `extraKnownMarketplaces` — silently ignored
2. Using the `--ref` flag with `claude plugin marketplace add` — flag does not exist
3. Using the `--branch` flag — flag does not exist

## Working strategy — local-checkout directory marketplace

Although a marketplace _source_ cannot be branch-pinned, the goal — use a
plugin from a non-default branch — IS achievable:

1. Keep a **local git checkout** of the marketplace repo, checked out to the
   desired branch.
2. Register that checkout as a **`directory`-source marketplace** in
   `extraKnownMarketplaces`. The `extraKnownMarketplaces` KEY is free-form
   (independent of the `marketplace.json` `"name"`), so it can be named
   distinctly — e.g. `agents-local`.
3. Point the relevant `enabledPlugins` entries at the local marketplace key.

A `directory` marketplace serves plugins from the checkout's current working
tree, so whatever branch the checkout sits on is what gets served.

**Operational caveat:** a `directory` marketplace does NOT auto-update when the
branch advances on the remote. The local checkout must be continually
`git fetch`ed + `git pull`ed to stay current — otherwise the marketplace serves
stale plugin code. farish automates this in its `SessionStart` hook
(`.claude/hooks/session-start.sh`), which refreshes `/home/user/agents` and
`/home/user/ai-mktpl` on every session start.

Full empirical findings and farish's exact configuration:
[`local-marketplace-setup.md`](local-marketplace-setup.md).

## Conclusion

A marketplace's _source_ cannot be branch-pinned (`ref` is silently ignored for
`github` sources). But the objective is met by the **local-checkout directory
marketplace** strategy above: register a local checkout — kept on the target
branch and kept fresh by your own `git fetch`/`pull` — as a `directory`
marketplace. farish uses this for `agents-local` and `ai-mktpl-local`.

---

## Sources

[^1]: Claude Code Official Documentation - Create and Distribute a Plugin Marketplace. "Plugin sources" section describing the `github` source type and its fields, and the distinction between marketplace sources (which do not support `ref`) and plugin sources (which do). [https://code.claude.com/docs/en/plugin-marketplaces](https://code.claude.com/docs/en/plugin-marketplaces)

[^2]: Claude Code CLI `--help` output for `claude plugin marketplace add` and `claude plugin marketplace`. Confirmed no `--ref`, `--branch`, or `--tag` flag exists. Output captured 2026-05-21.

[^3]: User testing summary (provided in task context): attempted `"ref": "branch-name"` in settings.json — silently ignored. Attempted CLI flags `--ref` and `--branch` — not recognized.
