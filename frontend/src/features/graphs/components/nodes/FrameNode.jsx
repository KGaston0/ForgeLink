import { NodeResizer } from '@xyflow/react';
import { NODE_TYPE_COLORS } from './NodeConstants';
import NodeResizerStyles from './NodeResizerStyles';
import ConnectionHandles from './ConnectionHandles';

/**
 * Frame node component.
 * Uses absolute-positioned drawer with dynamic resizer expansion,
 * preserving the original visual design.
 */
const FrameNode = ({
  id, // FIX: Recibe el ID
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
  const isDragOver = data.isDragOver === true;
  const hasCustomColor = !!data.customColor;
  const gradientClass =
    NODE_TYPE_COLORS[data.nodeType?.toLowerCase()] || NODE_TYPE_COLORS.default;
  const headerStyle = hasCustomColor ? { backgroundColor: data.customColor } : {};
  const headerClass = hasCustomColor ? '' : `bg-gradient-to-r ${gradientClass}`;

  // Unification styling logic
  const activeColor = selected ? 'border-cyan-500' : 'border-[rgb(var(--color-border))]';
  const drawerBorderStyle = selected ? 'border-solid' : 'border-dashed';
  const activeShadow = selected ? 'shadow-[0_0_20px_rgba(6,182,212,0.15)]' : '';

  // Frame container: always solid border. When expanded, no left border/rounding (drawer covers it).
  const frameContainerClasses = isDragOver
    ? 'border-cyan-400 border-solid bg-cyan-500/20 rounded-xl'
    : `bg-[rgb(var(--color-bg))]/30 ${activeColor} border-solid ${
        isPropsExpanded ? 'border-l-0 rounded-r-xl rounded-l-none' : 'rounded-xl'
      } ${activeShadow}`;

  // FIX: Se cambió border-r-0 por border-r-2 para crear la línea vertical separadora
  const drawerWrapperClasses = `absolute -top-[2px] -bottom-[2px] w-[220px] flex flex-col z-20 transition-all duration-300 ease-in-out ${
    isPropsExpanded
      ? `-left-[2px] -translate-x-full border-y-2 border-l-2 border-r-2 rounded-tl-xl rounded-bl-xl ${activeColor} ${drawerBorderStyle} ${activeShadow}`
      : `-left-[2px] translate-x-0 border-2 border-transparent pointer-events-none`
  }`;

  const drawerHeaderClasses = `custom-drag-handle relative z-30 flex items-center gap-3 px-3 py-2 flex-shrink-0 transition-all duration-300 ${headerClass} ${
    isPropsExpanded
      ? 'rounded-tl-[10px] rounded-tr-none rounded-b-none border-b border-dashed border-[rgb(var(--color-border))] pointer-events-auto'
      : 'rounded-tl-[10px] rounded-br-xl shadow-md pointer-events-auto'
  }`;

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
        minWidth={300}
        minHeight={200}
        isVisible={true}
        handleClassName={`custom-resizer-handle ${isPropsExpanded ? 'is-expanded' : ''}`}
        lineStyle={{ opacity: 0 }}
      />


      <div className={`relative w-full h-full border-2 backdrop-blur-sm transition-all duration-200 overflow-visible z-10 ${frameContainerClasses}`}>
        <div className="absolute inset-0 nodrag cursor-default rounded-xl -z-10 bg-[rgb(var(--color-bg))]/50" />

        {/* FIX: Se pasan los props para que el punto izquierdo viaje con el panel */}
        <ConnectionHandles id={id} isFrame={true} isPropsExpanded={isPropsExpanded} />

        <div className={drawerWrapperClasses}>

          <div className={drawerHeaderClasses} style={headerStyle}>
            <div className="flex flex-col min-w-[80px]">
              <span className="text-[10px] font-bold text-white/80 uppercase tracking-wide m-0 p-0">
                {data.nodeType || 'Frame'}
              </span>
              {renderLabel('text-sm font-bold text-white m-0 p-0', 'Nuevo Marco')}
            </div>
            <ToggleButton />
          </div>

          <div
            id={drawerId}
            className={`custom-drag-handle relative z-10 flex-1 bg-[rgb(var(--color-bg))] rounded-bl-[10px] flex flex-col overflow-hidden transition-opacity duration-300 ease-in-out cursor-grab active:cursor-grabbing pointer-events-auto ${
              isPropsExpanded ? 'opacity-100' : 'opacity-0'
            }`}
            aria-hidden={!isPropsExpanded}
          >
            <div className="w-[220px] p-3 flex flex-col h-full">
              <span className="text-[10px] font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wide mb-2 border-b border-[rgb(var(--color-border))] pb-1">
                Propiedades
              </span>
              {hasCustomProps && (
                <ul className="space-y-1.5 overflow-y-auto mt-1 flex-1 pr-1 nowheel cursor-auto" onPointerDown={(e) => e.stopPropagation()}>
                  {customPropsEntries.map(([key, value]) => (
                    <li key={key} className="flex flex-col text-xs">
                      <span className="font-semibold text-[rgb(var(--color-text-secondary))] truncate">{key}</span>
                      <span className="text-[rgb(var(--color-text))] break-words">{value || '—'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FrameNode;