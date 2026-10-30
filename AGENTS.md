# AGENTS.md

Operational contract for any coding agent (and new human contributors) working in this repository.

## Read First
1. REQUIREMENTS.md — what the product must do (FR/AC IDs)
2. SPEC.md — verifiable API behavior and conventions
3. ARCHITECTURE.md — layers and boundaries
4. TASKS.md — task status and traceability
5. docs/REPO_MAP.md — where things live and how to change them

## Sources of Truth
- Requirements live only in REQUIREMENTS.md. Verifiable behavior lives only in SPEC.md.
- Task/change files (TASK_UNDER_TEST.md, CHANGE_REQUEST.md) reference IDs; they never redefine requirements.
- Never change REQUIREMENTS.md or SPEC.md to make code or tests pass.

## Repository Map (short)
- `backend/app.js` — Express app and routes (HTTP layer)
- `backend/services/` — business rules, pure functions
- `backend/data/movies.json` — catalog fixture (read-only)
- `backend/test/` — unit + HTTP tests (`node:test`)
- `frontend/` — static vanilla JS client
- `scripts/` — deterministic checks
- `results/` — generated evidence/reports

## Standard Commands (run from repo root, Node >= 18)
- Install: `npm install` (installs `backend/` via postinstall) — CI uses `npm ci --prefix backend`
- Run: `npm start` → http://localhost:5000
- Test: `npm test`
- Lint: `npm run lint`
- Verify (required before declaring done): `./scripts/verify_repo.sh`

## Change Rules
- Keep changes scoped to the requested task/change ID.
- Business rules and input validation go in `backend/services/`; `app.js` only reads the request, calls services and shapes the response.
- Every new or changed behavior needs tests: unit tests in `backend/test/movieService.test.js` and, for HTTP-observable AC, `backend/test/api.test.js`.
- Name tests with the AC they verify (e.g. `AC-06.3 ...`).
- Do not weaken, skip or delete existing tests.
- Do not add dependencies without justification in your report.
- Follow SPEC.md API conventions (error shape, status codes, parameter parsing).

## Do Not Edit (protected; `movies.json` and `REQUIREMENTS.md` are enforced by `scripts/check_repo_contract.js`)
- `backend/data/movies.json`
- `REQUIREMENTS.md`
- `.github/workflows/`
- `.env*` files, tokens or credentials of any kind

## Stop Conditions
Stop and ask for a human decision when:
- requirements are ambiguous or conflict with SPEC.md,
- a protected path or an architecture boundary would have to change,
- a destructive or external action is needed (push, delete, publish),
- `./scripts/verify_repo.sh` fails for reasons unrelated to your change.

## Definition of Done
- All AC of the task are covered by tests that name them.
- `./scripts/verify_repo.sh` ends with `VERIFY_REPO: PASS`.
- TASKS.md status updated for the task ID.
- Report lists files changed, commands executed, tests added and assumptions.
- No out-of-scope changes. You do not approve or merge your own change.
