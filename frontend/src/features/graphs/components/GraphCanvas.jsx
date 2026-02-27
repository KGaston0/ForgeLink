import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import BaseNode from './BaseNode';
import NodeEditorModal from './NodeEditorModal';
import Toolbar from './Toolbar';
import { fetchCanvasData, saveCanvasNodes, getOrCreateDefaultConnectionType, saveCanvasConnections, deleteGraphNode, deleteConnection } from '../api/graphService';

const nodeTypes = {
  custom: BaseNode,
};

/**
 * Sort nodes so frames always come first.
 * React Flow requires parent nodes to appear before their children.
 */
function sortNodes(nodes) {
  return [...nodes].sort((a, b) => {
    if (a.data?.isFrame && !b.data?.isFrame) return -1;
    if (!a.data?.isFrame && b.data?.isFrame) return 1;
    return 0;
  });
}

function GraphCanvasInner({ graphId }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [projectId, setProjectId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const contextMenuRef = useRef(null);
  const { getIntersectingNodes } = useReactFlow();
  const dragOverFrameIdRef = useRef(null);

  // Load canvas data from backend on mount
  useEffect(() => {
    if (!graphId) return;

    fetchCanvasData(graphId)
      .then((data) => {
        setProjectId(data.graph.project);

        // Build a map: node_id → graphNode_id for edge mapping
        const nodeToGraphNode = {};
        const loadedNodes = data.nodes.map((gn) => {
          nodeToGraphNode[gn.node] = gn.id;

          const isFrame = gn.is_frame || false;

          const reactFlowNode = {
            id: `gn-${gn.id}`,
            type: 'custom',
            position: { x: gn.position_x, y: gn.position_y },
            data: {
              label: gn.node_title,
              nodeType: gn.node_type,
              graphNodeId: gn.id,
              nodeId: gn.node,
              isFrame,
              parentNode: gn.parent_node ? `gn-${gn.parent_node}` : null,
              width: gn.width || 400,
              height: gn.height || 300,
              customProps: gn.node_custom_properties || {},
            },
          };

          // Frame-specific React Flow properties
          if (isFrame) {
            reactFlowNode.style = { width: gn.width || 400, height: gn.height || 300 };
            reactFlowNode.dragHandle = '.custom-drag-handle';
          }

          // Nesting: set parentId if this node belongs to a frame
          if (gn.parent_node) {
            reactFlowNode.parentId = `gn-${gn.parent_node}`;
            reactFlowNode.extent = 'parent';
          }

          return reactFlowNode;
        });

        // Sort: frames first so React Flow registers parents before children
        setNodes(sortNodes(loadedNodes));

        const loadedEdges = data.connections
          .filter((conn) => nodeToGraphNode[conn.source_node] && nodeToGraphNode[conn.target_node])
          .map((conn) => ({
            id: `conn-${conn.id}`,
            source: `gn-${nodeToGraphNode[conn.source_node]}`,
            target: `gn-${nodeToGraphNode[conn.target_node]}`,
            type: 'smoothstep',
            animated: true,
          }));
        setEdges(loadedEdges);
      })
      .catch((err) => {
        console.error('Error loading canvas:', err);
      });
  }, [graphId, setNodes, setEdges]);

  const onConnect = useCallback(
    (connection) => {
      setEdges((eds) =>
        addEdge({ ...connection, type: 'smoothstep', animated: true }, eds)
      );
    },
    [setEdges]
  );

  const createNode = useCallback(
    (nodeType) => {
      const newNodeId = `temp-${Date.now()}`;
      const newNode = {
        id: newNodeId,
        type: 'custom',
        position: { x: 100, y: 100 },
        data: {
          label: `Nuevo ${nodeType}`,
          nodeType: nodeType,
          graphNodeId: null,
          parentNode: null,
          isFrame: false,
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const createFrame = useCallback(() => {
    const newFrameId = `temp-${Date.now()}`;
    const newFrame = {
      id: newFrameId,
      type: 'custom',
      position: { x: 150, y: 150 },
      dragHandle: '.custom-drag-handle',
      style: { width: 400, height: 300 },
      data: {
        label: 'Nuevo Marco',
        nodeType: 'frame',
        graphNodeId: null,
        parentNode: null,
        isFrame: true,
        width: 400,
        height: 300,
      },
    };

    setNodes((nds) => nds.concat(newFrame));
  }, [setNodes]);

  const toggleFrameMode = useCallback(
    (nodeId) => {
      setNodes((currentNodes) =>
        currentNodes.map((node) => {
          if (node.id !== nodeId) return node;

          const isCurrentlyFrame = node.data.isFrame === true;
          const frameWidth = node.data.width || 400;
          const frameHeight = node.data.height || 300;

          return {
            ...node,
            dragHandle: !isCurrentlyFrame ? '.custom-drag-handle' : undefined,
            style: !isCurrentlyFrame
              ? { width: frameWidth, height: frameHeight }
              : undefined,
            data: {
              ...node.data,
              isFrame: !isCurrentlyFrame,
              width: !isCurrentlyFrame ? frameWidth : node.data.width,
              height: !isCurrentlyFrame ? frameHeight : node.data.height,
            },
          };
        })
      );
      setContextMenu(null);
    },
    [setNodes]
  );

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      nodeId: node.id,
      node,
      isFrame: node.data.isFrame === true,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

  // Close context menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
        setContextMenu(null);
      }
    };

    if (contextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);


  const handleModalSave = useCallback(
    (updatedData) => {
      if (!editingNode) return;
      setNodes((nds) =>
        nds.map((n) =>
          n.id === editingNode.id
            ? { ...n, data: { ...n.data, ...updatedData } }
            : n
        )
      );
      setEditingNode(null);
    },
    [editingNode, setNodes]
  );

  const onNodeDragStart = useCallback(
    (_event, draggedNode) => {
      if (draggedNode.data?.isFrame || !draggedNode.parentId) return;
      // Remove extent temporarily so the node can be pulled outside
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== draggedNode.id) return n;
          const freed = { ...n };
          delete freed.extent;
          return freed;
        })
      );
    },
    [setNodes]
  );

  const onNodeDrag = useCallback(
    (_event, draggedNode) => {
      if (draggedNode.data?.isFrame) return;

      const intersections = getIntersectingNodes(draggedNode).filter(
        (n) => n.data?.isFrame === true
      );
      const hoveredFrameId = intersections[0]?.id || null;

      // Only update nodes if the hovered frame changed
      if (hoveredFrameId === dragOverFrameIdRef.current) return;
      dragOverFrameIdRef.current = hoveredFrameId;

      setNodes((currentNodes) =>
        currentNodes.map((n) => {
          if (!n.data?.isFrame) return n;

          const shouldHighlight = n.id === hoveredFrameId;
          if (n.data.isDragOver === shouldHighlight) return n;

          return {
            ...n,
            data: { ...n.data, isDragOver: shouldHighlight },
          };
        })
      );
    },
    [getIntersectingNodes, setNodes]
  );

  const onNodeDragStop = useCallback(
    (_event, draggedNode) => {
      // Clear drag-over highlight from all frames
      dragOverFrameIdRef.current = null;
      setNodes((currentNodes) =>
        currentNodes.map((n) => {
          if (n.data?.isFrame && n.data.isDragOver) {
            return { ...n, data: { ...n.data, isDragOver: false } };
          }
          return n;
        })
      );

      // Don't nest frames inside other frames
      if (draggedNode.data?.isFrame) return;

      const intersections = getIntersectingNodes(draggedNode).filter(
        (n) => n.data?.isFrame === true
      );
      const targetFrame = intersections[0] || null;

      setNodes((currentNodes) => {
        const updated = currentNodes.map((node) => {
          if (node.id !== draggedNode.id) return node;

          const currentParentId = node.parentId || null;

          if (targetFrame) {

            // Calculate absolute position of the dragged node
            let absoluteX = draggedNode.position.x;
            let absoluteY = draggedNode.position.y;

            if (currentParentId) {
              const oldParent = currentNodes.find((n) => n.id === currentParentId);
              if (oldParent) {
                absoluteX += oldParent.position.x;
                absoluteY += oldParent.position.y;
              }
            }

            // Convert to position relative to the new parent frame
            const relativeX = absoluteX - targetFrame.position.x;
            const relativeY = absoluteY - targetFrame.position.y;

            return {
              ...node,
              position: { x: relativeX, y: relativeY },
              parentId: targetFrame.id,
              extent: 'parent',
              data: {
                ...node.data,
                parentNode: targetFrame.id,
              },
            };
          }

          // Dropped outside any frame — remove parent if it had one
          if (currentParentId) {
            const oldParent = currentNodes.find((n) => n.id === currentParentId);
            const absoluteX = oldParent
              ? draggedNode.position.x + oldParent.position.x
              : draggedNode.position.x;
            const absoluteY = oldParent
              ? draggedNode.position.y + oldParent.position.y
              : draggedNode.position.y;

            // Use delete to fully remove keys — avoids phantom extent limits
            const updatedNode = { ...node };
            delete updatedNode.parentId;
            delete updatedNode.extent;
            updatedNode.position = { x: absoluteX, y: absoluteY };
            updatedNode.data = { ...updatedNode.data, parentNode: null };
            return updatedNode;
          }

          return node;
        });

        return sortNodes(updated);
      });
    },
    [getIntersectingNodes, setNodes]
  );

  const saveState = useCallback(async () => {
    if (!graphId || !projectId) {
      console.error('Missing graphId or projectId');
      return;
    }

    setSaving(true);

    try {
      // --- Step 1: Save nodes (POST new / PATCH existing) ---
      const nodesPayload = nodes.map((node) => ({
        tempId: node.id,
        graphNodeId: node.data.graphNodeId || null,
        nodeId: node.data.nodeId || null,
        nodeType: node.data.nodeType,
        label: node.data.label,
        positionX: node.position.x,
        positionY: node.position.y,
        parentNode: node.data.parentNode || null,
        isFrame: node.data.isFrame || false,
        width: Math.round(node.style?.width || node.data.width || 400),
        height: Math.round(node.style?.height || node.data.height || 300),
        customProps: node.data.customProps || {},
      }));

      const nodeResults = await saveCanvasNodes(graphId, projectId, nodesPayload);

      // --- Step 2: Build frontendId → nodeId map ---
      // The backend connections use Node IDs (not GraphNode IDs),
      // so we map each frontend node ID to its real Node ID.
      const frontendIdToNodeId = {};

      // Map created nodes: tempId → node.id from backend response
      for (const created of nodeResults.created) {
        frontendIdToNodeId[created.tempId] = created.node.id;
      }

      // Map existing nodes: use the data already loaded in the canvas
      // For existing nodes (gn-{graphNodeId}), we need their real Node ID.
      // The updated entries return graphNode data; we also check loaded node data.
      for (const node of nodes) {
        if (node.data.graphNodeId && !frontendIdToNodeId[node.id]) {
          // For existing nodes, the node ID was stored when loading from canvas.
          // We need to fetch it from the graphNode response or the loaded data.
          frontendIdToNodeId[node.id] = node.data.nodeId || null;
        }
      }

      // Also map from updated results (graphNode has `node` field = Node ID)
      for (const updated of nodeResults.updated) {
        if (updated.graphNode?.node) {
          frontendIdToNodeId[updated.tempId] = updated.graphNode.node;
        }
      }

      // Update local nodes with backend IDs for newly created nodes
      // and fix parentId / data.parentNode references for children
      const tempIdToNewId = {};
      for (const created of nodeResults.created) {
        tempIdToNewId[created.tempId] = `gn-${created.graphNode.id}`;
      }

      if (nodeResults.created.length > 0) {
        setNodes((currentNodes) => {
          const updated = currentNodes.map((n) => {
            const created = nodeResults.created.find((c) => c.tempId === n.id);

            // Step A: Update the node's own ID if it was just created
            const updatedNode = created
              ? {
                  ...n,
                  id: `gn-${created.graphNode.id}`,
                  data: {
                    ...n.data,
                    graphNodeId: created.graphNode.id,
                    nodeId: created.node.id,
                  },
                }
              : { ...n };

            // Step B: Update parentId if it points to a temp- ID that was just replaced
            if (updatedNode.parentId && tempIdToNewId[updatedNode.parentId]) {
              updatedNode.parentId = tempIdToNewId[updatedNode.parentId];
            }

            // Step C: Update data.parentNode to match the new parentId
            if (updatedNode.data.parentNode && tempIdToNewId[updatedNode.data.parentNode]) {
              updatedNode.data = {
                ...updatedNode.data,
                parentNode: tempIdToNewId[updatedNode.data.parentNode],
              };
            }

            return updatedNode;
          });

          return sortNodes(updated);
        });
      }

      // --- Step 3: Translate edges and save connections ---
      // Filter edges that have both source and target mapped to real Node IDs
      // and skip edges that already came from the backend (conn-*)
      const newEdges = edges.filter((edge) => !edge.id.startsWith('conn-'));

      if (newEdges.length > 0) {
        const defaultConnectionType = await getOrCreateDefaultConnectionType(projectId);

        const connectionsPayload = newEdges
          .map((edge) => {
            const sourceNodeId = frontendIdToNodeId[edge.source];
            const targetNodeId = frontendIdToNodeId[edge.target];

            if (!sourceNodeId || !targetNodeId) {
              console.warn('[SaveState] Skipping edge — missing node ID mapping:', edge);
              return null;
            }

            return {
              sourceNodeId,
              targetNodeId,
              label: '',
            };
          })
          .filter(Boolean);

        if (connectionsPayload.length > 0) {
          const connectionResults = await saveCanvasConnections(
            graphId,
            defaultConnectionType.id,
            connectionsPayload
          );

          // Update edge IDs to reflect backend-persisted connections
          if (connectionResults.created.length > 0) {
            setEdges((currentEdges) => {
              let createdIndex = 0;
              return currentEdges.map((e) => {
                if (!e.id.startsWith('conn-') && createdIndex < connectionResults.created.length) {
                  const saved = connectionResults.created[createdIndex];
                  createdIndex++;
                  return { ...e, id: `conn-${saved.id}` };
                }
                return e;
              });
            });
          }

          if (connectionResults.errors.length > 0) {
            console.warn('[SaveState] Connection errors:', connectionResults.errors);
          }
        }
      }

      // Update edge source/target references if nodes were renamed from temp- to gn-
      if (Object.keys(tempIdToNewId).length > 0) {
        setEdges((currentEdges) =>
          currentEdges.map((e) => ({
            ...e,
            source: tempIdToNewId[e.source] || e.source,
            target: tempIdToNewId[e.target] || e.target,
          }))
        );
      }

      // Build summary message
      const summary = [];
      if (nodeResults.created.length > 0) summary.push(`${nodeResults.created.length} nodos creados`);
      if (nodeResults.updated.length > 0) summary.push(`${nodeResults.updated.length} nodos actualizados`);
      const savedEdgeCount = newEdges.length;
      if (savedEdgeCount > 0) summary.push(`${savedEdgeCount} conexiones procesadas`);
      if (nodeResults.errors.length > 0) summary.push(`${nodeResults.errors.length} errores en nodos`);

      const summaryText = summary.length > 0 ? summary.join(', ') : 'Sin cambios';
      alert('Guardado exitoso: ' + summaryText);
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert('Error al guardar el estado del canvas.');
    } finally {
      setSaving(false);
    }
  }, [graphId, projectId, nodes, edges, setNodes, setEdges]);

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      for (const node of deletedNodes) {
        if (node.data?.graphNodeId) {
          deleteGraphNode(node.data.graphNodeId).catch((err) =>
            console.error('[Delete] Failed to delete graph node:', err)
          );
        }
      }
    },
    []
  );

  const onEdgesDelete = useCallback(
    (deletedEdges) => {
      for (const edge of deletedEdges) {
        // Only delete edges that were persisted to the backend (conn-{id})
        if (edge.id.startsWith('conn-')) {
          const connectionId = edge.id.replace('conn-', '');
          deleteConnection(connectionId).catch((err) =>
            console.error('[Delete] Failed to delete connection:', err)
          );
        }
      }
    },
    []
  );

  return (
    <div className="absolute inset-0 flex flex-col bg-[rgb(var(--color-bg))] overflow-hidden">
      <Toolbar onCreateNode={createNode} onCreateFrame={createFrame} onSaveState={saveState} saving={saving} />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onNodeContextMenu={onNodeContextMenu}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onPaneClick={onPaneClick}
          connectionMode="loose"
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          style={{ width: '100%', height: '100%' }}
        >

          <Controls />
        </ReactFlow>

        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="fixed z-[9999] min-w-[200px] bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg shadow-xl py-2"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            <button
              type="button"
              onClick={() => {
                setEditingNode(contextMenu.node);
                setContextMenu(null);
              }}
              className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer"
            >
              Propiedades
            </button>
            <button
              type="button"
              onClick={() => toggleFrameMode(contextMenu.nodeId)}
              className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer"
            >
              {contextMenu.isFrame ? 'Convertir en Nodo Normal' : 'Convertir en Marco'}
            </button>
          </div>
        )}
      </div>

      <NodeEditorModal
        node={editingNode}
        isOpen={!!editingNode}
        onClose={() => setEditingNode(null)}
        onSave={handleModalSave}
      />
    </div>
  );
}

export default function GraphCanvas({ graphId }) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner graphId={graphId} />
    </ReactFlowProvider>
  );
}