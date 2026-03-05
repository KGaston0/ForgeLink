import { useState } from 'react';
import NodeLabModal from './NodeLabModal';

const DEFAULT_NODES = [
  { type: 'character', label: 'Character', color: 'bg-purple-500' },
  { type: 'location', label: 'Location', color: 'bg-blue-500' },
  { type: 'event', label: 'Event', color: 'bg-red-500' },
  { type: 'item', label: 'Item', color: 'bg-green-500' },
  { type: 'concept', label: 'Concept', color: 'bg-yellow-500' },
  { type: 'note', label: 'Note', color: 'bg-gray-500' },
];

const DEFAULT_FRAMES = [
  { type: 'standard', label: 'Standard Frame', color: 'bg-slate-600' },
];

const Toolbar = ({ onCreateNode, onCreateFrame, saveStatus, onUndo, onRedo, canUndo, canRedo }) => {
  const [isNodeLabOpen, setIsNodeLabOpen] = useState(false);

  const STATUS_CONFIG = {
    saved: {
      text: 'Synced',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      ),
    },
    unsaved: {
      text: 'Unsaved Changes',
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
      borderColor: 'border-amber-500/20',
      icon: (
        <span className="relative flex h-2 w-2 mr-0.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
      ),
    },
    saving: {
      text: 'Saving...',
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      icon: (
        <svg className="animate-spin h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ),
    },
    error: {
      text: 'Sync Error',
      color: 'text-red-400',
      bgColor: 'bg-red-500/10',
      borderColor: 'border-red-500/20',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
      ),
    }
  };

  const currentStatus = STATUS_CONFIG[saveStatus] || STATUS_CONFIG.saved;

  return (
    <>
      <div className="w-full relative z-50 bg-[rgb(var(--color-bg-secondary))]/95 backdrop-blur-sm border-b border-[rgb(var(--color-border))] shadow-lg connection-mode-loose">
        <div className="flex items-center justify-between px-6 py-2.5">

          {/* --- SECCIÓN IZQUIERDA: CREACIÓN --- */}
          <div className="flex items-center gap-3">

            {/* MENU NODOS */}
            <div className="relative group">
              <button
                type="button"
                className="px-4 py-1.5 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] hover:border-[rgb(var(--color-text-secondary))/20] transition-all font-medium text-sm cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                Add Node
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-text))] transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="absolute top-full left-0 pt-1.5 hidden group-hover:block z-50 animate-fadeInShort">
                <div className="min-w-[200px] bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl shadow-2xl py-2 px-1 context-menu">

                  <div className="px-3 pb-1 pt-1 text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                    Default Types
                  </div>
                  {DEFAULT_NODES.map(({ type, label, color }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onCreateNode(type)}
                      className="w-full px-3 py-1.5 rounded-md text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <span className={`w-2 h-2 rounded-full ${color}`}></span>
                      {label}
                    </button>
                  ))}

                  <div className="mt-2 px-3 pb-1 pt-2 border-t border-[rgb(var(--color-border))] text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider flex items-center justify-between">
                    <span>Pinned Blueprints</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-[rgb(var(--color-text-secondary))]"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  </div>
                  <button
                    type="button"
                    onClick={() => onCreateNode('custom_npc')}
                    className="w-full px-3 py-1.5 rounded-md text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                    NPC Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => onCreateNode('custom_spell')}
                    className="w-full px-3 py-1.5 rounded-md text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer transition-colors flex items-center gap-2"
                  >
                    <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                    Magic Spell
                  </button>

                  <div className="mt-2 pt-2 border-t border-[rgb(var(--color-border))] px-1">
                    <button
                      type="button"
                      onClick={() => setIsNodeLabOpen(true)}
                      className="w-full px-3 py-1.5 rounded-md text-left text-xs text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      Explore Node Lab
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* MENU MARCOS (UNIFICADO) */}
            <div className="relative group">
              <button
                type="button"
                className="px-4 py-1.5 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] hover:border-[rgb(var(--color-text-secondary))/20] transition-all font-medium text-sm cursor-pointer shadow-sm flex items-center gap-1.5"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[rgb(var(--color-text-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v14a1 1 0 01-1 1H5a1 1 0 01-1-1V5z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2v2H3V3zm16 0h2v2h-2V3zM3 19h2v2H3v-2zm16 0h2v2h-2v-2z" />
                </svg>
                Add Frame
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-0.5 text-[rgb(var(--color-text-secondary))] group-hover:text-[rgb(var(--color-text))] transition-transform duration-200 group-hover:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              <div className="absolute top-full left-0 pt-1.5 hidden group-hover:block z-50 animate-fadeInShort">
                <div className="min-w-[200px] bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-xl shadow-2xl py-2 px-1 context-menu">

                  <div className="px-3 pb-1 pt-1 text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                    Default Frames
                  </div>
                  {DEFAULT_FRAMES.map(({ type, label, color }) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => onCreateFrame(type)}
                      className="w-full px-3 py-1.5 rounded-md text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer transition-colors flex items-center gap-2"
                    >
                      <span className={`w-2 h-2 rounded-full ${color}`}></span>
                      {label}
                    </button>
                  ))}

                  <div className="mt-2 px-3 pb-1 pt-2 border-t border-[rgb(var(--color-border))] text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider flex items-center justify-between">
                    <span>Pinned Blueprints</span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="currentColor" className="text-[rgb(var(--color-text-secondary))]"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path></svg>
                  </div>
                  <div className="px-3 py-1.5 text-xs text-[rgb(var(--color-text-secondary))] italic opacity-50">
                    No pinned frames
                  </div>

                  <div className="mt-2 pt-2 border-t border-[rgb(var(--color-border))] px-1">
                    <button
                      type="button"
                      onClick={() => setIsNodeLabOpen(true)}
                      className="w-full px-3 py-1.5 rounded-md text-left text-xs text-cyan-500 hover:bg-cyan-500/10 hover:text-cyan-400 font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                      Explore Node Lab
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* --- SECCIÓN DERECHA: ESTADO Y ACCIONES --- */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-full shadow-inner p-0.5">
              <div className="relative group">
                <button type="button" onClick={onUndo} disabled={!canUndo} className="p-1.5 flex items-center justify-center rounded-full text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all duration-150" aria-label="Deshacer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></svg>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-md shadow-lg text-[10px] font-semibold text-[rgb(var(--color-text))] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50">
                  Deshacer (Ctrl+Z)
                </div>
              </div>

              <div className="w-px h-4 bg-[rgb(var(--color-border))] mx-0.5"></div>

              <div className="relative group">
                <button type="button" onClick={onRedo} disabled={!canRedo} className="p-1.5 flex items-center justify-center rounded-full text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer transition-all duration-150" aria-label="Rehacer">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"></path></svg>
                </button>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-2.5 py-1.5 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-md shadow-lg text-[10px] font-semibold text-[rgb(var(--color-text))] whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 z-50">
                  Rehacer (Ctrl+Y)
                </div>
              </div>
            </div>

            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border shadow-sm transition-all duration-500 ease-out ${currentStatus.bgColor} ${currentStatus.borderColor} ${currentStatus.color}`} role="status" aria-live="polite">
              <div className="flex-shrink-0 flex items-center justify-center">{currentStatus.icon}</div>
              <span className="text-xs font-medium tracking-tight whitespace-nowrap">{currentStatus.text}</span>
            </div>
          </div>
        </div>
      </div>

      <NodeLabModal
        isOpen={isNodeLabOpen}
        onClose={() => setIsNodeLabOpen(false)}
        onSpawnNode={(type) => {
          // Si el tipo empieza por 'custom_' es un nodo, si no (o por lógica de negocio), manejamos frames
          if (type.includes('frame')) {
             onCreateFrame(type);
          } else {
             onCreateNode(type);
          }
          setIsNodeLabOpen(false);
        }}
      />
    </>
  );
};

export default Toolbar;