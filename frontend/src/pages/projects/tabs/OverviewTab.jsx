import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PlusIcon,
  XMarkIcon,
  Square3Stack3DIcon,
  CubeIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../../services/api/apiClient';
import { useActivityFeedInvalidation } from '../../../context/ActivityFeedContext';

// ── Validation ────────────────────────────────────────────────────────────────
function validateName(value, t) {
  if (!value.trim()) return t('projectDetail.overview.noGraphs');
  if (value.length > 255) return t('projects.newProjectModal.errors.nameMaxLength');
  return '';
}

// ── New Graph Modal ───────────────────────────────────────────────────────────
function NewGraphModal({ isOpen, onClose, onCreated, projectId }) {
  const { invalidateActivityFeed } = useActivityFeedInvalidation();
  const { t } = useTranslation();
  const [form, setForm] = useState({ name: '', description: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setForm({ name: '', description: '' });
      setErrors({});
      setTouched({});
      setSubmitting(false);
      setApiError('');
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'name') setErrors((prev) => ({ ...prev, name: validateName(value, t) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'name') setErrors((prev) => ({ ...prev, name: validateName(value, t) }));
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    const nameErr = validateName(form.name, t);
    setErrors({ name: nameErr });
    setTouched({ name: true });
    if (nameErr) return;

    setSubmitting(true);
    try {
      const { data } = await apiClient.post('/graphs/', {
        project: projectId,
        name: form.name.trim(),
        description: form.description.trim(),
      });
      invalidateActivityFeed();
      onCreated(data);
      onClose();
    } catch (err) {
      const detail =
        err.response?.data?.name?.[0] ||
        err.response?.data?.non_field_errors?.[0] ||
        err.response?.data?.detail ||
        t('projects.newProjectModal.errors.creationFailed');
      setApiError(detail);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" aria-modal="true" aria-labelledby="new-graph-title">
      <div className="w-full max-w-lg mx-4 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-2xl shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--color-border))]">
          <h2 id="new-graph-title" className="text-lg font-semibold text-[rgb(var(--color-text))]">{t('projectDetail.overview.newGraph')}</h2>
          <button onClick={onClose} className="p-1 rounded-md text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:bg-white/5 transition" aria-label={t('projects.newProjectModal.cancelButton')}>
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          {apiError && (
            <p role="alert" className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-2">{apiError}</p>
          )}

          <div>
            <label htmlFor="graph-name" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1">{t('projectDetail.overview.newGraph')}</label>
            <input
              id="graph-name"
              name="name"
              type="text"
              autoComplete="off"
              value={form.name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={`input-field ${touched.name && errors.name ? 'input-error' : ''}`}
              placeholder={t('projectDetail.overview.newGraph')}
              aria-required="true"
              aria-invalid={!!(touched.name && errors.name)}
              aria-describedby={touched.name && errors.name ? 'graph-name-error' : undefined}
            />
            {touched.name && errors.name && (
              <p id="graph-name-error" role="alert" className="mt-1 text-xs text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="graph-description" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1">{t('projects.newProjectModal.description')}</label>
            <textarea
              id="graph-description"
              name="description"
              rows={3}
              autoComplete="off"
              value={form.description}
              onChange={handleChange}
              onBlur={handleBlur}
              className="input-field resize-none"
              placeholder={t('projects.newProjectModal.placeholder.description')}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={submitting}>{t('projects.newProjectModal.cancelButton')}</button>
            <button type="submit" className="btn-primary" disabled={submitting || hasErrors} aria-busy={submitting}>
              {submitting ? `${t('projects.newProjectModal.createButton')}…` : t('projectDetail.overview.newGraph')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Graph Card ────────────────────────────────────────────────────────────────
function GraphCard({ graph, onOpen }) {
  const updatedDate = new Date(graph.updated_at).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  });

  return (
    <div className="group p-5 bg-[rgb(var(--color-bg-secondary))]/50 border border-transparent rounded-xl shadow-sm hover:border-purple-500/40 transition-colors">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-base font-semibold text-[rgb(var(--color-text))] truncate pr-2">{graph.name}</h3>
        <Square3Stack3DIcon className="h-5 w-5 shrink-0 text-purple-500" aria-hidden="true" />
      </div>

      <p className="text-sm text-[rgb(var(--color-text-secondary))] line-clamp-2 mb-3 min-h-[2.5rem]">
        {graph.description || 'No description'}
      </p>

      <div className="flex items-center gap-4 text-xs text-[rgb(var(--color-text-muted))] mb-4">
        <span className="flex items-center gap-1">
          <CubeIcon className="h-4 w-4" aria-hidden="true" />
          {graph.node_count ?? 0} {graph.node_count === 1 ? 'node' : 'nodes'}
        </span>
        <span className="ml-auto">{updatedDate}</span>
      </div>

      <button onClick={() => onOpen(graph)} className="btn-primary w-full text-sm">
        Open Canvas
      </button>
    </div>
  );
}

// ── Overview Tab ──────────────────────────────────────────────────────────────
export default function OverviewTab() {
  const { graphs, addGraph, projectId } = useOutletContext();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [graphModalOpen, setGraphModalOpen] = useState(false);

  return (
    <>
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">{t('projectDetail.overview.graphs')}</h2>
          <button onClick={() => setGraphModalOpen(true)} className="btn-primary flex items-center gap-2 text-sm">
            <PlusIcon className="h-4 w-4" />
            {t('projectDetail.overview.newGraph')}
          </button>
        </div>

        {graphs.length === 0 ? (
          <div className="p-8 bg-gradient-to-br from-purple-500/10 to-cyan-500/10 border border-purple-500/20 rounded-2xl text-center">
            <Square3Stack3DIcon className="h-12 w-12 text-purple-500/60 mx-auto mb-3" />
            <p className="text-[rgb(var(--color-text-secondary))] mb-4">
              {t('projectDetail.overview.noGraphs')}
            </p>
            <button onClick={() => setGraphModalOpen(true)} className="btn-primary text-sm">
              {t('projectDetail.overview.newGraph')}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {graphs.map((graph) => (
              <GraphCard
                key={graph.uuid}
                graph={graph}
                onOpen={(g) => navigate(`/graphs/${g.uuid}`)}
              />
            ))}
          </div>
        )}
      </section>

      <NewGraphModal
        isOpen={graphModalOpen}
        onClose={() => setGraphModalOpen(false)}
        onCreated={addGraph}
        projectId={projectId}
      />
    </>
  );
}





