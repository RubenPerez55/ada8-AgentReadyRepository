# AI Usage Log — ADA-08 Agent-Ready Repository

Herramienta: Claude (Cowork), modelo claude-opus-5-5. Las corridas BEFORE/AFTER usaron sub-agentes con contexto limpio.

| # | Fecha | Tema | Qué hizo la IA | Decisión humana / validación |
|---|---|---|---|---|
| 1 | 2026-10-30 | Auditoría inicial | Analizó el repo Movies-ADA06 y propuso el score BEFORE (36/100), destacando la ausencia de AGENTS.md y que `server.js` hacía `listen()` al importarse. | Revisé el score dimensión por dimensión y acepté usar el repo del ADA-06 como baseline. Acepté agregar REQUIREMENTS.md al baseline (documentado como amenaza a la validez). |
| 2 | 2026-10-30 | Tarea bajo prueba | Propuso CR-01 (`min_rating`) con AC-06.1–06.4, incluyendo un AC observable por HTTP (400). | Aprobé la tarea porque requiere tocar servicio, ruta y tests, y es verificable. |
| 3 | 2026-10-30 | Discoverability / implicit knowledge | Del RUN TRACE del BEFORE identificó 6 conocimientos implícitos (comando de install, ubicación de reglas, testabilidad HTTP, formato de errores, fixture protegido, DoD). | Decidí que IK-02, IK-03 e IK-05 debían volverse ejecutables (contract check, split app/server) y no solo documentación. |
| 4 | 2026-10-30 | Diseño de AGENTS.md | Generó AGENTS.md, CLAUDE.md (adaptador), SPEC, ARCHITECTURE, TASKS y REPO_MAP. | Rechacé proteger `.github/workflows/` en el check automático (bloqueaba el propio PR de mejoras); queda solo como regla documentada. |
| 5 | 2026-10-30 | Guardrail | Creó `check_repo_contract.js` (archivos requeridos, servicios sin express/fs, rutas protegidas, IDs válidos) y `check_secrets.js`. | Lo probé modificando `movies.json`: el contrato falló como se esperaba. |
| 6 | 2026-10-30 | CI | Creó `.github/workflows/verify.yml` que llama al mismo `verify_repo.sh`. | Acepté que CI no duplique lógica: humano, agente y pipeline comparten un solo contrato. |
| 7 | 2026-10-30 | Ejecución AFTER | Mismo prompt en sesión limpia: 0 comandos fallidos, 0 cambios fuera de alcance, verify completo, tests nombrados por AC. | Comparé ambos diffs (`results/*.diff`) y confirmé que AFTER no tocó `server.js` ni archivos protegidos. |
| 8 | 2026-10-30 | Evaluación final | Calculó AFTER 94/100 (+58). | Sigue requiriendo humano: aprobar cambios a REQUIREMENTS/SPEC, definir casos borde no especificados (`.5`, `+7`) y configurar branch protection en GitHub. |
