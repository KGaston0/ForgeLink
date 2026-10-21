# Instrucciones para asistentes de código (AGENTS.md)

Archivo único para Claude Code, Copilot, Junie y otros asistentes. `CLAUDE.md` lo importa. Aquí van las reglas que no se deducen del código. La arquitectura, el modelo de datos y los flujos están en [DEVELOPMENT.md](./DEVELOPMENT.md); no se repiten aquí.

## Proyecto

**ForgeLink** es una aplicación de gestión de conocimiento basada en grafos para worldbuilding y proyectos creativos. Backend Django + DRF, frontend React + Vite, autenticación JWT en cookies httpOnly. Cómo arrancar: [README.md](./README.md). Frontend y design system: [frontend/README.md](./frontend/README.md).

## Idioma
- Responde siempre en **español**.
- Código, comentarios, nombres, commits, descripciones de PR y documentos del repo, en **inglés**. `AGENTS.md` y las especificaciones (`specs/`) van en español.

## Cómo trabajamos

### Desarrollo guiado por especificaciones
Para funcionalidad nueva se escribe y aprueba una especificación **antes** de tocar código.

**Cuándo hace falta una especificación:** funcionalidad nueva, cambios de modelo de datos o de API, cualquier cosa que toque permisos, aislamiento entre usuarios o migraciones. **No hace falta** para correcciones de bugs, refactors sin cambio de comportamiento, actualizaciones de dependencias, documentación y cambios triviales. Si dudas, pregunta.

**Dónde:** `specs/NNN-nombre-corto.md` (numeración secuencial, por ejemplo `specs/001-portales-con-fk.md`). Una especificación debe caber en una o dos páginas; si crece, se divide. Encabezado con `Estado: borrador | aprobada | implementada | reemplazada`.

**Secciones:**
1. Contexto y problema
2. Alcance y fuera de alcance
3. Comportamiento, en escenarios (Dado / Cuando / Entonces)
4. Modelo de datos y migraciones (incluye qué pasa con los datos existentes)
5. API
6. Permisos y aislamiento entre usuarios
7. Casos límite: borrado, ciclos, concurrencia, carga
8. Criterios de aceptación numerados (`AC-1`, `AC-2`...), cada uno verificable con un test o con una comprobación manual indicada
9. Plan de pruebas: qué test cubre cada criterio
10. Preguntas abiertas

**Flujo:**
1. Redactas el borrador y listas las preguntas abiertas. No inventes respuestas: pregúntalas.
2. El usuario aprueba (o corrige) y pasa el estado a `aprobada`.
3. Implementas solo lo que la especificación aprobada cubre. Los tests citan el criterio en el nombre o la docstring (`AC-3`).
4. Si al implementar aparece un hueco o un cambio de criterio, **detente**, propón el cambio a la especificación y espera el visto bueno. No te desvíes en silencio.
5. Al terminar: estado `implementada`, `DEVELOPMENT.md` actualizado si cambió la arquitectura, y la descripción del PR enlaza la especificación.

Una especificación aprobada no se reescribe de forma silenciosa; el historial de git es su registro de cambios. Las especificaciones describen intención; `DEVELOPMENT.md` describe cómo funciona hoy.

### Definición de terminado
Antes de decir que algo está listo, ejecuta y que pase:
- Backend: `python manage.py test`, `python manage.py makemigrations --check --dry-run` y `python manage.py spectacular --validate --fail-on-warn --file /dev/null`.
- Frontend (desde `frontend/`): `npm run lint` sin errores ni avisos nuevos, y `npm run build`.
- Los cambios de interfaz se comprueban en el navegador cuando sea posible. Si no lo verificaste, dilo explícitamente: tests pasando no demuestran que la pantalla funcione.
- Informa con franqueza de lo que falló o no se pudo comprobar.

### Git y PRs
- Commits pequeños y temáticos, en inglés, con prefijo `tipo(ámbito): descripción en imperativo` (`feat`, `fix`, `refactor`, `docs`, `test`, `ci`, `chore`). Cada commit contiene solo lo suyo.
- No uses `--no-verify`, `--amend` sobre commits ya publicados ni `push --force`.
- **Pide confirmación antes de** hacer push, abrir o fusionar PRs, cambiar ajustes del repositorio o modificar la autenticación de `gh` o de git. Que se aprobara una vez no vale para la siguiente.
- **Ramas cortas.** Cada cambio vive en su propia rama, que sale de un `main` actualizado y vuelve a `main` mediante un PR. No se trabaja directamente en `main`.
- **Nombre de rama:** `tipo/nombre-corto`, con los mismos tipos que los commits: `feature/`, `fix/`, `refactor/`, `docs/`, `test/`, `ci/`, `chore/`. La rama de una especificación se llama como ella: `feature/001-portales-con-fk`.
- Antes de redactar el PR, ejecuta `git log origin/main..HEAD` para describir solo lo nuevo.
- Formato del PR, como el #12: título corto, viñetas con etiqueta en negrita (**Security:**, **CI:**...), y una sección `## Notes` con pocas viñetas (migraciones, pruebas, alertas). Sin emojis. La línea de atribución va en texto plano. Si el PR implementa una especificación, la enlaza.
- Fusión: **"Squash and merge"** por defecto, un commit por PR, con el título del PR como mensaje. La rama se borra al fusionar.
- `main` exige los checks `Backend (Django)` y `Frontend (React)`. No renombres esos jobs en `.github/workflows/ci.yml` sin actualizar la protección de la rama.
- Las migraciones ya aplicadas no se editan: un cambio de modelo crea una migración nueva.
- No subas `.env`, bases de datos locales ni credenciales.

### Entorno
- El desarrollo es en Windows. Los scripts (`dev.sh`, `helpers.sh`, `setup.sh`) son bash. El repositorio no incluye un entorno virtual: se crea uno con `python -m venv .venv`.
- Los servidores de desarrollo se detienen al terminar la sesión.

## Reglas del código

### Backend
- **Aislamiento entre usuarios:** todo queryset se filtra por dueño, y los serializers con claves foráneas usan `OwnerScopedRelatedFieldsMixin` (`owner_scoped_fields`). Todo cambio en esa zona lleva un test cruzado entre usuarios (ver `apps/projects/test_isolation.py`).
- **Identificadores:** Projects y Graphs se exponen por `uuid` en las URLs; el resto usa el `id` entero. Nunca expongas ids secuenciales de Projects ni Graphs en una URL.
- **Nodos:** `Node` guarda qué es algo; `GraphNode` guarda dónde está en un grafo. El anidamiento existe solo en `GraphNode.parent_node`.
- **API documentada desde el código:** no se escribe documentación de endpoints a mano. Los campos calculados de los serializers llevan anotación de tipo de retorno, o el CI de OpenAPI falla.
- Nunca devuelvas texto de excepciones al cliente; usa mensajes fijos.
- Docstrings en inglés en modelos y acciones de ViewSets. PEP 8.

### Frontend
- Componentes funcionales con hooks, un componente por archivo. Funcionalidad compleja en `features/<nombre>/` (api, components, hooks); páginas simples en `pages/<nombre>/`.
- Estilos con los tokens HSL de `index.css` y los componentes de `components/ui`; no uses las clases legacy en código nuevo.
- Un solo componente de carga: `LoadingSpinner`.
- Formularios: validar en `onChange` y `onBlur`, deshabilitar el envío con errores, `aria-busy` durante la carga y errores localizados con `role="alert"`.
- Sidebar y canvas se comunican con eventos del `window`; los eventos existentes están en `DEVELOPMENT.md`.

### Internacionalización
- **Cero texto estático** legible por el usuario en componentes React (excepto la landing). Todo pasa por `const { t } = useTranslation();`.
- Claves jerárquicas `seccion.componente.elemento` (por ejemplo `dashboard.resumeWork.title`), con interpolación en vez de concatenar (`t('dashboard.greeting', { username })`).
- Toda clave nueva se añade a `src/locales/en.json` y `src/locales/es.json`.
- Las funciones de validación externas reciben `t` como parámetro.

### Accesibilidad
- `<label htmlFor>` enlazado a cada `<input id>`; `aria-required`, `aria-invalid` y `aria-describedby` (con ids únicos) en formularios; `autoComplete` apropiado.
- `role="alert"` para errores y `role="status"` para éxitos.

### Seguridad
- Tokens JWT solo en cookies httpOnly. CORS cerrado por defecto: los orígenes se listan explícitamente.
- Cabeceras `X_FRAME_OPTIONS` y `SECURE_CONTENT_TYPE_NOSNIFF`; usa CSP en lugar del obsoleto `SECURE_BROWSER_XSS_FILTER`.
- Contraseñas: mínimo 8 caracteres con mayúsculas, minúsculas, números y caracteres especiales.
- Nunca hardcodees credenciales ni claves.

### Criterio general
- La solución más simple que cumpla la especificación. Escalable sin sobreingeniería.
- Sigue el estilo del código que ya hay alrededor. Nombres descriptivos. No dupliques lo que ya existe.

## Documentación
- Documentos vigentes: `README.md` (qué es y cómo arrancar), `DEVELOPMENT.md` (arquitectura, modelo de datos y flujos, con su sección "Design notes"), `frontend/README.md` (frontend y design system) y `specs/` (especificaciones).
- Si un cambio altera algo descrito en esos documentos, se actualizan en el mismo commit. No dupliques información entre documentos: enlaza.
- No crees otros archivos `.md` salvo que el usuario lo pida. Las especificaciones de `specs/` son la excepción.
- Los `.md` son documentación, no notas de cambios. No incluyas secciones "Cambios realizados", comparaciones "Antes/Después" ni historiales de cambios.
- Los resúmenes y explicaciones de lo que hiciste se dan en la conversación, **no se guardan en archivos** del repositorio.
