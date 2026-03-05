/**
 * Node types enum matching backend Node.NODE_TYPES
 */
export const NodeType = {
  CHARACTER: 'character',
  LOCATION: 'location',
  EVENT: 'event',
  ITEM: 'item',
  CONCEPT: 'concept',
  NOTE: 'note',
};

/**
 * Human-readable labels for node types
 */
export const NodeTypeLabels = {
  [NodeType.CHARACTER]: 'Character',
  [NodeType.LOCATION]: 'Location',
  [NodeType.EVENT]: 'Event',
  [NodeType.ITEM]: 'Item',
  [NodeType.CONCEPT]: 'Concept',
  [NodeType.NOTE]: 'Note',
};

/**
 * Get all node types as an array
 */
export const getNodeTypes = () => Object.values(NodeType);

/**
 * Get label for a node type
 */
export const getNodeTypeLabel = (type) => NodeTypeLabels[type] || type;
