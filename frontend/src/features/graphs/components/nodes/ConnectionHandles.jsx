import { Handle, Position, useStore } from '@xyflow/react';

const VisibleHandle = ({ position, id, isFrame, isPropsExpanded }) => {
  let style = {};

  // FIX: Mueve el handle al extremo izquierdo del panel de propiedades cuando se expande el Frame
  if (position === Position.Left && isFrame && isPropsExpanded) {
    style = { left: '-224px', transition: 'left 0.3s ease-in-out' };
  }

  return (
    <Handle
      type="source" // En modo 'loose', actúa como origen y destino
      position={position}
      id={id}
      className="!w-[14px] !h-[14px] !bg-[rgb(var(--color-bg))] !border-[2.5px] !border-cyan-500 !rounded-full shadow-sm transition-all duration-150 hover:!scale-125 hover:!bg-cyan-500 z-50 node-handle cursor-crosshair"
      style={style}
    />
  );
};

// Handle secundario: Solo sirve para recibir conexiones y solo es visible cuando se está arrastrando una flecha
const TargetOnlyHandle = ({ position, id, style: extraStyle, isVisible }) => (
  <Handle
    type="target" // ESTRICTAMENTE SOLO DESTINO
    position={position}
    id={id}
    className={`!w-[12px] !h-[12px] !bg-[rgb(var(--color-bg-secondary))] !border-[2px] !border-purple-500 !rounded-full shadow-sm z-40 !cursor-crosshair transition-opacity duration-300 ${
      isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}
    style={extraStyle}
  />
);

const ConnectionHandles = ({ id, isFrame, isPropsExpanded }) => {
  // Hook nativo para saber si el usuario está arrastrando una conexión en este momento
  const connectionNodeId = useStore((state) => state.connectionNodeId);

  // Es visible si hay una conexión en progreso, PERO ocultamos los del nodo del que sale la flecha
  const isConnecting = !!connectionNodeId && connectionNodeId !== id;

  return (
    <>
      {/* Puntos principales (Orígenes y destinos) */}
      <VisibleHandle position={Position.Top} id="top" isFrame={isFrame} isPropsExpanded={isPropsExpanded} />
      <VisibleHandle position={Position.Right} id="right" isFrame={isFrame} isPropsExpanded={isPropsExpanded} />
      <VisibleHandle position={Position.Bottom} id="bottom" isFrame={isFrame} isPropsExpanded={isPropsExpanded} />
      <VisibleHandle position={Position.Left} id="left" isFrame={isFrame} isPropsExpanded={isPropsExpanded} />

      {/* Puntos secundarios (SOLO destinos, aparecen dinámicamente) */}
      <TargetOnlyHandle position={Position.Top} id="top-left" style={{ left: '25%' }} isVisible={isConnecting} />
      <TargetOnlyHandle position={Position.Top} id="top-right" style={{ left: '75%' }} isVisible={isConnecting} />
      <TargetOnlyHandle position={Position.Bottom} id="bottom-left" style={{ left: '25%' }} isVisible={isConnecting} />
      <TargetOnlyHandle position={Position.Bottom} id="bottom-right" style={{ left: '75%' }} isVisible={isConnecting} />
    </>
  );
};

export default ConnectionHandles;