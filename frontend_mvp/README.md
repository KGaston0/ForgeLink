# ForgeLink Frontend MVP (sin framework)

---

## ℹ️ Información histórica

Este MVP es un HTML estático que usa `fetch()` contra la API Django.

### Qué hace
- Crear Project
- Crear Graph
- Crear ConnectionType
## Qué hace
- Cargar el canvas con 1 request: `GET /api/graphs/{id}/canvas/`

### Cómo usar (solo para testing legacy)
1. Iniciar el backend en `http://localhost:8000`
2. Abrir `frontend_mvp/index.html` en el navegador
3. Si no coincide la URL, cambiar el campo `API` arriba

### Notas
## Cómo usar
- Requiere autenticación JWT: el backend ya no está en AllowAny, debes iniciar sesión y usar el token (por ejemplo, vía cabecera `Authorization: Bearer <token>`).

---

**✨ MIGRA AL NUEVO FRONTEND:** Este MVP será removido en futuras versiones. El nuevo frontend React tiene:
## Notas
- ✅ Design system completo
- ✅ Dark/Light mode
- ✅ Arquitectura escalable
- ✅ Mejor UX/UI

Ver: [../frontend/README.md](../frontend/README.md)
