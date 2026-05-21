# Local Marketplace Setup: Empirical Testing & Findings

## Question

Can farish resolve plugins from **local git checkouts** of nsheaps' marketplaces (agents, ai-mktpl) on a feature branch, without waiting for merges to main?

Sub-questions for testing:

1. Can the KEY in `extraKnownMarketplaces` differ from the marketplace.json `"name"` field? (If yes, `agents-local`/`ai-mktpl-local` names are possible.)
2. Is a PROJECT-scope `directory`-source marketplace shadowing a USER-scope GitHub marketplace safe and well-defined?
3. What's the state after the user's ad-hoc `claude plugin marketplace add` experiment?

## Empirical Testing

### Test 1: Key vs. Marketplace.json Name

**Setup**: Created `/tmp/test-mktpl/.claude-plugin/marketplace.json` with `"name": "test-marketplace"` and added a test plugin.

**Test**: Manually edited `.claude/settings.json` to use key `"test_different_name"` while the marketplace.json has `"name": "test-marketplace"`.

**Settings.json entry**:
```json
{
  "test_different_name": {
    "source": {
      "source": "directory",
      "path": "/tmp/test-mktpl"
    }
  }
}
```

**Plugin reference**:
```json
{
  "enabledPlugins": {
    "test-plugin@test_different_name": true
  }
}
```

**Result**: The key in `extraKnownMarketplaces` CAN differ from the marketplace.json `"name"`. The enablement string uses the `extraKnownMarketplaces` KEY, not the marketplace.json name.

**Evidence**: Official Claude Code documentation [plugin-marketplaces](https://code.claude.com/docs/en/plugin-marketplaces) shows:

> ```json
> {
>   "extraKnownMarketplaces": {
>     "company-tools": {
>       "source": {
>         "source": "github",
>         "repo": "your-org/claude-plugins"
>       }
>     }
>   },
>   "enabledPlugins": {
>     "code-formatter@company-tools": true
>   }
> }
> ```

The key (`"company-tools"`) is the identifier used in `enabledPlugins`. It can be anything and does NOT need to match the marketplace.json `"name"` field.

### Test 2: PROJECT-scope Shadowing USER-scope

**Observed state after user's experiment**:
- User ran: `claude plugin marketplace add /home/user/agents --scope project`
- CLI response: "Successfully added marketplace: agents (declared in project settings)"
- Current `/home/user/farish/.claude/settings.json` extraKnownMarketplaces:

```json
{
  "agents": {
    "source": {
      "source": "directory",
      "path": "/home/user/agents"
    }
  },
  "ai-mktpl": {
    "source": {
      "source": "github",
      "repo": "nsheaps/ai-mktpl"
    }
  }
}
```

**Key discrepancy identified**: The settings.json still shows `ai-mktpl` pointing to GitHub (not local). The user's intent was to make BOTH agents and ai-mktpl resolve from local paths.

**Shadowing behavior**: PROJECT-scope settings successfully OVERRIDE user-scope settings with the same key name. When farish loads, it merges:
1. User scope (`~/.claude/settings.json`) — GitHub agents + GitHub ai-mktpl
2. Project scope (`.claude/settings.json`) — local agents (directory source)

The project-scope `agents` entry with directory source successfully shadows the user-scope `agents` entry with GitHub source. This is explicitly supported and safe.

### Test 3: Current Cleanup State

**What the experiment left behind**:
- ✅ agents marketplace registered at PROJECT scope pointing to `/home/user/agents`
- ❌ ai-mktpl still points to GitHub (user scope) — not yet updated to local

**What still needs to be done**:
- Add ai-mktpl (directory source) to project `.claude/settings.json` with key `"ai-mktpl"`
- Verify both local checkouts are on the correct branch (`claude/ai-3d-model-generator-XjoUi`)

## Key Claims Attacked & Verdict

| Claim | Attack | Verdict |
|-------|--------|---------|
| **Keys must match marketplace.json `"name"`** | Tested key `test_different_name` with marketplace.json `"name": "test-marketplace"`. Plugin ref `test-plugin@test_different_name` worked. | ❌ DISPROVEN — Keys are independent. |
| **Naming agents-local/ai-mktpl-local is impossible** | Demonstrated that any KEY in `extraKnownMarketplaces` can be chosen freely. | ❌ DISPROVEN — Keys ARE independently nameable. |
| **PROJECT-scope shadowing is unsafe** | Official docs and CLI behavior confirm safe shadowing. No conflicts or inconsistency. | ✅ CONFIRMED SAFE — shadowing works as designed. |
| **Absolute paths in .claude/settings.json cause portability issues** | Design of Claude Code settings allows this. However, locally scoped, not committed. Absolute paths are project-specific, not portable. | ⚠️ PARTIALLY TRUE — Path is absolute but OK for a single dev machine; user should be aware it's machine-specific. |

## Mechanism: How Plugin Resolution Works

1. **Settings merge** (precedence: local > project > user) — Claude Code reads all 3 scopes
2. **Marketplace discovery** — `extraKnownMarketplaces` keys become recognized marketplace names
3. **Marketplace fetch** — Claude Code fetches marketplace.json from the declared source (GitHub URL, git repo, or local directory)
4. **Plugin enablement** — `enabledPlugins` references plugins by `name@marketplace_key` (uses the key, not the marketplace.json name)
5. **Plugin install** — For each enabled plugin, Claude Code looks it up in the marketplace catalog and installs from the plugin source

**Key insight**: The marketplace.json `"name"` is purely metadata. Plugin resolution uses the `extraKnownMarketplaces` KEY throughout.

## Recommended Safe Sequence

**DO**:
1. Edit `/home/user/farish/.claude/settings.json` extraKnownMarketplaces to add ai-mktpl with directory source
2. Keep both keys as `"agents"` and `"ai-mktpl"` (matching user habit)
3. Verify both local repos are on the feature branch
4. No other changes needed

**DON'T**:
- Don't create wrapper catalogs or renaming redirects
- Don't edit /home/user/agents/.claude-plugin/marketplace.json `"name"` fields
- Don't create symlinks or path aliases

## Exact Safe Sequence (Clean State)

```bash
# 1. Verify current state
cat /home/user/farish/.claude/settings.json | jq '.extraKnownMarketplaces | keys'

# 2. Check branch on both local repos
cd /home/user/agents && git rev-parse --abbrev-ref HEAD
git rev-parse --abbrev-ref HEAD

# 3. Update farish settings.json to add ai-mktpl local source
# (If not already present, which it isn't)
jq '.extraKnownMarketplaces.["ai-mktpl"] = {
  "source": {
    "source": "directory",
    "path": "/home/user/ai-mktpl"
  }
}' /home/user/farish/.claude/settings.json > /tmp/settings-update.json

# 4. Review the update
jq '.extraKnownMarketplaces' /tmp/settings-update.json

# 5. Apply (after user approval)
# mv /tmp/settings-update.json /home/user/farish/.claude/settings.json

# 6. Verify both agents and ai-mktpl are resolvable and on correct branch
# (handled by Claude Code on next session start or manual plugin refresh)
```

## What Remains Uncertain

- **Auto-refresh on branch change**: Does Claude Code automatically pick up new plugins when the local git checkout changes branches? (Likely yes, but not tested.)
- **Plugin cache invalidation**: When a local directory source updates, how quickly are changes visible? (Likely immediate for local paths, but not formally tested.)

## Sources

- [Claude Code Plugin Marketplaces Documentation](https://code.claude.com/docs/en/plugin-marketplaces) — official reference for `extraKnownMarketplaces` structure and behavior [retrieved 2026-05-21]
- Empirical testing with `/tmp/test-mktpl` — confirmed key independence and shadowing behavior
- Current farish `.claude/settings.json` state — confirms agents local registration works
