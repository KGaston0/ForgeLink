import Sidebar from '../../components/layout/Sidebar/index';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import apiClient from '../../services/api/apiClient';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const goToMainGraph = async () => {
    try {
      const { data } = await apiClient.get('/graphs/', { params: { ordering: '-updated_at' } });
      const graphs = Array.isArray(data?.results) ? data.results : data;
      let target = graphs?.find(g => g.name === 'Grafo Principal');
      if (!target && graphs?.length) target = graphs[0];
      if (target) navigate(`/graphs/${target.id}`);
    } catch (_) {
      // ignore
    }
  };

  return (
    <div className="flex h-screen bg-[rgb(var(--color-bg))]">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-[rgb(var(--color-text))]">Dashboard</h1>
            <p className="text-[rgb(var(--color-text-secondary))] mt-2">
              Bienvenido de nuevo, {user?.user?.username || 'Explorador'}.
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Quick Stats or Cards */}
            <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-2">Proyectos Activos</h3>
              <p className="text-3xl font-bold text-cyan-500">1</p>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-2">"Mi Primer Proyecto"</p>
            </div>

            <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-2">Grafos Visuales</h3>
              <p className="text-3xl font-bold text-purple-500">1</p>
              <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-2">"Grafo Principal"</p>
            </div>

            <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl shadow-sm">
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] mb-2">Perfil</h3>
              <div className="flex items-center gap-4 mt-2">
                <div className="h-10 w-10 rounded-full bg-cyan-500 flex items-center justify-center text-white font-bold">
                  {user?.user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium text-[rgb(var(--color-text))]">{user?.user?.username}</p>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))]">{user?.user?.membership_type || 'Free Plan'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl">
            <h2 className="text-2xl font-bold text-[rgb(var(--color-text))] mb-4">🚀 Tu Aventura Comienza</h2>
            <p className="text-[rgb(var(--color-text-secondary))] mb-6 max-w-2xl">
              Hemos preparado tu primer proyecto y grafo principal para que empieces a forjar conexiones de inmediato.
            </p>
            <button onClick={goToMainGraph} className="btn-primary">
              Ir al Grafo Principal
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
