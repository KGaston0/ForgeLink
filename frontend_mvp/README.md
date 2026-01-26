# ForgeLink Frontend MVP (LEGACY - sin framework)

> ⚠️ **DEPRECADO:** Este MVP es legacy y está siendo reemplazado por el frontend React en `/frontend/`
> 
> **Usa el nuevo frontend:** [../frontend/README.md](../frontend/README.md)

---

## ℹ️ Información histórica

Este MVP es un HTML estático que usa `fetch()` contra la API Django.

### Qué hace
- Crear Project
- Crear Graph
- Crear ConnectionType
- Crear Node (global al proyecto)
- Agregar Node al Graph (GraphNode con posición)
- Crear conexiones seleccionando 2 nodos en el canvas
- Cargar el canvas con 1 request: `GET /api/graphs/{id}/canvas/`

### Cómo usar (solo para testing legacy)
1. Iniciar el backend en `http://localhost:8000`
2. Abrir `frontend_mvp/index.html` en el navegador
3. Si no coincide la URL, cambiar el campo `API` arriba

### Notas
- Requiere que exista al menos un usuario válido en el backend (por ejemplo, creado desde el admin de Django) para poder crear proyectos (o cambiar el owner).
- Requiere autenticación JWT: el backend ya no está en AllowAny, debes iniciar sesión y usar el token (por ejemplo, vía cabecera `Authorization: Bearer <token>`).

---

**✨ MIGRA AL NUEVO FRONTEND:** Este MVP será removido en futuras versiones. El nuevo frontend React tiene:
- ✅ Componentes reutilizables
- ✅ Design system completo
- ✅ Dark/Light mode
- ✅ Arquitectura escalable
- ✅ Mejor UX/UI

Ver: [../frontend/README.md](../frontend/README.md)
