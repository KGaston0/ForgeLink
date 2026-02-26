import apiClient from '../../../services/api/apiClient';

/**
 * Fetch full canvas data (graph info, nodes, connections) for a given graph.
 */
export async function fetchCanvasData(graphId) {
  const response = await apiClient.get(`/graphs/${graphId}/canvas/`);
  return response.data;
}

/**
 * Create a new Node in the project, then link it to the graph as a GraphNode.
 */
export async function createGraphNode(graphId, projectId, { nodeType, label, positionX, positionY, isFrame = false, width = 400, height = 300, parentNode = null }) {
  // 1. Create the Node entity
  const nodeResponse = await apiClient.post('/nodes/', {
    project: projectId,
    title: label,
    node_type: nodeType,
  });

  const nodeId = nodeResponse.data.id;

  // 2. Create GraphNode (membership + layout + frame data)
  const graphNodeResponse = await apiClient.post('/graph-nodes/', {
    graph: graphId,
    node: nodeId,
    position_x: positionX,
    position_y: positionY,
    is_frame: isFrame,
    width: Math.round(width),
    height: Math.round(height),
    parent_node: parentNode,
  });

  return {
    node: nodeResponse.data,
    graphNode: graphNodeResponse.data,
  };
}

/**
 * Update an existing GraphNode (position, frame data, parent).
 */
export async function updateGraphNode(graphNodeId, { positionX, positionY, isFrame = false, width = 400, height = 300, parentNode = null }) {
  const response = await apiClient.patch(`/graph-nodes/${graphNodeId}/`, {
    position_x: positionX,
    position_y: positionY,
    is_frame: isFrame,
    width: Math.round(width),
    height: Math.round(height),
    parent_node: parentNode,
  });
  return response.data;
}

/**
 * Save all canvas nodes: create new nodes and update positions of existing ones.
 * Returns results with created/updated/errors arrays.
 * Each created entry includes { tempId, node, graphNode } for ID mapping.
 */
export async function saveCanvasNodes(graphId, projectId, nodes) {
  const results = { created: [], updated: [], errors: [] };

  // First pass: save all nodes (parent_node resolved in second pass)
  for (const node of nodes) {
    try {
      if (node.graphNodeId) {
        // Existing node: update position + frame data
        const updated = await updateGraphNode(node.graphNodeId, {
          positionX: Math.round(node.positionX),
          positionY: Math.round(node.positionY),
          isFrame: node.isFrame || false,
          width: node.width || 400,
          height: node.height || 300,
          parentNode: null,
        });
        results.updated.push({ tempId: node.tempId, graphNode: updated });
      } else {
        // New node: create Node + GraphNode
        const created = await createGraphNode(graphId, projectId, {
          nodeType: node.nodeType,
          label: node.label,
          positionX: Math.round(node.positionX),
          positionY: Math.round(node.positionY),
          isFrame: node.isFrame || false,
          width: node.width || 400,
          height: node.height || 300,
          parentNode: null,
        });
        results.created.push({ tempId: node.tempId, ...created });
      }
    } catch (error) {
      results.errors.push({
        node,
        message: error.response?.data || error.message,
      });
    }
  }

  // Second pass: resolve parent_node references (frontendId → graphNodeId)
  const frontendToGraphNodeId = {};
  for (const created of results.created) {
    frontendToGraphNodeId[created.tempId] = created.graphNode.id;
  }
  for (const updated of results.updated) {
    frontendToGraphNodeId[updated.tempId] = updated.graphNode.id;
  }

  for (const node of nodes) {
    if (!node.parentNode) continue;

    const graphNodeId = node.graphNodeId || frontendToGraphNodeId[node.tempId];
    const parentGraphNodeId = frontendToGraphNodeId[node.parentNode];

    if (graphNodeId && parentGraphNodeId) {
      try {
        await apiClient.patch(`/graph-nodes/${graphNodeId}/`, {
          parent_node: parentGraphNodeId,
        });
      } catch (error) {
        console.warn('[saveCanvasNodes] Failed to set parent_node:', error.response?.data || error.message);
      }
    }
  }

  return results;
}

/**
 * Get or create a default ConnectionType for the given project.
 * Used when saving edges that don't have an explicit connection type.
 */
export async function getOrCreateDefaultConnectionType(projectId) {
  // Try to find an existing "default" connection type for this project
  const response = await apiClient.get('/connection-types/', {
    params: { project: projectId },
  });

  const existing = response.data.results ?? response.data;

  const defaultType = existing.find(
    (ct) => ct.name.toLowerCase() === 'default'
  );

  if (defaultType) {
    return defaultType;
  }

  // Create a default connection type for the project
  const createResponse = await apiClient.post('/connection-types/', {
    project: projectId,
    name: 'Default',
    description: 'Default connection type (auto-created)',
    color: '#6B7280',
  });

  return createResponse.data;
}

/**
 * Save a single connection to the backend.
 */
export async function createConnection({ graphId, sourceNodeId, targetNodeId, connectionTypeId, label = '' }) {
  const response = await apiClient.post('/connections/', {
    graph: graphId,
    source_node: sourceNodeId,
    target_node: targetNodeId,
    connection_type: connectionTypeId,
    label,
  });
  return response.data;
}

/**
 * Save multiple connections to the backend.
 * Returns results with created/errors arrays.
 */
export async function saveCanvasConnections(graphId, connectionTypeId, connectionsPayload) {
  const results = { created: [], errors: [] };

  for (const conn of connectionsPayload) {
    try {
      const created = await createConnection({
        graphId,
        sourceNodeId: conn.sourceNodeId,
        targetNodeId: conn.targetNodeId,
        connectionTypeId,
        label: conn.label || '',
      });
      results.created.push(created);
    } catch (error) {
      results.errors.push({
        connection: conn,
        message: error.response?.data || error.message,
      });
    }
  }

  return results;
}

// Keep backward compatibility alias
export const saveCanvasState = saveCanvasNodes;

/**
 * Delete a GraphNode (and its associated Node) from the backend.
 */
export async function deleteGraphNode(graphNodeId) {
  await apiClient.delete(`/graph-nodes/${graphNodeId}/`);
}

/**
 * Delete a connection from the backend.
 */
export async function deleteConnection(connectionId) {
  await apiClient.delete(`/connections/${connectionId}/`);
}

