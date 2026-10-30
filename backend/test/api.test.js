// HTTP-level regression tests for the REST API (FR-01..FR-04).
// The app is started in-process on a random port; no external server is needed.
const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../app');
const catalog = require('../data/movies.json');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(() => new Promise(resolve => server.close(resolve)));

async function get(path) {
  const res = await fetch(baseUrl + path);
  return { status: res.status, body: await res.json() };
}

describe('API: GET /api/movies (FR-01)', () => {
  it('AC-01.1 returns the full catalog without query params', async () => {
    const { status, body } = await get('/api/movies');
    assert.equal(status, 200);
    assert.equal(body.total_results, catalog.length);
    assert.equal(body.results.length, catalog.length);
  });

  it('AC-01.2 filters by category', async () => {
    const { body } = await get('/api/movies?category=top_rated');
    const expected = catalog.filter(m => m.category.includes('top_rated')).length;
    assert.equal(body.total_results, expected);
  });

  it('AC-01.5 combines category and genre', async () => {
    const { body } = await get('/api/movies?category=popular&genre=drama');
    assert.ok(body.results.every(m =>
      m.category.includes('popular') && m.genres.some(g => g.toLowerCase() === 'drama')));
  });
});

describe('API: GET /api/movies/:id (FR-02)', () => {
  it('AC-02.1 returns the movie detail', async () => {
    const { status, body } = await get(`/api/movies/${catalog[0].id}`);
    assert.equal(status, 200);
    assert.equal(body.id, catalog[0].id);
  });

  it('AC-02.2 returns 404 for an unknown id', async () => {
    const { status, body } = await get('/api/movies/999999');
    assert.equal(status, 404);
    assert.ok(body.error);
  });
});

describe('API: metadata and metrics (FR-03, FR-04)', () => {
  it('AC-03.2 returns sorted unique genres', async () => {
    const { body } = await get('/api/genres');
    assert.deepEqual(body, [...body].sort());
    assert.equal(new Set(body).size, body.length);
  });

  it('AC-04.1 returns catalog metrics', async () => {
    const { body } = await get('/api/metrics');
    assert.equal(body.total, catalog.length);
    assert.equal(typeof body.averageScore, 'number');
  });
});
