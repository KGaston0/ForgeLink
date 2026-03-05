import { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import {
  Cog6ToothIcon,
  ExclamationTriangleIcon,
} from '@heroicons/react/24/outline';
import apiClient from '../../../services/api/apiClient';

// ── Validation ────────────────────────────────────────────────────────────────
function validateName(value) {
  if (!value.trim()) return 'Name is required.';
  if (value.length > 255) return 'Name must be 255 characters or less.';
  return '';
}

// ── Settings sidebar nav items ────────────────────────────────────────────────
const SECTIONS = [
  { id: 'general', label: 'General', icon: Cog6ToothIcon },
  { id: 'danger', label: 'Danger Zone', icon: ExclamationTriangleIcon, danger: true },
];

// ── Delete Confirmation Modal ─────────────────────────────────────────────────
function DeleteProjectModal({ isOpen, onClose, onConfirm, projectName, deleting }) {
  const [confirmation, setConfirmation] = useState('');

  useEffect(() => {
    if (isOpen) setConfirmation('');
  }, [isOpen]);

  if (!isOpen) return null;

  const isMatch = confirmation === projectName;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" role="dialog" aria-modal="true" aria-labelledby="delete-project-title">
      <div className="w-full max-w-md mx-4 bg-[rgb(var(--color-bg-secondary))] border border-red-500/30 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-[rgb(var(--color-border))]">
          <ExclamationTriangleIcon className="h-6 w-6 text-red-500 shrink-0" />
          <h2 id="delete-project-title" className="text-lg font-semibold text-[rgb(var(--color-text))]">Delete Project</h2>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            This action <strong className="text-red-400">cannot be undone</strong>. It will permanently delete the project
            <strong className="text-[rgb(var(--color-text))]"> {projectName}</strong>, all its graphs, nodes and connections.
          </p>

          <div>
            <label htmlFor="delete-confirmation" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1">
              Type <strong>{projectName}</strong> to confirm
            </label>
            <input
              id="delete-confirmation"
              type="text"
              autoComplete="off"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value)}
              className="input-field"
              placeholder={projectName}
              aria-required="true"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary" disabled={deleting}>Cancel</button>
            <button
              onClick={onConfirm}
              disabled={!isMatch || deleting}
              className="px-4 py-2 rounded-lg bg-red-600 text-white font-medium text-sm hover:bg-red-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              aria-busy={deleting}
            >
              {deleting ? 'Deleting…' : 'Delete Project'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Settings Tab ──────────────────────────────────────────────────────────────
export default function SettingsTab() {
  const { project, updateProject, projectUuid } = useOutletContext();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState('general');

  // Edit form
  const [editForm, setEditForm] = useState({ name: '', description: '' });
  const [editErrors, setEditErrors] = useState({});
  const [editTouched, setEditTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  // Delete modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Sync form when project changes
  useEffect(() => {
    if (project) {
      setEditForm({ name: project.name, description: project.description || '' });
      setEditErrors({});
      setEditTouched({});
      setSaveSuccess('');
      setSaveError('');
    }
  }, [project]);

  // ── Edit handlers ───────────────────────────────────────────────────────
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
    if (name === 'name') setEditErrors((prev) => ({ ...prev, name: validateName(value) }));
    setSaveSuccess('');
    setSaveError('');
  };

  const handleEditBlur = (e) => {
    const { name, value } = e.target;
    setEditTouched((prev) => ({ ...prev, [name]: true }));
    if (name === 'name') setEditErrors((prev) => ({ ...prev, name: validateName(value) }));
  };

  const editHasErrors = Object.values(editErrors).some(Boolean);

  const isDirty =
    project &&
    (editForm.name !== project.name || editForm.description !== (project.description || ''));

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveSuccess('');
    setSaveError('');

    const nameErr = validateName(editForm.name);
    setEditErrors({ name: nameErr });
    setEditTouched({ name: true });
    if (nameErr) return;

    setSaving(true);
    try {
      const { data } = await apiClient.patch(`/projects/${projectUuid}/`, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
      });
      updateProject(data);
      setSaveSuccess('Project updated successfully.');
    } catch (err) {
      const detail =
        err.response?.data?.name?.[0] || err.response?.data?.detail || 'Could not save changes.';
      setSaveError(detail);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete handler ──────────────────────────────────────────────────────
  const handleDeleteProject = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(`/projects/${projectUuid}/`);
      navigate('/projects', { replace: true });
    } catch {
      setDeleting(false);
    }
  };

  return (
    <div className="flex gap-8">
      {/* Sidebar sub-navigation */}
      <nav className="w-48 shrink-0" aria-label="Settings sections">
        <ul className="space-y-1">
          {SECTIONS.map((section) => {
            const isActive = activeSection === section.id;
            return (
              <li key={section.id}>
                <button
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? section.danger
                        ? 'bg-red-500/10 text-red-400'
                        : 'bg-cyan-500/10 text-cyan-500'
                      : section.danger
                        ? 'text-red-400/60 hover:text-red-400 hover:bg-red-500/5'
                        : 'text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:bg-white/5'
                  }`}
                >
                  <section.icon className="h-4 w-4" aria-hidden="true" />
                  {section.label}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section content */}
      <div className="flex-1 min-w-0">
        {activeSection === 'general' && (
          <section>
            <h2 className="text-xl font-bold text-[rgb(var(--color-text))] mb-6">General</h2>

            <form onSubmit={handleSave} className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl space-y-5">
              {saveSuccess && (
                <p role="status" className="text-sm text-emerald-400 bg-emerald-400/10 rounded-lg px-4 py-2">
                  {saveSuccess}
                </p>
              )}
              {saveError && (
                <p role="alert" className="text-sm text-red-400 bg-red-400/10 rounded-lg px-4 py-2">
                  {saveError}
                </p>
              )}

              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1">
                  Project Name
                </label>
                <input
                  id="edit-name"
                  name="name"
                  type="text"
                  autoComplete="off"
                  value={editForm.name}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  className={`input-field ${editTouched.name && editErrors.name ? 'input-error' : ''}`}
                  aria-required="true"
                  aria-invalid={!!(editTouched.name && editErrors.name)}
                  aria-describedby={editTouched.name && editErrors.name ? 'edit-name-error' : undefined}
                />
                {editTouched.name && editErrors.name && (
                  <p id="edit-name-error" role="alert" className="mt-1 text-xs text-red-400">
                    {editErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="edit-description" className="block text-sm font-medium text-[rgb(var(--color-text))] mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  rows={3}
                  autoComplete="off"
                  value={editForm.description}
                  onChange={handleEditChange}
                  onBlur={handleEditBlur}
                  className="input-field resize-none"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn-primary text-sm"
                  disabled={saving || editHasErrors || !isDirty}
                  aria-busy={saving}
                >
                  {saving ? 'Saving…' : 'Save Changes'}
                </button>
              </div>
            </form>

            {/* Placeholder sections for future settings */}
            <div className="mt-8 space-y-4">
              {[
                { label: 'Default Nodes', desc: 'Configure which node types appear in the toolbar.' },
                { label: 'Visibility', desc: 'Set project visibility rules: public, private, etc.' },
                { label: 'Sharing', desc: 'Invite collaborators and manage permissions.' },
                { label: 'Appearance', desc: 'Customize colors, themes and visual preferences.' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl opacity-50"
                >
                  <h3 className="text-sm font-semibold text-[rgb(var(--color-text))]">{item.label}</h3>
                  <p className="text-xs text-[rgb(var(--color-text-muted))] mt-1">{item.desc}</p>
                  <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded bg-[rgb(var(--color-border))] text-[rgb(var(--color-text-muted))]">
                    Coming soon
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {activeSection === 'danger' && (
          <section>
            <h2 className="text-xl font-bold text-red-400 mb-6 flex items-center gap-2">
              <ExclamationTriangleIcon className="h-5 w-5" />
              Danger Zone
            </h2>

            <div className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-red-500/30 rounded-xl flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-[rgb(var(--color-text))]">Delete this project</h3>
                <p className="text-sm text-[rgb(var(--color-text-secondary))] mt-1">
                  Once deleted, all graphs, nodes and connections will be permanently removed.
                </p>
              </div>
              <button
                onClick={() => setDeleteModalOpen(true)}
                className="px-4 py-2 rounded-lg border border-red-500/50 text-red-400 text-sm font-medium hover:bg-red-500/10 transition shrink-0"
              >
                Delete Project
              </button>
            </div>
          </section>
        )}
      </div>

      {/* Delete modal */}
      <DeleteProjectModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleDeleteProject}
        projectName={project?.name || ''}
        deleting={deleting}
      />
    </div>
  );
}

