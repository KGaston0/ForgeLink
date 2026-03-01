/** Direction constants matching the backend model */
export const EDGE_DIRECTIONS = {
  FORWARD: 'forward',
  REVERSE: 'reverse',
  BIDIRECTIONAL: 'bidirectional',
  UNDIRECTED: 'undirected',
};

/** Cycle order for right-click direction toggle */
export const DIRECTION_CYCLE = [
  EDGE_DIRECTIONS.FORWARD,
  EDGE_DIRECTIONS.REVERSE,
  EDGE_DIRECTIONS.BIDIRECTIONAL,
  EDGE_DIRECTIONS.UNDIRECTED,
];

/** Human-readable labels */
export const DIRECTION_LABELS = {
  [EDGE_DIRECTIONS.FORWARD]: 'A → B',
  [EDGE_DIRECTIONS.REVERSE]: 'A ← B',
  [EDGE_DIRECTIONS.BIDIRECTIONAL]: 'A ↔ B',
  [EDGE_DIRECTIONS.UNDIRECTED]: 'A — B',
};

