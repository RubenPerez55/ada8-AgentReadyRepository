# Readiness Improvement Report

## Experimental Setup
- Same functional code for both runs: `ada08-baseline` (`941852b`).
- BEFORE: baseline as-is (branch `ada08/before`). AFTER: baseline + readiness improvements only (`ada08-ready`, branch `ada08/after`).
- Same task (`TASK_UNDER_TEST.md`, CR-01), same prompt, same agent/model (claude-opus-5-5), same tools and permissions, fresh context each run. The BEFORE implementation was never visible to the AFTER agent (separate worktree; `results/` committed after the AFTER run).

## Changes Made

### I-01 — Context
Problem: no agent instructions (IK-01, IK-06). Change: `AGENTS.md` with read-first list, sources of truth, standard commands, change rules, protected paths, stop conditions, Definition of Done. Evidence: AFTER agent read files in the declared order and updated TASKS.md per DoD.

### I-02 — Context (tool adapter)
Problem: tool-specific file could become a second truth. Change: `CLAUDE.md` only points to AGENTS.md. Evidence: contains no requirements.

### I-03 — Navigation
Problem: README mixed setup, features and GitHub token steps. Change: `docs/REPO_MAP.md` + pointer at top of README. Evidence: change guide used by AFTER agent (service → app → tests → TASKS → verify).

### I-04 — Context (specification)
Problem: error format, numeric parsing and status codes were implicit (IK-04). Change: `SPEC.md` with API conventions and parameter table linked to FR/AC. Evidence: BEFORE had 3 unbacked assumptions; AFTER assumptions were backed by SPEC.

### I-05 — Executable Knowledge
Problem: no single verification command (IK-01). Change: `scripts/verify_repo.sh` (install if needed → tests → lint → contract → security). Evidence: AFTER ran it before and after the change; 0 unknown commands (BEFORE: install discovered manually, 1 failed command).

### I-06 — Test (testability)
Problem: `server.js` called `listen()` on import, so routes were not testable in-process (IK-03); BEFORE agent changed the architecture on its own to work around it. Change: `backend/app.js` (exported app) + `backend/server.js` (listen only). No behavior change. Evidence: AFTER did not touch `server.js`.

### I-07 — Context (traceability)
Problem: requirements not connected to spec/tasks/tests. Change: `SPEC.md` and `TASKS.md` reference FR/AC IDs; AGENTS.md requires test names with AC IDs. Evidence: all 22 AFTER tests named after AC; contract validates IDs.

### I-08 — Guardrail
Problem: catalog fixture and requirements could be edited to fit code (IK-05); services could import framework code (IK-02). Change: `scripts/check_repo_contract.js` (required files, services boundary, protected paths vs `main`, valid requirement IDs). Evidence: modifying `movies.json` → `REPO_CONTRACT: FAIL ... requires human approval`.

### I-09 — Guardrail (security)
Change: `scripts/check_secrets.js` (token/key patterns, tracked `.env`). Evidence: `SECURITY_CHECK: PASS` in verify.

### I-10 — CI Check
Change: `.github/workflows/verify.yml` runs the same `./scripts/verify_repo.sh`. Evidence: no duplicated logic in the pipeline.

### I-11 — Test (regression)
Change: `backend/test/api.test.js` HTTP regression tests for FR-01…FR-04 + ESLint (`npm run lint`). Evidence: 24/24 tests and lint PASS on `ada08-ready`.

## BEFORE vs AFTER

| Indicator | BEFORE | AFTER |
|---|---|---|
| Clarification questions | 2 open questions left for the human (requirement status, server.js change) | 0 blocking, 1 minor (number grammar edge cases) |
| Failed / unknown commands | 1 failed (`pkill`), install command discovered by reading package.json | 0 |
| Incorrect / unbacked assumptions | 3 unbacked (number formats, repeated param, error language) | 0 unbacked (all from SPEC.md) |
| Out-of-scope files modified | 1 (`server.js` architectural change) | 0 |
| Validations executed correctly | Tests + ad-hoc curl (agent's choice) | Full `verify_repo.sh` before and after (tests, lint, contract, security) + curl |
| Final result | PASS (with friction) | PASS |
| Qualitative observation | Agent read whole README and package files to infer how to work; finished by asking what "done" means. | Agent followed AGENTS.md order, used REPO_MAP change guide, updated TASKS.md, named tests by AC. |
| Discoverability | Commands and boundaries inferred | Files, commands, tests and sources of truth discovered from AGENTS.md / REPO_MAP |
| Implicit knowledge | 6 items found (`results/implicit-knowledge.md`) | 5 made explicit, 3 of them also executable (verify, contract, app split) |
| CI / shared checks | None | Human, agent and CI run the same `verify_repo.sh` |

Readiness score: **36 → 94 (+58)**.

## Threats to Validity
- REQUIREMENTS.md (with FR/AC IDs) was added to the baseline because the task must reference existing requirements; the original repo had none. This raised the BEFORE traceability score slightly.
- Both runs used a strong model that succeeded functionally even in BEFORE; the difference shows in uncertainty, scope control and evidence, not in correctness.
- n = 1 run per condition; results may vary between runs.
- The improvements and the audit were prepared with AI assistance (see AI_USAGE_LOG.md) and reviewed by the student.
