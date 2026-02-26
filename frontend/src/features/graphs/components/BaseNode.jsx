import { memo } from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

const NODE_TYPE_COLORS = {
  character: 'from-purple-500 to-pink-500',
  location: 'from-cyan-500 to-blue-500',
  event: 'from-orange-500 to-red-500',
  item: 'from-green-500 to-emerald-500',
  concept: 'from-yellow-500 to-amber-500',
  note: 'from-gray-500 to-slate-500',
  frame: 'from-slate-600 to-zinc-700',
  default: 'from-blue-500 to-indigo-500',
};

const RESIZER_HANDLE_CLASS = '!w-3 !h-3 !bg-cyan-400 !border-none !rounded-sm hover:!scale-150 transition-transform cursor-pointer';

const BaseNode = ({ data, selected }) => {
  const gradientClass =
    NODE_TYPE_COLORS[data.nodeType?.toLowerCase()] || NODE_TYPE_COLORS.default;

  // --- FRAME NODE RENDERING ---
  if (data.isFrame) {
    const isDragOver = data.isDragOver === true;

    const frameClasses = isDragOver
      ? 'border-cyan-400 border-solid bg-cyan-500/20'
      : selected
        ? 'border-cyan-500 border-dashed bg-[rgb(var(--color-bg))]/30'
        : 'border-[rgb(var(--color-border))] border-dashed bg-[rgb(var(--color-bg))]/30';

    return (
      <>
        <NodeResizer
          minWidth={300}
          minHeight={200}
          isVisible={selected}
          handleClassName={RESIZER_HANDLE_CLASS}
        />

        <div
          className={`relative w-full h-full border-2 rounded-xl backdrop-blur-sm transition-all duration-150 overflow-visible ${frameClasses}`}
        >
          {/* Locked background — nodrag allows drag-selection inside the frame */}
          <div className="absolute inset-0 nodrag cursor-default rounded-xl" />

          <Handle type="source" position={Position.Top} id="top" className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-[rgb(var(--color-bg))]" />
          <Handle type="source" position={Position.Right} id="right" className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-[rgb(var(--color-bg))]" />
          <Handle type="source" position={Position.Bottom} id="bottom" className="!w-3 !h-3 !bg-purple-500 !border-2 !border-[rgb(var(--color-bg))]" />
          <Handle type="source" position={Position.Left} id="left" className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-[rgb(var(--color-bg))]" />

          {/* Floating info card — acts as drag handle for the frame */}
          <div className="custom-drag-handle absolute -right-[180px] top-0 w-[170px] rounded-xl overflow-hidden border-2 border-[rgb(var(--color-border))] bg-[rgb(var(--color-bg))] shadow-md cursor-grab active:cursor-grabbing">
            <div className={`bg-gradient-to-r ${gradientClass} px-3 py-1.5`}>
              <span className="text-xs font-semibold text-white uppercase tracking-wide">
                {data.nodeType || 'Frame'}
              </span>
            </div>
            <div className="px-3 py-2">
              <h3 className="text-xs font-bold text-[rgb(var(--color-text))] break-words">
                {data.label || 'Nuevo Marco'}
              </h3>
            </div>
          </div>
        </div>
      </>
    );
  }

  // --- NORMAL NODE RENDERING ---
  return (
    <>
      <NodeResizer
        minWidth={160}
        minHeight={80}
        isVisible={selected}
        handleClassName={RESIZER_HANDLE_CLASS}
      />

      <div
        className={`h-full w-full flex flex-col rounded-xl overflow-hidden border-2 bg-[rgb(var(--color-bg))] min-w-[160px] ${selected ? 'border-cyan-500 shadow-lg shadow-cyan-500/20' : 'border-[rgb(var(--color-border))] shadow-md'} transition-[border-color,box-shadow] duration-200`}
      >
        <Handle type="source" position={Position.Top} id="top" className="!w-3 !h-3 !bg-cyan-500 !border-2 !border-[rgb(var(--color-bg))]" />

        <div className={`bg-gradient-to-r ${gradientClass} px-4 py-2`}>
          <span className="text-xs font-semibold text-white uppercase tracking-wide">
            {data.nodeType || 'Node'}
          </span>
        </div>

        <div className="flex-1 px-4 py-3">
          <h3 className="text-sm font-bold text-[rgb(var(--color-text))] mb-1 break-words">
            {data.label || 'Nuevo Nodo'}
          </h3>
        </div>

        <Handle type="source" position={Position.Bottom} id="bottom" className="!w-3 !h-3 !bg-purple-500 !border-2 !border-[rgb(var(--color-bg))]" />
      </div>
    </>
  );
};

export default memo(BaseNode);