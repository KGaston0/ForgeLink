import { useState, useEffect, useRef } from 'react';
import { EDGE_DIRECTIONS, DIRECTION_CYCLE, DIRECTION_LABELS } from './edges/edgeConstants';

export default function EdgeEditorModal({ edge, isOpen, onClose, onSave, onDelete }) {
  const [label, setLabel] = useState('');
  const [direction, setDirection] = useState(EDGE_DIRECTIONS.FORWARD);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!edge) return;
    setLabel(edge.data?.label || '');
    setDirection(edge.data?.direction || EDGE_DIRECTIONS.FORWARD);
  }, [edge]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !edge) return null;

  const handleSave = () => {
    onSave({
      ...edge.data,
      label: label.trim(),
      direction,
    });
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-label="Editar Conexión"
    >
      <div className="w-full max-w-md mx-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
            Editar Conexión
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-[rgb(var(--color-text-muted))] hover:text-[rgb(var(--color-text))] transition-colors cursor-pointer"
            aria-label="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            <label htmlFor="edge-label" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">
              Etiqueta
            </label>
            <input
              ref={inputRef}
              id="edge-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="input-field"
              placeholder="Ej. pertenece a, conecta con..."
              autoComplete="off"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">
              Dirección
            </label>
            <div className="grid grid-cols-2 gap-3">
              {DIRECTION_CYCLE.map((dir) => (
                <button
                  key={dir}
                  type="button"
                  onClick={() => setDirection(dir)}
                  className={`py-2.5 px-4 text-sm rounded-lg border cursor-pointer transition-all ${
                    direction === dir
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400 font-semibold shadow-[0_0_10px_rgba(6,182,212,0.1)]'
                      : 'border-[rgb(var(--color-border))] text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-secondary))] hover:text-[rgb(var(--color-text))]'
                  }`}
                >
                  {DIRECTION_LABELS[dir]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer con botón Eliminar */}
        <div className="flex items-center justify-between border-t border-[rgb(var(--color-border))] px-6 py-4">
          <button
            type="button"
            onClick={onDelete}
            className="text-sm font-medium text-red-500 hover:text-red-400 transition-colors cursor-pointer"
          >
            Eliminar
          </button>
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="btn-secondary !py-2 !px-4 text-sm cursor-pointer">
              Cancelar
            </button>
            <button type="button" onClick={handleSave} className="btn-primary !py-2 !px-4 text-sm cursor-pointer">
              Guardar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}