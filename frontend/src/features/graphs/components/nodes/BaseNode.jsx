import { memo, useState, useCallback, useId, useEffect } from 'react';
import { useReactFlow, useUpdateNodeInternals } from '@xyflow/react';
import StandardNode from './StandardNode';
import FrameNode from './FrameNode';

/**
 * Wrapper component that manages shared editing state
 * and delegates rendering to StandardNode or FrameNode.
 */
const BaseNode = ({ id, data, selected }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editLabel, setEditLabel] = useState(data.label || '');
  const [isPropsExpanded, setIsPropsExpanded] = useState(true);

  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals(); // <-- 1. Importar el actualizador interno
  const nodeId = useId();

  // FIX: Forzar a React Flow a recalcular las coordenadas del Handle al expandir/colapsar
  useEffect(() => {
    // 1. Actualizar de inmediato al hacer click
    updateNodeInternals(id);

    // 2. Volver a actualizar cuando la animación CSS (300ms) termine para tener precisión milimétrica
    const timeoutId = setTimeout(() => {
      updateNodeInternals(id);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [isPropsExpanded, id, updateNodeInternals]);

  const commitLabel = useCallback(() => {
    const trimmed = editLabel.trim();
    if (trimmed && trimmed !== data.label) {
      setNodes((nds) =>
        nds.map((n) =>
          n.id === id ? { ...n, data: { ...n.data, label: trimmed } } : n
        )
      );
    } else {
      setEditLabel(data.label || '');
    }
    setIsEditing(false);
  }, [id, editLabel, data.label, setNodes]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        commitLabel();
      }
      if (e.key === 'Escape') {
        setEditLabel(data.label || '');
        setIsEditing(false);
      }
    },
    [commitLabel, data.label]
  );

  const startEditing = useCallback(() => {
    setEditLabel(data.label || '');
    setIsEditing(true);
  }, [data.label]);

  const customPropsEntries = data.customProps
    ? Object.entries(data.customProps)
    : [];
  const hasCustomProps = customPropsEntries.length > 0;
  const drawerId = `props-drawer-${nodeId}`;

  /** Toggle button for expanding / collapsing properties */
  const ToggleButton = () => {
    return (
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setIsPropsExpanded((prev) => !prev);
        }}
        className="nodrag ml-auto flex items-center justify-center w-6 h-6 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
        aria-expanded={isPropsExpanded}
        aria-controls={drawerId}
        aria-label={
          isPropsExpanded ? 'Collapse properties' : 'Expand properties'
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-300 ${
            isPropsExpanded ? 'rotate-180' : 'rotate-0'
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    );
  };

  const sharedProps = {
    id,
    selected,
    data,
    isEditing,
    isPropsExpanded,
    editLabel,
    setEditLabel,
    commitLabel,
    handleKeyDown,
    startEditing,
    hasCustomProps,
    customPropsEntries,
    drawerId,
    ToggleButton,
  };

  return data.isFrame ? (
    <FrameNode {...sharedProps} />
  ) : (
    <StandardNode {...sharedProps} />
  );
};

export default memo(BaseNode);