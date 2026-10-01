const { describe, it } = require('node:test');
const assert = require('node:assert/strict');
const {
  filterMovies,
  formatMovieScore,
  formatDateSpanish,
  calculateCatalogMetrics,
  validateMovie
} = require('../services/movieService');

// Datos de prueba controlados
const mockMovies = [
  {
    id: 1,
    title: 'Dune: Parte Dos',
    original_title: 'Dune: Part Two',
    overview: 'Viaje mítico de Paul Atreides en el desierto de Arrakis.',
    release_date: '2024-03-01',
    vote_average: 8.2,
    category: ['trending', 'popular', 'top_rated'],
    genres: ['Ciencia Ficción', 'Aventura']
  },
  {
    id: 2,
    title: 'Del Revés 2',
    original_title: 'Inside Out 2',
    overview: 'Nuevas emociones llegan a la mente de Riley.',
    release_date: '2024-06-14',
    vote_average: 7.6,
    category: ['trending', 'popular'],
    genres: ['Animación', 'Familia', 'Comedia']
  },
  {
    id: 3,
    title: 'Joker: Folie à Deux',
    original_title: 'Joker: Folie à Deux',
    overview: 'Arthur Fleck en el juicio por sus crímenes en Gotham.',
    release_date: '2024-10-04',
    vote_average: 5.6,
    category: ['popular'],
    genres: ['Drama', 'Crimen', 'Suspenso']
  },
  {
    id: 4,
    title: 'Película de Bajo Puntaje',
    original_title: 'Low Score Movie',
    overview: 'Una película experimental sin mucho éxito de taquilla.',
    release_date: '2023-01-10',
    vote_average: 4.2,
    category: ['upcoming'],
    genres: ['Drama']
  }
];

describe('Pruebas Unitarias: movieService', () => {

  describe('filterMovies()', () => {
    it('debe devolver todas las películas si no se aplican filtros', () => {
      const results = filterMovies(mockMovies);
      assert.equal(results.length, 4);
    });

    it('debe filtrar correctamente por categoría (ej. trending)', () => {
      const results = filterMovies(mockMovies, { category: 'trending' });
      assert.equal(results.length, 2);
      assert.ok(results.some(m => m.id === 1));
      assert.ok(results.some(m => m.id === 2));
    });

    it('debe filtrar correctamente por género (insensible a mayúsculas/minúsculas)', () => {
      const results = filterMovies(mockMovies, { genre: 'animación' });
      assert.equal(results.length, 1);
      assert.equal(results[0].title, 'Del Revés 2');
    });

    it('debe devolver todas las películas si el género es "all"', () => {
      const results = filterMovies(mockMovies, { genre: 'all' });
      assert.equal(results.length, 4);
    });

    it('debe buscar por coincidencia en título o sinopsis', () => {
      const byTitle = filterMovies(mockMovies, { search: 'Dune' });
      assert.equal(byTitle.length, 1);
      assert.equal(byTitle[0].id, 1);

      const byOverview = filterMovies(mockMovies, { search: 'Arrakis' });
      assert.equal(byOverview.length, 1);
      assert.equal(byOverview[0].id, 1);
    });

    it('debe combinar múltiples filtros (categoría + género + búsqueda)', () => {
      const results = filterMovies(mockMovies, {
        category: 'popular',
        genre: 'Drama',
        search: 'Arthur'
      });
      assert.equal(results.length, 1);
      assert.equal(results[0].id, 3);
    });

    it('debe manejar entradas vacías o inválidas sin lanzar error', () => {
      assert.deepEqual(filterMovies(null), []);
      assert.deepEqual(filterMovies(undefined), []);
      assert.deepEqual(filterMovies('no-es-arreglo'), []);
    });
  });

  describe('formatMovieScore()', () => {
    it('debe convertir calificación alta (>= 7.0) a porcentaje verde', () => {
      const score = formatMovieScore(8.2);
      assert.equal(score.percentage, 82);
      assert.equal(score.ratingLevel, 'high');
      assert.equal(score.color, '#21d07a');
    });

    it('debe convertir calificación media (5.0 a 6.9) a porcentaje amarillo', () => {
      const score = formatMovieScore(5.6);
      assert.equal(score.percentage, 56);
      assert.equal(score.ratingLevel, 'medium');
      assert.equal(score.color, '#d2d531');
    });

    it('debe convertir calificación baja (< 5.0) a porcentaje rojo', () => {
      const score = formatMovieScore(4.2);
      assert.equal(score.percentage, 42);
      assert.equal(score.ratingLevel, 'low');
      assert.equal(score.color, '#db2360');
    });

    it('debe manejar valores nulos, negativos o fuera de rango', () => {
      const invalid = formatMovieScore(null);
      assert.equal(invalid.percentage, 0);
      assert.equal(invalid.ratingLevel, 'low');

      const negative = formatMovieScore(-5);
      assert.equal(negative.percentage, 0);

      const overLimit = formatMovieScore(12);
      assert.equal(overLimit.percentage, 100);
    });
  });

  describe('formatDateSpanish()', () => {
    it('debe formatear fechas ISO correctamente al español', () => {
      assert.equal(formatDateSpanish('2024-03-01'), '1 mar 2024');
      assert.equal(formatDateSpanish('2024-10-04'), '4 oct 2024');
      assert.equal(formatDateSpanish('2024-06-14'), '14 jun 2024');
    });

    it('debe devolver la cadena original si el formato es inválido', () => {
      assert.equal(formatDateSpanish('fecha-invalida'), 'fecha-invalida');
      assert.equal(formatDateSpanish(''), '');
      assert.equal(formatDateSpanish(null), '');
    });
  });

  describe('calculateCatalogMetrics()', () => {
    it('debe calcular métricas del catálogo agregadas con precisión', () => {
      const metrics = calculateCatalogMetrics(mockMovies);
      assert.equal(metrics.total, 4);
      assert.equal(metrics.averageScore, 6.4); // (8.2 + 7.6 + 5.6 + 4.2) / 4 = 6.4
      assert.equal(metrics.topRated.id, 1);
      assert.equal(metrics.genresCount, 8); // Ciencia Ficción, Aventura, Animación, Familia, Comedia, Drama, Crimen, Suspenso
      assert.equal(metrics.genreDistribution['Drama'], 2);
    });

    it('debe devolver estructura segura para catálogo vacío', () => {
      const metrics = calculateCatalogMetrics([]);
      assert.equal(metrics.total, 0);
      assert.equal(metrics.averageScore, 0);
      assert.equal(metrics.topRated, null);
    });
  });

  describe('validateMovie()', () => {
    it('debe validar exitosamente una película con estructura correcta', () => {
      const validMovie = mockMovies[0];
      const result = validateMovie(validMovie);
      assert.equal(result.valid, true);
      assert.equal(result.errors.length, 0);
    });

    it('debe detectar errores cuando faltan campos requeridos o son inválidos', () => {
      const invalidMovie = {
        id: -1,
        title: '',
        release_date: '01/03/2024',
        vote_average: 15,
        genres: []
      };
      const result = validateMovie(invalidMovie);
      assert.equal(result.valid, false);
      assert.ok(result.errors.length >= 4);
      assert.ok(result.errors.some(e => e.includes('id')));
      assert.ok(result.errors.some(e => e.includes('title')));
      assert.ok(result.errors.some(e => e.includes('release_date')));
      assert.ok(result.errors.some(e => e.includes('vote_average')));
    });
  });

});
