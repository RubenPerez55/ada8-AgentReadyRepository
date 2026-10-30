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

describe('API: GET /api/movies?min_rating (FR-06)', () => {
  it('AC-06.1 returns only movies with vote_average >= min_rating', async () => {
    const { status, body } = await get('/api/movies?min_rating=8');
    const expected = catalog.filter(m => m.vote_average >= 8);
    assert.equal(status, 200);
    assert.ok(expected.length > 0 && expected.length < catalog.length);
    assert.equal(body.total_results, expected.length);
    assert.deepEqual(body.results.map(m => m.id), expected.map(m => m.id));
    assert.ok(body.results.every(m => m.vote_average >= 8));
  });

  it('AC-06.1 is inclusive and accepts decimals, 0 and 10', async () => {
    const boundary = catalog[0].vote_average;
    const inclusive = await get(`/api/movies?min_rating=${boundary}`);
    assert.ok(inclusive.body.results.some(m => m.id === catalog[0].id));

    const decimal = await get('/api/movies?min_rating=7.5');
    assert.equal(decimal.body.total_results, catalog.filter(m => m.vote_average >= 7.5).length);

    const zero = await get('/api/movies?min_rating=0');
    assert.equal(zero.body.total_results, catalog.length);

    const ten = await get('/api/movies?min_rating=10');
    assert.equal(ten.status, 200);
    assert.equal(ten.body.total_results, catalog.filter(m => m.vote_average >= 10).length);
  });

  it('AC-06.2 combines min_rating with category, genre and search (AND)', async () => {
    const { body } = await get('/api/movies?category=popular&genre=drama&min_rating=7');
    const expected = catalog.filter(m =>
      m.category.includes('popular') &&
      m.genres.some(g => g.toLowerCase() === 'drama') &&
      m.vote_average >= 7);
    assert.ok(expected.length > 0);
    assert.deepEqual(body.results.map(m => m.id), expected.map(m => m.id));

    const withSearch = await get(`/api/movies?search=${encodeURIComponent(catalog[0].title)}&min_rating=${catalog[0].vote_average}`);
    assert.ok(withSearch.body.results.some(m => m.id === catalog[0].id));
    const tooHigh = await get(`/api/movies?search=${encodeURIComponent(catalog[0].title)}&min_rating=${catalog[0].vote_average + 0.1}`);
    assert.ok(!tooHigh.body.results.some(m => m.id === catalog[0].id));
  });

  for (const raw of ['abc', '7a', '1e1', '0x5', 'Infinity', '', '-1', '10.5', '11']) {
    it(`AC-06.3 returns 400 with { error } and no results for min_rating=${JSON.stringify(raw)}`, async () => {
      const { status, body } = await get(`/api/movies?min_rating=${encodeURIComponent(raw)}`);
      assert.equal(status, 400);
      assert.equal(typeof body.error, 'string');
      assert.ok(body.error.length > 0);
      assert.equal(body.results, undefined);
      assert.equal(body.total_results, undefined);
    });
  }

  it('AC-06.3 returns 400 for a repeated min_rating parameter', async () => {
    const { status, body } = await get('/api/movies?min_rating=7&min_rating=8');
    assert.equal(status, 400);
    assert.ok(body.error);
    assert.equal(body.results, undefined);
  });

  it('AC-06.4 without min_rating the FR-01 behavior is unchanged', async () => {
    const all = await get('/api/movies');
    assert.equal(all.status, 200);
    assert.deepEqual(all.body.results, catalog);

    const filtered = await get('/api/movies?category=top_rated');
    assert.deepEqual(
      filtered.body.results.map(m => m.id),
      catalog.filter(m => m.category.includes('top_rated')).map(m => m.id)
    );
  });

  it('NFR-02 a min_rating request does not mutate the in-memory catalog', async () => {
    await get('/api/movies?min_rating=9');
    const { body } = await get('/api/movies');
    assert.equal(body.total_results, catalog.length);
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
