import { Handle, Position, useStore } from '@xyflow/react';

const VisibleHandle = ({ position, id, isFrame, isPropsExpanded }) => {
  let style = {};

  // FIX: Move handle to the far left of the properties panel when frame is expanded
  if (position === Position.Left && isFrame && isPropsExpanded) {
    style = { left: '-224px', transition: 'left 0.3s ease-in-out' };
  }

  return (
    <Handle
      type="source" // In 'loose' mode, acts as both source and target
      position={position}
      id={id}
      className="!w-[14px] !h-[14px] !bg-[rgb(var(--color-bg))] !border-[2.5px] !border-cyan-500 !rounded-full shadow-sm transition-all duration-150 hover:!scale-125 hover:!bg-cyan-500 z-50 node-handle cursor-crosshair"
      style={style}
    />
  );
};

// Secondary handle: only receives connections, visible only while dragging an edge
const TargetOnlyHandle = ({ position, id, style: extraStyle, isVisible }) => (
  <Handle
    type="target" // STRICTLY TARGET ONLY
    position={position}
    id={id}
    className={`!w-[12px] !h-[12px] !bg-[rgb(var(--color-bg-secondary))] !border-[2px] !border-purple-500 !rounded-full shadow-sm z-40 !cursor-crosshair transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    style={extraStyle}
  />
);

const ConnectionHandles = ({ id, isFrame, isPropsExpanded }) => {
  // Native hook to detect if the user is currently dragging a connection
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  // Visible when a connection is in progress, BUT hidden on the node the edge originates from
  const isConnecting = !!connectionNodeId && connectionNodeId !== id;

  return (
    <>
      {/* Primary handles (source and target) */}
      <VisibleHandle position={Position.Top} id="top" isFrame={isFrame} isPropsExpanded={isPropsExpanded} />
      <VisibleHandle position={Position.Right} id="right" isFrame={isFrame} isPropsExpanded={isPropsExpanded} />
      <VisibleHandle position={Position.Bottom} id="bottom" isFrame={isFrame} isPropsExpanded={isPropsExpanded} />
      <VisibleHandle position={Position.Left} id="left" isFrame={isFrame} isPropsExpanded={isPropsExpanded} />

      {/* Secondary handles (target-only, appear dynamically while connecting) */}
      <TargetOnlyHandle position={Position.Top} id="top-left" style={{ left: '25%' }} isVisible={isConnecting} />
      <TargetOnlyHandle position={Position.Top} id="top-right" style={{ left: '75%' }} isVisible={isConnecting} />
      <TargetOnlyHandle position={Position.Bottom} id="bottom-left" style={{ left: '25%' }} isVisible={isConnecting} />
      <TargetOnlyHandle position={Position.Bottom} id="bottom-right" style={{ left: '75%' }} isVisible={isConnecting} />
    </>
  );
};

export default ConnectionHandles;