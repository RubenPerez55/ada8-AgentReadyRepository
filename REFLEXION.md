# Reflexión individual — ADA-08 Agent-Ready Repository

Nombre: Ruben Perez
Fecha: 30/10/2026

---

## 1. ¿Cuál fue el principal obstáculo para el agente en la ejecución BEFORE?

Que no había nada que le dijera cómo trabajar en el repo. Para encontrar cómo instalar y probar tuvo que leer el README completo (dos veces) y ambos `package.json`, y descubrir `npm ci` en `backend/` por su cuenta. El obstáculo técnico más fuerte fue que `server.js` hacía `app.listen()` al importarse: para probar AC-06.3 (HTTP 400) tuvo que cambiar la arquitectura él solo con un guard `require.main === module`. Terminó la tarea (PASS), pero preguntando qué significaba "terminado".

## 2. ¿Qué información tuvo que inferir el agente que un desarrollador experimentado ya conocía?

Los 6 puntos de `results/implicit-knowledge.md`: el comando oficial de install/test, que las reglas de negocio van en `backend/services/`, que la API debe probarse en proceso, que los errores son `400 { error }` con mensajes en español, que `movies.json` no se toca y qué incluye la Definition of Done. También tuvo que decidir sin respaldo cómo tratar `1e1`, `0x5`, `Infinity` y el parámetro repetido.

## 3. ¿Qué mejora produjo el mayor impacto y por qué?

`scripts/verify_repo.sh` junto con la Definition of Done de AGENTS.md. Convirtió "¿ya terminé?" en un comando con una línea final (`VERIFY_REPO: PASS`): el agente AFTER lo corrió antes de cambiar nada (24/24) y al final (46/46), con 0 comandos fallidos o desconocidos. Muy cerca está el split `app.js`/`server.js`, que eliminó el único cambio fuera de alcance del BEFORE.

## 4. ¿Qué información pertenece en AGENTS.md y qué información NO debería vivir ahí?

Sí pertenece: el orden de lectura, dónde están las fuentes de verdad, comandos estándar, reglas de cambio, rutas protegidas, condiciones para detenerse y la Definition of Done; es decir, *cómo* trabajar. No pertenece: los requisitos (viven solo en REQUIREMENTS.md), el comportamiento verificable de la API (SPEC.md), el detalle de capas (ARCHITECTURE.md) ni el estado de las tareas (TASKS.md). AGENTS.md apunta a ellos; si los copiara, tendríamos dos versiones que tarde o temprano se contradicen.

## 5. ¿Qué regla convertiste en software/hook/script en lugar de dejarla como instrucción?

Tres: (1) "no edites `movies.json` ni `REQUIREMENTS.md`" → `check_repo_contract.js` compara contra `main` y falla (lo probé editando `movies.json`: `REPO_CONTRACT: FAIL`); (2) "las reglas van en services" → el mismo script falla si `services/` importa `express`, `http` o `fs`; (3) "verifica antes de declarar terminado" → `verify_repo.sh`, que también corre en CI. La protección de `.github/workflows/` la dejé como instrucción porque como check bloqueaba el propio PR que crea el workflow.

## 6. ¿Qué diferencia observaste entre 'más contexto' y 'mejor contexto'?

El BEFORE tenía mucho contexto (un README largo con emojis, árbol de directorios, pasos para crear un token de GitHub) y aun así tuvo que inferir lo importante. El AFTER tenía documentos cortos con una sola responsabilidad cada uno y un orden de lectura. Mejor contexto significó: separado por propósito, sin duplicar, con IDs que conectan requisito → spec → tarea → test, y respaldado por un comando que lo comprueba.

## 7. ¿Qué riesgo aparece cuando CLAUDE.md/GEMINI.md/copilot instructions duplican información del proyecto?

Que se vuelven fuentes de verdad paralelas: alguien actualiza REQUIREMENTS o AGENTS.md y el archivo de una herramienta queda viejo, y cada agente trabaja con reglas distintas según cuál lea. Además se gasta contexto repitiendo lo mismo. Por eso CLAUDE.md tiene 10 líneas y solo apunta a AGENTS.md.

## 8. ¿Qué checks comparten ahora el agente, el desarrollador humano y CI?

El mismo `./scripts/verify_repo.sh`: tests (`node:test`, unitarios + HTTP), lint (ESLint), `check_repo_contract.js` (archivos requeridos, frontera de services, rutas protegidas, IDs válidos) y `check_secrets.js`. El workflow de GitHub Actions no tiene lógica propia, solo instala y llama al script.

## 9. ¿Qué parte del proceso sigue requiriendo decisión humana?

Aprobar cambios a REQUIREMENTS.md y SPEC.md (por ejemplo marcar FR-06 como *Implemented*), resolver casos que la spec no define (`.5`, `7.`, `+7`), aprobar y hacer merge, configurar branch protection en GitHub y decidir qué reglas valen la pena automatizar y cuáles no.

## 10. ¿Qué evidencia demuestra que el AFTER es realmente mejor?

Con el mismo modelo, prompt, tarea y permisos: preguntas abiertas 2 → 0 bloqueantes; comandos fallidos/desconocidos 1 → 0; supuestos sin respaldo 3 → 0; archivos fuera de alcance 1 → 0; validación "tests + curl a criterio del agente" → `verify_repo.sh` completo antes y después. El readiness score subió de 36 a 94. Los diffs (`results/before-agent-run.diff` y `after-agent-run.diff`) muestran que el AFTER no tocó `server.js` ni archivos protegidos y nombró sus 22 tests por AC.

## 11. ¿Qué mejora realizada para el agente también beneficia a un desarrollador que entra por primera vez al proyecto?

Casi todas, pero sobre todo `docs/REPO_MAP.md` (dónde está cada cosa y la guía de cambio service → app → tests → TASKS → verify) y `verify_repo.sh` (un solo comando que instala si hace falta y te dice si rompiste algo). AGENTS.md mismo dice que es para agentes *y* para nuevos contribuidores humanos.

## 12. ¿Qué variable no controlada podría afectar tu comparación BEFORE/AFTER?

- n = 1 corrida por condición: el mismo modelo puede comportarse distinto entre corridas.
- Agregué REQUIREMENTS.md al baseline, lo que ayudó un poco al BEFORE.
- El modelo es fuerte y ya resolvía la tarea en BEFORE, así que la mejora se ve en fricción y control de alcance, no en corrección.
- Las mejoras y la auditoría se hicieron con ayuda de la misma IA que luego corrió la tarea, lo que puede sesgar a favor de lo que ese modelo entiende mejor.
- La tarea es pequeña; con un cambio grande el efecto podría ser distinto.

## 13. ¿Qué elementos de este ADA conservarás como base para tu proyecto final?

AGENTS.md con su estructura (Read First, Sources of Truth, Stop Conditions, DoD), CLAUDE.md como adaptador delgado, la separación REQUIREMENTS / SPEC / ARCHITECTURE / TASKS con IDs, `verify_repo.sh` compartido con CI, `check_repo_contract.js` para rutas protegidas y fronteras, el split `app.js`/`server.js` para tests HTTP en proceso y la práctica de nombrar tests por AC. De hecho ya los reutilicé como base del ADA-09.
