# Inventario de Herramientas MCP de GitHub (GitHub MCP Tool Inventory)

Este documento registra el inventario de herramientas (tools) provistas por el servidor MCP de GitHub en el entorno del cliente (**github-Readonly**), evaluando su conjunto de herramientas (*toolset*), modalidad de acceso (*Read/Write*), propósito en las actividades del ADA y nivel de riesgo asociado.

---

## 📊 Tabla Resumen de Capacidades y Riesgo

La siguiente tabla resume las capacidades principales requeridas en el ADA, reflejando la correspondencia con las herramientas reales registradas en el cliente:

| Tool / capacidad | Toolset | Read/Write | Uso en el ADA | Riesgo |
|---|---|---|---|---|
| `get_file_contents` / lectura de archivos | `repos` | Read | Leer código y docs | Bajo |
| `search_code` / `search_repositories` (`search`) / búsqueda de código o repos | `repos` | Read | Localizar implementación | Bajo |
| `issue_read` / lectura de Issue | `issues` | Read | Comprender solicitud/bug | Medio: contenido no confiable |
| `pull_request_read` / lectura de PR | `pull_requests` | Read | Analizar cambio y diff | Medio: contenido no confiable |
| Write tools | — | No disponibles | No deben aparecer por read-only | Alto si estuvieran habilitadas |

> **Nota sobre variaciones de versión:** Los identificadores exactos de las tools pueden variar según la versión y distribución del servidor MCP (por ejemplo, algunos servidores agrupan la búsqueda bajo una única tool `search`, mientras que la versión actual expone `search_code`, `search_repositories`, etc.). A continuación se documenta el inventario exhaustivo expuesto por el cliente actual.

---

## 🔍 Inventario Detallado de Tools Disponibles en el Cliente (`github-Readonly`)

En la configuración activa del cliente para el servidor **`github-Readonly`**, se encuentran expuestas exclusivamente **22 herramientas de solo lectura**, agrupadas por categoría funcional (*toolset*):

### 1. Repositorio, Archivos y Ramas (`repos`)

| Nombre Exacto en el Cliente | Modalidad | Descripción / Propósito en el ADA | Nivel de Riesgo |
|---|---|---|---|
| `get_file_contents` | Read | Obtiene el contenido de archivos o lista directorios en una ruta específica del repositorio. Permite consultar código fuente, esquemas JSON y documentación. | Bajo |
| `list_branches` | Read | Lista las ramas existentes en el repositorio para validar ramas activas de trabajo o evaluación. | Bajo |
| `list_tags` | Read | Lista las etiquetas (tags) creadas en el repositorio. | Bajo |
| `get_tag` | Read | Obtiene la información y el commit asociado a un tag específico. | Bajo |
| `list_repository_collaborators` | Read | Consulta los colaboradores asignados al repositorio para verificar accesos. | Bajo |

### 2. Historial de Commits (`commits`)

| Nombre Exacto en el Cliente | Modalidad | Descripción / Propósito en el ADA | Nivel de Riesgo |
|---|---|---|---|
| `list_commits` | Read | Lista el historial de commits con autor, mensaje y fecha para auditar cambios. | Bajo |
| `get_commit` | Read | Obtiene los detalles y el diff de un commit individual específico por su SHA. | Bajo |

### 3. Motores de Búsqueda (`search`)

| Nombre Exacto en el Cliente | Modalidad | Descripción / Propósito en el ADA | Nivel de Riesgo |
|---|---|---|---|
| `search_code` | Read | Búsqueda precisa de código, símbolos, funciones y clases en los repositorios utilizando el motor de búsqueda nativo de GitHub. | Bajo |
| `search_repositories` | Read | Búsqueda y descubrimiento de repositorios por nombre, descripción, tópicos o metadatos. | Bajo |
| `search_commits` | Read | Búsqueda textual y por filtros en los mensajes y metadatos de commits. | Bajo |
| `search_issues` | Read | Búsqueda avanzada de issues y discusiones con filtros por estado, autor o etiquetas. | Bajo |
| `search_pull_requests` | Read | Búsqueda de pull requests por palabras clave, estado o autor. | Bajo |

### 4. Gestión de Issues (`issues`)

| Nombre Exacto en el Cliente | Modalidad | Descripción / Propósito en el ADA | Nivel de Riesgo |
|---|---|---|---|
| `issue_read` | Read | Consulta en detalle un issue específico, incluyendo comentarios, sub-issues, issues padre y etiquetas (`get`, `get_comments`, `get_sub_issues`, `get_parent`, `get_labels`). Esencial para entender solicitudes y reportes de bug. | Medio: contenido no confiable |
| `list_issues` | Read | Lista los issues abiertos o cerrados del repositorio con paginación y filtros. | Medio: contenido no confiable |
| `list_issue_fields` | Read | Lista los campos configurados para issues en proyectos de GitHub. | Bajo |
| `list_issue_types` | Read | Consulta los tipos de issue definidos en la organización. | Bajo |
| `get_label` | Read | Consulta la información de una etiqueta específica. | Bajo |

### 5. Pull Requests (`pull_requests`)

| Nombre Exacto en el Cliente | Modalidad | Descripción / Propósito en el ADA | Nivel de Riesgo |
|---|---|---|---|
| `pull_request_read` | Read | Inspecciona un PR específico: detalle (`get`), diferencias de código (`get_diff`), estado CI (`get_status`), archivos modificados (`get_files`), commits (`get_commits`), revisiones (`get_reviews`) y comentarios (`get_comments`, `get_review_comments`). | Medio: contenido no confiable |
| `list_pull_requests` | Read | Lista los pull requests del repositorio según estado (`open`, `closed`, `all`). | Medio: contenido no confiable |

### 6. Versiones y Releases (`releases`)

| Nombre Exacto en el Cliente | Modalidad | Descripción / Propósito en el ADA | Nivel de Riesgo |
|---|---|---|---|
| `list_releases` | Read | Lista los lanzamientos (releases) publicados en el repositorio. | Bajo |
| `get_latest_release` | Read | Obtiene los detalles y notas del release más reciente. | Bajo |
| `get_release_by_tag` | Read | Obtiene el release asociado a un tag específico. | Bajo |

---

## 🚫 Herramientas de Escritura (*Write Tools*)

En cumplimiento con el principio de mínimo privilegio y los requerimientos de seguridad del ADA, las siguientes herramientas de escritura **NO se encuentran disponibles**:

- `create_or_update_file` / `push_files` (creación o sobreescritura de código).
- `create_branch` (creación de ramas).
- `create_issue` / `update_issue` / `add_issue_comment` (modificación de issues).
- `create_pull_request` / `update_pull_request_branch` / `merge_pull_request` (creación o fusión de PRs).
- `create_repository` / `fork_repository` (creación o bifurcación de repositorios).

**Estado:** ❌ **No disponibles**  
**Justificación:** El servidor MCP está configurado como `github-Readonly` respaldado por un *Fine-grained Personal Access Token* configurado estrictamente con permisos de solo lectura (`Contents: Read`, `Issues: Read`, `Pull requests: Read`, `Metadata: Read`). Esto previene cualquier alteración no supervisada o accidental en la base de código.

---

## 🛡️ Análisis de Riesgo y Criterios de Clasificación

1. **Riesgo Bajo (Operaciones de lectura interna y búsqueda):**
   - Las operaciones de lectura sobre archivos de código fuente (`get_file_contents`), historial (`list_commits`, `get_commit`) y búsquedas de estructura (`search_code`, `search_repositories`) operan sobre el repositorio del proyecto bajo control de versiones. No mutan el estado y su impacto se limita a la consulta de información.

2. **Riesgo Medio (Contenido no confiable en Issues y PRs):**
   - Las herramientas `issue_read`, `list_issues`, `pull_request_read` y `list_pull_requests` recuperan texto generado por usuarios externos o colaboradores (descripciones de issues, hilos de discusión, comentarios de PR).
   - **Vector de amenaza:** Existe el riesgo de *Indirect Prompt Injection* o contenido manipulado que intente engañar al modelo de IA durante la interpretación de solicitudes o análisis de diffs. Deben tratarse como entradas no sanitizadas.

3. **Riesgo Alto (Herramientas de escritura si estuvieran presentes):**
   - La inclusión de herramientas con permisos de escritura permitiría a un agente automatizado modificar archivos (`push_files`), fusionar código a ramas principales (`merge_pull_request`) o publicar comentarios no verificados.
   - Su bloqueo total garantiza la integridad del repositorio y el aislamiento del entorno de evaluación.
