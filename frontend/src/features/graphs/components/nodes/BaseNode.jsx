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

  // FIX: Instead of local state that is lost on reload,
  // read the expanded state from the hidden custom properties (default: true).
  const isPropsExpanded = data.customProps?._isExpanded !== false;

  const { setNodes } = useReactFlow();
  const updateNodeInternals = useUpdateNodeInternals();
  const nodeId = useId();

  // Force React Flow to recalculate handle coordinates on expand/collapse
  useEffect(() => {
    updateNodeInternals(id);
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
      // FIX: Notify GraphCanvas of unsaved changes
      window.dispatchEvent(new CustomEvent('canvas-unsaved'));
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

  // FIX: Filter out the hidden '_isExpanded' key so it doesn't render in the UI list
  const customPropsEntries = data.customProps
    ? Object.entries(data.customProps).filter(([key]) => key !== '_isExpanded')
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
          const newState = !isPropsExpanded;

          // FIX: Store the expanded state directly in the node data
          setNodes((nds) => nds.map((n) => {
            if (n.id === id) {
              return {
                ...n,
                data: {
                  ...n.data,
                  customProps: {
                    ...n.data.customProps,
                    _isExpanded: newState // Persisted to backend as a hidden property
                  }
                }
              };
            }
            return n;
          }));

          // Notify GraphCanvas to trigger auto-save
          window.dispatchEvent(new CustomEvent('canvas-unsaved'));
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