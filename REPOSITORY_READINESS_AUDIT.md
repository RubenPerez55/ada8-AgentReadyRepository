# Repository Readiness Audit

Repository: TMDB Clone (fork of `RubenPerez55/Movies-ADA06`)
Baseline: tag `ada08-baseline` (commit `941852b`)
Formula: `points = (score_0_to_5 / 5) x weight`

## BEFORE

Audited on the baseline, before running the agent and before any readiness improvement.

| Dimension | Score 0-5 | Weighted | Evidence | Main Gap |
|---|---:|---:|---|---|
| Entry Point & Navigation | 3 | 9 /15 | README.md has a directory tree and an endpoint table. | Written for humans (Spanish, emojis, PAT instructions mixed in); no map of where to change what, no source-of-truth pointer. |
| Agent Instructions | 0 | 0 /15 | No AGENTS.md / CLAUDE.md or equivalent. | Agent must infer rules, commands, limits and Definition of Done. |
| Build / Run / Test | 3 | 9 /15 | `npm run install:all`, `npm start`, `npm test` documented in README; root `npm test` delegates to `backend/`. | No lint, no single verify command; dependencies install via a `postinstall` side effect. |
| Architecture Boundaries | 2 | 4 /10 | README states `movieService.js` holds business logic; `server.js` holds routes. | Layers are implicit; nothing says route handlers must not contain business rules, or which files must not be edited (`data/movies.json`). |
| Requirements & Traceability | 2 | 4 /10 | REQUIREMENTS.md with FR/AC IDs exists. | No SPEC/TASKS; tests and code do not reference requirement IDs. |
| Automation & Guardrails | 1 | 2 /10 | Only `npm test`. | No CI, no lint, no hooks, no repository contract check. |
| Testability & Evidence | 2 | 6 /15 | 17 unit tests for `movieService` (node:test). | No HTTP-level tests; `server.js` calls `app.listen()` on import, so routes cannot be tested in-process; DoD undefined. |
| Safety & Permissions | 1 | 2 /10 | `.gitignore` excludes `.env` and `node_modules`. | No protected paths, no stop conditions, no secret check; README documents token creation steps. |

TOTAL BEFORE: **36 / 100**

Top 3 friction points:
1. No agent instructions: no source of truth, commands, change rules or Definition of Done.
2. API routes are not testable in-process (`app.listen()` on import) and there are no HTTP tests, so AC that are observable at HTTP level (e.g. status 400) cannot be verified cheaply.
3. No single verification command, no lint and no CI: "done" depends on the agent's judgment.

## AFTER

Audited on `ada08-ready` (`95d80cd`): same baseline code + readiness improvements only.

| Dimension | Score 0-5 | Weighted | Evidence | Improvement |
|---|---:|---:|---|---|
| Entry Point & Navigation | 5 | 15 /15 | README points to AGENTS.md; `docs/REPO_MAP.md` lists entry points, tests, change guide, do-not-edit. AFTER agent read docs in the declared order. | I-01, I-03 |
| Agent Instructions | 5 | 15 /15 | AGENTS.md: read-first, sources of truth, commands, change rules, protected paths, stop conditions, DoD; CLAUDE.md as thin adapter. AFTER agent followed DoD (updated TASKS.md, ran verify). | I-01, I-02 |
| Build / Run / Test | 5 | 15 /15 | `./scripts/verify_repo.sh` installs if needed and runs tests + lint + contract + security; 0 failed/unknown commands in AFTER. | I-04, I-05 |
| Architecture Boundaries | 4 | 8 /10 | ARCHITECTURE.md layer table; services boundary checked automatically. Frontend boundaries are only documented. | I-06, I-08 |
| Requirements & Traceability | 4 | 8 /10 | REQUIREMENTS → SPEC (IDs per parameter) → TASKS (code + tests); contract fails on unknown IDs; tests named after AC. Code itself has no ID references. | I-07 |
| Automation & Guardrails | 5 | 10 /10 | verify_repo.sh, contract check (required files, boundary, protected paths, valid IDs), secret check, ESLint, GitHub Actions running the same script. Guardrail tested: editing `movies.json` → `REPO_CONTRACT: FAIL`. | I-05, I-08, I-09, I-10 |
| Testability & Evidence | 5 | 15 /15 | `app.js`/`server.js` split; HTTP tests in-process (`api.test.js`); DoD defines evidence. | I-06, I-11 |
| Safety & Permissions | 4 | 8 /10 | Protected paths enforced, secret scan, stop conditions for destructive/external actions. No branch protection configured on GitHub yet. | I-08, I-09 |

TOTAL AFTER: **94 / 100**
DELTA: AFTER - BEFORE = **+58 points** (36 → 94)
