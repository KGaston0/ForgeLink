const NODE_TYPES = [
  { type: 'character', label: 'Character' },
  { type: 'location', label: 'Location' },
  { type: 'event', label: 'Event' },
  { type: 'item', label: 'Item' },
  { type: 'concept', label: 'Concept' },
  { type: 'note', label: 'Note' },
];

const Toolbar = ({ onCreateNode, onCreateFrame, onSaveState, saving = false }) => {
  return (
    <div className="w-full relative z-50 bg-[rgb(var(--color-bg-secondary))]/95 backdrop-blur-sm border-b border-[rgb(var(--color-border))] shadow-lg">
      <div className="flex items-center justify-between px-6 py-3">

        <div className="flex items-center gap-3">
          <div className="relative group">
            <button
              type="button"
              className="px-4 py-2 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] font-medium text-sm cursor-pointer"
            >
              Añadir Nodo ▼
            </button>

            <div className="absolute top-full left-0 pt-1 hidden group-hover:block z-50">
              <div className="min-w-[180px] bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg shadow-xl py-2">
                {NODE_TYPES.map(({ type, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => onCreateNode(type)}
                    className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer"
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateFrame}
            className="px-4 py-2 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] font-medium text-sm cursor-pointer"
          >
            Añadir Marco
          </button>
        </div>

        <button
          type="button"
          onClick={onSaveState}
          disabled={saving}
          aria-busy={saving}
          className="px-4 py-2 rounded-lg bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] font-medium text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? 'Guardando...' : 'Guardar Estado'}
        </button>
      </div>
    </div>
  );
};

export default Toolbar;