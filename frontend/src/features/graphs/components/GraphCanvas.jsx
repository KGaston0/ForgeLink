import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  addEdge,
  reconnectEdge,
  ReactFlowProvider,
  useNodesState,
  useEdgesState,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import BaseNode from './nodes/BaseNode';
import CustomEdge from './edges/CustomEdge';
import { EDGE_DIRECTIONS } from './edges/edgeConstants';
import NodeEditorModal from './NodeEditorModal';
import EdgeEditorModal from './EdgeEditorModal';
import Toolbar from './Toolbar';
import {
  fetchCanvasData,
  saveCanvasNodes,
  getOrCreateDefaultConnectionType,
  saveCanvasConnections,
  updateConnection,
  deleteGraphNode,
  deleteConnection
} from '../api/graphService';

const nodeTypes = {
  custom: BaseNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

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

  // Estado unificado para el menú contextual
  const [contextMenu, setContextMenu] = useState(null);

  const [editingNode, setEditingNode] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);

  const contextMenuRef = useRef(null);
  const { getIntersectingNodes, deleteElements } = useReactFlow();
  const dragOverFrameIdRef = useRef(null);

  useEffect(() => {
    if (!graphId) return;

    fetchCanvasData(graphId)
      .then((data) => {
        setProjectId(data.graph.project);

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

          if (isFrame) {
            reactFlowNode.style = { width: gn.width || 400, height: gn.height || 300 };
            reactFlowNode.dragHandle = '.custom-drag-handle';
          }

          if (gn.parent_node) {
            reactFlowNode.parentId = `gn-${gn.parent_node}`;
            reactFlowNode.extent = 'parent';
          }

          return reactFlowNode;
        });

        setNodes(sortNodes(loadedNodes));

        const loadedEdges = data.connections
          .filter((conn) => nodeToGraphNode[conn.source_node] && nodeToGraphNode[conn.target_node])
          .map((conn) => ({
            id: `conn-${conn.id}`,
            source: `gn-${nodeToGraphNode[conn.source_node]}`,
            target: `gn-${nodeToGraphNode[conn.target_node]}`,
            type: 'custom',
            data: {
              label: conn.label || '',
              direction: conn.direction || EDGE_DIRECTIONS.FORWARD,
              sourceHandlePosition: conn.source_handle_position,
              targetHandlePosition: conn.target_handle_position,
            },
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
        addEdge(
          {
            ...connection,
            type: 'custom',
            data: {
              label: '',
              direction: EDGE_DIRECTIONS.FORWARD,
              sourceHandlePosition: null,
              targetHandlePosition: null,
            },
          },
          eds
        )
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

  // --- NUEVA LÓGICA DE MENÚ CONTEXTUAL UNIFICADO ---
  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({
      type: 'node', // Identificador para renderizar opciones de nodo
      nodeId: node.id,
      node,
      isFrame: node.data.isFrame === true,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      type: 'edge', // Identificador para renderizar opciones de conexión
      edgeId: edge.id,
      edge,
      x: event.clientX,
      y: event.clientY,
    });
  }, []);

  // Doble click sigue abriendo el modal directamente (es muy cómodo)
  const onEdgeDoubleClick = useCallback((event, edge) => {
    event.preventDefault();
    event.stopPropagation();
    setEditingEdge(edge);
  }, []);

  const handleEdgeModalSave = useCallback(
    (updatedData) => {
      if (!editingEdge) return;
      setEdges((eds) =>
        eds.map((e) =>
          e.id === editingEdge.id
            ? { ...e, data: { ...e.data, ...updatedData } }
            : e
        )
      );
      setEditingEdge(null);
    },
    [editingEdge, setEdges]
  );

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
  }, []);

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

      const validIntersections = getIntersectingNodes(draggedNode).filter((n) => {
        const isFrame = n.data?.isFrame === true;
        const isNotCurrentParent = n.id !== draggedNode.parentId && n.id !== draggedNode.data?.parentNode;
        return isFrame && isNotCurrentParent;
      });

      const hoveredFrameId = validIntersections[0]?.id || null;

      if (hoveredFrameId === dragOverFrameIdRef.current) return;
      dragOverFrameIdRef.current = hoveredFrameId;

      setNodes((currentNodes) =>
        currentNodes.map((n) => {
          if (!n.data?.isFrame) return n;
          const shouldHighlight = n.id === hoveredFrameId;
          if (n.data.isDragOver === shouldHighlight) return n;
          return { ...n, data: { ...n.data, isDragOver: shouldHighlight } };
        })
      );
    },
    [getIntersectingNodes, setNodes]
  );

  const onNodeDragStop = useCallback(
    (_event, draggedNode) => {
      dragOverFrameIdRef.current = null;
      setNodes((currentNodes) =>
        currentNodes.map((n) => {
          if (n.data?.isFrame && n.data.isDragOver) {
            return { ...n, data: { ...n.data, isDragOver: false } };
          }
          return n;
        })
      );

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
            let absoluteX = draggedNode.position.x;
            let absoluteY = draggedNode.position.y;

            if (currentParentId) {
              const oldParent = currentNodes.find((n) => n.id === currentParentId);
              if (oldParent) {
                absoluteX += oldParent.position.x;
                absoluteY += oldParent.position.y;
              }
            }

            const relativeX = absoluteX - targetFrame.position.x;
            const relativeY = absoluteY - targetFrame.position.y;

            return {
              ...node,
              position: { x: relativeX, y: relativeY },
              parentId: targetFrame.id,
              extent: 'parent',
              data: { ...node.data, parentNode: targetFrame.id },
            };
          }

          if (currentParentId) {
            const oldParent = currentNodes.find((n) => n.id === currentParentId);
            const absoluteX = oldParent ? draggedNode.position.x + oldParent.position.x : draggedNode.position.x;
            const absoluteY = oldParent ? draggedNode.position.y + oldParent.position.y : draggedNode.position.y;

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
      const frontendIdToNodeId = {};

      for (const created of nodeResults.created) {
        frontendIdToNodeId[created.tempId] = created.node.id;
      }
      for (const node of nodes) {
        if (node.data.graphNodeId && !frontendIdToNodeId[node.id]) {
          frontendIdToNodeId[node.id] = node.data.nodeId || null;
        }
      }
      for (const updated of nodeResults.updated) {
        if (updated.graphNode?.node) {
          frontendIdToNodeId[updated.tempId] = updated.graphNode.node;
        }
      }

      const tempIdToNewId = {};
      for (const created of nodeResults.created) {
        tempIdToNewId[created.tempId] = `gn-${created.graphNode.id}`;
      }

      if (nodeResults.created.length > 0) {
        setNodes((currentNodes) => {
          const updated = currentNodes.map((n) => {
            const created = nodeResults.created.find((c) => c.tempId === n.id);
            const updatedNode = created
              ? { ...n, id: `gn-${created.graphNode.id}`, data: { ...n.data, graphNodeId: created.graphNode.id, nodeId: created.node.id } }
              : { ...n };

            if (updatedNode.parentId && tempIdToNewId[updatedNode.parentId]) {
              updatedNode.parentId = tempIdToNewId[updatedNode.parentId];
            }
            if (updatedNode.data.parentNode && tempIdToNewId[updatedNode.data.parentNode]) {
              updatedNode.data = { ...updatedNode.data, parentNode: tempIdToNewId[updatedNode.data.parentNode] };
            }
            return updatedNode;
          });
          return sortNodes(updated);
        });
      }

      const newEdges = edges.filter((edge) => !edge.id.startsWith('conn-'));
      const existingEdges = edges.filter((edge) => edge.id.startsWith('conn-'));

      if (newEdges.length > 0) {
        const defaultConnectionType = await getOrCreateDefaultConnectionType(projectId);
        const connectionsPayload = newEdges
          .map((edge) => {
            const sourceNodeId = frontendIdToNodeId[edge.source];
            const targetNodeId = frontendIdToNodeId[edge.target];
            if (!sourceNodeId || !targetNodeId) return null;

            return {
              sourceNodeId,
              targetNodeId,
              label: edge.data?.label || '',
              direction: edge.data?.direction || 'forward',
              sourceHandlePosition: edge.data?.sourceHandlePosition || null,
              targetHandlePosition: edge.data?.targetHandlePosition || null,
            };
          })
          .filter(Boolean);

        if (connectionsPayload.length > 0) {
          const connectionResults = await saveCanvasConnections(graphId, defaultConnectionType.id, connectionsPayload);
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
        }
      }

      for (const edge of existingEdges) {
        const connectionId = edge.id.replace('conn-', '');
        try {
          await updateConnection(connectionId, {
            label: edge.data?.label || '',
            direction: edge.data?.direction || 'forward',
            sourceHandlePosition: edge.data?.sourceHandlePosition || null,
            targetHandlePosition: edge.data?.targetHandlePosition || null,
          });
        } catch (error) {
          console.warn('[SaveState] Failed to update connection:', connectionId);
        }
      }

      if (Object.keys(tempIdToNewId).length > 0) {
        setEdges((currentEdges) =>
          currentEdges.map((e) => ({
            ...e,
            source: tempIdToNewId[e.source] || e.source,
            target: tempIdToNewId[e.target] || e.target,
          }))
        );
      }

      alert('Guardado exitoso');
    } catch (error) {
      console.error('Error saving canvas:', error);
      alert('Error al guardar el estado del canvas.');
    } finally {
      setSaving(false);
    }
  }, [graphId, projectId, nodes, edges, setNodes, setEdges]);

  const onReconnect = useCallback(
    (oldEdge, newConnection) => {
      setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
    },
    [setEdges]
  );

  const onNodesDelete = useCallback(
    (deletedNodes) => {
      for (const node of deletedNodes) {
        if (node.data?.graphNodeId) {
          deleteGraphNode(node.data.graphNodeId).catch((err) => console.error(err));
        }
      }
    },
    []
  );

  const onEdgesDelete = useCallback(
    (deletedEdges) => {
      for (const edge of deletedEdges) {
        if (edge.id.startsWith('conn-')) {
          const connectionId = edge.id.replace('conn-', '');
          deleteConnection(connectionId).catch((err) => console.error(err));
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
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onReconnect={onReconnect}
          edgesReconnectable
          onNodesDelete={onNodesDelete}
          onEdgesDelete={onEdgesDelete}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeDoubleClick={onEdgeDoubleClick}
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

        {/* --- MENÚ CONTEXTUAL UNIFICADO (Nodos y Edges) --- */}
        {contextMenu && (
          <div
            ref={contextMenuRef}
            className="fixed z-[9999] min-w-[200px] bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg shadow-xl py-1.5"
            style={{ top: contextMenu.y, left: contextMenu.x }}
          >
            {/* Opciones de Nodo */}
            {contextMenu.type === 'node' && (
              <>
                <button
                  type="button"
                  onClick={() => { setEditingNode(contextMenu.node); setContextMenu(null); }}
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
                <div className="h-px bg-[rgb(var(--color-border))] my-1 w-full" />
                <button
                  type="button"
                  onClick={() => {
                    deleteElements({ nodes: [{ id: contextMenu.nodeId }] });
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-colors"
                >
                  Eliminar Nodo
                </button>
              </>
            )}

            {/* Opciones de Conexión (Edge) */}
            {contextMenu.type === 'edge' && (
              <>
                <button
                  type="button"
                  onClick={() => { setEditingEdge(contextMenu.edge); setContextMenu(null); }}
                  className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer"
                >
                  Configurar Relación
                </button>
                <div className="h-px bg-[rgb(var(--color-border))] my-1 w-full" />
                <button
                  type="button"
                  onClick={() => {
                    deleteElements({ edges: [{ id: contextMenu.edgeId }] });
                    setContextMenu(null);
                  }}
                  className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-colors"
                >
                  Eliminar Conexión
                </button>
              </>
            )}
          </div>
        )}
      </div>

      <NodeEditorModal
        node={editingNode}
        isOpen={!!editingNode}
        onClose={() => setEditingNode(null)}
        onSave={handleModalSave}
        onDelete={() => {
          deleteElements({ nodes: [{ id: editingNode.id }] });
          setEditingNode(null);
        }}
      />

      <EdgeEditorModal
        edge={editingEdge}
        isOpen={!!editingEdge}
        onClose={() => setEditingEdge(null)}
        onSave={handleEdgeModalSave}
        onDelete={() => {
          deleteElements({ edges: [{ id: editingEdge.id }] });
          setEditingEdge(null);
        }}
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