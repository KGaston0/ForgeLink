import { useState } from 'react';

// Mock data: the global default list + per-graph overrides
const GLOBAL_DEFAULTS = [
  // World Building types
  { type: 'character', label: 'Character', color: 'bg-purple-500' },
  { type: 'location', label: 'Location', color: 'bg-blue-500' },
  { type: 'event', label: 'Event', color: 'bg-red-500' },
  { type: 'item', label: 'Item', color: 'bg-green-500' },
  { type: 'concept', label: 'Concept', color: 'bg-yellow-500' },
  { type: 'note', label: 'Note', color: 'bg-gray-500' },
  // Process Management types
  { type: 'process_step', label: 'Process Step', color: 'bg-emerald-500' },
  { type: 'decision', label: 'Decision Point', color: 'bg-cyan-500' },
  { type: 'task', label: 'Task', color: 'bg-orange-500' },
];

const MOCK_GRAPH_LISTS = [
  {
    id: 'list-4',
    graphName: 'Customer Service Workflow',
    projectName: 'Support Management',
    nodeTypes: [
      { type: 'task', label: 'Task', color: 'bg-orange-500' },
      { type: 'decision', label: 'Decision Point', color: 'bg-cyan-500' },
      { type: 'process_step', label: 'Process Step', color: 'bg-emerald-500' },
      { type: 'custom_notification', label: 'Notification', color: 'bg-red-500' },
    ],
  },
  {
    id: 'list-6',
    graphName: 'Data Integration Flow',
    projectName: 'System Integration',
    nodeTypes: [
      { type: 'custom_mapping', label: 'Data Mapping', color: 'bg-teal-500' },
      { type: 'decision', label: 'Decision Point', color: 'bg-cyan-500' },
      { type: 'process_step', label: 'Process Step', color: 'bg-emerald-500' },
      { type: 'custom_sync', label: 'Sync Node', color: 'bg-purple-500' },
    ],
  },
  {
    id: 'list-1',
    graphName: 'Main Story Arc',
    projectName: 'Fantasy Campaign',
    nodeTypes: [
      { type: 'character', label: 'Character', color: 'bg-purple-500' },
      { type: 'location', label: 'Location', color: 'bg-blue-500' },
      { type: 'event', label: 'Event', color: 'bg-red-500' },
      { type: 'custom_npc', label: 'NPC Profile', color: 'bg-pink-500' },
      { type: 'custom_quest', label: 'Quest Objective', color: 'bg-amber-500' },
    ],
  },
  {
    id: 'bp-2',
    graphName: 'Magic System',
    projectName: 'Fantasy Campaign',
    nodeTypes: [
      { type: 'concept', label: 'Concept', color: 'bg-yellow-500' },
      { type: 'item', label: 'Item', color: 'bg-green-500' },
      { type: 'custom_spell', label: 'Magic Spell', color: 'bg-cyan-500' },
      { type: 'custom_artifact', label: 'Artifact', color: 'bg-rose-500' },
    ],
  },
  {
    id: 'list-5',
    graphName: 'Order Fulfillment Process',
    projectName: 'E-Commerce Operations',
    nodeTypes: [
      { type: 'process_step', label: 'Process Step', color: 'bg-emerald-500' },
      { type: 'task', label: 'Task', color: 'bg-orange-500' },
      { type: 'decision', label: 'Decision Point', color: 'bg-cyan-500' },
      { type: 'custom_approval', label: 'Approval Gate', color: 'bg-yellow-500' },
    ],
  },
  {
    id: 'list-3',
    graphName: 'World Map',
    projectName: 'Setting Development',
    nodeTypes: [
      { type: 'location', label: 'Location', color: 'bg-blue-500' },
      { type: 'custom_tavern', label: 'Tavern', color: 'bg-orange-500' },
      { type: 'custom_faction', label: 'Faction Base', color: 'bg-indigo-500' },
    ],
  },
];

function NodeTypeChip({ nodeType }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-full text-xs text-[rgb(var(--color-text))]">
      <span className={`w-2 h-2 rounded-full ${nodeType.color} shrink-0`} />
      {nodeType.label}
    </span>
  );
}

function GraphListCard({ list }) {
  return (
    <div className="bg-[rgb(var(--color-bg-secondary))]/50 border border-transparent rounded-xl p-5 hover:border-cyan-500/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-[rgb(var(--color-text))] font-semibold text-base">{list.graphName}</h3>
          <p className="text-[10px] text-[rgb(var(--color-text-secondary))] mt-0.5">{list.projectName}</p>
        </div>
        <span className="text-[10px] font-mono text-[rgb(var(--color-text-secondary))]/40 bg-[rgb(var(--color-bg))] px-2 py-0.5 rounded-full border border-[rgb(var(--color-border))]">
          {list.nodeTypes.length} types
        </span>
      </div>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {list.nodeTypes.map(nt => (
          <NodeTypeChip key={nt.type} nodeType={nt} />
        ))}
      </div>

      <div className="pt-3 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
        <button type="button" className="text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer">
          Edit List
        </button>
        <button type="button" className="text-xs font-medium text-red-400/70 hover:text-red-400 transition-colors cursor-pointer">
          Remove
        </button>
      </div>
    </div>
  );
}

export default function NodeListsTab() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLists = MOCK_GRAPH_LISTS.filter(list =>
    list.graphName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    list.projectName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Global defaults section */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-[rgb(var(--color-text))]">Global Defaults</h2>
            <p className="text-xs text-[rgb(var(--color-text-secondary))] mt-0.5">
              These node types appear in every graph by default.
            </p>
          </div>
          <button
            type="button"
            className="px-3 py-1.5 rounded-lg bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] hover:border-[rgb(var(--color-text-secondary))]/30 transition-colors cursor-pointer"
          >
            Edit Defaults
          </button>
        </div>

        <div className="bg-[rgb(var(--color-bg-secondary))]/30 border border-[rgb(var(--color-border))] rounded-xl p-5">
          <div className="flex flex-wrap gap-2">
            {GLOBAL_DEFAULTS.map(nt => (
              <NodeTypeChip key={nt.type} nodeType={nt} />
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-[rgb(var(--color-border))]" />
        <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
          Per-Graph Overrides
        </span>
        <div className="flex-1 h-px bg-[rgb(var(--color-border))]" />
      </div>

      {/* Search + create */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--color-text-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by graph or project..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            className="w-full pl-9 pr-4 py-2.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-secondary))]/50 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <button
          type="button"
          className="px-4 py-2.5 rounded-lg bg-cyan-500 text-white text-sm font-semibold hover:bg-cyan-600 transition-colors cursor-pointer shadow-sm shadow-cyan-500/20 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          New List
        </button>
      </div>

      {/* Graph lists grid */}
      {filteredLists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-[rgb(var(--color-text-secondary))]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-40">
            <line x1="8" y1="6" x2="21" y2="6" />
            <line x1="8" y1="12" x2="21" y2="12" />
            <line x1="8" y1="18" x2="21" y2="18" />
            <line x1="3" y1="6" x2="3.01" y2="6" />
            <line x1="3" y1="12" x2="3.01" y2="12" />
            <line x1="3" y1="18" x2="3.01" y2="18" />
          </svg>
          <p className="text-sm">No graph lists match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLists.map(list => (
            <GraphListCard key={list.id} list={list} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-xs text-[rgb(var(--color-text-secondary))]/50">
          Graph-specific node list configuration coming in a future update.
        </p>
      </div>
    </>
  );
}

