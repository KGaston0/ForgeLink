import { NodeResizer } from '@xyflow/react';
import { NODE_TYPE_COLORS } from './NodeConstants';
import NodeResizerStyles from './NodeResizerStyles';
import ConnectionHandles from './ConnectionHandles';

/**
 * Standard (non-frame) node component.
 * Uses an inner container with overflow-hidden and rounded corners
 * to prevent the colored header from clipping outside the border.
 */
const StandardNode = ({
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
}) => {
  const hasCustomColor = !!data.customColor;
  const gradientClass =
    NODE_TYPE_COLORS[data.nodeType?.toLowerCase()] || NODE_TYPE_COLORS.default;
  const headerStyle = hasCustomColor ? { backgroundColor: data.customColor } : {};
  const headerClass = hasCustomColor ? '' : `bg-gradient-to-r ${gradientClass}`;

  const nodeColor = selected ? 'border-cyan-500' : 'border-[rgb(var(--color-border))]';
  const nodeShadow = selected ? 'shadow-[0_0_15px_rgba(6,182,212,0.25)]' : 'shadow-md';

  const renderLabel = (textClass, fallback) =>
    isEditing ? (
      <input
        autoFocus
        type="text"
        value={editLabel}
        onChange={(e) => setEditLabel(e.target.value)}
        onBlur={commitLabel}
        onKeyDown={handleKeyDown}
        className={`nodrag nopan ${textClass} bg-transparent border-b border-cyan-500 outline-none w-full p-0 m-0`}
        autoComplete="off"
        aria-label="Edit node label"
      />
    ) : (
      <h3
        onDoubleClick={startEditing}
        className={`${textClass} cursor-text break-words`}
      >
        {data.label || fallback}
      </h3>
    );

  return (
    <>
      <NodeResizerStyles />

      <NodeResizer
        minWidth={160}
        minHeight={80}
        isVisible={true}
        handleClassName="custom-resizer-handle"
        lineStyle={{ opacity: 0 }}
      />


      <div className={`relative h-full w-full rounded-xl border-2 bg-[rgb(var(--color-bg))] min-w-[160px] transition-all duration-200 z-10 flex flex-col ${nodeColor} ${nodeShadow}`}>

        <ConnectionHandles id={id} isFrame={false} isPropsExpanded={isPropsExpanded} />

        <div className="flex-1 flex flex-col rounded-[10px] overflow-hidden">
          <div className={`custom-drag-handle flex items-center justify-between px-4 py-2 cursor-grab active:cursor-grabbing flex-shrink-0 ${headerClass}`} style={headerStyle}>
            <span className="text-xs font-semibold text-white uppercase tracking-wide">
              {data.nodeType || 'Node'}
            </span>
            <ToggleButton />
          </div>

          <div className="flex-1 px-4 py-3 bg-[rgb(var(--color-bg))] flex flex-col overflow-y-auto">
            {renderLabel('text-sm font-bold text-[rgb(var(--color-text))]', 'New Node')}

            {isPropsExpanded && hasCustomProps && (
              <div className="mt-3 pt-2 border-t border-[rgb(var(--color-border))] border-dashed flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200 nowheel">
                {customPropsEntries.map(([key, value]) => (
                  <div key={key} className="flex justify-between items-center text-xs">
                    <span className="text-[rgb(var(--color-text-secondary))] font-medium truncate pr-2">{key}:</span>
                    <span className="text-[rgb(var(--color-text))] truncate">{value || '—'}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default StandardNode;