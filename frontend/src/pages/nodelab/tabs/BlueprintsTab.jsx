import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBlueprints, deleteBlueprint } from '@/features/graphs/api/graphService';
import LoadingSpinner from '@/components/ui/loading-spinner';

function BlueprintCard({ blueprint, isPinned, onPinToggle, onEdit, onDelete }) {
  return (
    <div className="group relative bg-[rgb(var(--color-bg-secondary))]/50 border border-[rgb(var(--color-border))] border-t-4 rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-lg transition-all duration-200" style={{ borderTopColor: blueprint.color || '#06b6d4' }}>
      <div className="p-4">
        {/* Header with category and pin */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span 
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: blueprint.color || '#06b6d4' }}
            />
            <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
              {blueprint.category || 'General'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => onPinToggle(blueprint.id)}
            className={`text-[rgb(var(--color-text-secondary))] hover:text-amber-400 transition-colors cursor-pointer ${
              isPinned ? 'text-amber-400' : ''
            }`}
            title={isPinned ? 'Unpin' : 'Pin'}
            aria-label={isPinned ? 'Unpin blueprint' : 'Pin blueprint'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill={isPinned ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
        </div>

        {/* Title (blueprint name = semantic type) */}
        <h3 className="text-[rgb(var(--color-text))] font-semibold text-base mb-1">
          {blueprint.name}
        </h3>

        {/* Description */}
        <p className="text-xs text-[rgb(var(--color-text-secondary))] line-clamp-2 mb-4 leading-relaxed">
          {blueprint.description || '(No description)'}
        </p>

        {/* Footer */}
        <div className="pt-3 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
          <div className="text-[10px] text-[rgb(var(--color-text-secondary))]">
            {blueprint.spawned_nodes_count || 0} nodes spawned
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEdit(blueprint)}
              className="text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(blueprint.id)}
              className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>

        {/* Published badge */}
        {blueprint.is_published && (
          <div className="absolute top-3 right-3 px-2 py-1 bg-green-500/20 text-green-400 text-[10px] rounded font-medium">
            Published
          </div>
        )}
      </div>
    </div>
  );
}

export default function BlueprintsTab() {
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [pinnedBlueprints, setPinnedBlueprints] = useState(new Set());
  const [categories, setCategories] = useState(['All']);

  // Load pinned blueprints from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('forgelink_pinned_blueprints');
    if (saved) {
      try {
        setPinnedBlueprints(new Set(JSON.parse(saved)));
      } catch (err) {
        console.error('Failed to parse pinned blueprints:', err);
      }
    }
  }, []);

  // Sync pinned blueprints to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('forgelink_pinned_blueprints', JSON.stringify(Array.from(pinnedBlueprints)));
  }, [pinnedBlueprints]);

  const loadBlueprints = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {};
      if (searchTerm) params.search = searchTerm;
      if (activeCategory !== 'All') params.category = activeCategory;

      const response = await fetchBlueprints(params);
      const data = response.results || response;
      
      setBlueprints(data);
      
      // Extract unique categories
      const uniqueCategories = new Set(['All']);
      data.forEach(bp => {
        if (bp.category) uniqueCategories.add(bp.category);
      });
      setCategories(Array.from(uniqueCategories));
    } catch (err) {
      setError(err.response?.data?.detail || 'Error loading blueprints');
      console.error('[BlueprintsTab] Error fetching blueprints:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlueprints();
  }, [searchTerm, activeCategory]);

  const handlePinToggle = (blueprintId) => {
    setPinnedBlueprints(prev => {
      const next = new Set(prev);
      if (next.has(blueprintId)) {
        next.delete(blueprintId);
      } else {
        next.add(blueprintId);
      }
      return next;
    });
  };

  const handleDelete = async (blueprintId) => {
    if (!window.confirm('Delete this blueprint?')) return;

    try {
      await deleteBlueprint(blueprintId);
      setBlueprints(prev => prev.filter(bp => bp.id !== blueprintId));
    } catch (err) {
      console.error('[BlueprintsTab] Error deleting blueprint:', err);
      setError(err.response?.data?.detail || 'Error deleting blueprint');
    }
  };

  const handleEditBlueprint = (blueprint) => {
    // Navigate to edit page
    window.location.href = `/node-types/builder/${blueprint.id}`;
  };

  // Sort blueprints: pinned first, then by name
  const sortedBlueprints = [...blueprints].sort((a, b) => {
    const aPinned = pinnedBlueprints.has(a.id) ? 0 : 1;
    const bPinned = pinnedBlueprints.has(b.id) ? 0 : 1;
    if (aPinned !== bPinned) return aPinned - bPinned;
    return (a.name || '').localeCompare(b.name || '');
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[rgb(var(--color-text))]">
          Blueprints Library
        </h2>
        <Link
          to="/node-types/builder"
          className="btn-primary px-4 py-2 text-sm cursor-pointer inline-block"
        >
          Create Blueprint
        </Link>
      </div>

      {error && (
        <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
          {error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative w-full sm:w-64">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--color-text-secondary))]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search blueprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === category
                  ? 'bg-[rgb(var(--color-text))] text-[rgb(var(--color-bg))]'
                  : 'bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {sortedBlueprints.length === 0 ? (
        <div className="text-center py-12">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto mb-4 text-[rgb(var(--color-text-secondary))] opacity-50"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
          </svg>
          <p className="text-[rgb(var(--color-text-secondary))] mb-2">No blueprints found</p>
          <p className="text-xs text-[rgb(var(--color-text-secondary))] opacity-75">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sortedBlueprints.map(blueprint => (
            <BlueprintCard
              key={blueprint.id}
              blueprint={blueprint}
              isPinned={pinnedBlueprints.has(blueprint.id)}
              onPinToggle={handlePinToggle}
              onEdit={handleEditBlueprint}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
