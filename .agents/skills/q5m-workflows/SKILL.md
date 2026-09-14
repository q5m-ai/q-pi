---
name: q5m-workflows
description: Use for everyday life and work involving connected services, personal context, specialist skills, memory, or prior q5m conversations when native q5m tools are unavailable or CLI guidance is needed. Route by capability, load instructions, inspect schemas, act, and verify.
---

# q5m from a shell-capable agent

The executable is `q5m`; the npm package is `@q5m-ai/cli`. No platform checkout,
MCP server, second model, or custom credentials implementation is required.
Follow the repository's `AGENTS.md` action, Home, and privacy boundaries.

## 1. Establish the current contract

```bash
q5m --help
q5m catalog --json
```

The catalog contains Q's instructions, exact tool schemas, and resolved Home.
Read it rather than substituting a memorized workflow. If diagnosis is needed,
`q5m auth status --json` is a read-only connection check. Do not inspect the
credential file. The CLI's installed help wins over examples here; authentication
UX differs between releases. The user completes login securely in their terminal.

Keep results in the session, not tracked files. If output is too large, use a
protected temporary file under ignored `private/`, read all relevant sections,
and remove it afterward. Do not truncate away instructions or required schemas.

## 2. Discover the capability and load its context

```bash
q5m agents --json
q5m route 'the capability needed for this task' --json
q5m agent <returned-slug> --json
q5m tools <returned-slug> --json
```

Angle-bracket values are placeholders, not literal shell arguments. Route only
when the directory doesn't identify the owner. Load relevant memory and skills
using the catalog's `list_*` and `get_*` tools with their actual schemas. Don't
ask the user for information these sources already hold. Independent reads can
run in parallel; a domain call depends on its loaded instructions and schema.

## 3. Execute exactly the discovered operation

Q's catalog and a peer's domain tools have distinct shorthands:

```text
q5m call TOOL --input-file - --json
q5m tool AGENT TOOL --input-file - --json
```

Send a JSON object over stdin (for example from a script using `JSON.stringify`
and a subprocess argument array). Never interpolate untrusted content into shell
code. A non-sensitive illustrative catalog read, after inspecting its schema:

```bash
q5m call get_memory --input '{"path":"/profile"}' --json
```

For larger or sensitive payloads prefer stdin over command-line arguments. If a
file is necessary, use an owner-only file under ignored `private/`, clean it up,
and remember that stdin and files are not a promise of transcript privacy.

Read `readOnlyHint` and `destructiveHint`, plus the operation's actual effects.
A false destructive hint does not make sending a message or spending money
implicitly authorized. Do not test writes on the user's real account.

## 4. Resolve Homes deliberately

- `q5m context --json` shows the configured default, not proof of current access.
- The catalog reports the resolved Home. For a specific host Home use
  `q5m catalog --group personal|GROUP_ID --json` (choose one actual value).
- `--group` selects Q's host Home for one command.
- `q5m tool ... --home personal|GROUP_ID` selects the peer's Home.
- Peer dispatch otherwise resolves where that peer is installed; multiple Homes
  may require a choice. Don't assume host Home and peer Home are identical.
- If the returned Home differs from the requested one, stop before sensitive
  reads/writes. Membership validation can cause fallback to Personal.
- Changing the saved default with `q5m context HOME` requires user intent and can
  affect other sessions. A running native extension needs `/q5m reload` afterward.

## 5. Verify and summarize

Check exit status **and** the response for errors and partial results. Exit codes
are 0 success, 1 request/network/server failure, 2 usage/input error, and 3
authentication/authorization failure. Older clients may also return tool-level
errors in a success response. Don't convert denied access into a shell workaround.

For writes, verify returned identifiers and statuses, or perform a focused
read-back. Reconcile uncertain outcomes before retrying. Report completed work,
missing pieces, and the next useful step, rather than dumping raw JSON.

Use `q5m recall 'relevant prior discussion' --limit 5 --json` when the question
is about past q5m conversations. This does not search Pi/Paseo session history.
