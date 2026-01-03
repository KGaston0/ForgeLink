# ForgeLink Frontend MVP (sin framework)

Este MVP es un HTML estático que usa `fetch()` contra tu API Django.

## Qué hace
- Crear Project
- Crear Graph
- Crear ConnectionType
- Crear Node (global al proyecto)
- Agregar Node al Graph (GraphNode con posición)
- Crear conexiones seleccionando 2 nodos en el canvas
- Cargar el canvas con 1 request: `GET /api/graphs/{id}/canvas/`

## Cómo usar
1. Iniciar el backend en `http://localhost:8000`
2. Abrir `frontend_mvp/index.html` en el navegador
3. Si no coincide la URL, cambiar el campo `API` arriba

## Notas
- Requiere que exista un usuario con id=1 para crear proyectos (o cambiar el owner).
- No hay auth; tu backend está en AllowAny.

