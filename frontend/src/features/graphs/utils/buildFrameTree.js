/**
 * Turns the flat `hierarchy` list returned by GET /graphs/{uuid}/canvas/ into the
 * nested tree rendered by the sidebar explorer.
 *
 * @param {Array<{id: number, name: string, parent_id: number|null, is_frame: boolean}>} hierarchy
 * @returns {Array<{id: number, name: string, is_frame: boolean, children: Array}>} root nodes
 */
export function buildFrameTree(hierarchy = []) {
  const byId = new Map();
  for (const item of hierarchy) {
    byId.set(item.id, { id: item.id, name: item.name, is_frame: item.is_frame, children: [] });
  }

  const roots = [];
  for (const item of hierarchy) {
    const node = byId.get(item.id);
    const parent = item.parent_id == null ? null : byId.get(item.parent_id);
    // A node whose parent is missing is shown at the top level instead of being dropped
    (parent ? parent.children : roots).push(node);
  }
  return roots;
}
