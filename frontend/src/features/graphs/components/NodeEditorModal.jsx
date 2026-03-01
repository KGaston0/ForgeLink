import { useState, useEffect, useRef } from 'react';

const NODE_TYPES = [
  { value: 'character', label: 'Character' },
  { value: 'location', label: 'Location' },
  { value: 'event', label: 'Event' },
  { value: 'item', label: 'Item' },
  { value: 'concept', label: 'Concept' },
  { value: 'note', label: 'Note' },
  { value: 'frame', label: 'Frame' },
];

export default function NodeEditorModal({ node, isOpen, onClose, onSave, onDelete }) {
  const [label, setLabel] = useState('');
  const [nodeType, setNodeType] = useState('note');
  const [customProps, setCustomProps] = useState([]);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (!node) return;
    setLabel(node.data?.label || '');
    setNodeType(node.data?.nodeType || 'note');

    const existing = node.data?.customProps || {};
    setCustomProps(
      Object.entries(existing).map(([key, value]) => ({ key, value }))
    );
  }, [node]);

  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => titleInputRef.current?.focus());
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

  if (!isOpen || !node) return null;

  const handleAddProp = () => {
    setCustomProps((prev) => [...prev, { key: '', value: '' }]);
  };

  const handleRemoveProp = (index) => {
    setCustomProps((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePropChange = (index, field, val) => {
    setCustomProps((prev) =>
      prev.map((p, i) => (i === index ? { ...p, [field]: val } : p))
    );
  };

  const handleSave = () => {
    const propsObj = {};
    for (const { key, value } of customProps) {
      const trimmedKey = key.trim();
      if (trimmedKey) {
        propsObj[trimmedKey] = value;
      }
    }

    onSave({
      ...node.data,
      label: label.trim() || node.data.label,
      nodeType,
      customProps: propsObj,
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
      aria-label="Editar nodo"
    >
      <div className="w-full max-w-md mx-4 rounded-xl border border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[rgb(var(--color-border))] px-6 py-4">
          <h2 className="text-lg font-semibold text-[rgb(var(--color-text))]">
            Editar Nodo
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
            <label htmlFor="node-label" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">
              Nombre
            </label>
            <input
              ref={titleInputRef}
              id="node-label"
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              className="input-field"
              placeholder="Nombre del nodo"
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="node-type" className="block text-sm font-medium text-[rgb(var(--color-text-secondary))] mb-1.5">
              Tipo
            </label>
            <select
              id="node-type"
              value={nodeType}
              onChange={(e) => setNodeType(e.target.value)}
              className="input-field cursor-pointer"
            >
              {NODE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-[rgb(var(--color-text-secondary))]">
                Propiedades Personalizadas
              </span>
              <button
                type="button"
                onClick={handleAddProp}
                className="text-xs font-medium text-cyan-500 hover:text-cyan-400 transition-colors cursor-pointer"
              >
                + Agregar
              </button>
            </div>

            {customProps.length === 0 && (
              <p className="text-xs text-[rgb(var(--color-text-muted))] italic">
                Sin propiedades. Haz clic en "+ Agregar" para crear una.
              </p>
            )}

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {customProps.map((prop, index) => (
                <div key={index} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={prop.key}
                    onChange={(e) => handlePropChange(index, 'key', e.target.value)}
                    placeholder="Clave"
                    className="input-field !py-1.5 !px-2.5 !text-sm flex-1"
                    autoComplete="off"
                  />
                  <input
                    type="text"
                    value={prop.value}
                    onChange={(e) => handlePropChange(index, 'value', e.target.value)}
                    placeholder="Valor"
                    className="input-field !py-1.5 !px-2.5 !text-sm flex-1"
                    autoComplete="off"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveProp(index)}
                    className="shrink-0 p-1 text-[rgb(var(--color-text-muted))] hover:text-red-500 transition-colors cursor-pointer"
                    aria-label="Eliminar propiedad"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
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