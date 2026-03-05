import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Outlet, NavLink } from 'react-router-dom';
import {
  ArrowLeftIcon,
  Square3Stack3DIcon,
  Cog6ToothIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/layout/Sidebar/index';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import apiClient from '../../services/api/apiClient';

const normalizeList = (data) =>
  Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];

const TABS = [
  { label: 'Overview', to: '.', icon: Square3Stack3DIcon, end: true },
  { label: 'Settings', to: 'settings', icon: Cog6ToothIcon, end: false },
];

export default function ProjectDetailLayout() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const [projectRes, graphsRes] = await Promise.all([
        apiClient.get(`/projects/${id}/`),
        apiClient.get('/graphs/', { params: { project__uuid: id, ordering: '-updated_at' } }),
      ]);
      const proj = projectRes.data;
      setProject(proj);
      setGraphs(normalizeList(graphsRes.data));
    } catch (err) {
      setFetchError(err.response?.status === 404 ? 'Project not found.' : 'Could not load project data.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Callbacks passed down to child tabs via Outlet context
  const addGraph = (newGraph) => setGraphs((prev) => [newGraph, ...prev]);
  const updateProject = (updated) => setProject(updated);

  // ── Loading state ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex h-screen bg-[rgb(var(--color-bg))]">
        <Sidebar />
        <main className="flex-1 flex items-center justify-center">
          <LoadingSpinner size="medium" fullScreen={false} />
        </main>
      </div>
    );
  }

  // ── Error state ─────────────────────────────────────────────────────────
  if (fetchError || !project) {
    return (
      <div className="flex h-screen bg-[rgb(var(--color-bg))]">
        <Sidebar />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <p role="alert" className="text-red-400">{fetchError || 'Project not found.'}</p>
          <button onClick={() => navigate('/projects')} className="btn-secondary">
            Back to Projects
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[rgb(var(--color-bg))]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-5xl mx-auto">
          {/* Back link */}
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1 text-sm text-[rgb(var(--color-text-secondary))] hover:text-cyan-500 transition-colors mb-6"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            Back to Projects
          </button>

          {/* Project header */}
          <header className="mb-2">
            <h1 className="text-3xl font-bold text-[rgb(var(--color-text))]">{project.name}</h1>
            {project.description && (
              <p className="text-[rgb(var(--color-text-secondary))] mt-2 max-w-2xl">{project.description}</p>
            )}
            <div className="flex items-center gap-4 text-xs text-[rgb(var(--color-text-muted))] mt-3">
              <span className="flex items-center gap-1">
                <Square3Stack3DIcon className="h-4 w-4" aria-hidden="true" />
                {graphs.length} {graphs.length === 1 ? 'graph' : 'graphs'}
              </span>
              <span className="flex items-center gap-1">
                <CubeIcon className="h-4 w-4" aria-hidden="true" />
                {project.node_count ?? 0} {project.node_count === 1 ? 'node' : 'nodes'}
              </span>
            </div>
          </header>

          {/* Tab navigation */}
          <nav className="flex gap-1 border-b border-[rgb(var(--color-border))] mb-8 mt-6" aria-label="Project sections">
            {TABS.map((tab) => (
              <NavLink
                key={tab.label}
                to={tab.to}
                end={tab.end}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                    isActive
                      ? 'border-cyan-500 text-cyan-500'
                      : 'border-transparent text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-border-hover))]'
                  }`
                }
              >
                <tab.icon className="h-4 w-4" aria-hidden="true" />
                {tab.label}
              </NavLink>
            ))}
          </nav>

          {/* Active tab content */}
          <Outlet context={{ project, graphs, addGraph, updateProject, projectId: project.id, projectUuid: id }} />
        </div>
      </main>
    </div>
  );
}

