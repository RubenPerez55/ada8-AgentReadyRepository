# SPEC — REST API behavior

Verifiable behavior of the API. Requirement IDs refer to REQUIREMENTS.md.

## Conventions (all endpoints)
- Responses are JSON. Errors use the shape `{ "error": "<message in Spanish>" }`.
- `404` for unknown resources; `400` for invalid query parameters (no partial results are returned).
- Query parameters are optional unless stated. Absent parameter ⇒ no effect.
- Numeric query parameters accept plain decimal notation only (`7`, `7.5`, `0`). Values such as `abc`, `7a`, `1e1`, `0x5`, `Infinity`, empty string or a repeated parameter are invalid.
- Parsing and validation of query parameters is done in `backend/services/` (see ARCHITECTURE.md).
- The in-memory catalog is never mutated by a request (NFR-02).

## GET /api/movies
Response `200`: `{ "total_results": number, "results": Movie[] }`, `total_results === results.length`.

| Param | Values | Behavior | Req |
|---|---|---|---|
| `category` | trending, popular, top_rated, upcoming | case-insensitive match against `movie.category[]` | FR-01, AC-01.2 |
| `genre` | genre name, `all` | case-insensitive exact match against `movie.genres[]` | AC-01.3 |
| `search` | text | case-insensitive substring of title / original_title / overview | AC-01.4 |
| `min_rating` | number 0–10 | keep `vote_average >= min_rating`; invalid ⇒ 400 | FR-06, AC-06.1, AC-06.3 |
| `sort_by` | `rating`, `release_date` | stable descending sort, applied after filtering; invalid ⇒ 400 | FR-07, AC-07.1, AC-07.2, AC-07.4 |

All filters combine with AND (AC-01.5, AC-06.2, AC-07.6). Without parameters the catalog order of `movies.json` is kept (AC-01.1, AC-07.5).

Examples:
- `GET /api/movies?min_rating=8` → only movies with `vote_average >= 8`.
- `GET /api/movies?min_rating=abc` → `400 { "error": "..." }`.
- `GET /api/movies?sort_by=rating` → highest `vote_average` first; ties keep catalog order (AC-07.3).

## GET /api/movies/:id
`200` movie object (AC-02.1); `404 { error }` if not found (AC-02.2).

## GET /api/categories · GET /api/genres
Category list (AC-03.1); unique genres sorted alphabetically (AC-03.2).

## GET /api/metrics
`{ total, averageScore, topRated, genresCount, genreDistribution }` (AC-04.1); zeroed for empty catalog (AC-04.2).

## Score presentation (service only)
`formatMovieScore(vote)` → `{ percentage, ratingLevel, color }` per AC-05.1, AC-05.2, AC-05.3.
