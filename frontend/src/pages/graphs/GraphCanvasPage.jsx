import Sidebar from '../../components/layout/Sidebar/index';
import GraphCanvas from '../../features/graphs/components/GraphCanvas';
import { useParams } from 'react-router-dom';

export default function GraphCanvasPage() {
  const { id } = useParams();
  const graphId = id ? parseInt(id, 10) : null;

  return (
    <div className="flex h-screen bg-[rgb(var(--color-bg))]">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        {graphId ? (
          <GraphCanvas graphId={graphId} />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[rgb(var(--color-text-secondary))]">
            Selecciona un grafo para visualizar.
          </div>
        )}
      </main>
    </div>
  );
}
