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
  saveCanvasBulk,
  getOrCreateDefaultConnectionType,
  deleteGraphNode,
  deleteConnection
} from '../api/graphService';

// --- IMPORTAMOS NUESTRO HOOK DE HISTORIAL ---
import useUndoRedo from '../hooks/useUndoRedo';

const nodeTypes = { custom: BaseNode };
const edgeTypes = { custom: CustomEdge };

function sortNodes(nodes) {
  return [...nodes].sort((a, b) => {
    if (a.data?.isFrame && !b.data?.isFrame) return -1;
    if (!a.data?.isFrame && b.data?.isFrame) return 1;
    return (a.zIndex || 0) - (b.zIndex || 0);
  });
}

function GraphCanvasInner({ graphUuid }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphId, setGraphId] = useState(null);
  const [projectId, setProjectId] = useState(null);

  const [saveStatus, setSaveStatus] = useState('saved');

  const [contextMenu, setContextMenu] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);

  const contextMenuRef = useRef(null);
  const { getIntersectingNodes, deleteElements, screenToFlowPosition } = useReactFlow();
  const dragOverFrameIdRef = useRef(null);

  const markUnsaved = useCallback(() => setSaveStatus('unsaved'), []);

  // --- UNDO/REDO HOOK ---
  const { undo, redo, takeSnapshot, canUndo, canRedo } = useUndoRedo(
    nodes,
    edges,
    setNodes,
    setEdges,
    markUnsaved
  );

  // --- HELPER: Calculate the exact center of the current viewport ---
  const getCenterSpawnPosition = useCallback(() => {
    if (typeof window === 'undefined') return { x: 100, y: 100 };

    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Convert screen center to React Flow canvas coordinates
    const position = screenToFlowPosition({ x: centerX, y: centerY });

    // Small random offset to prevent nodes from stacking on the exact same spot
    const offset = Math.floor(Math.random() * 20) - 10;
    return { x: position.x + offset - 80, y: position.y + offset - 40 };
  }, [screenToFlowPosition]);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    if (!graphUuid) return;

    fetchCanvasData(graphUuid)
      .then((data) => {
        setGraphId(data.graph.id);       // internal int for data ops
        setProjectId(data.graph.project);
        const nodeToGraphNode = {};
        const loadedNodes = data.nodes.map((gn) => {
          nodeToGraphNode[gn.node] = gn.id;
          const isFrame = gn.is_frame || false;

          const reactFlowNode = {
            id: `gn-${gn.id}`,
            type: 'custom',
            position: { x: gn.position_x, y: gn.position_y },
            zIndex: isFrame ? -1 : 0,
            style: {
              width: gn.width || (isFrame ? 400 : 160),
              height: gn.height || (isFrame ? 300 : 80)
            },
            data: {
              label: gn.node_title,
              nodeType: gn.node_type,
              graphNodeId: gn.id,
              nodeId: gn.node,
              isFrame,
              parentNode: gn.parent_node ? `gn-${gn.parent_node}` : null,
              width: gn.width || (isFrame ? 400 : 160),
              height: gn.height || (isFrame ? 300 : 80),
              customProps: gn.node_custom_properties || {},
            },
          };

          if (isFrame) {
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
        setSaveStatus('saved');
      })
      .catch((err) => console.error('Error loading canvas:', err));
  }, [graphUuid, setNodes, setEdges]);

  // --- GLOBAL AUTO-SAVE LISTENER ---
  useEffect(() => {
    const handleUnsaved = () => markUnsaved();
    window.addEventListener('canvas-unsaved', handleUnsaved);
    return () => window.removeEventListener('canvas-unsaved', handleUnsaved);
  }, [markUnsaved]);

  // --- CHANGE INTERCEPTORS ---
  const handleNodesChange = useCallback((changes) => {
    const isStructural = changes.some(c => ['remove', 'add'].includes(c.type));
    if (isStructural) takeSnapshot();

    const hasAnyChange = changes.some(c => ['position', 'remove', 'add', 'dimensions'].includes(c.type));
    if (hasAnyChange) markUnsaved();
    onNodesChange(changes);
  }, [onNodesChange, markUnsaved, takeSnapshot]);

  const handleEdgesChange = useCallback((changes) => {
    const isStructural = changes.some(c => ['remove', 'add'].includes(c.type));
    if (isStructural) takeSnapshot();

    if (isStructural) markUnsaved();
    onEdgesChange(changes);
  }, [onEdgesChange, markUnsaved, takeSnapshot]);

  const onConnect = useCallback((connection) => {
    takeSnapshot();
    setEdges((eds) => addEdge({
      ...connection,
      type: 'custom',
      data: { label: '', direction: EDGE_DIRECTIONS.FORWARD, sourceHandlePosition: null, targetHandlePosition: null },
    }, eds));
    markUnsaved();
  }, [setEdges, markUnsaved, takeSnapshot]);

  // --- ELEMENT CREATION ---
  const createNode = useCallback((nodeType) => {
    takeSnapshot();
    const centerPosition = getCenterSpawnPosition();

    setNodes((nds) => nds.concat({
      id: `temp-${Date.now()}`,
      type: 'custom',
      position: centerPosition,
      zIndex: 1000,
      style: { width: 160, height: 80 },
      data: { label: `Nuevo ${nodeType}`, nodeType, graphNodeId: null, parentNode: null, isFrame: false, width: 160, height: 80 },
    }));
    markUnsaved();
  }, [setNodes, markUnsaved, takeSnapshot, getCenterSpawnPosition]);

  const createFrame = useCallback(() => {
    takeSnapshot();
    const centerPosition = getCenterSpawnPosition();
    centerPosition.x -= 120;
    centerPosition.y -= 110;

    setNodes((nds) => nds.concat({
      id: `temp-${Date.now()}`,
      type: 'custom',
      position: centerPosition,
      dragHandle: '.custom-drag-handle',
      style: { width: 400, height: 300 },
      zIndex: -1,
      data: { label: 'Nuevo Marco', nodeType: 'frame', graphNodeId: null, parentNode: null, isFrame: true, width: 400, height: 300 },
    }));
    markUnsaved();
  }, [setNodes, markUnsaved, takeSnapshot, getCenterSpawnPosition]);

  // --- INTERACTIONS AND DRAG & DROP ---
  const onNodeClick = useCallback((_, clickedNode) => {
    setNodes((nds) => nds.map((n) => ({
      ...n,
      zIndex: n.id === clickedNode.id ? 1000 : (n.data?.isFrame ? -1 : 0)
    })));
  }, [setNodes]);

  const onNodeDragStart = useCallback((_event, draggedNode, draggedNodes) => {
    takeSnapshot();

    const draggedIds = new Set(draggedNodes.map((n) => n.id));
    setNodes((nds) => nds.map((n) => {
      if (draggedIds.has(n.id)) {
        const freed = { ...n, zIndex: 1000 };
        if (!n.data?.isFrame && n.parentId) delete freed.extent;
        return freed;
      }
      return { ...n, zIndex: n.data?.isFrame ? -1 : 0 };
    }));
  }, [setNodes, takeSnapshot]);

  const onNodeDrag = useCallback((_event, draggedNode) => {
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
  }, [getIntersectingNodes, setNodes]);

  const onNodeDragStop = useCallback((_event, draggedNode, draggedNodes) => {
    dragOverFrameIdRef.current = null;
    const draggedIds = new Set(draggedNodes.map(n => n.id));

    let structureChanged = false;

    setNodes((currentNodes) => {
      const updated = currentNodes.map((node) => {
        if (node.data?.isFrame && node.data.isDragOver) {
          node = { ...node, data: { ...node.data, isDragOver: false } };
        }

        if (!draggedIds.has(node.id)) return node;
        if (node.data?.isFrame) return node;

        const intersections = getIntersectingNodes(draggedNode).filter((n) => n.data?.isFrame === true);
        const targetFrame = intersections[0] || null;
        const currentParentId = node.parentId || null;

        if (targetFrame) {
          if (currentParentId !== targetFrame.id) structureChanged = true;
          let absoluteX = node.position.x;
          let absoluteY = node.position.y;
          if (currentParentId && currentParentId !== targetFrame.id) {
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
            zIndex: 1000,
            data: { ...node.data, parentNode: targetFrame.id },
          };
        }

        if (currentParentId) {
          structureChanged = true;
          const oldParent = currentNodes.find((n) => n.id === currentParentId);
          const absoluteX = oldParent ? node.position.x + oldParent.position.x : node.position.x;
          const absoluteY = oldParent ? node.position.y + oldParent.position.y : node.position.y;
          const updatedNode = { ...node };
          delete updatedNode.parentId;
          delete updatedNode.extent;
          updatedNode.position = { x: absoluteX, y: absoluteY };
          updatedNode.zIndex = 1000;
          updatedNode.data = { ...updatedNode.data, parentNode: null };
          return updatedNode;
        }

        return { ...node, zIndex: 1000 };
      });
      return sortNodes(updated);
    });

    if (structureChanged) markUnsaved();
  }, [getIntersectingNodes, setNodes, markUnsaved]);

  // --- LÓGICA DE GUARDADO EN BLOQUE ---
  const saveState = useCallback(async () => {
    if (!graphUuid || !graphId || !projectId) return;
    setSaveStatus('saving');

    try {
      const nodesPayload = nodes.map((node) => {
        const isFrame = node.data?.isFrame === true;

        const getDim = (dimName, fallback) => {
          const val = node.measured?.[dimName] ?? node.style?.[dimName] ?? node.data?.[dimName] ?? fallback;
          const parsed = parseFloat(val);
          return isNaN(parsed) ? fallback : Math.round(parsed);
        };

        return {
          temp_id: node.id,
          graph_node_id: node.data.graphNodeId || null,
          node_id: node.data.nodeId || null,
          node_type: node.data.nodeType,
          label: node.data.label,
          position_x: node.position.x,
          position_y: node.position.y,
          parent_node: node.data.parentNode || null,
          is_frame: isFrame,
          width: getDim('width', isFrame ? 400 : 160),
          height: getDim('height', isFrame ? 300 : 80),
          custom_properties: node.data.customProps || {},
        };
      });

      const hasNewEdges = edges.some((e) => !e.id.startsWith('conn-'));
      let defaultConnectionTypeId = null;
      if (hasNewEdges) {
        const defaultConnectionType = await getOrCreateDefaultConnectionType(projectId);
        defaultConnectionTypeId = defaultConnectionType.id;
      }

      const connectionsPayload = edges.map((edge) => {
        const isExisting = edge.id.startsWith('conn-');
        return {
          connection_id: isExisting ? parseInt(edge.id.replace('conn-', ''), 10) : null,
          source_temp_id: edge.source,
          target_temp_id: edge.target,
          connection_type_id: isExisting
            ? (edge.data?.connectionTypeId || defaultConnectionTypeId)
            : defaultConnectionTypeId,
          label: edge.data?.label || '',
          direction: edge.data?.direction || 'forward',
          source_handle_position: edge.data?.sourceHandlePosition || null,
          target_handle_position: edge.data?.targetHandlePosition || null,
        };
      });

      const result = await saveCanvasBulk(graphUuid, projectId, {
        nodes: nodesPayload,
        connections: connectionsPayload,
      });

      const createdNodes = result.nodes?.created || [];
      const createdConns = result.connections?.created || [];

      if (createdNodes.length > 0 || createdConns.length > 0) {
        const tempIdToNewId = {};
        for (const created of createdNodes) {
          tempIdToNewId[created.temp_id] = `gn-${created.graph_node_id}`;
        }

        setNodes((currentNodes) => {
          const updated = currentNodes.map((n) => {
            const created = createdNodes.find((c) => c.temp_id === n.id);
            const updatedNode = created
              ? {
                  ...n,
                  id: `gn-${created.graph_node_id}`,
                  data: {
                    ...n.data,
                    graphNodeId: created.graph_node_id,
                    nodeId: created.node_id,
                  },
                }
              : { ...n };

            if (updatedNode.parentId && tempIdToNewId[updatedNode.parentId]) {
              updatedNode.parentId = tempIdToNewId[updatedNode.parentId];
            }
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

        setEdges((currentEdges) => {
          let createdConnIndex = 0;
          return currentEdges.map((e) => {
            let updatedEdge = { ...e };
            if (tempIdToNewId[e.source]) updatedEdge.source = tempIdToNewId[e.source];
            if (tempIdToNewId[e.target]) updatedEdge.target = tempIdToNewId[e.target];

            if (!e.id.startsWith('conn-') && createdConnIndex < createdConns.length) {
              updatedEdge.id = `conn-${createdConns[createdConnIndex].id}`;
              createdConnIndex++;
            }
            return updatedEdge;
          });
        });
      }

      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving canvas:', error);
      setSaveStatus('error');
    }
  }, [graphUuid, graphId, projectId, nodes, edges]);

  useEffect(() => {
    if (saveStatus === 'unsaved') {
      const timerId = setTimeout(() => {
        saveState();
      }, 2500);
      return () => clearTimeout(timerId);
    }
  }, [saveStatus, saveState]);

  // --- CONTEXT MENU AND UTILITIES ---
  const toggleFrameMode = useCallback((nodeId) => {
    takeSnapshot();
    setNodes((currentNodes) => currentNodes.map((node) => {
      if (node.id !== nodeId) return node;
      const isCurrentlyFrame = node.data.isFrame === true;
      const frameWidth = node.data.width || 400;
      const frameHeight = node.data.height || 300;
      return {
        ...node,
        dragHandle: !isCurrentlyFrame ? '.custom-drag-handle' : undefined,
        style: !isCurrentlyFrame ? { width: frameWidth, height: frameHeight } : undefined,
        zIndex: !isCurrentlyFrame ? -1 : 1000,
        data: { ...node.data, isFrame: !isCurrentlyFrame, width: !isCurrentlyFrame ? frameWidth : node.data.width, height: !isCurrentlyFrame ? frameHeight : node.data.height },
      };
    }));
    markUnsaved();
    setContextMenu(null);
  }, [setNodes, markUnsaved, takeSnapshot]);

  const onNodeContextMenu = useCallback((event, node) => {
    event.preventDefault();
    setContextMenu({ type: 'node', nodeId: node.id, node, isFrame: node.data.isFrame === true, x: event.clientX, y: event.clientY });
  }, []);

  const onEdgeContextMenu = useCallback((event, edge) => {
    event.preventDefault(); event.stopPropagation();
    setContextMenu({ type: 'edge', edgeId: edge.id, edge, x: event.clientX, y: event.clientY });
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => { if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) setContextMenu(null); };
    if (contextMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  return (
    <div className="absolute inset-0 flex flex-col bg-[rgb(var(--color-bg))] overflow-hidden">
      <Toolbar
        onCreateNode={createNode}
        onCreateFrame={createFrame}
        saveStatus={saveStatus}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={handleNodesChange}
          onEdgesChange={handleEdgesChange}
          onConnect={onConnect}
          onReconnect={useCallback((oldEdge, newConnection) => {
            takeSnapshot();
            setEdges((eds) => reconnectEdge(oldEdge, newConnection, eds));
            markUnsaved();
          }, [setEdges, markUnsaved, takeSnapshot])}
          edgesReconnectable
          onNodesDelete={useCallback((deletedNodes) => { for (const node of deletedNodes) { if (node.data?.graphNodeId) deleteGraphNode(node.data.graphNodeId).catch(console.error); } }, [])}
          onEdgesDelete={useCallback((deletedEdges) => { for (const edge of deletedEdges) { if (edge.id.startsWith('conn-')) deleteConnection(edge.id.replace('conn-', '')).catch(console.error); } }, [])}
          onNodeContextMenu={onNodeContextMenu}
          onEdgeContextMenu={onEdgeContextMenu}
          onEdgeDoubleClick={useCallback((event, edge) => { event.preventDefault(); event.stopPropagation(); setEditingEdge(edge); }, [])}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onPaneClick={useCallback(() => setContextMenu(null), [])}
          panOnDrag={[1, 2]}
          selectionOnDrag={true}
          panOnScroll={true}
          selectionMode="partial"
          connectionMode="loose"
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Background />
          <Controls />
        </ReactFlow>

        {contextMenu && (
          <div ref={contextMenuRef} className="fixed z-[9999] min-w-[200px] bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg shadow-xl py-1.5" style={{ top: contextMenu.y, left: contextMenu.x }}>
            {contextMenu.type === 'node' && (
              <>
                <button type="button" onClick={() => { setEditingNode(contextMenu.node); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer">Propiedades</button>
                <button type="button" onClick={() => toggleFrameMode(contextMenu.nodeId)} className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer">{contextMenu.isFrame ? 'Convertir en Nodo Normal' : 'Convertir en Marco'}</button>
                <div className="h-px bg-[rgb(var(--color-border))] my-1 w-full" />
                <button type="button" onClick={() => { deleteElements({ nodes: [{ id: contextMenu.nodeId }] }); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-colors">Eliminar Nodo</button>
              </>
            )}
            {contextMenu.type === 'edge' && (
              <>
                <button type="button" onClick={() => { setEditingEdge(contextMenu.edge); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer">Configurar Relación</button>
                <div className="h-px bg-[rgb(var(--color-border))] my-1 w-full" />
                <button type="button" onClick={() => { deleteElements({ edges: [{ id: contextMenu.edgeId }] }); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-colors">Eliminar Conexión</button>
              </>
            )}
          </div>
        )}
      </div>

      <NodeEditorModal
        node={editingNode}
        isOpen={!!editingNode}
        onClose={() => setEditingNode(null)}
        onSave={useCallback((updatedData) => {
          if (!editingNode) return;
          takeSnapshot();
          setNodes((nds) => nds.map((n) => n.id === editingNode.id ? { ...n, data: { ...n.data, ...updatedData } } : n));
          markUnsaved();
          setEditingNode(null);
        }, [editingNode, setNodes, markUnsaved, takeSnapshot])}
        onDelete={() => { deleteElements({ nodes: [{ id: editingNode.id }] }); setEditingNode(null); }}
      />

      <EdgeEditorModal
        edge={editingEdge}
        isOpen={!!editingEdge}
        onClose={() => setEditingEdge(null)}
        onSave={useCallback((updatedData) => {
          if (!editingEdge) return;
          takeSnapshot();
          setEdges((eds) => eds.map((e) => e.id === editingEdge.id ? { ...e, data: { ...e.data, ...updatedData } } : e));
          markUnsaved();
          setEditingEdge(null);
        }, [editingEdge, setEdges, markUnsaved, takeSnapshot])}
        onDelete={() => { deleteElements({ edges: [{ id: editingEdge.id }] }); setEditingEdge(null); }}
      />
    </div>
  );
}

export default function GraphCanvas({ graphUuid }) {
  return (
    <ReactFlowProvider>
      <GraphCanvasInner graphUuid={graphUuid} />
    </ReactFlowProvider>
  );
}