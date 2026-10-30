# AI Usage Log — ADA-08 Agent-Ready Repository

Mínimo 5 entradas significativas. Cada entrada debe dejar claro qué hizo la IA y qué decidiste tú.

Herramienta / modelo utilizado: Claude Opus 5.5 medium (`claude-opus-5-5`) en Claude Cowork. Las corridas BEFORE y AFTER usaron sub-agentes con contexto limpio, mismo prompt, mismas herramientas y permisos, cada uno en su propio worktree.

---

## Entrada 1 — Auditoría inicial: qué detectó el agente y qué validaste tú

**Fecha:** 30/10/26

**Herramienta / modelo:** Claude Opus 5.5 medium (Cowork, sesión principal)

**Qué le pedí a la IA (prompt o intención):**
Auditar el repositorio del ADA-06 (clon de TMDB, fork de `RubenPerez55/Movies-ADA06`) con las 8 dimensiones de readiness del ADA, dar un score 0-5 por dimensión con evidencia y proponer una tarea bajo prueba.

**Qué propuso / hizo la IA:**
Score BEFORE de **36/100**. Top 3 fricciones: (1) no existe AGENTS.md ni equivalente, (2) `server.js` hace `app.listen()` al importarse, así que las rutas no se pueden probar en proceso y no hay tests HTTP, (3) no hay comando único de verificación, ni lint, ni CI. Propuso CR-01 (`min_rating`, FR-06, AC-06.1…AC-06.4) porque toca servicio, ruta y tests y tiene un AC observable por HTTP (400).

**Mi decisión (aceptado / rechazado / modificado) y por qué:**
Aceptado con una modificación. Revisé el score dimensión por dimensión contra el README y el código. Acepté agregar `REQUIREMENTS.md` (con IDs FR/AC) al baseline, porque la tarea necesita requisitos existentes a los que referirse, pero lo registré como amenaza a la validez: sube un poco el score BEFORE de trazabilidad. Aprobé CR-01 como tarea bajo prueba.

**Evidencia (archivo, commit, comando o resultado):**
`REPOSITORY_READINESS_AUDIT.md` § BEFORE; `TASK_UNDER_TEST.md`; commit `941852b` (tag `ada08-baseline`); `results/readiness-improvement-report.md` § Threats to Validity.

---

## Entrada 2 — Diseño de AGENTS.md: qué sugerencias aceptaste/rechazaste

**Fecha:** 30/10/26

**Herramienta / modelo:** Claude Opus 5.5 medium (sesión principal)

**Qué le pedí a la IA (prompt o intención):**
Generar AGENTS.md y los documentos de soporte a partir de lo que el agente BEFORE tuvo que inferir, sin duplicar requisitos.

**Qué propuso / hizo la IA:**
AGENTS.md con Read First, Sources of Truth, comandos estándar, Change Rules, Do Not Edit, Stop Conditions y Definition of Done; CLAUDE.md como adaptador de 10 líneas que solo apunta a AGENTS.md; además SPEC.md (convenciones de API: `{ error }`, mensajes en español, parseo numérico, parámetro repetido → 400), ARCHITECTURE.md, TASKS.md y `docs/REPO_MAP.md`.

**Mi decisión (aceptado / rechazado / modificado) y por qué:**
Aceptado con un cambio: **rechacé** que `.github/workflows/` quedara protegido por el check automático, porque bloqueaba el propio PR de mejoras que crea el workflow. Queda como regla documentada en "Do Not Edit" y el check automático solo protege `movies.json` y `REQUIREMENTS.md`. También acepté que CLAUDE.md no tenga contenido propio, para que no se convierta en una segunda fuente de verdad.

**Evidencia (archivo, commit, comando o resultado):**
`AGENTS.md`, `CLAUDE.md`, `SPEC.md`, `ARCHITECTURE.md`, `TASKS.md`, `docs/REPO_MAP.md`; commit `95d80cd` (tag `ada08-ready`); mejoras I-01 a I-04 y I-07 en `results/readiness-improvement-report.md`.

---

## Entrada 3 — Guardrail: qué regla convertiste a software y por qué

**Fecha:** 30/10/26

**Herramienta / modelo:** Claude Opus 5.5 medium (sesión principal)

**Qué le pedí a la IA (prompt o intención):**
Convertir en checks deterministas las reglas que, si solo quedan escritas, un agente puede ignorar.

**Qué propuso / hizo la IA:**
`scripts/check_repo_contract.js` (archivos requeridos, `backend/services/` sin `express`/`http`/`fs`, rutas protegidas comparadas contra `main`, IDs de requisitos válidos), `scripts/check_secrets.js` (patrones de tokens y `.env` versionados) y `scripts/verify_repo.sh` que encadena install → tests → lint → contract → security. También separó `backend/app.js` (app exportada) de `backend/server.js` (solo `listen`), sin cambio de comportamiento.

**Mi decisión (aceptado / rechazado / modificado) y por qué:**
Aceptado. Decidí que IK-02 (reglas en services), IK-03 (testabilidad HTTP) e IK-05 (fixture protegido) debían ser **ejecutables** y no solo documentación, porque son justo los puntos donde el agente BEFORE decidió solo. Lo probé: modifiqué `movies.json` y el contrato respondió `REPO_CONTRACT: FAIL ... requires human approval`.

**Evidencia (archivo, commit, comando o resultado):**
`scripts/check_repo_contract.js`, `scripts/check_secrets.js`, `scripts/verify_repo.sh`, `backend/app.js`; commit `95d80cd`; mejoras I-05, I-06, I-08, I-09.

---

## Entrada 4 — Ejecución AFTER: qué cambió en el comportamiento del agente

**Fecha:** 30/10/26

**Herramienta / modelo:** Claude Opus 5.5 medium — sub-agente independiente, contexto limpio, sin acceso a la corrida BEFORE

**Qué le pedí a la IA (prompt o intención):**
El mismo prompt oficial del ADA y la misma tarea CR-01, ahora sobre `ada08-ready` (baseline + mejoras de readiness, sin cambios funcionales).

**Qué propuso / hizo la IA:**
Leyó los archivos en el orden de "Read First", corrió `./scripts/verify_repo.sh` **antes** de cambiar nada (24/24), implementó `min_rating` en services, agregó 22 tests nombrados por AC (46/46), actualizó TASKS.md según la DoD y terminó con `VERIFY_REPO: PASS`. 0 comandos fallidos, 0 cambios fuera de alcance, 0 supuestos sin respaldo; solo una duda menor (si `.5`, `7.` o `+7` cuentan como decimal válido).

**Mi decisión (aceptado / rechazado / modificado) y por qué:**
Aceptado. Comparé ambos diffs: el BEFORE había modificado `server.js` por su cuenta (guard `require.main === module`) y el AFTER no lo tocó porque el split ya existía. Confirmé que no tocó archivos protegidos. Hice el merge de CR-01 y después marqué FR-06 como *Implemented* en `REQUIREMENTS.md` como acción humana.

**Evidencia (archivo, commit, comando o resultado):**
`results/before-agent-run.md` y `.diff`; `results/after-agent-run.md` y `.diff`; commit `5f82717` (AFTER run); merge `0e0f6e7`; `a515dd7` "mark FR-06 implemented (human-approved)".

---

## Entrada 5 — Evaluación final: qué limitación del repositorio sigue requiriendo intervención humana

**Fecha:** 30/10/26

**Herramienta / modelo:** Claude Opus 5.5 medium (sesión principal)

**Qué le pedí a la IA (prompt o intención):**
Re-auditar con las mismas 8 dimensiones y explicar por qué cada una no llega a 5 si es el caso.

**Qué propuso / hizo la IA:**
Score AFTER de **94/100 (+58)**. Las dimensiones que quedaron en 4/5: Architecture Boundaries (las fronteras del frontend solo están documentadas), Requirements & Traceability (el código no referencia IDs), Safety & Permissions (no hay branch protection en GitHub).

**Mi decisión (aceptado / rechazado / modificado) y por qué:**
Aceptado. Lo que sigue requiriendo humano: aprobar cambios a REQUIREMENTS/SPEC, decidir los casos borde que SPEC no define (`.5`, `+7`), configurar branch protection y aprobar merges. Acepté también que n = 1 corrida por condición y un modelo fuerte (que ya pasaba en BEFORE) limitan la comparación; la diferencia está en incertidumbre, alcance y evidencia, no en corrección.

**Evidencia (archivo, commit, comando o resultado):**
`REPOSITORY_READINESS_AUDIT.md` § AFTER; `results/readiness-improvement-report.md` § BEFORE vs AFTER y § Threats to Validity.

---

## Entrada 6 — Discoverability / implicit knowledge: qué información estaba oculta y cómo decidiste hacerla explícita o ejecutable

**Fecha:** 30/10/26

**Herramienta / modelo:** Claude Opus 5.5 medium (sesión principal, a partir del RUN TRACE del BEFORE)

**Qué le pedí a la IA (prompt o intención):**
Identificar, con base en lo que el agente BEFORE leyó, preguntó y supuso, qué conocimiento del proyecto solo existía en mi cabeza.

**Qué propuso / hizo la IA:**
6 conocimientos implícitos: IK-01 comando de install/test (el agente leyó el README completo dos veces y ambos `package.json`), IK-02 reglas de negocio en services, IK-03 API testeable en proceso, IK-04 formato de errores y parseo numérico, IK-05 `movies.json` no se edita, IK-06 Definition of Done (el agente terminó preguntando qué significaba "terminado").

**Mi decisión (aceptado / rechazado / modificado) y por qué:**
Aceptado, pero decidí el destino de cada uno: IK-01 e IK-06 → AGENTS.md **y** `verify_repo.sh`; IK-04 → SPEC.md; IK-02, IK-03 e IK-05 → ejecutables (contract check, split app/server, protected paths). Resultado: 5 de 6 explícitos y 3 también ejecutables.

**Evidencia (archivo, commit, comando o resultado):**
`results/implicit-knowledge.md`; `results/before-agent-run.md` § Repository Exploration y § Clarification Questions.

---

## Entrada 7 — CI: qué verificaciones decidiste compartir entre humano, agente y pipeline, y por qué

**Fecha:** 30/10/26

**Herramienta / modelo:** Claude Opus 5.5 medium (sesión principal)

**Qué le pedí a la IA (prompt o intención):**
Agregar CI sin duplicar la lógica de verificación que ya usan el agente y el desarrollador.

**Qué propuso / hizo la IA:**
`.github/workflows/verify.yml` en `push` y `pull_request`: checkout con historial completo, Node 20, `npm ci --prefix backend`, `git fetch origin main:main` (para que el contrato compare rutas protegidas contra `main`) y `./scripts/verify_repo.sh`.

**Mi decisión (aceptado / rechazado / modificado) y por qué:**
Aceptado. Preferí que el pipeline solo llame al mismo script: humano, agente y CI comparten un único contrato (tests + lint + repo contract + secrets) y no puede pasar en local pero fallar en CI por reglas distintas. Los cambios en el propio workflow quedan bajo revisión humana (regla documentada, no automática; ver Entrada 2).

**Evidencia (archivo, commit, comando o resultado):**
`.github/workflows/verify.yml`; mejora I-10; AGENTS.md § Standard Commands ("Verify (required before declaring done)").

---
