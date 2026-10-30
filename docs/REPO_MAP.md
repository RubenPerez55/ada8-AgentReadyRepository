# Repository Map

## Entry Points
- `backend/server.js` — process entry (`npm start`), only calls `listen()`
- `backend/app.js` — Express app: all `/api/*` routes + static frontend
- `backend/services/movieService.js` — business rules (filter, sort, validate, format, metrics)
- `backend/data/movies.json` — catalog fixture (read-only)
- `frontend/index.html`, `frontend/app.js` — UI

## Tests
- `backend/test/movieService.test.js` — unit tests of services
- `backend/test/api.test.js` — HTTP tests (in-process server)
- Run all: `npm test` · Full gate: `./scripts/verify_repo.sh`

## Change Guide
Adding/changing a query parameter or API behavior:
1. Find the FR/AC in REQUIREMENTS.md and the contract in SPEC.md.
2. Implement rule + validation in `backend/services/movieService.js` (export it).
3. Wire it in `backend/app.js` (invalid → `400 { error }`).
4. Add unit tests + HTTP tests named after the AC.
5. Update TASKS.md and run `./scripts/verify_repo.sh`.

Changing UI only: `frontend/` — no API contract change without updating SPEC via human approval.

## Do Not Edit Directly
- `backend/data/movies.json`
- `REQUIREMENTS.md` (human-owned)
- `.github/workflows/`
- `backend/node_modules/`, `.env*`

## Other
- `docs/` — ADA-06 evidence (historical, not needed for code changes)
- `results/` — agent runs and reports
