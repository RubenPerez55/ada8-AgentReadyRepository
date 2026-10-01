# 🎬 TMDB Clone — Movies ADA06

Recreación simplificada de las vistas y catálogo de **The Movie Database (TMDB)** ([themoviedb.org](https://www.themoviedb.org/?language=es)) con arquitectura Frontend y Backend (REST API) y suite de pruebas unitarias.

---

## 📋 Descripción del Proyecto

Este proyecto implementa las vistas principales de TMDB para exploración y consulta de películas:
- **Navbar / Encabezado TMDB**: Navegación por categorías, menú desplegable, branding oficial y búsqueda.
- **Hero Banner interactivo**: Buscador en tiempo real de títulos y sinopsis.
- **Filtro por Géneros**: Chips interactivos para filtrar el catálogo (Acción, Animación, Aventura, Ciencia Ficción, Comedia, Drama, Terror, etc.).
- **Carruseles de Categorías**:
  - *Tendencias* (Hoy / Esta semana).
  - *Lo más popular* (En streaming / En cines).
  - *Mejor valoradas* (Aclamadas por la crítica).
- **Insignias circulares de calificación**: Círculo de porcentaje SVG estilo TMDB con código de colores dinámico según la nota de usuario.
- **Imágenes oficiales de TMDB**: Carátulas y backdrops de alta definición 100% verificados, junto a fallbacks vectoriales SVG offline para evitar errores de carga.
- **Vista detallada / Modal de Película**:
  - Banner backdrop y póster en alta resolución.
  - Ficha técnica (año, clasificación por edades, duración y géneros).
  - Sinopsis completa ("Vista general").
  - Reparto principal con avatares y personajes.
  - Reproductor integrado de tráiler oficial en YouTube.

---

## 📂 Estructura del Repositorio

```text
Movies-ADA06/
├── AI_USAGE_LOG.md               # Registro de uso de Inteligencia Artificial (plantilla requerida)
├── README.md                     # Documentación del proyecto
├── .gitignore                    # Reglas de exclusión para dependencias y temporales
├── package.json                  # Configuración y scripts raíz (start, dev, test)
├── backend/                      # Servidor y API REST
│   ├── package.json
│   ├── server.js                 # API Express con endpoints de películas y servicio estático
│   ├── data/
│   │   └── movies.json           # Base de datos con películas, pósters oficiales e información detallada
│   ├── services/
│   │   └── movieService.js       # Lógica de negocio (filtrado, formateo, métricas y validaciones)
│   └── test/
│       └── movieService.test.js  # Suite de pruebas unitarias con node:test y node:assert
└── frontend/                     # Interfaz de usuario (Vistas TMDB)
    ├── index.html                # Estructura de vistas, componentes y modales
    ├── styles.css                # Hoja de estilos con diseño fiel a TMDB y carruseles
    └── app.js                    # Lógica del cliente, consumo de API, modales y fallbacks SVG
```

---

## 🚀 Puesta en Marcha

### Prerrequisitos
- Node.js (versión 18 o superior)
- npm

### 1. Ejecución del Servidor y Aplicación Web
Desde la raíz del proyecto, ejecuta:

```bash
# Instalar dependencias del backend (o simplemente "npm install")
npm run install:all

# Iniciar servidor (sirve tanto la API como el frontend)
npm start
```

Abre tu navegador en:  
👉 **[http://localhost:5000](http://localhost:5000)**

---

## 🧪 Pruebas Unitarias

El proyecto incluye una suite completa de pruebas unitarias implementadas con el ejecutor nativo `node:test` y `node:assert`:

Para ejecutar las pruebas:

```bash
npm test
```

### Funcionalidades evaluadas en las pruebas (`movieService.test.js`):
1. **`filterMovies()`**:
   - Filtrado preciso por categorías (`trending`, `popular`, `top_rated`, `upcoming`).
   - Filtrado insensible a mayúsculas/minúsculas por género.
   - Búsqueda textual parcial en títulos, títulos originales y sinopsis.
   - Filtrado combinado multicriterio (categoría + género + búsqueda).
   - Manejo seguro de datos vacíos o no válidos.
2. **`formatMovieScore()`**:
   - Transformación de calificación 0-10 a porcentaje de aprobación (0-100%).
   - Clasificación por umbral cromático estilo TMDB: alta (verde $\ge 70\%$), media (amarillo $\ge 50\%$) y baja (rojo $< 50\%$).
   - Normalización de valores nulos, negativos o fuera de rango.
3. **`formatDateSpanish()`**:
   - Formateo de fechas ISO (`YYYY-MM-DD`) a fechas legibles en español (ej. `1 mar 2024`).
4. **`calculateCatalogMetrics()`**:
   - Agregación estadística: conteo total, promedio de calificación, película mejor valorada y distribución por género.
5. **`validateMovie()`**:
   - Validación de esquema de datos obligatorio para objetos de película.

---

## 📡 Endpoints del Backend (API REST)

| Método | Endpoint | Descripción | Parámetros de consulta |
|---|---|---|---|
| `GET` | `/api/movies` | Lista todas las películas o aplica filtros | `?category=popular\|trending\|top_rated\|upcoming`, `?search=texto`, `?genre=genero` |
| `GET` | `/api/movies/:id` | Detalle completo de una película | Parámetro en ruta `:id` |
| `GET` | `/api/metrics` | Métricas y resumen estadístico del catálogo | Ninguno |
| `GET` | `/api/categories` | Lista de categorías disponibles | Ninguno |
| `GET` | `/api/genres` | Lista de todos los géneros únicos | Ninguno |
| `GET` | `/api/health` | Estado de salud del servicio | Ninguno |

---

## 🔑 Prerrequisito: Fine-grained Personal Access Token (Solo Lectura)

Para dar acceso de solo lectura al evaluador/profesor sobre este repositorio mediante un **Fine-grained Personal Access Token**:

1. En GitHub, ve a **Settings** → **Developer Settings** → **Personal Access Tokens** → **Fine-grained tokens**.
2. Haz clic en **Generate new token**.
3. Configura:
   - **Token name**: `Evaluacion-Movies-ADA06`
   - **Expiration**: Según la duración del curso (ej. 30 o 60 días).
   - **Repository access**: Selecciona **Only select repositories** y elige `RubenPerez55/Movies-ADA06`.
   - **Permissions** → **Repository permissions**:
     - *Contents*: `Read-only`
     - *Issues*: `Read-only`
     - *Pull requests*: `Read-only`
     - *Metadata*: `Read-only` (asignado automáticamente)
4. Haz clic en **Generate token** y copia el token para entregarlo al profesor.

---

## 📝 Registro de IA

El archivo `AI_USAGE_LOG.md` se encuentra disponible en la raíz del repositorio listo para ser completado durante el desarrollo de las tareas correspondientes.
