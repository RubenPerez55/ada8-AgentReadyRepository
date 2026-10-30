/**
 * Process entry point: starts the HTTP server.
 * The Express application (routes) lives in app.js so it can be tested in-process.
 */
const app = require('./app');

const PORT = process.env.PORT || 5000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🎬 TMDB Clone Server corriendo exitosamente!`);
  console.log(`🌐 Acceso Web: http://localhost:${PORT}`);
  console.log(`📡 API Movies: http://localhost:${PORT}/api/movies`);
  console.log(`📊 API Metrics: http://localhost:${PORT}/api/metrics`);
  console.log(`===============================================`);
});

