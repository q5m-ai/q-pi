# Setup

## Let the agent set up q5m

Open this checkout in Pi and say **“Set up q5m for me.”** You need Node.js 22.19+
and npm on the agent host. The agent checks PATH and existing tools, installs a
missing CLI, guides secure login, verifies the connection, and resumes your task.
An explicit setup/install request authorizes the missing CLI install. Otherwise,
if a life-work task discovers it is missing, the agent asks once before installing.
Project trust or cloning alone is not installation consent.

After approval, the agent runs:

```bash
npm install --global --ignore-scripts @q5m-ai/cli
q5m --version
q5m --help
q5m auth status --json
```

The install uses the current user's existing npm configuration, not this repo's
package.json. No sudo, permission changes, runtime replacements, shell-profile
edits, or managed-tool overrides. If Node/npm is missing, the npm prefix isn't
writable, or PATH is wrong, the agent reports the blocker and asks before changing
anything else. It doesn't mistake an authentication or network error for a reason
to reinstall. Declined or unavailable approval means no install.

If authentication is needed, complete `q5m auth login` in your own terminal on
the agent host using the installed version's secure flow. Don't paste keys into
chat; don't run an interactive login in an agent shell without safe input support.
Afterward the agent checks authentication and resolved Home again. Installing
the CLI does not authenticate it. Pi, model setup, upgrades, and the optional
native extension are separate changes requiring their own approval.

The doctor below stays read-only. This onboarding is agent guidance, not an
auto-running installation script.

## Already installed and authenticated

Clone the repo on the agent's machine, enter it, and run:

```bash
node scripts/doctor.mjs
pi
```

Confirm Pi shows this repo's `AGENTS.md`. Review the files and trust the project
if you want its prompts and skills. Normal language should work immediately via
bash and `q5m`. Pi model login and q5m account login are separate.

The doctor invokes only `pi --version`, `q5m --version`, `q5m --help`, and
`q5m auth status --json`. The last command makes a read-only authenticated
request. It prints fixed diagnostic messages and validated numeric versions,
not raw output, endpoint URLs, account identifiers, or credentials. It never
installs anything or logs in. Exit codes: 0 ready, 1 failed check, 2 invalid usage.
Each subprocess has a 15-second timeout. It cannot certify model access, native
extension loading, or permissions for a particular specialist.

## Install missing prerequisites

Do this deliberately on the machine where the agent runs, not necessarily the
computer displaying Paseo:

```bash
npm install --global --ignore-scripts @earendil-works/pi-coding-agent
npm install --global --ignore-scripts @q5m-ai/cli
q5m --help
q5m auth login
q5m auth status
```

Use Node.js 22.19 or newer. Start `pi` and use `/login` to configure a model if
needed. Never paste a q5m key or model-provider key into an agent conversation.

**Login varies by CLI version.** Current q5m releases support browser device
authorization; older releases prompt securely for an API key created in q5m's
access settings. Follow the installed `q5m --help` and its secure terminal flow.
Do not assume a browser flow exists on an older fleet-managed CLI, or silently
upgrade a managed installation. This template does not depend on either UX.

## Optional official native extension

```bash
pi install npm:@q5m-ai/cli
```

Restart Pi. `/q5m status` shows the connection; `/q5m reload` refreshes after
external CLI configuration changes. If already installed, don't load another
copy through a second path. The shell executable and Pi package may have
independent installed versions; update intentionally using your installation's
supported package-management workflow.

The extension owns native tool registration, Q's live instruction injection, and
its destructive-action confirmations. q-pi only supplies workspace behavior and
workflows. Without it, the CLI fallback remains supported. With it, do not bypass
a confirmation or rejection by switching to the CLI.

## Paseo

Use this checkout as the project/workspace directory for a Pi agent in Paseo.
You can register it from the daemon host:

```bash
cd /path/to/q-pi
paseo project create .
```

Select the project in Paseo and start a Pi agent using your configured model.
No Paseo plugin, app server, or workspace startup script is required. Other
shell-capable agents can use the root instructions and CLI fallback too; verify
they actually load `AGENTS.md` and explicitly read the skill when needed.

Authentication, PATH, and CLI/Pi packages must be available to the **daemon's
OS user**. A successful login on your laptop does not authenticate a remote
server. Do not copy credential files into this repo to bridge that gap.

Non-interactive/RPC Pi modes may ignore untrusted project skills and prompts.
Approve project resources through your runtime's supported trust configuration
after reviewing them. The root `AGENTS.md` and explicit CLI fallback do not
require a custom extension. Interactive destructive confirmations may not be
available in a remote session; defer those operations, don't bypass them.

A worktree gets tracked template files, not ignored `private/` files. For daily
life work, use the existing local workspace or deliberately maintain a separate
private location. Don't force-add private context to make it follow a worktree.

## Troubleshooting

| Symptom | Next step |
| --- | --- |
| `q5m` missing | The agent checks PATH and offers to install the official CLI after approval |
| Authentication failure | Run `q5m auth status` in your terminal, then the secure login flow if needed |
| Wrong Home | Inspect the resolved catalog Home; choose a per-call Home or intentionally change the default |
| CLI works, native tools absent | Check `pi list`, restart, and `/q5m status`; use CLI only if not bypassing a safety rejection |
| Native tools use the old Home | `/q5m reload` after an external context change |
| Missing specialist/integration | Check reachable agents and account setup; don't guess slugs or credentials |
| Local prompts absent | Check project trust, working directory, and `/reload` |
| API/network error | Report missing live context; don't change API origins or replay uncertain writes blindly |

Environment overrides can take precedence over saved q5m configuration. Diagnose
them without printing secret values. q-pi neither reads nor writes the credential
store and does not set an API endpoint or default Home.
