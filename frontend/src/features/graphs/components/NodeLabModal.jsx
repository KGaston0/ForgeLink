import { useState, useEffect } from 'react';

const MOCK_BLUEPRINTS = [
  { id: 'bp-1', type: 'custom_npc', name: 'NPC Profile', category: 'Characters', color: 'bg-purple-500', isPinned: true },
  { id: 'bp-2', type: 'custom_quest', name: 'Quest Objective', category: 'Gameplay', color: 'bg-amber-500', isPinned: false },
  { id: 'bp-3', type: 'custom_spell', name: 'Magic Spell', category: 'Lore', color: 'bg-cyan-500', isPinned: true },
  { id: 'bp-4', type: 'custom_tavern', name: 'Tavern', category: 'Locations', color: 'bg-orange-500', isPinned: false },
  { id: 'bp-5', type: 'custom_artifact', name: 'Artifact', category: 'Lore', color: 'bg-rose-500', isPinned: false },
  { id: 'bp-6', type: 'custom_faction', name: 'Faction Base', category: 'World', color: 'bg-indigo-500', isPinned: false },
];

const NodeLabModal = ({ isOpen, onClose, onSpawnNode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const categories = ['All', ...new Set(MOCK_BLUEPRINTS.map(bp => bp.category))];

  const filteredBlueprints = MOCK_BLUEPRINTS.filter(bp => {
    const matchesSearch = bp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || bp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

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
            className="p-2 text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] rounded-full transition-colors"
            aria-label="Close Node Lab"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        {/* Toolbar: Search & Filters */}
        <div className="px-6 py-4 border-b border-[rgb(var(--color-border))] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-64">
            <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--color-text-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input
              type="text"
              placeholder="Search blueprints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-2 sm:pb-0 hide-scrollbar">
            {categories.map(category => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${activeCategory === category ? 'bg-[rgb(var(--color-text))] text-[rgb(var(--color-bg))]' : 'bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))]'}`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[rgb(var(--color-bg))] min-h-[400px]">
          {filteredBlueprints.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[rgb(var(--color-text-secondary))]">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
              <p>No blueprints found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {filteredBlueprints.map(bp => (
                <div key={bp.id} className="group relative bg-[rgb(var(--color-bg-secondary))]/50 border border-[rgb(var(--color-border))] rounded-xl p-4 hover:border-cyan-500/50 hover:shadow-lg transition-all duration-200">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${bp.color} shadow-sm`}></span>
                      <span className="text-xs font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">{bp.category}</span>
                    </div>
                    <button
                      type="button"
                      className={`text-[rgb(var(--color-text-secondary))] hover:text-amber-400 transition-colors ${bp.isPinned ? 'text-amber-400' : ''}`}
                      title={bp.isPinned ? "Unpin from Toolbar" : "Pin to Toolbar"}
                      aria-label="Toggle pin"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={bp.isPinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                    </button>
                  </div>
                  <h3 className="text-[rgb(var(--color-text))] font-semibold text-base mb-1">{bp.name}</h3>
                  <p className="text-xs text-[rgb(var(--color-text-secondary))] line-clamp-2 mb-4">
                    Custom properties structure ready to be deployed into the canvas.
                  </p>

                  <div className="pt-3 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
                    <button
                      type="button"
                      className="text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors"
                    >
                      Edit Blueprint
                    </button>
                    <button
                      type="button"
                      onClick={() => onSpawnNode(bp.type)}
                      className="px-3 py-1.5 bg-[rgb(var(--color-text))] text-[rgb(var(--color-bg))] rounded-md text-xs font-bold hover:opacity-90 transition-opacity"
                    >
                      Spawn Node
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NodeLabModal;