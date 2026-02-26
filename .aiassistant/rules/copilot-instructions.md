---
apply: always
---

# Instrucciones Personalizadas para GitHub Copilot

## Contexto del Proyecto: ForgeLink

**ForgeLink** es una aplicación de gestión de conocimiento basada en grafos para worldbuilding y gestión de proyectos creativos.

### Stack Tecnológico
- **Backend:** Django 4.2+ con Django REST Framework
- **Frontend:** React 19.2.0 + Vite + Tailwind CSS v4
- **Base de datos:** PostgreSQL (producción) / SQLite (desarrollo)
- **Autenticación:** JWT con httpOnly cookies
- **Visualización de grafos:** @xyflow/react

### Arquitectura Backend
- **Apps Django:** `apps/users/`, `apps/projects/`, `apps/nodes/`, `apps/graphs/`, `apps/connections/`
- **Modelos principales:** User, Project, Node, Graph, GraphNode, NodeConnection, ConnectionType
- **Signal implementado:** `post_save` en User crea automáticamente "Mi Primer Proyecto" y "Grafo Principal"

### Arquitectura Frontend
- **Estructura:** Feature-based (cada feature tiene components/, hooks/, api/)
- **Componentes:** 13 componentes modulares (Navigation, Footer, Sidebar, Button, Card, Badge, ThemeToggle, LoadingSpinner, HeroSection, BentoGrid, DualPurpose, PricingSection, CTASection)
- **Páginas implementadas:** Landing, Login, Register, Dashboard, GraphCanvasPage, Settings
- **Context:** AuthContext, ThemeContext
- **Rutas protegidas:** ProtectedRoute con redirección automática

### MVP Implementado
- ✅ Signal post_save: auto-creación de proyecto y grafo inicial
- ✅ Dashboard con sidebar de navegación
- ✅ GraphCanvas con @xyflow/react para visualización interactiva
- ✅ Redirección automática al "Grafo Principal" tras login
- ✅ Persistencia de posiciones de nodos (PATCH /api/graph-nodes/{id}/)

### Convenciones del Proyecto
- **Backend:** Nombres en inglés, docstrings en inglés, seguir PEP 8
- **Frontend:** Componentes funcionales con hooks, un componente por archivo
- **Estilos:** Tailwind CSS v4 con CSS variables para theming (dark/light mode)
- **API:** RESTful, paginación de 100 items, filtros con django-filter

## Idioma
- Responde siempre en **español**.
- El código generado debe estar siempre en **inglés** (nombres de variables, funciones, comentarios en código, etc.).

## Archivos Markdown
- **NO** crear archivos `.md` a menos que se solicite explícitamente.
- Los `.md` del proyecto son **documentación**, no notas de cambios.
- **NUNCA** incluir en los `.md`:
  - Secciones tipo "Cambios realizados" o "Por qué se tomó esta decisión"
  - Comparaciones "Antes/Después" o "Viejo/Nuevo"
  - Explicaciones de decisiones de implementación
  - Historial de cambios
- **Los `.md` deben contener únicamente:**
  - Documentación técnica clara y directa
  - Instrucciones de uso
  - Referencias y ejemplos
  - Estructura y arquitectura
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
- **Manejo de errores:** mostrar mensajes de error claros al usuario con `role="alert"`
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
- **Headers de seguridad:** incluir `SECURE_BROWSER_XSS_FILTER`, `X_FRAME_OPTIONS`, `SECURE_CONTENT_TYPE_NOSNIFF`
- **Validación de passwords:** mínimo 8 caracteres, mayúsculas, minúsculas, números, caracteres especiales
- **No exponer secretos:** nunca hardcodear credenciales en el código