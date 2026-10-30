# Task Under Test

Change ID: CR-01

## Goal
Add the optional `min_rating` query parameter to `GET /api/movies` so clients can request only movies at or above a minimum rating.

## Requirements Covered
- FR-06
- AC-06.1
- AC-06.2
- AC-06.3
- AC-06.4

## Verification
- Automated tests cover filtering by minimum rating, combination with existing filters, rejection of invalid values (HTTP 400) and unchanged behavior when the parameter is absent.
- The full existing test suite still passes.

## Constraints
- Use REQUIREMENTS.md as the source of truth.
- Keep changes scoped to this task.
- Do not redefine requirements in this file.
