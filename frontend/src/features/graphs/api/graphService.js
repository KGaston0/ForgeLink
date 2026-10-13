import apiClient from '../../../services/api/apiClient';

// ============================================================================
// GRAPH & CANVAS OPERATIONS
// ============================================================================

/**
 * Fetch full canvas data (graph info, nodes, connections) for a given graph.
 * @param {string} graphUuid - The graph UUID for the API URL
 * @param {number|null} folderId - Optional ID of the GraphNode to use as a folder root
 * @param {number} depth - Optional depth of nesting to fetch (default: 3)
 */
export async function fetchCanvasData(graphUuid, folderId = null, depth = 3) {
  const params = { depth };
  if (folderId) params.folder_id = folderId;
  const response = await apiClient.get(`/graphs/${graphUuid}/canvas/`, { params });
  return response.data;
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
 * Bulk save the entire canvas state (nodes + connections) in a single PUT request.
 * This replaces the N+1 pattern of individual PATCH requests.
 *
 * @param {string} graphUuid - The graph UUID for the API URL
 * @param {number} projectId - The project owning the graph (internal FK id)
 * @param {{ nodes: Array, connections: Array }} payload - Full canvas state
 * @returns {Promise<{ nodes: { created: Array, updated_count: number }, connections: { created: Array, updated_count: number } }>}
 */
export async function saveCanvasBulk(graphUuid, projectId, payload) {
  const response = await apiClient.put(
    `/graphs/${graphUuid}/canvas/bulk/`,
    payload,
  );
  return response.data;
}

/**
 * Remove a node from the graph. The backend also removes the placements nested inside it,
 * this graph's connections that touch them, and any Node left without a placement.
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

// ============================================================================
// BLUEPRINT OPERATIONS (NEW)
// ============================================================================

/**
 * Fetch all blueprints for the authenticated user.
 * 
 * @param {Object} options - Query options
 * @param {string} options.search - Search by name or description
 * @param {string} options.category - Filter by category
 * @param {boolean} options.isFrame - Filter by is_frame
 * @param {boolean} options.isPublished - Filter by is_published
 * @param {number} options.limit - Pagination limit (default: 100)
 * @param {number} options.offset - Pagination offset (default: 0)
 * @returns {Promise<{ count: number, results: Array }>}
 */
export async function fetchBlueprints(options = {}) {
  const params = new URLSearchParams();

  if (options.search) params.append('search', options.search);
  if (options.category) params.append('category', options.category);
  if (options.isFrame !== undefined) params.append('is_frame', options.isFrame);
  if (options.isPublished !== undefined) params.append('is_published', options.isPublished);
  if (options.limit) params.append('limit', options.limit);
  if (options.offset) params.append('offset', options.offset);

  const response = await apiClient.get('/blueprints/', { params });
  return response.data;
}

/**
 * Fetch a single blueprint by ID.
 * 
 * @param {number} blueprintId - The blueprint ID
 * @returns {Promise<Object>} Blueprint object
 */
export async function fetchBlueprint(blueprintId) {
  const response = await apiClient.get(`/blueprints/${blueprintId}/`);
  return response.data;
}

/**
 * Create a new blueprint.
 * 
 * @param {Object} data - Blueprint data
 * @param {string} data.name - Custom semantic type name (e.g., "Car", "Spell")
 * @param {string} data.description - Description (optional)
 * @param {string} data.category - Category (free text, e.g., "Vehicles")
 * @param {boolean} data.isFrame - Whether this renders as a container frame
 * @param {string} data.color - Hex color code
 * @param {Object} data.schema - Property rules (JSONField)
 * @param {boolean} data.isPublished - Whether published to marketplace
 * @returns {Promise<Object>} Created blueprint
 */
export async function createBlueprint(data) {
  const response = await apiClient.post('/blueprints/', {
    name: data.name,
    description: data.description || '',
    category: data.category || 'General',
    is_frame: data.isFrame || false,
    color: data.color || '#3B82F6',
    schema: data.schema || {},
    is_published: data.isPublished || false,
  });
  return response.data;
}

/**
 * Update an existing blueprint.
 * 
 * @param {number} blueprintId - The blueprint ID
 * @param {Object} data - Updated blueprint data (partial)
 * @returns {Promise<Object>} Updated blueprint
 */
export async function updateBlueprint(blueprintId, data) {
  const payload = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.category !== undefined) payload.category = data.category;
  if (data.isFrame !== undefined) payload.is_frame = data.isFrame;
  if (data.color !== undefined) payload.color = data.color;
  if (data.schema !== undefined) payload.schema = data.schema;
  if (data.isPublished !== undefined) payload.is_published = data.isPublished;

  const response = await apiClient.patch(`/blueprints/${blueprintId}/`, payload);
  return response.data;
}

/**
 * Delete a blueprint.
 * 
 * @param {number} blueprintId - The blueprint ID
 */
export async function deleteBlueprint(blueprintId) {
  await apiClient.delete(`/blueprints/${blueprintId}/`);
}

/**
 * Fetch all blueprint lists for the authenticated user.
 * 
 * @param {Object} options - Query options
 * @param {string} options.search - Search by name or description
 * @param {number} options.limit - Pagination limit
 * @param {number} options.offset - Pagination offset
 * @returns {Promise<{ count: number, results: Array }>}
 */
export async function fetchBlueprintLists(options = {}) {
  const params = new URLSearchParams();

  if (options.search) params.append('search', options.search);
  if (options.limit) params.append('limit', options.limit);
  if (options.offset) params.append('offset', options.offset);

  const response = await apiClient.get('/blueprint-lists/', { params });
  return response.data;
}

/**
 * Fetch a single blueprint list by ID.
 * 
 * @param {number} listId - The blueprint list ID
 * @returns {Promise<Object>} Blueprint list with nested blueprints
 */
export async function fetchBlueprintList(listId) {
  const response = await apiClient.get(`/blueprint-lists/${listId}/`);
  return response.data;
}

/**
 * Create a new blueprint list.
 * 
 * @param {Object} data - List data
 * @param {string} data.name - List name
 * @param {string} data.description - List description (optional)
 * @param {Array<number>} data.blueprintIds - IDs of blueprints to add
 * @returns {Promise<Object>} Created blueprint list
 */
export async function createBlueprintList(data) {
  const response = await apiClient.post('/blueprint-lists/', {
    name: data.name,
    description: data.description || '',
    blueprint_ids: data.blueprintIds || [],
  });
  return response.data;
}

/**
 * Update an existing blueprint list.
 * 
 * @param {number} listId - The blueprint list ID
 * @param {Object} data - Updated list data (partial)
 * @returns {Promise<Object>} Updated blueprint list
 */
export async function updateBlueprintList(listId, data) {
  const payload = {};
  if (data.name !== undefined) payload.name = data.name;
  if (data.description !== undefined) payload.description = data.description;
  if (data.blueprintIds !== undefined) payload.blueprint_ids = data.blueprintIds;

  const response = await apiClient.patch(`/blueprint-lists/${listId}/`, payload);
  return response.data;
}

/**
 * Delete a blueprint list.
 * 
 * @param {number} listId - The blueprint list ID
 */
export async function deleteBlueprintList(listId) {
  await apiClient.delete(`/blueprint-lists/${listId}/`);
}

