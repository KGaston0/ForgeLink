import { useState, useEffect } from 'react';
import { fetchBlueprints } from '@/features/graphs/api/graphService';
import LoadingSpinner from '@/components/ui/loading-spinner';

const NodeLabModal = ({ isOpen, onClose, onSpawnNode }) => {
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  // Load blueprints from API when modal opens
  useEffect(() => {
    if (!isOpen) return;

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
        console.error('[NodeLabModal] Error fetching blueprints:', err);
        setError('Failed to load blueprints');
      } finally {
        setLoading(false);
      }
    };

    loadBlueprints();
  }, [isOpen, searchTerm, activeCategory]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSpawnNode = (blueprint) => {
    onSpawnNode({
      blueprintId: blueprint.id,
      nodeType: blueprint.name,
      label: blueprint.name,
      isFrame: blueprint.is_frame || false,
      customProps: blueprint.schema || {},
      color: blueprint.color || '#06b6d4',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fadeInShort">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="node-lab-title"
        className="w-full max-w-4xl max-h-[85vh] flex flex-col bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            </div>
            <div>
              <h2 id="node-lab-title" className="text-lg font-bold text-[rgb(var(--color-text))]">Node Lab</h2>
              <p className="text-xs text-[rgb(var(--color-text-secondary))]">Your personal library of custom blueprints</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] rounded-full transition-colors cursor-pointer"
            aria-label="Close Node Lab"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search & Filters */}
          <div className="p-4 border-b border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg-secondary))]/25 space-y-3">
            <div className="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--color-text-secondary))]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search blueprints..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              {categories.map(category => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategory === category
                      ? 'bg-cyan-500 text-white'
                      : 'bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Blueprints Grid or Loading/Error State */}
          <div className="flex-1 overflow-y-auto p-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <LoadingSpinner />
              </div>
            ) : error ? (
              <div role="alert" className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm">
                {error}
              </div>
            ) : blueprints.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mb-3 text-[rgb(var(--color-text-secondary))] opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                <p className="text-[rgb(var(--color-text-secondary))] mb-1">No blueprints found</p>
                <p className="text-xs text-[rgb(var(--color-text-secondary))] opacity-75">Try different search terms or filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {blueprints.map(blueprint => (
                  <button
                    key={blueprint.id}
                    type="button"
                    onClick={() => handleSpawnNode(blueprint)}
                    className="group relative bg-[rgb(var(--color-bg-secondary))]/50 border border-[rgb(var(--color-border))] rounded-lg overflow-hidden hover:border-cyan-500/50 hover:shadow-md hover:bg-[rgb(var(--color-bg-secondary))] transition-all duration-150 flex flex-col text-left"
                  >
                    {/* Top color indicator bar */}
                    <div 
                      className="h-1 w-full flex-shrink-0"
                      style={{ backgroundColor: blueprint.color || '#06b6d4' }}
                    />

                    {/* Content - more compact */}
                    <div className="flex-1 flex flex-col p-2.5 gap-1.5">
                      {/* Category badge */}
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: blueprint.color || '#06b6d4' }}
                        ></span>
                        <span className="text-[9px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider truncate">
                          {blueprint.category || 'General'}
                        </span>
                      </div>

                      {/* Blueprint name */}
                      <h3 className="text-[rgb(var(--color-text))] font-semibold text-xs group-hover:text-cyan-400 transition-colors line-clamp-1">
                        {blueprint.name}
                      </h3>

                      {/* Description - smaller text */}
                      <p className="text-[10px] text-[rgb(var(--color-text-secondary))] line-clamp-1 flex-1">
                        {blueprint.description || '—'}
                      </p>

                      {/* Spawn button - compact */}
                      <div className="pt-1.5 mt-auto border-t border-[rgb(var(--color-border))]/30">
                        <span className="inline-block w-full px-2 py-1 bg-cyan-500 hover:bg-cyan-600 text-white text-[10px] font-medium rounded transition-colors text-center">
                          Spawn
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeLabModal;


