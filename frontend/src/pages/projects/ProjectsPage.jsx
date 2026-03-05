import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusIcon,
  XMarkIcon,
  FolderOpenIcon,
  Square3Stack3DIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import Sidebar from '../../components/layout/Sidebar/index';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import apiClient from '../../services/api/apiClient';

const INITIAL_FORM = { name: '', description: '' };

const VALIDATION_RULES = {
  name: {
    required: 'Project name is required.',
    maxLength: { value: 255, message: 'Name must be 255 characters or less.' },
  },
};

function validateField(field, value) {
  const rules = VALIDATION_RULES[field];
  if (!rules) return '';
  if (rules.required && !value.trim()) return rules.required;
  if (rules.maxLength && value.length > rules.maxLength.value) return rules.maxLength.message;
  return '';
}

// ── Modal for creating a new project ──────────────────────────────────────────
function NewProjectModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  // Reset state whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setForm(INITIAL_FORM);
      setErrors({});
      setTouched({});
      setSubmitting(false);
      setApiError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Validate all fields before submission
    const newErrors = { name: validateField('name', form.name) };
    setErrors(newErrors);
    setTouched({ name: true });

    if (Object.values(newErrors).some(Boolean)) return;

    setSubmitting(true);
    try {
      const { data } = await apiClient.post('/projects/', {
        name: form.name.trim(),
        description: form.description.trim(),
      });
      onCreated(data);
      onClose();
    } catch (err) {
      const detail =
        err.response?.data?.name?.[0] ||
        err.response?.data?.detail ||
        'Could not create the project. Please try again.';
      setApiError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-project-title"
    >
      <div className="w-full max-w-lg mx-4 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--color-border))]">
          <h2 id="new-project-title" className="text-lg font-semibold text-[rgb(var(--color-text))]">
            New Project
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:bg-white/5 transition"
            aria-label="Close modal"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {apiError && (
            <p role="alert" className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-2">
              {apiError}
            </p>
          )}

          {/* Name field */}
          <div>
            <label htmlFor="project-name" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1">
              Name
            </label>
            <input
              id="project-name"
              name="name"
              type="text"
              autoComplete="off"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field ${touched.name && errors.name ? 'input-error' : ''}`}
              placeholder="My Awesome Project"
              aria-required="true"
              aria-invalid={!!(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? 'project-name-error' : undefined}
            />
            {touched.name && errors.name && (
              <p id="project-name-error" role="alert" className="mt-1 text-xs text-red-400">
                {errors.name}
              </p>
            )}
          </div>

          {/* Description field */}
          <div>
            <label htmlFor="project-description" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1">
              Description
            </label>
            <textarea
              id="project-description"
              name="description"
              rows={3}
              autoComplete="off"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field resize-none"
              placeholder="What is this project about?"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={submitting}>
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={submitting || hasErrors}
              aria-busy={submitting}
            >
              {submitting ? 'Creating…' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Project card ──────────────────────────────────────────────────────────────
function ProjectCard({ project, onOpen }) {
  return (
    <div className="group p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl shadow-sm hover:border-cyan-500/40 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-[rgb(var(--color-text))] truncate pr-2">
          {project.name}
        </h3>
        <FolderOpenIcon className="h-5 w-5 shrink-0 text-cyan-500" aria-hidden="true" />
      </div>

      <p className="text-sm text-[rgb(var(--color-text-secondary))] line-clamp-2 mb-4 min-h-[2.5rem]">
        {project.description || 'No description'}
      </p>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-[rgb(var(--color-text-muted))] mb-5">
        <span className="flex items-center gap-1">
          <Square3Stack3DIcon className="h-4 w-4" aria-hidden="true" />
          {project.graph_count ?? 0} {project.graph_count === 1 ? 'graph' : 'graphs'}
        </span>
        <span className="flex items-center gap-1">
          <CubeIcon className="h-4 w-4" aria-hidden="true" />
          {project.node_count ?? 0} {project.node_count === 1 ? 'node' : 'nodes'}
        </span>
      </div>

      <button onClick={() => onOpen(project)} className="btn-primary w-full text-sm">
        Open
      </button>
    </div>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onNewProject }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <FolderOpenIcon className="h-16 w-16 text-[rgb(var(--color-text-muted))] mb-4" />
      <h2 className="text-xl font-semibold text-[rgb(var(--color-text))] mb-2">No projects yet</h2>
      <p className="text-[rgb(var(--color-text-secondary))] mb-6 max-w-md">
        Create your first project to start organizing your knowledge network.
      </p>
      <button onClick={onNewProject} className="btn-primary">
        <span className="flex items-center gap-2">
          <PlusIcon className="h-5 w-5" />
          New Project
        </span>
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function ProjectsPage() {
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const { data } = await apiClient.get('/projects/');
      // Handle both paginated and non-paginated responses
      const list = Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];
      setProjects(list);
    } catch {
      setFetchError('Could not load projects. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleProjectCreated = (newProject) => {
    setProjects((prev) => [newProject, ...prev]);
  };

  const handleOpenProject = (project) => {
    navigate(`/projects/${project.uuid}`);
  };

  return (
    <div className="flex h-screen bg-[rgb(var(--color-bg))]">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[rgb(var(--color-text))]">Projects</h1>
              <p className="text-[rgb(var(--color-text-secondary))] mt-1">
                Manage your knowledge workspaces.
              </p>
            </div>
            <button onClick={() => setModalOpen(true)} className="btn-primary flex items-center gap-2 self-start">
              <PlusIcon className="h-5 w-5" />
              New Project
            </button>
          </header>

          {/* Content */}
          {loading ? (
            <LoadingSpinner size="medium" fullScreen={false} />
          ) : fetchError ? (
            <div role="alert" className="text-center py-16">
              <p className="text-red-400 mb-4">{fetchError}</p>
              <button onClick={fetchProjects} className="btn-secondary">
                Retry
              </button>
            </div>
          ) : projects.length === 0 ? (
            <EmptyState onNewProject={() => setModalOpen(true)} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.uuid} project={project} onOpen={handleOpenProject} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* New Project Modal */}
      <NewProjectModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleProjectCreated}
      />
    </div>
  );
}

