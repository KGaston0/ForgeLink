import { useNavigate } from 'react-router-dom';
import {
  Square3Stack3DIcon,
  ShareIcon,
  CubeIcon,
  FolderOpenIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/layout/Sidebar/index';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import useDashboardStats from './useDashboardStats';

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, accent, icon: Icon }) {
  return (
    <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">{label}</h3>
        <Icon className={`h-5 w-5 ${accent}`} aria-hidden="true" />
      </div>
      <p className={`text-3xl font-bold ${accent}`}>{value}</p>
    </div>
  );
}

// ── Recent project card ───────────────────────────────────────────────────────
function RecentProjectCard({ project, onOpen }) {
  const updatedDate = new Date(project.updated_at).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="p-5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl shadow-sm hover:border-cyan-500/40 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-semibold text-[rgb(var(--color-text))] truncate pr-2">
          {project.name}
        </h3>
        <FolderOpenIcon className="h-5 w-5 shrink-0 text-cyan-500" aria-hidden="true" />
      </div>

      <p className="text-sm text-[rgb(var(--color-text-secondary))] line-clamp-2 mb-3 min-h-[2.5rem]">
        {project.description || 'No description'}
      </p>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs text-[rgb(var(--color-text-muted))] mb-4">
        <span className="flex items-center gap-1">
          <Square3Stack3DIcon className="h-4 w-4" aria-hidden="true" />
          {project.graph_count ?? 0} {project.graph_count === 1 ? 'graph' : 'graphs'}
        </span>
        <span className="flex items-center gap-1">
          <CubeIcon className="h-4 w-4" aria-hidden="true" />
          {project.node_count ?? 0} {project.node_count === 1 ? 'node' : 'nodes'}
        </span>
        <span className="ml-auto">{updatedDate}</span>
      </div>

      <button onClick={() => onOpen(project)} className="btn-primary w-full text-sm flex items-center justify-center gap-2">
        Open
        <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { stats, recentProjects, loading, error, refresh } = useDashboardStats();
  const handleOpenProject = (project) => {
    navigate(`/projects/${project.uuid}`);
  };

  return (
    <div className="flex h-screen bg-[rgb(var(--color-bg))]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-[rgb(var(--color-text))]">Dashboard</h1>
            <p className="text-[rgb(var(--color-text-secondary))] mt-2">
              Welcome back, {user?.user?.username || 'Explorer'}.
            </p>
          </header>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="medium" fullScreen={false} />
            </div>
          ) : error ? (
            <div role="alert" className="text-center py-16">
              <p className="text-red-400 mb-4">{error}</p>
              <button onClick={refresh} className="btn-secondary">
                Retry
              </button>
            </div>
          ) : (
            <>
              {/* Stat cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard
                  label="Active Projects"
                  value={stats.projects}
                  accent="text-cyan-500"
                  icon={Square3Stack3DIcon}
                />
                <StatCard
                  label="Visual Graphs"
                  value={stats.graphs}
                  accent="text-purple-500"
                  icon={ShareIcon}
                />
                <StatCard
                  label="Nodes"
                  value={stats.nodes}
                  accent="text-cyan-500"
                  icon={CubeIcon}
                />
              </div>

              {/* Recent Projects section */}
              <section className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[rgb(var(--color-text))]">
                    Recent Projects
                  </h2>
                  {recentProjects.length > 0 && (
                    <button
                      onClick={() => navigate('/projects')}
                      className="text-sm text-cyan-500 hover:text-cyan-400 transition-colors flex items-center gap-1"
                    >
                      View all
                      <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                {recentProjects.length === 0 ? (
                  <div className="p-8 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl text-center">
                    <p className="text-[rgb(var(--color-text-secondary))] mb-4">
                      You don't have any projects yet. Create your first one to get started!
                    </p>
                    <button onClick={() => navigate('/projects')} className="btn-primary">
                      Create Your First Project
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {recentProjects.map((project) => (
                      <RecentProjectCard
                        key={project.uuid}
                        project={project}
                        onOpen={handleOpenProject}
                      />
                    ))}
                  </div>
                )}
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
