/**
 * TMDB CLONE — APLICACIÓN FRONTEND
 * Conexión con Backend REST API, renderizado dinámico y vistas de detalle
 */

// Imágenes de respaldo seguras en formato SVG Data-URI (funcionan 100% offline y sin fallos)
const FALLBACK_POSTER = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='450' viewBox='0 0 300 450'><rect width='100%' height='100%' fill='%23032541'/><rect x='15' y='15' width='270' height='420' rx='12' fill='none' stroke='%2301b4e4' stroke-width='2' stroke-dasharray='6,6'/><text x='50%' y='46%' fill='%2301b4e4' font-size='28' font-family='sans-serif' font-weight='900' text-anchor='middle'>TMDB</text><text x='50%' y='54%' fill='%23ffffff' font-size='14' font-family='sans-serif' opacity='0.85' text-anchor='middle'>Carátula de Película</text></svg>";

const FALLBACK_ACTOR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='185' height='240' viewBox='0 0 185 240'><rect width='100%' height='100%' fill='%230d253f'/><circle cx='92.5' cy='85' r='38' fill='%2301b4e4' opacity='0.75'/><ellipse cx='92.5' cy='185' rx='60' ry='42' fill='%2301b4e4' opacity='0.75'/></svg>";

// Fallback de datos con URLs oficiales de TMDB verificadas
const FALLBACK_MOVIES = [
  {
    id: 1,
    title: "Dune: Parte Dos",
    original_title: "Dune: Part Two",
    overview: "Sigue el viaje mítico de Paul Atreides mientras se une a Chani y a los Fremen en una senda de venganza contra los conspiradores que destruyeron a su familia. Ante la elección entre el amor de su vida y el destino del universo, Paul debe evitar un futuro terrible que solo él puede prever.",
    release_date: "2024-03-01",
    vote_average: 8.2,
    category: ["trending", "popular", "top_rated"],
    genres: ["Ciencia Ficción", "Aventura"],
    runtime: "2h 46m",
    certification: "+12",
    tagline: "Larga vida a los luchadores.",
    poster_path: "https://media.themoviedb.org/t/p/w500/6o5cJjA4srfvU52UKWaqPUuPPgl.jpg",
    backdrop_path: "https://media.themoviedb.org/t/p/w780/eZ239CUp1d6OryZEBPnO2n87gMG.jpg",
    trailer_key: "Way9Dexny3w",
    cast: [
      { name: "Timothée Chalamet", character: "Paul Atreides", photo: "https://image.tmdb.org/t/p/w185/BE2sdjpgsa2rNTFa66f7upkaOP.jpg" },
      { name: "Zendaya", character: "Chani", photo: "https://ui-avatars.com/api/?name=Zendaya&background=032541&color=fff&size=200" },
      { name: "Rebecca Ferguson", character: "Lady Jessica", photo: "https://ui-avatars.com/api/?name=Rebecca+Ferguson&background=032541&color=fff&size=200" }
    ]
  },
  {
    id: 2,
    title: "Del Revés 2 (Inside Out 2)",
    original_title: "Inside Out 2",
    overview: "Regresa a la mente de una recién graduada Riley justo cuando el cuartel general está sufriendo una repentina demolición para hacer espacio a algo totalmente inesperado: ¡nuevas emociones! Alegría, Tristeza, Furia, Temor y Desagrado se ven sorprendidas cuando aparece Ansiedad.",
    release_date: "2024-06-14",
    vote_average: 7.6,
    category: ["trending", "popular"],
    genres: ["Animación", "Familia", "Comedia"],
    runtime: "1h 36m",
    certification: "TP",
    tagline: "Haz sitio para nuevas emociones.",
    poster_path: "https://media.themoviedb.org/t/p/w500/4HEJdpcmTGm3BWWic31G4aCnuC6.jpg",
    backdrop_path: "https://media.themoviedb.org/t/p/w780/p5ozvmdgsmbWe0H8Xk7Rc8SCwAB.jpg",
    trailer_key: "LEjhY15eCx0",
    cast: [
      { name: "Amy Poehler", character: "Alegría (voz)", photo: "https://ui-avatars.com/api/?name=Amy+Poehler&background=032541&color=fff&size=200" },
      { name: "Maya Hawke", character: "Ansiedad (voz)", photo: "https://ui-avatars.com/api/?name=Maya+Hawke&background=032541&color=fff&size=200" },
      { name: "Phyllis Smith", character: "Tristeza (voz)", photo: "https://ui-avatars.com/api/?name=Phyllis+Smith&background=032541&color=fff&size=200" }
    ]
  },
  {
    id: 3,
    title: "Deadpool y Lobezno",
    original_title: "Deadpool & Wolverine",
    overview: "Un apático Wade Wilson se afana en la vida civil con sus días como el moralmente flexible mercenario Deadpool en el pasado. Pero cuando su mundo natal se enfrenta a una amenaza existencial, Wade debe volver a ponerse el traje con un aún más reacio Lobezno.",
    release_date: "2024-07-26",
    vote_average: 7.7,
    category: ["trending", "popular"],
    genres: ["Acción", "Comedia", "Ciencia Ficción"],
    runtime: "2h 08m",
    certification: "+18",
    tagline: "Juntos salvarán el multiverso... o no.",
    poster_path: "https://media.themoviedb.org/t/p/w500/6aY3OzCIdxoBMYdiH5s17rWFFFA.jpg",
    backdrop_path: "https://media.themoviedb.org/t/p/w780/by8z9Fe8y7p4jo2YlW2SZDnptyT.jpg",
    trailer_key: "73_1biulkYk",
    cast: [
      { name: "Ryan Reynolds", character: "Wade Wilson / Deadpool", photo: "https://ui-avatars.com/api/?name=Ryan+Reynolds&background=032541&color=fff&size=200" },
      { name: "Hugh Jackman", character: "Logan / Wolverine", photo: "https://ui-avatars.com/api/?name=Hugh+Jackman&background=032541&color=fff&size=200" },
      { name: "Emma Corrin", character: "Cassandra Nova", photo: "https://ui-avatars.com/api/?name=Emma+Corrin&background=032541&color=fff&size=200" }
    ]
  },
  {
    id: 4,
    title: "Robot Salvaje",
    original_title: "The Wild Robot",
    overview: "El épico viaje de una robot que naufraga en una isla deshabitada y debe aprender a adaptarse al duro entorno entablando poco a poco relaciones con los animales de la isla y convirtiéndose en la madre adoptiva de un gansito huérfano.",
    release_date: "2024-09-27",
    vote_average: 8.4,
    category: ["trending", "popular", "top_rated"],
    genres: ["Animación", "Ciencia Ficción", "Familia"],
    runtime: "1h 42m",
    certification: "TP",
    tagline: "Descubre tu verdadera naturaleza.",
    poster_path: "https://media.themoviedb.org/t/p/w500/cYMihyFZreVBn8x6KnyPY4ea0HX.jpg",
    backdrop_path: "https://media.themoviedb.org/t/p/w780/1pmXyN3sKeYoUhu5VBZiDU4BX21.jpg",
    trailer_key: "67vbA5ZJb28",
    cast: [
      { name: "Lupita Nyong'o", character: "Roz (voz)", photo: "https://ui-avatars.com/api/?name=Lupita+Nyong'o&background=032541&color=fff&size=200" },
      { name: "Pedro Pascal", character: "Fink (voz)", photo: "https://ui-avatars.com/api/?name=Pedro+Pascal&background=032541&color=fff&size=200" }
    ]
  }
];

// Estado de la Aplicación
let allMovies = [];
let allGenres = [];
let currentFilter = {
  genre: 'all',
  search: ''
};

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', async () => {
  await initApp();
  setupEventListeners();
});

/**
 * Inicializa la carga de datos desde el backend
 */
async function initApp() {
  try {
    const res = await fetch('/api/movies');
    if (res.ok) {
      const data = await res.json();
      allMovies = data.results || [];
    } else {
      allMovies = FALLBACK_MOVIES;
    }
  } catch (err) {
    console.warn('Backend API no disponible, usando datos de respaldo:', err.message);
    allMovies = FALLBACK_MOVIES;
  }

  // Cargar lista de géneros
  extractOrFetchGenres();

  // Renderizar vistas
  renderGenreChips();
  renderSectionCarousels();
}

/**
 * Extrae géneros únicos
 */
function extractOrFetchGenres() {
  const genreSet = new Set();
  allMovies.forEach(m => {
    if (m.genres) m.genres.forEach(g => genreSet.add(g));
  });
  allGenres = Array.from(genreSet).sort();
}

/**
 * Renderiza los botones de chip de filtro de género
 */
function renderGenreChips() {
  const container = document.getElementById('genre-chips');
  if (!container) return;

  const html = ['<button class="genre-chip active" data-genre="all">Todos los géneros</button>'];
  allGenres.forEach(genre => {
    html.push(`<button class="genre-chip" data-genre="${escapeHtml(genre)}">${escapeHtml(genre)}</button>`);
  });
  container.innerHTML = html.join('');

  // Eventos de los chips
  container.querySelectorAll('.genre-chip').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.genre-chip').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const genre = btn.getAttribute('data-genre');
      currentFilter.genre = genre;
      applyFilters();
    });
  });
}

/**
 * Renderiza carruseles de películas por categoría
 */
function renderSectionCarousels() {
  const trendingMovies = allMovies.filter(m => m.category && m.category.includes('trending'));
  const popularMovies = allMovies.filter(m => m.category && m.category.includes('popular'));
  const topRatedMovies = allMovies.filter(m => m.category && m.category.includes('top_rated'));

  renderCarousel('carousel-trending', trendingMovies);
  renderCarousel('carousel-popular', popularMovies);
  renderCarousel('carousel-top-rated', topRatedMovies);
}

/**
 * Renderiza un carrusel específico
 */
function renderCarousel(elementId, movies) {
  const container = document.getElementById(elementId);
  if (!container) return;

  if (movies.length === 0) {
    container.innerHTML = '<p style="padding: 20px; color: #888;">No hay películas en esta categoría.</p>';
    return;
  }

  container.innerHTML = movies.map(movie => createMovieCardHtml(movie)).join('');

  // Asociar evento click a cada tarjeta
  container.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'), 10);
      openMovieModal(id);
    });
  });
}

/**
 * Genera el HTML de una tarjeta de película con la insignia de puntuación TMDB
 */
function createMovieCardHtml(movie) {
  const percentage = Math.round(movie.vote_average * 10);
  const strokeColor = percentage >= 70 ? '#21d07a' : percentage >= 50 ? '#d2d531' : '#db2360';
  const formattedDate = formatDateSpanish(movie.release_date);

  // SVG de círculo de progreso
  const dashOffset = 100 - percentage;

  return `
    <div class="movie-card" data-id="${movie.id}">
      <div class="card-poster-wrapper">
        <img 
          src="${escapeHtml(movie.poster_path)}" 
          alt="${escapeHtml(movie.title)}" 
          class="card-poster"
          loading="lazy"
          onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';"
        />
        <div class="score-badge" title="${percentage}% de aprobación">
          <svg viewBox="0 0 36 36">
            <path class="score-bg-circle"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path class="score-progress-circle"
              stroke="${strokeColor}"
              stroke-dasharray="100, 100"
              stroke-dashoffset="${dashOffset}"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
          <span class="score-text">${percentage}<sup>%</sup></span>
        </div>
      </div>
      <div class="card-info">
        <h3 class="card-title">${escapeHtml(movie.title)}</h3>
        <p class="card-date">${formattedDate}</p>
      </div>
    </div>
  `;
}

/**
 * Formatea fechas a formato amigable en español (ej. "1 mar 2024")
 */
function formatDateSpanish(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parts[0];
      const monthIndex = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
      return `${day} ${months[monthIndex] || ''} ${year}`;
    }
  } catch (e) {
    // Retornar fecha original si falla
  }
  return dateStr;
}

/**
 * Aplica los filtros de búsqueda y géneros
 */
function applyFilters() {
  const query = currentFilter.search.trim().toLowerCase();
  const genre = currentFilter.genre;

  const isFiltering = query !== '' || genre !== 'all';
  const sections = document.querySelectorAll('.movie-section');
  const searchResultsSection = document.getElementById('search-results-section');
  const movieGrid = document.getElementById('movie-grid');
  const title = document.getElementById('search-results-title');

  if (!isFiltering) {
    sections.forEach(s => s.style.display = 'block');
    searchResultsSection.style.display = 'none';
    return;
  }

  // Ocultar carruseles y mostrar cuadrícula de resultados
  sections.forEach(s => s.style.display = 'none');
  searchResultsSection.style.display = 'block';

  let filtered = allMovies.filter(m => {
    const matchGenre = (genre === 'all') || (m.genres && m.genres.includes(genre));
    const matchQuery = !query || 
      (m.title && m.title.toLowerCase().includes(query)) ||
      (m.original_title && m.original_title.toLowerCase().includes(query)) ||
      (m.overview && m.overview.toLowerCase().includes(query));
    return matchGenre && matchQuery;
  });

  if (title) {
    let titleText = 'Películas encontradas';
    if (query) titleText += ` para "${escapeHtml(query)}"`;
    if (genre !== 'all') titleText += ` [Género: ${escapeHtml(genre)}]`;
    titleText += ` (${filtered.length})`;
    title.innerHTML = titleText;
  }

  if (filtered.length === 0) {
    movieGrid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 50px 20px;">
        <h3 style="font-size: 20px; color: #555; margin-bottom: 10px;">No se encontraron películas</h3>
        <p style="color: #888;">Intenta con otros términos o seleccionando "Todos los géneros".</p>
      </div>
    `;
    return;
  }

  movieGrid.innerHTML = filtered.map(movie => createMovieCardHtml(movie)).join('');
  movieGrid.querySelectorAll('.movie-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = parseInt(card.getAttribute('data-id'), 10);
      openMovieModal(id);
    });
  });
}

/**
 * Abre el modal con la vista detallada de la película
 */
function openMovieModal(movieId) {
  const movie = allMovies.find(m => m.id === movieId);
  if (!movie) return;

  const modal = document.getElementById('movie-modal');
  const modalBody = document.getElementById('modal-body');

  const percentage = Math.round(movie.vote_average * 10);
  const strokeColor = percentage >= 70 ? '#21d07a' : percentage >= 50 ? '#d2d531' : '#db2360';
  const dashOffset = 100 - percentage;
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : '';
  const genresList = movie.genres ? movie.genres.join(', ') : 'Cine';

  // Reparto
  let castHtml = '';
  if (movie.cast && movie.cast.length > 0) {
    castHtml = `
      <div class="modal-info-section">
        <h3 class="cast-section-title">Reparto Principal</h3>
        <div class="cast-grid">
          ${movie.cast.map(c => `
            <div class="cast-card">
              <img 
                src="${escapeHtml(c.photo)}" 
                alt="${escapeHtml(c.name)}" 
                class="cast-photo" 
                loading="lazy"
                onerror="this.onerror=null;this.src='${FALLBACK_ACTOR}';"
              />
              <div class="cast-details">
                <div class="cast-name">${escapeHtml(c.name)}</div>
                <div class="cast-character">${escapeHtml(c.character)}</div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  modalBody.innerHTML = `
    <div class="modal-banner" style="background-image: url('${escapeHtml(movie.backdrop_path || movie.poster_path)}');">
      <div class="modal-banner-overlay"></div>
      <div class="modal-banner-content">
        <img 
          src="${escapeHtml(movie.poster_path)}" 
          alt="${escapeHtml(movie.title)}" 
          class="modal-poster" 
          onerror="this.onerror=null;this.src='${FALLBACK_POSTER}';"
        />
        
        <div class="modal-details">
          <h2 class="modal-title">${escapeHtml(movie.title)} <span>(${releaseYear})</span></h2>
          
          <div class="modal-facts">
            <span class="cert-badge">${escapeHtml(movie.certification || 'TP')}</span>
            <span>${formatDateSpanish(movie.release_date)}</span>
            <span>•</span>
            <span>${escapeHtml(genresList)}</span>
            <span>•</span>
            <span>${escapeHtml(movie.runtime || '2h 00m')}</span>
          </div>

          <div class="modal-actions-row">
            <div class="modal-score-wrap">
              <div class="score-badge">
                <svg viewBox="0 0 36 36">
                  <path class="score-bg-circle" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                  <path class="score-progress-circle" stroke="${strokeColor}" stroke-dasharray="100, 100" stroke-dashoffset="${dashOffset}" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                </svg>
                <span class="score-text">${percentage}<sup>%</sup></span>
              </div>
              <div class="score-label">Puntuación de usuario</div>
            </div>

            ${movie.trailer_key ? `
              <button class="play-trailer-btn" id="modal-trailer-btn" data-trailer="${escapeHtml(movie.trailer_key)}">
                ▶ Reproducir tráiler
              </button>
            ` : ''}
          </div>

          ${movie.tagline ? `<div class="modal-tagline">"${escapeHtml(movie.tagline)}"</div>` : ''}

          <div class="modal-overview-title">Vista general</div>
          <p class="modal-overview">${escapeHtml(movie.overview)}</p>
        </div>
      </div>
    </div>
    ${castHtml}
  `;

  // Trailer button dentro del modal
  const trailerBtn = modalBody.querySelector('#modal-trailer-btn');
  if (trailerBtn) {
    trailerBtn.addEventListener('click', () => {
      openTrailerModal(trailerBtn.getAttribute('data-trailer'));
    });
  }

  modal.classList.add('active');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

/**
 * Abre el reproductor del tráiler en YouTube
 */
function openTrailerModal(trailerKey) {
  if (!trailerKey) return;
  const trailerModal = document.getElementById('trailer-modal');
  const iframe = document.getElementById('trailer-iframe');
  iframe.src = `https://www.youtube.com/embed/${trailerKey}?autoplay=1`;
  trailerModal.classList.add('active');
  trailerModal.setAttribute('aria-hidden', 'false');
}

/**
 * Cierra modal de trailer
 */
function closeTrailerModal() {
  const trailerModal = document.getElementById('trailer-modal');
  const iframe = document.getElementById('trailer-iframe');
  iframe.src = '';
  trailerModal.classList.remove('active');
  trailerModal.setAttribute('aria-hidden', 'true');
}

/**
 * Cierra modal de película
 */
function closeMovieModal() {
  const modal = document.getElementById('movie-modal');
  modal.classList.remove('active');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = 'auto';
}

/**
 * Configura los event listeners principales
 */
function setupEventListeners() {
  // Buscador del hero
  const searchForm = document.getElementById('search-form');
  const searchInput = document.getElementById('search-input');
  if (searchForm && searchInput) {
    searchForm.addEventListener('submit', (e) => {
      e.preventDefault();
      currentFilter.search = searchInput.value;
      applyFilters();
    });

    searchInput.addEventListener('input', () => {
      currentFilter.search = searchInput.value;
      applyFilters();
    });
  }

  // Botón de limpiar filtro
  const clearBtn = document.getElementById('clear-search-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      currentFilter.search = '';
      currentFilter.genre = 'all';
      if (searchInput) searchInput.value = '';
      const chips = document.querySelectorAll('.genre-chip');
      chips.forEach(c => c.classList.remove('active'));
      if (chips[0]) chips[0].classList.add('active');
      applyFilters();
    });
  }

  // Logo recarga vista inicial
  const logoBtn = document.getElementById('logo-btn');
  if (logoBtn) {
    logoBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (clearBtn) clearBtn.click();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Filtros del menú de navegación
  document.querySelectorAll('[data-filter-cat]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const cat = item.getAttribute('data-filter-cat');
      const sec = document.getElementById(`section-${cat === 'top_rated' ? 'top-rated' : cat}`);
      if (sec) {
        if (clearBtn) clearBtn.click();
        sec.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Botones de scroll lateral en carruseles
  document.querySelectorAll('.scroll-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-scroll');
      const carousel = document.getElementById(targetId);
      if (!carousel) return;
      const scrollAmount = 600;
      if (btn.classList.contains('left')) {
        carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
      } else {
        carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    });
  });

  // Selector toggle tabs (Hoy / Esta semana, Streaming / En cines)
  document.querySelectorAll('.selector-toggle').forEach(group => {
    const pills = group.querySelectorAll('.toggle-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', () => {
        pills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      });
    });
  });

  // Cerrar modal de película
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const modalBackdrop = document.getElementById('modal-backdrop');
  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeMovieModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeMovieModal);

  // Cerrar modal de trailer
  const trailerCloseBtn = document.getElementById('trailer-close-btn');
  const trailerBackdrop = document.getElementById('trailer-backdrop');
  if (trailerCloseBtn) trailerCloseBtn.addEventListener('click', closeTrailerModal);
  if (trailerBackdrop) trailerBackdrop.addEventListener('click', closeTrailerModal);

  // Cerrar modales con tecla Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeTrailerModal();
      closeMovieModal();
    }
  });
}

/**
 * Escapa strings para prevenir XSS
 */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
