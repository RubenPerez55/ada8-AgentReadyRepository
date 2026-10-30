# Architecture

## Components
```
frontend/ (static, fetch) ──HTTP──▶ backend/app.js (Express routes)
                                         │ calls
                                         ▼
                              backend/services/movieService.js (pure business rules)
                                         ▲
             backend/app.js loads ───────┘ backend/data/movies.json (read-only fixture)
backend/server.js ── requires app.js and calls listen() (process entry point only)
```

## Dependency Flow
`server.js → app.js → services/` . Never the reverse.

| Layer | Responsibility | Must NOT |
|---|---|---|
| `backend/server.js` | Start the HTTP server | Contain routes or logic |
| `backend/app.js` | Routing, read `req.query`/`req.params`, call services, map results/errors to HTTP status + JSON | Contain filtering, sorting or validation rules |
| `backend/services/` | Filtering, sorting, parsing/validation of inputs, formatting, metrics. Pure functions, no I/O | Require `express`, `http`, `fs`, `app.js` or `server.js` |
| `backend/data/movies.json` | Catalog fixture | Be edited to make a feature or test pass |
| `frontend/` | UI, consumes the API | Duplicate business rules required by the API |

## Business-Rule Location
Validation of query parameters (e.g. `min_rating`, `sort_by`) is a business rule: implement it as a service function that returns `{ valid, value, error }`, and let `app.js` translate an invalid result into `400`.

## Protected Boundaries (enforced by `scripts/check_repo_contract.js`)
- Services are framework-free (no `express`/`http`/`fs` imports).
- `backend/data/movies.json` and `REQUIREMENTS.md` are not modified on feature branches without human approval.

## Testing Strategy
- Unit: `backend/test/movieService.test.js` — every service function.
- HTTP: `backend/test/api.test.js` — starts `app` in-process on a random port (`app.listen(0)`), no running server needed.
