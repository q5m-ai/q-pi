# q-pi

**Your life-work workspace in [Pi](https://pi.dev), powered by [q5m](https://www.q5m.ai).**

Talk naturally. Use your connected agents, skills, memory, and services. Build
scripts, reports, small apps, and new workflows when conversation isn't enough.
No need to prefix requests with “use q5m CLI.”

> “Help me plan next week around my calendar and training.”
>
> “What did we decide about the trip?”
>
> “Make a small dashboard for my tasks, using synthetic data first.”

[`AGENTS.md`](AGENTS.md) makes q5m-aware life work the default, while preserving
Pi's coding tools. This is a portable workspace template, not a Pi fork or a new
web chat application.

## Start here

Start with **Node.js 22.19+**, **npm**, and **Pi with a configured model** on the
machine running the agent. The agent can install the **q5m CLI** for you and guide
secure login. q5m's package is `@q5m-ai/cli`; its executable is `q5m`.

```bash
git clone https://github.com/q5m-ai/q-pi.git
cd q-pi
pi
```

Review this repository before trusting its project resources. Pi automatically
loads the root `AGENTS.md`; trust the project to enable its local prompts and
skill discovery. Then ask for an ordinary task. No npm dependency install is
needed for this workspace or its tests.

**First time?** Say “Set up q5m for me.” The agent checks prerequisites, installs
only a missing CLI with your approval, guides secure login, and verifies the
connection. If an ordinary task reveals a missing CLI, it offers to do the setup
instead of just showing commands. You complete login securely, never by pasting
credentials into chat. Existing installations are reused, not silently upgraded.

Already installed and authenticated? Nothing else is required: the agent can
use `q5m` through bash. For **native tools**, install the official extension once
in your Pi installation:

```bash
pi install npm:@q5m-ai/cli
```

Restart Pi, then use `/q5m status`. The official extension loads Q's live
instructions and catalog and exposes peer tools with their exact schemas. q-pi
does not duplicate it or silently modify your global Pi settings.

**Recommended, optional:** [Paseo](https://paseo.sh) is a companion for using this
workspace with a Pi agent. It isn't required; running Pi directly works too.

Missing prerequisites? See [setup and troubleshooting](docs/setup.md), including
Paseo, older CLI login flows, and remote-host authentication.

## What you get

| Path | Purpose |
| --- | --- |
| `AGENTS.md` | Always-on generalist behavior, capability routing, memory, Home and action boundaries |
| `.agents/skills/q5m-workflows/` | Schema-driven CLI fallback, loaded when needed |
| `.pi/prompts/` | Optional `/day-plan`, `/weekly-review`, `/build-workflow` shortcuts |
| `scripts/doctor.mjs` | Read-only readiness checks, with no credential or catalog dumps |
| `examples/private-AGENTS.md` | Starting point for private preferences |
| `private/` (ignored, created by you) | Personal notes, generated artifacts, local workflows, and scratch work |

Shortcuts are conveniences, not required commands. Customize the public
instructions and workflows for your own template, or put personal preferences in
`private/AGENTS.md`. The root contract tells the agent to read those when relevant.

## How it fits

```text
You → Pi (directly or through Paseo)
        ├─ AGENTS.md + local skills/prompts + coding tools
        └─ official q5m native tools OR q5m CLI
             → q5m API → agents, memory, skills, connected services
```

**An alternative frontend, not an offline replacement for q5m.** q5m still hosts
the agent network and enforces account access and Home permissions. Pi's chosen
model provider performs reasoning and may receive the tool results needed for
your task. Local session history is not automatically synced to q5m recall.

There is no app server, database, MCP bridge, vendored platform source, or
background scheduler here. No action is triggered merely by cloning this repo.

## Your data stays out of the public template

Keep personal output in ignored `private/` or a separate private workspace.
**`.gitignore` is not a security sandbox.** Pi/Paseo sessions, model-provider
processing, filesystem permissions, backups, and public previews are separate
concerns. Never publish life-work session exports or generated reports without
review. See [privacy](docs/privacy.md).

## Develop and extend

```bash
npm test                       # offline tests, synthetic fixtures only
node scripts/doctor.mjs --json  # sanitized machine-readable readiness report
```

See [architecture](docs/architecture.md), [contributing](CONTRIBUTING.md), and
[acceptance scenarios](docs/acceptance.md). MIT licensed.
