# Public code, private life

q-pi is a public template. Treat any tracked file as publicly readable, including
old Git revisions. Do not put personal data into a commit and plan to delete it
later.

## Storage boundaries

| Location | Appropriate content |
| --- | --- |
| Tracked repo | Generic instructions, reusable code, synthetic fixtures, public docs |
| Ignored `private/` | Personal preferences, drafts, reports, exports, private workflows, temporary payloads |
| q5m memory | Curated cross-session facts in the intended agent and Home |
| q5m application data | Tasks, notes, events, and other records through their owning tools |
| Pi/Paseo session storage | Local/daemon conversation history, managed separately from this repo |
| CLI/provider credential stores | Credentials managed by the installed tools, never opened by the agent |

Create a private directory with restrictive permissions on Unix-like systems:

```bash
mkdir -p private
chmod 700 private
cp examples/private-AGENTS.md private/AGENTS.md
chmod 600 private/AGENTS.md
```

Only do the copy for a new preferences file; don't overwrite your existing one.
Ignored files are not encrypted or protected from the agent, local extensions,
other authorized filesystem readers, backups, or model-provider processing.
The template is guidance, not a sandbox or complete DLP system.

## Before sharing

- Inspect `git status --short`, the exact staged diff, and the staged file list.
- Never use `git add -f` for ignored life-work content. Stage code/docs explicitly.
- Review tracked fixtures and screenshots for identities, addresses, Home IDs,
  account numbers, calendars, messages, health/financial data, and API responses.
- Do not share raw Pi/Paseo session exports, gists, terminal logs, or q5m catalogs
  from real accounts. Sessions may include tool results even if no file was saved.
- A “local” dashboard bound to a network address or published by a preview tool
  can disclose data. Use synthetic data until hosting/sharing is explicitly approved.
- Public instructions should describe capabilities and judgment, not your actual
  family, account topology, addresses, or machine-specific paths.

## Model and backend processing

q5m remains a network service. The CLI sends authenticated tool requests to the
configured backend. Pi's selected model may receive relevant tool results and
local context. This is not an offline or cloud-free mode. Model-provider terms,
q5m data handling, and Paseo host access still matter.

Keep Home boundaries explicit. Private access from a generalist is not permission
to copy data into a shared Space, another service, a public repo, or a published
report. Minimize sensitive fields even when the source is legitimately accessible.

Do not automatically mirror local chats into q5m memory or recall. Store only
useful curated facts with appropriate scope and user intent.

## If something leaks

Stop publishing. Revoke exposed credentials with the owning service, notify the
user, and assess history/session/artifact copies. Deleting the current file is
not sufficient to remove it from Git history or downstream copies. Don't run a
destructive history rewrite without authorization.
