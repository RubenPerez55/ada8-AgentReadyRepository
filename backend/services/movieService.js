/**
 * Servicio de lógica de negocio para el catálogo de películas
 * Contiene funciones puras para filtrado, formateo, validación y métricas
 */

/**
 * Filtra un conjunto de películas según categoría, género y texto de búsqueda
 * @param {Array} movies - Lista de películas
 * @param {Object} filters - Opciones de filtrado
 * @param {string} [filters.category] - Categoría (trending, popular, top_rated, upcoming)
 * @param {string} [filters.genre] - Nombre del género
 * @param {string} [filters.search] - Término de búsqueda
 * @returns {Array} - Películas filtradas
 */
function filterMovies(movies = [], { category, genre, search } = {}) {
  if (!Array.isArray(movies)) return [];

  let result = [...movies];

  if (category && typeof category === 'string') {
    const cat = category.toLowerCase().trim();
    result = result.filter(m => {
      if (Array.isArray(m.category)) {
        return m.category.some(c => c.toLowerCase() === cat);
      }
      return m.category && m.category.toLowerCase() === cat;
    });
  }

  if (genre && typeof genre === 'string') {
    const targetGenre = genre.toLowerCase().trim();
    if (targetGenre !== 'all' && targetGenre !== 'todos los géneros') {
      result = result.filter(m =>
        Array.isArray(m.genres) &&
        m.genres.some(g => g.toLowerCase() === targetGenre)
      );
    }
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase().trim();
    if (q.length > 0) {
      result = result.filter(m =>
        (m.title && m.title.toLowerCase().includes(q)) ||
        (m.original_title && m.original_title.toLowerCase().includes(q)) ||
        (m.overview && m.overview.toLowerCase().includes(q))
      );
    }
  }

  return result;
}

/**
 * Convierte una calificación numérica (0 a 10) a formato porcentaje e indicador de nivel
 * @param {number} voteAverage - Calificación de 0 a 10
 * @returns {{ percentage: number, ratingLevel: 'high'|'medium'|'low', color: string }}
 */
function formatMovieScore(voteAverage) {
  const num = parseFloat(voteAverage);
  if (isNaN(num) || num < 0) {
    return { percentage: 0, ratingLevel: 'low', color: '#db2360' };
  }

  // Clampear a máximo 10
  const clamped = Math.min(num, 10);
  const percentage = Math.round(clamped * 10);

  if (percentage >= 70) {
    return { percentage, ratingLevel: 'high', color: '#21d07a' };
  } else if (percentage >= 50) {
    return { percentage, ratingLevel: 'medium', color: '#d2d531' };
  } else {
    return { percentage, ratingLevel: 'low', color: '#db2360' };
  }
}

/**
 * Formatea una fecha ISO (YYYY-MM-DD) al formato amigable en español
 * @param {string} dateStr - Fecha en formato '2024-03-01'
 * @returns {string} - Fecha formateada (ej. '1 mar 2024')
 */
function formatDateSpanish(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return '';
  const parts = dateStr.trim().split('-');
  if (parts.length !== 3) return dateStr;

  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(monthIndex) || isNaN(day) || monthIndex < 0 || monthIndex > 11) {
    return dateStr;
  }

  const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  return `${day} ${months[monthIndex]} ${year}`;
}

/**
 * Calcula métricas generales y estadísticas del catálogo de películas
 * @param {Array} movies - Lista de películas
 * @returns {Object} - Resumen de métricas
 */
function calculateCatalogMetrics(movies = []) {
  if (!Array.isArray(movies) || movies.length === 0) {
    return {
      total: 0,
      averageScore: 0,
      topRated: null,
      genresCount: 0,
      genreDistribution: {}
    };
  }

  let totalScore = 0;
  let topRated = movies[0];
  const genreDistribution = {};

  for (const m of movies) {
    const score = typeof m.vote_average === 'number' ? m.vote_average : 0;
    totalScore += score;

    if (score > (topRated.vote_average || 0)) {
      topRated = m;
    }

    if (Array.isArray(m.genres)) {
      for (const g of m.genres) {
        genreDistribution[g] = (genreDistribution[g] || 0) + 1;
      }
    }
  }

  const averageScore = Math.round((totalScore / movies.length) * 10) / 10;

  return {
    total: movies.length,
    averageScore,
    topRated,
    genresCount: Object.keys(genreDistribution).length,
    genreDistribution
  };
}

/**
 * Valida si un objeto de película cumple con la estructura requerida
 * @param {Object} movie - Objeto a validar
 * @returns {{ valid: boolean, errors: string[] }}
 */
function validateMovie(movie) {
  const errors = [];
  if (!movie || typeof movie !== 'object') {
    return { valid: false, errors: ['El objeto película no puede estar vacío'] };
  }

  if (typeof movie.id !== 'number' || movie.id <= 0) {
    errors.push('El campo "id" debe ser un número entero positivo');
  }

  if (!movie.title || typeof movie.title !== 'string' || movie.title.trim().length === 0) {
    errors.push('El campo "title" es obligatorio y debe ser un texto no vacío');
  }

  if (!movie.release_date || !/^\d{4}-\d{2}-\d{2}$/.test(movie.release_date)) {
    errors.push('El campo "release_date" debe tener el formato YYYY-MM-DD');
  }

  if (typeof movie.vote_average !== 'number' || movie.vote_average < 0 || movie.vote_average > 10) {
    errors.push('El campo "vote_average" debe ser un número entre 0 y 10');
  }

  if (!Array.isArray(movie.genres) || movie.genres.length === 0) {
    errors.push('El campo "genres" debe ser un arreglo con al menos un género');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

module.exports = {
  filterMovies,
  formatMovieScore,
  formatDateSpanish,
  calculateCatalogMetrics,
  validateMovie
};
