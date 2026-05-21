# `plugins/` — Claude plugin marketplace

A [Claude Code plugin marketplace][cc-marketplace] for the farish project.

## Layout

```
plugins/
├── .claude-plugin/marketplace.json   # marketplace manifest (lists plugins)
└── farish-dx/                        # example plugin
    ├── .claude-plugin/plugin.json    # plugin manifest
    └── skills/monorepo-tasks/SKILL.md
```

## Using this marketplace

From a Claude Code session, add the marketplace and enable a plugin:

```
/plugin marketplace add ./plugins
/plugin install farish-dx@farish
```

`farish-dx` is a dummy example plugin scaffolded to exercise the marketplace
structure. Real farish-specific plugins are added as the project grows.

[cc-marketplace]: https://code.claude.com/docs/en/plugins
