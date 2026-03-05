import { memo } from 'react';
import { getSmoothStepPath, EdgeLabelRenderer, BaseEdge } from '@xyflow/react';
import { EDGE_DIRECTIONS, DIRECTION_LABELS } from './edgeConstants';

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  selected,
  style,
}) => {
  const direction = data?.direction || EDGE_DIRECTIONS.FORWARD;
  const edgeColor = selected ? 'rgb(6, 182, 212)' : 'rgb(100, 116, 139)'; // cyan-500 : slate-500

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    borderRadius: 16,
  });

  const displayLabel = data?.label || '';
  const showStart = direction === EDGE_DIRECTIONS.REVERSE || direction === EDGE_DIRECTIONS.BIDIRECTIONAL;
  const showEnd = direction === EDGE_DIRECTIONS.FORWARD || direction === EDGE_DIRECTIONS.BIDIRECTIONAL;

  const markerStartId = `arrow-start-${id}`;
  const markerEndId = `arrow-end-${id}`;

  return (
    <>
      <defs>
        {showEnd && (
          <marker id={markerEndId} viewBox="0 0 12 12" refX="17" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 12 6 L 0 12 z" fill={edgeColor} />
          </marker>
        )}
        {showStart && (
          <marker id={markerStartId} viewBox="0 0 12 12" refX="17" refY="6" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
            <path d="M 0 0 L 12 6 L 0 12 z" fill={edgeColor} />
          </marker>
        )}
      </defs>

      <BaseEdge
        id={id}
        path={edgePath}
        interactionWidth={20}
        style={{
          ...style,
          stroke: edgeColor,
          strokeWidth: selected ? 2.5 : 1.5,
          transition: 'stroke 0.2s ease, stroke-width 0.2s ease',
        }}
        markerEnd={showEnd ? `url(#${markerEndId})` : undefined}
        markerStart={showStart ? `url(#${markerStartId})` : undefined}
      />

      <EdgeLabelRenderer>
        <div
          className="nodrag nopan absolute pointer-events-none flex flex-col items-center justify-center gap-1.5"
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            zIndex: selected ? 100 : 10,
          }}
        >
          {displayLabel && (
            //
            <span className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider rounded-[6px] bg-[rgb(var(--color-bg))]/95 text-[rgb(var(--color-text))] border-[1.5px] border-[rgb(var(--color-border))] shadow-md backdrop-blur-md">
              {displayLabel}
            </span>
          )}

          {selected && (
            <div className="text-[10px] px-2 py-0.5 rounded-full bg-[rgb(var(--color-bg-secondary))] border border-cyan-500/30 text-cyan-400 font-semibold shadow-sm tracking-wide">
              {DIRECTION_LABELS[direction]}
            </div>
          )}
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default memo(CustomEdge);