# Contributing

Keep q-pi a portable life-work frontend, not a second q5m client or a fleet-specific
configuration repository. Changes should work for another user with Pi and an
authenticated q5m CLI.

1. Inspect Git status and relevant instructions before editing. Preserve unrelated
   changes; use a focused branch/worktree for substantive contributions.
2. Prefer capabilities and live schema discovery over fixed agent/tool lists.
3. Use synthetic data. Tests must not need q5m credentials, call production, log
   into anything, or mutate a real account. Don't capture live catalogs as fixtures.
4. Run `npm test`. Use `node scripts/doctor.mjs` only when intentionally checking
   a configured machine; it makes a read-only authenticated request.
5. For instruction changes, walk through `docs/acceptance.md`. Automated text
   checks don't prove model behavior or replace human review.
6. Update the owning docs and regression tests with code changes. Commit focused
   logical units; stage only task-owned public files after reviewing the diff.
7. Open a focused PR for subsequent changes. Don't merge, push, deploy, publish
   personal artifacts, or install tooling without the relevant authorization.

No build step or runtime dependency install is required. Node's built-in test
runner covers the diagnostics and template contracts. Use your own private copy
or ignored private/ for life-work experiments. Public contributions must never
include personal data or credentials, even in screenshots or session links.
