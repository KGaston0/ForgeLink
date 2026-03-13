import { useState } from 'react';

const MOCK_BLUEPRINTS = [
  { id: 'bp-9', type: 'approval_gate', name: 'Approval Gate', category: 'Procesos', color: 'from-yellow-500 to-amber-500', description: 'Decision point with multiple approval paths and conditions.' },
  { id: 'bp-5', type: 'custom_artifact', name: 'Artifact', category: 'World Building', color: 'from-rose-500 to-pink-600', description: 'Legendary item template with origin and powers.' },
  { id: 'bp-10', type: 'data_mapping', name: 'Data Mapping', category: 'Procesos', color: 'from-teal-500 to-cyan-500', description: 'Map fields between systems with transformation rules.' },
  { id: 'bp-6', type: 'custom_faction', name: 'Faction Base', category: 'World Building', color: 'from-indigo-500 to-violet-500', description: 'Faction overview with hierarchy, goals and alliances.' },
  { id: 'bp-3', type: 'custom_spell', name: 'Magic Spell', category: 'World Building', color: 'from-cyan-500 to-blue-500', description: 'Spell blueprint with element type, cost and effects.' },
  { id: 'bp-1', type: 'custom_npc', name: 'NPC Profile', category: 'World Building', color: 'from-purple-500 to-pink-500', description: 'Full NPC sheet with stats, backstory and dialogue hooks.' },
  { id: 'bp-11', type: 'notification_rule', name: 'Notification Rule', category: 'Procesos', color: 'from-red-500 to-pink-500', description: 'Configure alerts and notifications based on conditions.' },
  { id: 'bp-2', type: 'custom_quest', name: 'Quest Objective', category: 'World Building', color: 'from-amber-500 to-orange-500', description: 'Quest template with objectives, rewards and branching paths.' },
  { id: 'bp-12', type: 'sla_tracking', name: 'SLA Tracking', category: 'Procesos', color: 'from-purple-500 to-indigo-500', description: 'Monitor service level agreements and performance metrics.' },
  { id: 'bp-4', type: 'custom_tavern', name: 'Tavern Location', category: 'World Building', color: 'from-orange-500 to-red-500', description: 'Location sheet for inns and gathering points.' },
  { id: 'bp-8', type: 'task_board', name: 'Task Board', category: 'Procesos', color: 'from-blue-500 to-cyan-500', description: 'Kanban-style board for task management and tracking.' },
  { id: 'bp-7', type: 'workflow_step', name: 'Workflow Step', category: 'Procesos', color: 'from-green-500 to-emerald-500', description: 'Define a step in a process with inputs, outputs, and conditions.' },
];

const CATEGORIES = ['All', ...new Set(MOCK_BLUEPRINTS.map(bp => bp.category))];

function BlueprintCard({ blueprint }) {
  return (
    <div className="group relative bg-[rgb(var(--color-bg-secondary))]/50 border border-transparent rounded-xl overflow-hidden hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/5 transition-all duration-200">
      <div className={`h-1.5 w-full bg-gradient-to-r ${blueprint.color}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full bg-gradient-to-r ${blueprint.color} shadow-sm`} />
            <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
              {blueprint.category}
            </span>
          </div>
          <span className="text-[10px] font-mono text-[rgb(var(--color-text-secondary))]/50">
            {blueprint.id}
          </span>
        </div>
        <h3 className="text-[rgb(var(--color-text))] font-semibold text-base mb-1.5">{blueprint.name}</h3>
        <p className="text-xs text-[rgb(var(--color-text-secondary))] leading-relaxed mb-5">{blueprint.description}</p>
        <div className="pt-3 border-t border-[rgb(var(--color-border))] flex items-center justify-between">
          <button type="button" className="text-xs font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer">
            Edit Blueprint
          </button>
          <span className="text-[10px] text-[rgb(var(--color-text-secondary))]/60 italic">Coming soon</span>
        </div>
      </div>
    </div>
  );
}

export default function BlueprintsTab() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredBlueprints = MOCK_BLUEPRINTS.filter(bp => {
    const matchesSearch = bp.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || bp.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div className="relative w-full sm:w-72">
          <svg xmlns="http://www.w3.org/2000/svg" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[rgb(var(--color-text-secondary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search blueprints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            autoComplete="off"
            className="w-full pl-9 pr-4 py-2.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-lg text-sm text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text-secondary))]/50 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {CATEGORIES.map(category => (
            <button
              key={category}
              type="button"
              onClick={() => setActiveCategory(category)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                activeCategory === category
                  ? 'bg-cyan-500 text-white shadow-sm shadow-cyan-500/25'
                  : 'bg-[rgb(var(--color-bg-secondary))] text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] border border-[rgb(var(--color-border))]'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filteredBlueprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-[rgb(var(--color-text-secondary))]">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-4 opacity-40">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
          <p className="text-sm">No blueprints match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredBlueprints.map(bp => (
            <BlueprintCard key={bp.id} blueprint={bp} />
          ))}
        </div>
      )}

      <div className="mt-12 text-center">
        <p className="text-xs text-[rgb(var(--color-text-secondary))]/50">
          Blueprint creation &amp; editing coming in a future update.
        </p>
      </div>
    </>
  );
}

