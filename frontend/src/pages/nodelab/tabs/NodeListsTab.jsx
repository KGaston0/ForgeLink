import { useState, useEffect } from 'react';
import { fetchBlueprintLists, createBlueprintList, deleteBlueprintList } from '@/features/graphs/api/graphService';
import LoadingSpinner from '@/components/ui/loading-spinner';
const GLOBAL_DEFAULTS = [
  { type: 'character', label: 'Character', color: 'bg-purple-500' },
  { type: 'location', label: 'Location', color: 'bg-blue-500' },
  { type: 'event', label: 'Event', color: 'bg-red-500' },
  { type: 'item', label: 'Item', color: 'bg-green-500' },
  { type: 'concept', label: 'Concept', color: 'bg-yellow-500' },
  { type: 'note', label: 'Note', color: 'bg-gray-500' },
  { type: 'process_step', label: 'Process Step', color: 'bg-emerald-500' },
  { type: 'decision', label: 'Decision Point', color: 'bg-cyan-500' },
  { type: 'task', label: 'Task', color: 'bg-orange-500' },
];
function CreateListModal({ isOpen, onClose, onCreate, isLoading }) {
  const [listName, setListName] = useState('');
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!listName.trim()) {
      setError('List name is required');
      return;
    }
    try {
      setError(null);
      await onCreate(listName.trim());
      setListName('');
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to create list');
    }
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeInShort">
      <div role="dialog" aria-modal="true" className="w-full max-w-md bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgb(var(--color-border))]">
          <h3 className="text-lg font-bold text-[rgb(var(--color-text))]">Create New List</h3>
          <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">Give your new blueprint list a name</p>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label htmlFor="listName" className="block text-xs font-medium text-[rgb(var(--color-text))] mb-2">List Name</label>
            <input
              id="listName"
              type="text"
              value={listName}
              onChange={(e) => { setListName(e.target.value); setError(null); }}
              placeholder="E.g., Medieval Fantasy"
              autoFocus
              className="w-full px-3 py-2.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-secondary))]/50 focus:outline-none focus:border-cyan-500 transition-colors"
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={error ? 'listNameError' : undefined}
            />
            {error && <p id="listNameError" role="alert" className="text-xs text-red-400 mt-1.5">{error}</p>}
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={() => { onClose(); setListName(''); setError(null); }} className="flex-1 px-3 py-2 rounded-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] text-sm font-medium text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))]/80 transition-colors cursor-pointer">Cancel</button>
            <button type="submit" disabled={isLoading || !listName.trim()} className="flex-1 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-600 disabled:bg-cyan-500/50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors cursor-pointer" aria-busy={isLoading}>{isLoading ? 'Creating...' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
function ConfirmDeleteModal({ isOpen, onClose, onConfirm, listName, isLoading }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeInShort">
      <div role="dialog" aria-modal="true" className="w-full max-w-md bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-[rgb(var(--color-border))] bg-red-500/5">
          <h3 className="text-lg font-bold text-red-400">Delete List?</h3>
          <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-1">This action cannot be undone.</p>
        </div>
        <div className="px-6 py-4">
          <p className="text-sm text-[rgb(var(--color-text))] mb-4">Are you sure you want to delete <strong className="text-red-400">{listName}</strong>?</p>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} disabled={isLoading} className="flex-1 px-3 py-2 rounded-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] text-sm font-medium text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))]/80 transition-colors cursor-pointer disabled:cursor-not-allowed disabled:opacity-50">Keep It</button>
            <button type="button" onClick={onConfirm} disabled={isLoading} className="flex-1 px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors cursor-pointer" aria-busy={isLoading}>{isLoading ? 'Deleting...' : 'Delete'}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
function NodeTypeChip({ nodeType }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-full text-xs text-[rgb(var(--color-text))]">
      <span className={`w-2 h-2 rounded-full ${nodeType.color} shrink-0`} />
      {nodeType.label}
    </span>
  );
}
function BlueprintListCard({ list, onDelete }) {
  const blueprintCount = list.blueprints?.length || list.blueprint_ids?.length || 0;
  return (
    <div className="bg-[rgb(var(--color-bg-secondary))]/50 border border-transparent rounded-xl p-5 hover:border-cyan-500/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-[rgb(var(--color-text))] font-semibold text-base break-words">{list.name}</h3>
          <p className="text-[10px] text-[rgb(var(--color-text-secondary))] mt-0.5 break-words">{list.description || '(No description)'}</p>
        </div>
        <span className="text-[10px] font-mono text-[rgb(var(--color-text-secondary))]/40 bg-[rgb(var(--color-bg))] px-2 py-0.5 rounded-full border border-[rgb(var(--color-border))] shrink-0 ml-2">{blueprintCount} item{blueprintCount !== 1 ? 's' : ''}</span>
      </div>
      {list.blueprints && list.blueprints.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {list.blueprints.slice(0, 3).map(bp => (
            <span key={bp.id} className="inline-flex items-center gap-1 px-2 py-1 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded text-[9px] text-[rgb(var(--color-text))]">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bp.color || '#06b6d4' }}></span>
              {bp.name}
            </span>
          ))}
          {list.blueprints.length > 3 && <span className="text-[9px] text-[rgb(var(--color-text-secondary))] px-2 py-1">+{list.blueprints.length - 3} more</span>}
        </div>
      )}
      <div className="pt-3 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
        <button type="button" className="text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer" disabled title="Coming soon">Edit List</button>
        <button type="button" onClick={onDelete} className="text-xs font-medium text-red-400/70 hover:text-red-400 transition-colors cursor-pointer">Remove</button>
      </div>
    </div>
  );
}
export default function NodeListsTab() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [listToDelete, setListToDelete] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => { loadLists(); }, []);
  const loadLists = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetchBlueprintLists({ limit: 100 });
      setLists(response.results || response.data || []);
    } catch (err) {
      console.error('[NodeListsTab] Error fetching lists:', err);
      setError('Failed to load blueprint lists');
    } finally {
      setLoading(false);
    }
  };
  const handleCreateListSubmit = async (listName) => {
    setIsSubmitting(true);
    try {
      await createBlueprintList({ name: listName, description: '', blueprintIds: [] });
      await loadLists();
    } catch (err) {
      console.error('[NodeListsTab] Error creating list:', err);
      throw new Error('Failed to create blueprint list');
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteListClick = (list) => {
    setListToDelete(list);
    setDeleteModalOpen(true);
  };
  const handleDeleteListConfirm = async () => {
    if (!listToDelete) return;
    setIsSubmitting(true);
    try {
      await deleteBlueprintList(listToDelete.id);
      setDeleteModalOpen(false);
      setListToDelete(null);
      await loadLists();
    } catch (err) {
      console.error('[NodeListsTab] Error deleting list:', err);
      alert('Failed to delete blueprint list');
    } finally {
      setIsSubmitting(false);
    }
  };
  const filteredLists = lists.filter(list => list.name.toLowerCase().includes(searchTerm.toLowerCase()) || (list.description && list.description.toLowerCase().includes(searchTerm.toLowerCase())));
  return (
    <>
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">Global Defaults</h2>
            <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">These node types appear in every graph by default.</p>
          </div>
          <button type="button" className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-text-secondary))]/30 transition-colors cursor-pointer" disabled>Edit Defaults</button>
        </div>
        <div className="bg-[rgb(var(--color-bg-secondary))]/30 border border-[rgb(var(--color-border))] rounded-xl p-5">
          <div className="flex flex-wrap gap-2">
            {GLOBAL_DEFAULTS.map(nt => (<NodeTypeChip key={nt.type} nodeType={nt} />))}
          </div>
        </div>
      </section>
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-[rgb(var(--color-border))]" />
        <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">Blueprint Lists</span>
        <div className="flex-1 h-px bg-[rgb(var(--color-border))]" />
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--color-text-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" placeholder="Search by name..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} autoComplete="off" className="w-full pl-9 pr-4 py-2.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-secondary))]/50 focus:outline-none focus:border-cyan-500 transition-colors" />
        </div>
        <button type="button" onClick={() => setCreateModalOpen(true)} className="px-4 py-2.5 rounded-lg bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-600 transition-colors cursor-pointer shadow-sm shadow-cyan-500/20 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New List
        </button>
      </div>
      {loading ? (
        <div className="flex items-center justify-center py-20"><LoadingSpinner /></div>
      ) : error ? (
        <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">{error}</div>
      ) : lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[rgb(var(--color-text-secondary))]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-40">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <p className="text-sm">No blueprint lists yet.</p>
          <p className="text-xs mt-1">Create your first list to organize blueprints.</p>
        </div>
      ) : filteredLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[rgb(var(--color-text-secondary))]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-40">
            <line x1="8" y1="6" x2="21" y2="6" /><line x1="8" y1="12" x2="21" y2="12" /><line x1="8" y1="18" x2="21" y2="18" /><line x1="3" y1="6" x2="3.01" y2="6" /><line x1="3" y1="12" x2="3.01" y2="12" /><line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <p className="text-sm">No blueprint lists match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLists.map(list => (<BlueprintListCard key={list.id} list={list} onDelete={() => handleDeleteListClick(list)} />))}
        </div>
      )}
      <CreateListModal isOpen={createModalOpen} onClose={() => setCreateModalOpen(false)} onCreate={handleCreateListSubmit} isLoading={isSubmitting} />
      <ConfirmDeleteModal isOpen={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setListToDelete(null); }} onConfirm={handleDeleteListConfirm} listName={listToDelete?.name || ''} isLoading={isSubmitting} />
    </>
  );
}
