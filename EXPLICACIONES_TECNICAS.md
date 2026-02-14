# Explicaciones Técnicas - ForgeLink

## Temas Pendientes de Implementación

### 4. Testing de Loading con Throttling

**Cómo probar en el navegador:**
1. Abre DevTools (F12)
2. Ve a la pestaña "Network" o "Red"
3. Encuentra el dropdown "No throttling"
4. Selecciona "Slow 3G", "Fast 3G" o "GPRS"
5. Intenta hacer login/register para ver el spinner

**Alternativa en Firefox:**
- Responsive Design Mode (Ctrl+Shift+M) > Throttling

**LoadingSpinner implementado:**
- ✅ Se muestra durante login/register
- ✅ Overlay con fondo oscuro semitransparente
- ✅ Spinner animado con mensaje "Loading..."
- ✅ z-index alto para estar sobre todo el contenido

---

### 5. a11y en Componentes Complejos (Futuro)

**Ya implementado en formularios:**
- ✅ Labels, ARIA attributes, roles, estados

**Para nodos y proyectos (cuando los implementes):**

**Listas interactivas:**
```jsx
<ul role="list" aria-label="Projects list">
  {projects.map(project => (
    <li key={project.id}>
      <button aria-label={`Open project ${project.name}`}>
        {project.name}
      </button>
    </li>
  ))}
</ul>
```

**Grafos interactivos - consideraciones:**
- Proporcionar alternativa textual del grafo
- Permitir navegación por teclado entre nodos
- Describir relaciones con `aria-describedby`
- Considerar modo "lista" como alternativa al modo "grafo"

**Esfuerzo estimado:**
- Para listas y formularios: 30-60 minutos
- Para grafos interactivos: 2-4 horas
- **Recomendación:** agregar mientras desarrollas, no al final

---

### 7. Estado Global - Ejemplo para Dashboard de Proyectos

**Caso de uso:** Dashboard con proyecto seleccionado y nodos jerarquizados (cargar hasta grado 3 inicialmente, luego bajo demanda)

```javascript
// context/ProjectContext.jsx
const ProjectContext = createContext(undefined);

export function ProjectProvider({ children }) {
  const [currentProject, setCurrentProject] = useState(null);
  const [nodesCache, setNodesCache] = useState({});
  const [maxDepthLoaded, setMaxDepthLoaded] = useState(0);

  const loadProject = async (projectId) => {
    const project = await api.getProject(projectId);
    setCurrentProject(project);
    
    // Cargar nodos hasta depth 3
    const nodes = await api.getNodes(projectId, { maxDepth: 3 });
    
    // Guardar en cache por profundidad
    const cache = {};
    nodes.forEach(node => {
      if (!cache[node.depth]) cache[node.depth] = [];
      cache[node.depth].push(node);
    });
    
    setNodesCache(cache);
    setMaxDepthLoaded(3);
  };

  const loadDeeperNodes = async (depth) => {
    if (depth <= maxDepthLoaded) return;
    
    const nodes = await api.getNodes(currentProject.id, { 
      minDepth: maxDepthLoaded + 1,
      maxDepth: depth 
    });
    
    // Actualizar cache...
  };

  return (
    <ProjectContext.Provider value={{ 
      currentProject,
      nodesCache,
      loadProject,
      loadDeeperNodes,
    }}>
      {children}
    </ProjectContext.Provider>
  );
}
```

**¿Es necesario en login?**
No. En login solo necesitas `AuthContext` (ya implementado).

**¿Cuándo usarlo?**
- Dashboard con proyecto seleccionado
- Vista de grafo con nodos
- Cuando múltiples componentes necesiten los mismos datos

---

### 9. Cache vs Estado Global

**Estado Global (Context API):**
- Para estado de UI y lógica de aplicación
- Ejemplo: proyecto seleccionado, sidebar abierto/cerrado
- Persiste solo mientras la app está abierta

**Cache (React Query/TanStack Query):**
- Para datos del servidor (API)
- Ejemplo: lista de proyectos, detalles de nodos
- Sincronización automática con servidor
- Revalidación y refetch inteligente

**Ejemplo combinado en Dashboard:**

```javascript
// Context: qué proyecto está seleccionado (estado UI)
const { currentProjectId, selectProject } = useProject();

// React Query: datos del proyecto (cache servidor)
const { data: projects } = useQuery({
  queryKey: ['projects'],
  queryFn: () => api.getProjects(),
  staleTime: 5 * 60 * 1000, // Cache válido por 5 minutos
});

const { data: projectDetails } = useQuery({
  queryKey: ['project', currentProjectId],
  queryFn: () => api.getProject(currentProjectId),
  enabled: !!currentProjectId, // Solo cargar si hay proyecto seleccionado
});
```

**Ventajas:**
1. Dashboard: solo carga datos básicos (nombre, thumbnail)
2. Cache automático: segunda vez es instantáneo
3. Detalles completos: lazy load solo cuando se necesita
4. Configuración: solo si usuario entra a settings

**¿Es lo mismo que punto 7?**
No:
- **Punto 7:** Guardar QUÉ proyecto está seleccionado
- **Punto 9:** Cargar y cachear los DATOS del proyecto

---

## ✅ Ya Implementado

1. **httpOnly cookies** para JWT tokens (protección XSS)
2. **Headers de seguridad XSS** en `settings.py` (SECURE_BROWSER_XSS_FILTER, X_FRAME_OPTIONS, SECURE_CONTENT_TYPE_NOSNIFF)
3. **Accesibilidad (a11y)** completa en formularios login/register
4. **Validación robusta** de passwords (8+ caracteres, mayúsculas, minúsculas, números, caracteres especiales)
5. **Manejo de errores** con mensajes claros al usuario
6. **LoadingSpinner único** consolidado (sin duplicación)
7. **Tests verificados** - todos pasan con las protecciones XSS activas

---

## ⏳ Para Implementar Más Adelante

- Estado global (Context) para dashboard con proyectos
- React Query para cache de datos del servidor (recomendado para futuro)


