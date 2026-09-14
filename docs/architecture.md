# Architecture and design intent

## Decision: a workspace, not another runtime

q-pi is the durable behavioral layer and coding workbench for a user's agentic
life work. Pi owns reasoning and local tools. Paseo can provide access to that
same agent workspace. The official `@q5m-ai/cli` package owns authentication,
HTTP transport, and native Pi integration. q5m owns agent definitions, skills,
memory, integrations, authorization, and Home-scoped persistence.

The product is usable through ordinary prompts in this checkout. `AGENTS.md`
is uppercase intentionally: it is Pi's automatically discovered context file.
An on-demand skill alone would not reliably establish the default behavior.
We do not replace Pi's entire system prompt, because coding and extensibility
are part of the point.

## What “the spirit of q5m” means here

- A generalist reaches specialists rather than improvising domain expertise.
- Read relevant authored skills and settled memory before generic advice.
- Retrieve existing user context instead of asking the user to re-onboard.
- Act on clear requests, chain capabilities, and synthesize actual results.
- Preserve Personal/shared Home boundaries and explain missing capabilities.
- Keep durable personalization close to its owning domain, not in a public repo.

“Act” is bounded by intent: a request for a plan doesn't authorize calendar
writes, and a request to build a workflow doesn't authorize running it forever.
Native confirmations remain authoritative; shell fallback is not an escape hatch.

## Two transports, one behavior

1. **Native:** the official extension loads Q's catalog/instructions and registers
   its tools. Discovering peer tools enables their exact-schema native versions.
2. **Shell:** the agent discovers the same live catalog and calls the installed
   `q5m` executable using inspected schemas and JSON inputs.

No copied agent catalogs, hardcoded integration lists, alternative permission
model, direct credential reads, or new API client. No bundled extension download
on project trust: users explicitly opt into installing the official package.

q5m CLI's gateway executes tools; it is not a remote chat loop. Local conversations
remain in the chosen runtime. q5m recall searches q5m conversations, not those
local sessions. q-pi does not implement transcript sync, a scheduler, a marketplace,
a local memory database, or full offline support.

## Source review

The initial design was informed by a local q5m-platform checkout at `6151652`,
especially:

- `agents/q/instructions.md`: generalist judgment, fetch-before-ask, domain memory,
  cross-agent profiles, and verified outcomes.
- `CONTEXT.md`: Generalist/Specialist/Integration graph, installs, Homes, memory,
  recall, and the native CLI gateway.
- `cli/README.md`, `cli/src/commands.ts`, `cli/src/pi-extension.ts`: actual command
  dispatch, JSON/status behavior, native schema registration, and confirmations.

These paths are design provenance, not a runtime dependency. No platform source
or account data is copied into this repository. The installed CLI's help and
live catalog outrank static examples; source checkout, executable, and published
package versions can differ (notably the login UX).

## Extension points

Add portable prompts under `.pi/prompts/`, task-specific skills under
`.agents/skills/`, and tested helper scripts under `scripts/`. Personal versions
belong in `private/`; add their paths to private preferences so an agent can load
them explicitly. A real Pi extension can be added later if a UI or execution
feature genuinely needs one. Don't duplicate the official q5m extension.
