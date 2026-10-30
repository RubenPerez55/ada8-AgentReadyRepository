# Implicit Knowledge Found

## IK-01
What: The official install command is `npm install` at the root (postinstall installs `backend/`); tests run with `npm test` at the root.
How was it discovered: Reading README.md and both package.json files.
Should this remain implicit? NO
Where should it become explicit? AGENTS.md (Standard Commands) + `scripts/verify_repo.sh`.

## IK-02
What: Business rules must live in `backend/services/` as pure functions; `server.js` only parses the request and shapes the response.
How was it discovered: Indirectly (README comment "Lógica de negocio" + code reading).
Risk: Validation or filtering logic placed in route handlers, untestable without HTTP.
Remediation: ARCHITECTURE.md + AGENTS.md change rules + a deterministic boundary check (`scripts/check_repo_contract.js`: services must not import express/http).

## IK-03
What: The API must be testable in-process (HTTP tests must not depend on a running server).
How was it discovered: Not documented; the BEFORE agent changed `server.js` on its own initiative.
Risk: Each agent decides differently; architectural change without approval.
Remediation: Split `app.js` (Express app, exported) from `server.js` (listen) as a readiness improvement; document in ARCHITECTURE.md and REPO_MAP.md.

## IK-04
What: Query parameter validation errors return HTTP 400 `{ error }` with messages in Spanish; numeric formats accepted are not defined.
How was it discovered: Not documented; agent inferred from the existing 404 handler.
Remediation: SPEC.md (API conventions: error shape, language, number parsing).

## IK-05
What: `backend/data/movies.json` is the catalog fixture and must not be edited to make a feature/test pass.
How was it discovered: Not documented.
Risk: The agent could modify data to fit the code.
Remediation: AGENTS.md "Do Not Edit" + protected-path check in `scripts/check_repo_contract.js`.

## IK-06
What: Definition of Done (tests + lint + contract, requirement status update) was undefined.
How was it discovered: Agent asked at the end whether to update REQUIREMENTS/README.
Remediation: AGENTS.md Definition of Done + `scripts/verify_repo.sh`.
