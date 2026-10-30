const { describe, it, before, after } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const app = require('../server');

const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'data', 'movies.json'), 'utf8')
);

let server;
let baseUrl;

async function get(query = '') {
  const res = await fetch(`${baseUrl}/api/movies${query}`);
  return { status: res.status, body: await res.json() };
}

describe('Pruebas de API: GET /api/movies con min_rating (FR-06)', () => {
  before(async () => {
    server = app.listen(0);
    await new Promise(resolve => server.once('listening', resolve));
    baseUrl = `http://127.0.0.1:${server.address().port}`;
  });

  after(() => new Promise(resolve => server.close(resolve)));

  it('AC-06.1: devuelve solo películas con vote_average >= N', async () => {
    const { status, body } = await get('?min_rating=8');
    const expected = catalog.filter(m => m.vote_average >= 8).map(m => m.id);
    assert.equal(status, 200);
    assert.ok(expected.length > 0 && expected.length < catalog.length);
    assert.deepEqual(body.results.map(m => m.id), expected);
    assert.equal(body.total_results, expected.length);
  });

  it('AC-06.2: se combina con category, genre y search (AND)', async () => {
    const { status, body } = await get('?category=popular&genre=Aventura&search=a&min_rating=7.5');
    const expected = catalog
      .filter(m => m.category.includes('popular'))
      .filter(m => m.genres.some(g => g.toLowerCase() === 'aventura'))
      .filter(m => [m.title, m.original_title, m.overview]
        .some(t => t && t.toLowerCase().includes('a')))
      .filter(m => m.vote_average >= 7.5)
      .map(m => m.id);
    assert.equal(status, 200);
    assert.deepEqual(body.results.map(m => m.id), expected);
  });

  for (const bad of ['abc', '', '-1', '10.5', '11', '7a']) {
    it(`AC-06.3: min_rating=${JSON.stringify(bad)} responde 400 con { error } y sin resultados`, async () => {
      const { status, body } = await get(`?min_rating=${encodeURIComponent(bad)}`);
      assert.equal(status, 400);
      assert.equal(typeof body.error, 'string');
      assert.equal(body.results, undefined);
      assert.equal(body.total_results, undefined);
    });
  }

  it('AC-06.3: min_rating repetido responde 400', async () => {
    const { status } = await get('?min_rating=5&min_rating=6');
    assert.equal(status, 400);
  });

  it('AC-06.4: sin min_rating el comportamiento de FR-01 no cambia', async () => {
    const all = await get();
    assert.equal(all.status, 200);
    assert.equal(all.body.total_results, catalog.length);
    assert.deepEqual(all.body.results.map(m => m.id), catalog.map(m => m.id));

    const filtered = await get('?category=top_rated');
    assert.deepEqual(
      filtered.body.results.map(m => m.id),
      catalog.filter(m => m.category.includes('top_rated')).map(m => m.id)
    );
  });
});
