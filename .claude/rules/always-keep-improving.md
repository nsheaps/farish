# Always keep improving

1. The initial prompt that started this all can be found at
   [docs/INITIAL_PROMPT.md](../../docs/INITIAL_PROMPT.md) and should be reviewed
   to ensure progress is being made accurately.

You can do literally anything. The skills you will make and have made make what
you do possible. To do something new, all you need to do is make a skill. Always
check your skills before during and after Tasks to see if there's any helpful
skills. Use `Agent(run_in_background:true)` carefully to parallelize tasks where
you can. These skills are only as good as their instructions.

CRITICAL: Changes to your configuration/rules/code/skills/hooks/agents must be
committed IMMEDIATELY after making them.

CRITICAL: Commits for this project MUST be atomic (only change one thing) using
the conventional commit style. Push often. Use CI to your advantage, but local
is always faster.

CRITICAL: NEVER execute `Bash(do && a && bunch || of ; things)` or
`Bash(python -c "a big python script")`. If the Bash tool call is doing more
than 1 or 2 things, it needs to be turned into a script (build a logical
hierarchy with proper CLAUDE.md documentation throughout in
`.claude/scripts/paths/to/categorize/meaningful-name.sh`. ALWAYS check to see if
a script exists before creating a new one. ALWAYS know which scripts you'll need
before executing a plan. ALWAYS make sure the scripts are tested. ALWAYS share
code between scripts when possible. ALWAYS prefer bun/ts/compiled tool (but
scripts are okay). ALWAYS use monorepo tooling, even in the scripts, they're
code too!

CRITICAL: Try to prefer behavior modifications in the following priority order:
  1. Hooks in claude configs (remember don't keep any in settings.local.json
     they're not saved!)
  2. `Skill(context:fork)`
  3. `Agent()` - don't forget they're resumable! Work iteratively with them,
     don't make them do everything in one go, guide them not to, they don't
     share the conversation context, ANY outputs should go to file that you can
     review. ALWAYS run them in the background AND check their work.
    - even better if they have their own hooks, which can help contain
      specialized behavior
  4. Hookify hooks - these help fine tune behaviors and keep things consistent.
     Anytime there's a regression in behavior, consider using these or a skill!
  5. Skills still, with scripts to encapsulate behavior
  6. Scripts
  7. Rules. These take up context and aren't really actually enforceable.
Use hooks to ensure something actually happens, skills on how to use tools,
Agents to encapsulate a recurring behavior where only the ins/outs are needed.

CRITICAL: NEVER use the general-purpose agent. ALWAYS see if you have an agent or
skill specialized in that task, and if not, make one or add it to an existing
one.

CRITICAL: KEEP SKILLS SMALL. Keep examples in supplementary documentation that
are mentioned (not @mentioned). Make most skills an ordered list of
instructions. Delegate shared knowledge to shared skills (eg don't describe how
to use git in making-a-pr, make a tool-cli-git skill that describes how to do
it). Disambiguate skills to make it easy to find the right skill without reading
one skill that does everything. If the skill is more than 5 paragraphs, it
probably needs to be broken up (including ones that were already too big before
you touched it). Always break things into maintainable and shareable chunks.

CRITICAL: Set up a cron for every 15 minutes to do a full review of your
configuration using "audit-verify-improve-agent" (create if it doesn't exist).
When you eventually go idle, set up a stop hook to do one final audit, make any
final adjustments, and push any remaining changes. This skill MUST be
context:fork, and review conversation transcripts to get the full picture,
iteratively, don't rely on memory. Use a haiku agent to scan logs since the last
time it ran (store in file somewhere using skill
`` !`date | tee .claude/state/self-improvement-last-ran` `` syntax within the
skill to write it everytime the skill is called) for instances where trouble
occurred, and note it by appropriate IDs for beginning and end of the issue. use
a script to extract the conversation transcript between those IDs, then another
script to convert it from JSONL to a more readable, chat-style output (like one
that you'd get from claude-stream from nsheaps/claude-utils).

CRITICAL: Be verbose in the data you give an Agent, explicit about the actions
you want it to take and not to take, requirements (including what you want for
the outputs and details about what you want them to contain), validation steps,
restrictions, other-notes. It will make stuff up if you don't tell it how to do
it's thing, including using skills. Use resuming to your advantage. Make sure it
understands the task (it needs to Stop to confirm with you) before it does the
task if the task is complex. Check it's outputs, don't always assume they're
right.

CRITICAL: You AND all Agents (subagents, et al) are EXPECTED to use
github-footnote-style references in ALL documents, issues, PRs, markdown docs,
etc to link to sources that support your claim. Claims made without sources or
significant data to back it up will be rejected. Use the repo's
`.claude/sources/xxx/yyy/zzz.abc` to store sources that can't directly be linked
to (eg scrubbed+humanified transcripts) and link to those. Always reference
files inside the repo using `github.com/…` links, NEVER filesystem paths. Review
your claims before making them, if you feel anywhere _might_ deserve a
`[citation needed]`, then you MUST add a citation, or update the claim BEFORE
you send it.

CRITICAL: Always consult with claude-code-guide running as sonnet or opus to
help with updating/changing agent configs. Encourage it to always be thorough in
it's research. Don't believe github issues about claude-code unless they have
significant community support or confirmation from anthropic.

CRITICAL: If you ever achieve undesired, unplanned, failed, or errored results
when executing tools, skills, following rules, being guided by hooks, executing
agents, you MUST update the appropriate configuration/code/document/skill.

CRITICAL: After completing every task, THINK HARD about what you did during the
task (use an Agent to review the transcript if necessary) and which skills you
executed during the task. Update configs/rules/code/skills/agents as necessary
to improve them for the next time.

CRITICAL: ALWAYS USE SKILLS AND AGENTS, EVEN IF YOU THINK YOU KNOW HOW TO DO
SOMETHING.

CRITICAL: ALWAYS use `/scm-utils:commit` to commit code.

CRITICAL: images use up insane amounts of context. ONLY use them within an
`Agent()`. Be explicit about what you want to know about the image.

EXTRA SUPER CRITICAL: As soon as you can, run the audit-verify-improve-agent when
you see this, which should start with improving the rules, including this file
if you deem fit. Make sure you're only keeping things in rules that need to be
visible all the time, and REALLY encouraging the use of Hooks, Skills, and
Agents.
