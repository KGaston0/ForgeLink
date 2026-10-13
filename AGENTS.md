# Instrucciones para asistentes de código (AGENTS.md)

Archivo único para Copilot, Junie, Claude Code y otros asistentes. `CLAUDE.md` lo importa.

## Contexto del Proyecto: ForgeLink

**ForgeLink** es una aplicación de gestión de conocimiento basada en grafos para worldbuilding y gestión de proyectos creativos.

### Stack Tecnológico
- **Backend:** Django 4.2+ con Django REST Framework
- **Frontend:** React 19 + Vite 7 + Tailwind CSS v4
- **Base de datos:** PostgreSQL (producción) / SQLite (desarrollo)
- **Documentación de API:** generada con drf-spectacular en `/api/docs/` (solo con `DEBUG=True`); no se escribe a mano
- **CI:** GitHub Actions (`.github/workflows/ci.yml`): check, migraciones, tests, lint y build
- **Autenticación:** JWT con httpOnly cookies
- **Visualización de grafos:** @xyflow/react 12
- **Internacionalización (i18n):** react-i18next con i18next-browser-languagedetector

### Arquitectura Backend
- **Apps Django:** `apps/users/`, `apps/projects/`, `apps/nodes/`, `apps/graphs/`, `apps/connections/`
- **Modelos principales:** User, Project, Node, NodeBlueprint, BlueprintList, Graph, GraphNode, NodeConnection, ConnectionType
- **Aislamiento entre usuarios:** todo queryset se filtra por dueño, y los serializers con claves foráneas usan `OwnerScopedRelatedFieldsMixin` (`owner_scoped_fields`). Todo cambio en esa zona lleva un test cruzado entre usuarios
- **UUID como identificador público:** Projects y Graphs usan `lookup_field = 'uuid'` en sus ViewSets
- **Signal implementado:** `post_save` en User crea automáticamente "Mi Primer Proyecto" y "Grafo Principal"
- **Bulk canvas save:** `PUT /graphs/{uuid}/canvas/bulk/` guarda todo el estado del canvas en una sola petición

### Arquitectura Frontend
- **Estructura:** `features/<nombre>/` para dominios complejos (api/, components/, hooks/); `pages/<nombre>/` para páginas simples
- **i18n:** Archivo de configuración `i18n.js` y diccionarios en `src/locales/en.json` y `es.json`
- **Componentes compartidos:** `components/ui/` (primitivas shadcn: button, avatar, tooltip, separator, theme-toggle, loading-spinner) y `components/layout/Sidebar`
- **Páginas:** Landing, Login, Register, Dashboard, ProjectsPage, ProjectDetailLayout (tabs: OverviewTab, SettingsTab), GraphCanvasPage, NodeLab y BlueprintBuilder, SettingsPage
- **Graph editor:** GraphCanvas con @xyflow/react, nodos custom (BaseNode, StandardNode, FrameNode, PortalNode), edges custom, Toolbar, modales de edición, drill-down en frames, auto-save con debounce, undo/redo
- **Context:** AuthContext, ThemeContext, ActivityFeedContext
- **Rutas protegidas:** ProtectedRoute con redirección automática
- **Rutas anidadas:** `/projects/:uuid` usa Outlet con tabs (Overview/Settings)

### Convenciones del Proyecto
- **Backend:** Nombres en inglés, docstrings en inglés, PEP 8, owner-scoped querysets
- **Frontend:** Componentes funcionales con hooks, un componente por archivo
- **URLs:** Projects y Graphs usan UUID; Nodes, GraphNodes, Connections usan int ID
- **Estilos:** Tailwind CSS v4 con tokens HSL en `index.css` (dark/light mode); en código nuevo usar los tokens y `components/ui`, no las clases legacy
- **API:** RESTful, paginación de 100 items, filtros con django-filter

## Internacionalización (i18n) 
- **CERO texto estático:** Ningún componente de React (excepto landing pages) debe contener strings de texto estáticos legibles por el usuario.
- **Uso de hook:** Todo texto debe renderizarse usando la función `t()` provista por `const { t } = useTranslation();`.
- **Nomenclatura de claves:** Las claves JSON deben seguir una jerarquía semántica: `seccion.componente.elemento` (ej: `dashboard.resumeWork.title`).
- **Interpolación:** Usar variables dinámicas en las traducciones en lugar de concatenar strings (ej: `t('dashboard.greeting', { username })`).
- **Validaciones:** Las funciones de validación externa deben recibir siempre la función `t` como parámetro para devolver mensajes de error localizados.
- **Diccionarios:** Cualquier clave nueva agregada al código debe reflejarse en ambos archivos (`en.json` y `es.json`).

## Idioma
- Responde siempre en **español**.
- El código generado debe estar siempre en **inglés** (nombres de variables, funciones, comentarios en código, etc.).

## Documentación
- Documentos vigentes: `README.md` (qué es y cómo arrancar), `DEVELOPMENT.md` (arquitectura y flujos), `frontend/README.md` (frontend y design system). Si un cambio altera algo descrito allí, actualizar el documento en el mismo commit.
- No duplicar información entre documentos: enlazar en lugar de copiar.

## Archivos Markdown
- **NO** crear archivos `.md` a menos que se solicite explícitamente.
- Los `.md` del proyecto son **documentación**, no notas de cambios.
- **NUNCA** incluir en los `.md`:
  - Secciones tipo "Cambios realizados"
  - Comparaciones "Antes/Después" o "Viejo/Nuevo"
  - Historial de cambios
- **Los `.md` deben contener únicamente:**
  - Documentación técnica clara y directa
  - Instrucciones de uso
  - Referencias y ejemplos
  - Estructura y arquitectura
  - Notas de diseño: el porqué de las decisiones de arquitectura que no se deducen del código (en `DEVELOPMENT.md`, sección "Design notes")
- Los resúmenes y explicaciones de cambios se muestran en la conversación, **NO se guardan en archivos**.

## Calidad del Código
- Priorizar **buenas prácticas** de programación sobre soluciones rápidas o "hacks".
- El código debe ser **escalable**, pero sin sobreingeniería.
- Mantener un equilibrio entre:
  - Legibilidad
  - Mantenibilidad
  - Escalabilidad razonable
- Evitar soluciones excesivamente complejas que dificulten la comprensión del código.

## Principios Generales
- Seguir principios SOLID cuando sea apropiado
- Nombrado descriptivo y consistente
- Código limpio y bien estructurado
- Evitar duplicación innecesaria

## Frontend (React)
- **Validación en tiempo real:** validar campos en `onChange` + `onBlur`, no solo en `onSubmit`
- **Deshabilitar botones:** deshabilitar botón de submit si hay errores de validación
- **Estados de loading:** mostrar estados de carga en botones (`aria-busy`) y spinners cuando sea necesario
- **Manejo de errores:** mostrar mensajes de error claros y localizados al usuario con `role="alert"`
- **No duplicar componentes:** usar un solo componente de loading (LoadingSpinner), no múltiples

## Accesibilidad (a11y)
- **Labels:** siempre usar `<label htmlFor="id">` vinculado a `<input id="id">`
- **ARIA attributes:** agregar `aria-required`, `aria-invalid`, `aria-describedby` en formularios
- **Roles:** usar `role="alert"` para errores, `role="status"` para éxitos
- **AutoComplete:** agregar `autoComplete` apropiado a todos los campos de formulario
- **Loading states:** usar `aria-busy={loading}` en botones durante carga
- **Mensajes de error:** vincular con `aria-describedby` y dar IDs únicos

## Seguridad
- **httpOnly cookies:** usar cookies httpOnly para tokens JWT (protección XSS)
- **Headers de seguridad:** incluir `X_FRAME_OPTIONS`, `SECURE_CONTENT_TYPE_NOSNIFF` (usar CSP en lugar del obsoleto `SECURE_BROWSER_XSS_FILTER`)
- **Validación de passwords:** mínimo 8 caracteres, mayúsculas, minúsculas, números, caracteres especiales
- **No exponer secretos:** nunca hardcodear credenciales en el código
- **UUID en URLs:** Projects y Graphs exponen UUIDs, nunca IDs secuenciales