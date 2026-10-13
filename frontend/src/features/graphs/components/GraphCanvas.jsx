import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import PortalNode from './nodes/PortalNode';
import CustomEdge from './edges/CustomEdge';
import { EDGE_DIRECTIONS } from './edges/edgeConstants';
import NodeEditorModal from './NodeEditorModal';
import EdgeEditorModal from './EdgeEditorModal';
import NodeLabModal from './NodeLabModal';
import Toolbar from './Toolbar';
import PortalCreationModal from './PortalCreationModal';
import {
  fetchCanvasData,
  saveCanvasBulk,
  getOrCreateDefaultConnectionType,
  deleteGraphNode,
  deleteConnection
} from '../api/graphService';

//
import useUndoRedo from '../hooks/useUndoRedo';
import { useActivityFeedInvalidation } from '../../../context/ActivityFeedContext';

const nodeTypes = { custom: BaseNode, portal: PortalNode };
const edgeTypes = { custom: CustomEdge };

function sortNodes(nodes) {
  // Calculamos la profundidad real (cuántos padres tiene arriba)
  const getDepth = (nodeId) => {
    let depth = 0;
    let current = nodes.find(n => n.id === nodeId);
    while (current && current.parentId) {
      depth++;
      current = nodes.find(n => n.id === current.parentId);
    }
    return depth;
  };

  const depthMap = new Map(nodes.map(n => [n.id, getDepth(n.id)]));

  return [...nodes].sort((a, b) => {
    // 1. Los padres SIEMPRE se dibujan antes que los hijos (Regla de oro de React Flow)
    const depthDiff = depthMap.get(a.id) - depthMap.get(b.id);
    if (depthDiff !== 0) return depthDiff;

    // 2. A igual profundidad, los marcos van al fondo
    if (a.data?.isFrame && !b.data?.isFrame) return -1;
    if (!a.data?.isFrame && b.data?.isFrame) return 1;

    // 3. Finalmente por zIndex manual
    return (a.zIndex || 0) - (b.zIndex || 0);
  });
}

// Traductores de conectores: React Flow (Texto) <--> Django (Float)
const handleStrToFloat = (handle) => {
  if (handle === 'top') return 0.0;
  if (handle === 'right') return 0.25;
  if (handle === 'bottom') return 0.5;
  if (handle === 'left') return 0.75;
  const parsed = parseFloat(handle);
  return isNaN(parsed) ? null : parsed;
};

const floatToHandleStr = (val) => {
  if (val === null || val === undefined) return null;
  if (val === 0.0) return 'top';
  if (val === 0.25) return 'right';
  if (val === 0.5) return 'bottom';
  if (val === 0.75) return 'left';
  return val.toString();
};

function GraphCanvasInner({ graphUuid }) {
  const { t } = useTranslation();
  const { invalidateActivityFeed } = useActivityFeedInvalidation();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [graphId, setGraphId] = useState(null);
  const [projectId, setProjectId] = useState(null);
  const [currentFolderId, setCurrentFolderId] = useState(null);
  const [currentFolderName, setCurrentFolderName] = useState(null);
  const [parentFolderId, setParentFolderId] = useState(null);
  const [isPortalModalOpen, setIsPortalModalOpen] = useState(false);
  const [isNodeLabOpen, setIsNodeLabOpen] = useState(false);

  const [saveStatus, setSaveStatus] = useState('saved');

  // ISSUE 3 FIX: Store backend hierarchy for real-time merge with live nodes
  const [, setBackendHierarchy] = useState([]);

  const [contextMenu, setContextMenu] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [editingEdge, setEditingEdge] = useState(null);

  const contextMenuRef = useRef(null);
  const navigate = useNavigate();
  const { getIntersectingNodes, deleteElements, screenToFlowPosition, getViewport, setViewport, fitView } = useReactFlow();
  const dragOverFrameIdRef = useRef(null);
  const originalParentIdsRef = useRef(new Map());

  const saveStateRef = useRef(null);

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
  const reactFlowWrapper = useRef(null);
  const getCenterSpawnPosition = useCallback(() => {
    const wrapper = reactFlowWrapper.current;
    if (!wrapper) return screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

    const rect = wrapper.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Convert screen center to React Flow canvas coordinates
    const position = screenToFlowPosition({ x: centerX, y: centerY });

    // Small random offset to prevent nodes from stacking on the exact same spot
    const offset = Math.floor(Math.random() * 20) - 10;
    return { x: position.x + offset, y: position.y + offset };
  }, [screenToFlowPosition]);

  // --- INITIAL DATA LOAD ---
  useEffect(() => {
    if (!graphUuid) return;

    const savedDepth = parseInt(localStorage.getItem('forgeLink_canvasDepth') || '3', 10);

    fetchCanvasData(graphUuid, currentFolderId, savedDepth)
      .then((data) => {
        setGraphId(data.graph.id);       // internal int for data ops
        setProjectId(data.graph.project);

        // Update parent info for folder-like navigation
        setParentFolderId(data.current_folder?.parent_node || null);
        setCurrentFolderName(data.current_folder?.node_title || null);

        const validNodeIds = new Set(data.nodes.map((gn) => gn.id));
        const nodeToGraphNode = {};
        const loadedNodes = data.nodes.map((gn) => {
          nodeToGraphNode[gn.node] = gn.id;
          const isFrame = gn.is_frame || false;
          const isPortal = gn.node_type === 'portal';

          const reactFlowNode = {
            id: `gn-${gn.id}`,
            type: isPortal ? 'portal' : 'custom',
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
              hiddenChildrenCount: gn.hidden_children_count || 0,
            },
          };

          if (isFrame) {
            reactFlowNode.dragHandle = '.custom-drag-handle';
          }

          // Fix 2: Context-Aware Rendering
          // Only set React Flow's native parentId and extent IF AND ONLY IF 
          // the node's parent_node actually exists in the current payload.
          if (gn.parent_node && validNodeIds.has(gn.parent_node)) {
            reactFlowNode.parentId = `gn-${gn.parent_node}`;
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

            sourceHandle: floatToHandleStr(conn.source_handle_position),
            targetHandle: floatToHandleStr(conn.target_handle_position),

            type: 'custom',
            data: {
              label: conn.label || '',
              direction: conn.direction || EDGE_DIRECTIONS.FORWARD,
              sourceHandlePosition: conn.source_handle_position,
              targetHandlePosition: conn.target_handle_position,
              // TASK 2: Store hoisted flag and original handle positions for auto-save protection
              isHoisted: conn.is_hoisted || false,
              originalSourceHandle: conn.source_handle_position,
              originalTargetHandle: conn.target_handle_position,
              connectionTypeId: conn.connection_type,
            },
          }));
        setEdges(loadedEdges);
        setSaveStatus('saved');

        // ISSUE 3 FIX: Store backend hierarchy for real-time merge with live nodes
        // (tree building moved to separate useEffect for live updates)
        setBackendHierarchy(data.hierarchy || []);

        // Fix 3: Viewport Centering
        setTimeout(() => {
          fitView({ padding: 0.2, duration: 800 });
        }, 50);
      })
      .catch((err) => console.error('Error loading canvas:', err));
  }, [graphUuid, currentFolderId, setNodes, setEdges, fitView]);

  // --- GLOBAL AUTO-SAVE LISTENER ---
  useEffect(() => {
    const handleUnsaved = () => markUnsaved();
    window.addEventListener('canvas-unsaved', handleUnsaved);
    return () => window.removeEventListener('canvas-unsaved', handleUnsaved);
  }, [markUnsaved]);


  // --- STEP 1B: Dispatch current folder change to Sidebar ---
  useEffect(() => {
    const event = new CustomEvent('canvas-folder-changed', {
      detail: currentFolderId,
    });
    window.dispatchEvent(event);
  }, [currentFolderId]);

  // --- STEP 2: Listen for sidebar navigation and update current folder ---
  useEffect(() => {
    const handleNavigate = async (e) => {
      const folderId = e.detail;
      
      // Save any unsaved changes before navigating
      if (saveStatus !== 'saved' && saveStateRef.current) {
        await saveStateRef.current();
      }

      setCurrentFolderId(folderId);
    };

    window.addEventListener('sidebar-navigate', handleNavigate);
    return () => window.removeEventListener('sidebar-navigate', handleNavigate);
  }, [saveStatus]);

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
    // Center the node on the spawn point
    centerPosition.x -= 80;
    centerPosition.y -= 40;

    setNodes((nds) => sortNodes([...nds.map((n) => ({
      ...n,
      zIndex: n.data?.isFrame ? -1 : 0,
    })), {
      id: `temp-${Date.now()}`,
      type: 'custom',
      position: centerPosition,
      zIndex: 1000,
      style: {},
      data: {
        label: t('graphCanvas.creation.newNode', { type: nodeType }),
        nodeType,
        graphNodeId: null,
        parentNode: currentFolderId ? `gn-${currentFolderId}` : null,
        isFrame: false,
        width: 160,
        height: 80
      },
    }]));
    markUnsaved();
  }, [setNodes, markUnsaved, takeSnapshot, getCenterSpawnPosition, currentFolderId, t]);

  const createFrame = useCallback(() => {
    takeSnapshot();
    const centerPosition = getCenterSpawnPosition();
    // Center the frame on the spawn point
    centerPosition.x -= 200;
    centerPosition.y -= 150;

    setNodes((nds) => sortNodes([...nds, {
      id: `temp-${Date.now()}`,
      type: 'custom',
      position: centerPosition,
      dragHandle: '.custom-drag-handle',
      style: { width: 400, height: 300 },
      zIndex: -1,
      data: {
        label: t('graphCanvas.creation.newFrame'),
        nodeType: 'frame',
        graphNodeId: null,
        parentNode: currentFolderId ? `gn-${currentFolderId}` : null,
        isFrame: true,
        width: 400,
        height: 300
      },
    }]));
    markUnsaved();
  }, [setNodes, markUnsaved, takeSnapshot, getCenterSpawnPosition, currentFolderId, t]);

  const createPortalNode = useCallback((targetGraphUuid, targetGraphName) => {
    takeSnapshot();
    const centerPosition = getCenterSpawnPosition();
    centerPosition.x -= 40;
    centerPosition.y -= 40;

    setNodes((nds) => sortNodes([...nds, {
      id: `temp-${Date.now()}`,
      type: 'portal',
      position: centerPosition,
      zIndex: 1000,
      data: {
        label: targetGraphName,
        nodeType: 'portal',
        graphNodeId: null,
        parentNode: currentFolderId ? `gn-${currentFolderId}` : null,
        isFrame: false,
        customProps: {
          target_graph_uuid: targetGraphUuid,
          target_graph_name: targetGraphName
        }
      },
    }]));
    markUnsaved();
  }, [setNodes, markUnsaved, takeSnapshot, getCenterSpawnPosition, currentFolderId]);

  // --- SPAWN NODE FROM BLUEPRINT ---
  const spawnBlueprintNode = useCallback((blueprintData) => {
    takeSnapshot();
    const centerPosition = getCenterSpawnPosition();
    const isFrame = blueprintData.isFrame || false;
    
    // Offset based on whether it's a frame or normal node
    if (isFrame) {
      centerPosition.x -= 200;
      centerPosition.y -= 150;
    } else {
      centerPosition.x -= 80;
      centerPosition.y -= 40;
    }

    setNodes((nds) => sortNodes([...nds, {
      id: `temp-${Date.now()}`,
      type: 'custom',
      position: centerPosition,
      dragHandle: isFrame ? '.custom-drag-handle' : undefined,
      style: { 
        width: isFrame ? 400 : 160, 
        height: isFrame ? 300 : 80 
      },
      zIndex: isFrame ? -1 : 1000,
      data: {
        label: blueprintData.label || blueprintData.nodeType,
        nodeType: blueprintData.nodeType,
        blueprintId: blueprintData.blueprintId,
        graphNodeId: null,
        nodeId: null,
        parentNode: currentFolderId ? `gn-${currentFolderId}` : null,
        isFrame: isFrame,
        width: isFrame ? 400 : 160,
        height: isFrame ? 300 : 80,
        customProps: blueprintData.customProps || {},
        customColor: blueprintData.color || undefined,
      },
    }]));
    markUnsaved();
  }, [setNodes, markUnsaved, takeSnapshot, getCenterSpawnPosition, currentFolderId]);

  // --- INTERACTIONS AND DRAG & DROP ---
  const onNodeClick = useCallback((_, clickedNode) => {
    setNodes((nds) => nds.map((n) => ({
      ...n,
      zIndex: n.id === clickedNode.id ? 1000 : (n.data?.isFrame ? -1 : 0)
    })));
  }, [setNodes]);

  const onNodeDoubleClick = useCallback(async (event, node) => {
    if (node.type === 'portal') {
      const targetGraphUuid = node.data.customProps?.target_graph_uuid;
      if (targetGraphUuid) {
        navigate(`/graphs/${targetGraphUuid}`);
      }
      return;
    }

    if (node.data?.isFrame) {
      // Fix 1: Mandatory Save before Navigation
      if (saveStatus !== 'saved') {
        if (saveStateRef.current) {
          await saveStateRef.current();
        }
      }
      setCurrentFolderId(node.data.graphNodeId);
    }
  }, [navigate, saveStatus]);

  const onNodeDragStart = useCallback((_event, draggedNode, draggedNodes) => {
    takeSnapshot();
    const draggedIds = new Set(draggedNodes.map((n) => n.id));
    const parentMap = new Map();

    setNodes((nds) => {
      for (const n of nds) {
        if (draggedIds.has(n.id) && n.parentId) {
          parentMap.set(n.id, n.parentId);
        }
      }
      originalParentIdsRef.current = parentMap;

      // FIX: Ya no despegamos el nodo acá para no pelear con las físicas de React Flow.
      return nds.map((n) => {
        if (draggedIds.has(n.id)) {
          return { ...n, zIndex: 1000 };
        }
        return { ...n, zIndex: n.data?.isFrame ? -1 : 0 };
      });
    });
  }, [setNodes, takeSnapshot]);

  const onNodeDrag = useCallback((_event, draggedNode) => {
    const originalParentId = originalParentIdsRef.current.get(draggedNode.id) || null;

    const validIntersections = getIntersectingNodes(draggedNode).filter((n) => {
      if (n.data?.isFrame !== true || n.id === draggedNode.id) return false;
      let current = n;
      while (current) {
        const pId = current.parentId || current.data?.parentNode;
        if (!pId) break;
        if (pId === draggedNode.id) return false;
        current = nodesRef.current.find(p => p.id === pId);
      }
      return true;
    });

    // Motor de profundidad genealógica real
    const getFrameDepth = (frameId) => {
      let depth = 0;
      let current = nodesRef.current.find(n => n.id === frameId);
      while (current && (current.parentId || current.data?.parentNode)) {
        depth++;
        const pId = current.parentId || current.data?.parentNode;
        current = nodesRef.current.find(n => n.id === pId);
      }
      return depth;
    };

    let deepestFrame = null;
    let maxDepth = -Infinity;

    for (const frame of validIntersections) {
      const currentDepth = getFrameDepth(frame.id);
      if (currentDepth > maxDepth) {
        maxDepth = currentDepth;
        deepestFrame = frame;
      }
    }

    const hoveredFrameId = deepestFrame?.id || null;
    const effectiveHoveredId = (hoveredFrameId === originalParentId || hoveredFrameId === draggedNode.id)
      ? null
      : hoveredFrameId;

    if (effectiveHoveredId === dragOverFrameIdRef.current) return;
    dragOverFrameIdRef.current = effectiveHoveredId;

    setNodes((currentNodes) =>
      currentNodes.map((n) => {
        if (!n.data?.isFrame) return n;
        const shouldHighlight = n.id === effectiveHoveredId;
        if (n.data.isDragOver === shouldHighlight) return n;
        return { ...n, data: { ...n.data, isDragOver: shouldHighlight } };
      })
    );
  }, [getIntersectingNodes, setNodes]);

  const onNodeDragStop = useCallback((_event, draggedNode, draggedNodes) => {
    dragOverFrameIdRef.current = null;
    const draggedIds = new Set(draggedNodes.map(n => n.id));
    const parentMap = originalParentIdsRef.current;
    let structureChanged = false;

    setNodes((currentNodes) => {
      let cleanedNodes = currentNodes.map((node) => {
        if (node.data?.isFrame && node.data.isDragOver) {
          return { ...node, data: { ...node.data, isDragOver: false } };
        }
        return node;
      });

      const getFrameDepth = (frameId) => {
        let depth = 0;
        let current = cleanedNodes.find(n => n.id === frameId);
        while (current && (current.parentId || current.data?.parentNode)) {
          depth++;
          const pId = current.parentId || current.data?.parentNode;
          current = cleanedNodes.find(n => n.id === pId);
        }
        return depth;
      };

      const getAbsPos = (nodeId) => {
        let current = cleanedNodes.find(n => n.id === nodeId);
        if (!current) return { x: 0, y: 0 };
        let x = current.position.x;
        let y = current.position.y;
        let pId = current.parentId;
        while (pId) {
          const p = cleanedNodes.find(n => n.id === pId);
          if (p) {
            x += p.position.x;
            y += p.position.y;
            pId = p.parentId;
          } else break;
        }
        return { x, y };
      };

      const updatedNodes = cleanedNodes.map((node) => {
        if (!draggedIds.has(node.id)) return node;

        const intersections = getIntersectingNodes(node).filter((n) => {
          if (n.data?.isFrame !== true || n.id === node.id || draggedIds.has(n.id)) return false;
          let current = n;
          while (current) {
            const pId = current.parentId || current.data?.parentNode;
            if (!pId) break;
            if (pId === node.id) return false;
            current = cleanedNodes.find(p => p.id === pId);
          }
          return true;
        });

        let deepestTarget = null;
        let maxDepth = -Infinity;

        for (const frame of intersections) {
          const currentDepth = getFrameDepth(frame.id);
          if (currentDepth > maxDepth) {
            maxDepth = currentDepth;
            deepestTarget = frame;
          }
        }

        const originalParentId = parentMap.get(node.id) || null;

        // --- CAÍDA DENTRO DE UN MARCO ---
        if (deepestTarget) {
          if (deepestTarget.id !== originalParentId) structureChanged = true;

          const nodeAbsPos = getAbsPos(node.id);
          const targetAbsPos = getAbsPos(deepestTarget.id);

          const relativeX = nodeAbsPos.x - targetAbsPos.x;
          const relativeY = nodeAbsPos.y - targetAbsPos.y;

          return {
            ...node,
            position: { x: relativeX, y: relativeY },
            parentId: deepestTarget.id,
            // ¡ELIMINAMOS extent: 'parent' para que no quede atrapado al soltarlo!
            zIndex: 1000,
            data: {
              ...node.data,
              parentNode: deepestTarget.id,
              isDragOver: false
            },
          };
        }

        // --- CAÍDA AFUERA (FONDO / CANVAS) ---
        if (originalParentId || currentFolderId) structureChanged = true;

        const nodeAbsPos = getAbsPos(node.id); // Guardamos la absoluta antes de romper el vínculo

        // Si se suelta afuera, le borramos el parentId de React Flow
        // y lo posicionamos en absoluto
        const detachedNode = { ...node };
        delete detachedNode.parentId; // ¡CLAVE PARA SACARLO DEL FRAME!

        return {
          ...detachedNode,
          position: nodeAbsPos, // Posición global absoluta
          zIndex: 0,
          data: {
            ...detachedNode.data,
            parentNode: currentFolderId ? `gn-${currentFolderId}` : null,
            isDragOver: false
          },
        };
      });

      return sortNodes(updatedNodes);
    });

    originalParentIdsRef.current = new Map();
    if (structureChanged) markUnsaved();
  }, [getIntersectingNodes, setNodes, markUnsaved, currentFolderId]);

  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  nodesRef.current = nodes;
  edgesRef.current = edges;

  // --- LÓGICA DE GUARDADO EN BLOQUE ---
  const saveState = useCallback(async () => {
    if (!graphUuid || !graphId || !projectId) return;
    setSaveStatus('saving');

    try {
      const nodesPayload = nodesRef.current.map((node) => {
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
          height: getDim('height', isFrame ? 300 : undefined),
          custom_properties: node.data.customProps || {},
          blueprint_id: node.data.blueprintId || null,
        };
      });

      const hasNewEdges = edgesRef.current.some((e) => !e.id.startsWith('conn-'));
      let defaultConnectionTypeId = null;
      if (hasNewEdges) {
        const defaultConnectionType = await getOrCreateDefaultConnectionType(projectId);
        defaultConnectionTypeId = defaultConnectionType.id;
      }

      const connectionsPayload = edgesRef.current.map((edge) => {
        const isExisting = edge.id.startsWith('conn-');
        
        // FIX 3: Bulletproof handle position conversion
        // Always ensure we get either a float or null, never undefined or NaN
        let sourceHandlePos = handleStrToFloat(edge.sourceHandle || edge.data?.sourceHandlePosition);
        let targetHandlePos = handleStrToFloat(edge.targetHandle || edge.data?.targetHandlePosition);
        
        // Guarantee valid values: must be null or a finite number
        sourceHandlePos = (typeof sourceHandlePos === 'number' && isFinite(sourceHandlePos)) ? sourceHandlePos : null;
        targetHandlePos = (typeof targetHandlePos === 'number' && isFinite(targetHandlePos)) ? targetHandlePos : null;
        
        if (edge.data?.isHoisted) {
          // For hoisted edges, use original positions (with fallback to null if originals missing/invalid)
          let originalSource = edge.data?.originalSourceHandle;
          let originalTarget = edge.data?.originalTargetHandle;
          
          sourceHandlePos = (typeof originalSource === 'number' && isFinite(originalSource)) ? originalSource : sourceHandlePos;
          targetHandlePos = (typeof originalTarget === 'number' && isFinite(originalTarget)) ? originalTarget : targetHandlePos;
        }
        
        // Get connectionTypeId - for existing edges, must use the stored value
        let connTypeId = null;
        if (isExisting) {
          // For updates, use stored connectionTypeId or fallback to defaultConnectionTypeId
          connTypeId = edge.data?.connectionTypeId || defaultConnectionTypeId;
        } else {
          // For new edges, use defaultConnectionTypeId
          connTypeId = defaultConnectionTypeId;
        }
        
        return {
          connection_id: isExisting ? parseInt(edge.id.replace('conn-', ''), 10) : null,
          source_temp_id: edge.source,
          target_temp_id: edge.target,
          connection_type_id: connTypeId,
          label: edge.data?.label || '',
          direction: edge.data?.direction || 'forward',

          source_handle_position: sourceHandlePos,
          target_handle_position: targetHandlePos,

          is_hoisted: edge.data?.isHoisted === true,
        };
      });

      const result = await saveCanvasBulk(graphUuid, projectId, {
        nodes: nodesPayload,
        connections: connectionsPayload,
      });

      const createdNodes = result.nodes?.created || [];
      const createdConns = result.connections?.created || [];

      // Invalidate feed if any nodes or connections were created
      if (createdNodes.length > 0 || createdConns.length > 0) {
        invalidateActivityFeed();
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
  }, [graphUuid, graphId, projectId, invalidateActivityFeed, setNodes, setEdges]);

  // Store saveState in a ref so we can call it without recreating the effect
  useEffect(() => {
    saveStateRef.current = saveState;
  }, [saveState]);

  // Auto-save effect - only depends on saveStatus, uses ref to call saveState
  useEffect(() => {
    if (saveStatus !== 'unsaved') return;
    
    const timerId = setTimeout(() => {
      saveStateRef.current();
    }, 2500);
    
    return () => clearTimeout(timerId);
  }, [saveStatus]);

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
        style: !isCurrentlyFrame ? { width: frameWidth, height: frameHeight } : {},
        zIndex: !isCurrentlyFrame ? -1 : 1000,
        data: { ...node.data, isFrame: !isCurrentlyFrame, width: !isCurrentlyFrame ? frameWidth : node.data.width, height: !isCurrentlyFrame ? frameHeight : node.data.height },
      };
    }));
    markUnsaved();
    setContextMenu(null);
  }, [setNodes, markUnsaved, takeSnapshot]);

  const rightMouseDownPosRef = useRef(null);
  const isPanningRef = useRef(false);

  // Manual right-click handling: pan on drag, context menu on static click
  useEffect(() => {
    const wrapper = reactFlowWrapper.current;
    if (!wrapper) return;

    const suppress = (e) => e.preventDefault();

    const handleMouseDown = (e) => {
      if (e.button !== 2) return;
      rightMouseDownPosRef.current = { x: e.clientX, y: e.clientY };
      isPanningRef.current = false;
    };

    const handleMouseMove = (e) => {
      const start = rightMouseDownPosRef.current;
      if (!start) return;

      const dx = e.clientX - start.x;
      const dy = e.clientY - start.y;

      if (!isPanningRef.current && (Math.abs(dx) > 3 || Math.abs(dy) > 3)) {
        isPanningRef.current = true;
      }

      if (isPanningRef.current) {
        const vp = getViewport();
        setViewport({ x: vp.x + (e.movementX), y: vp.y + (e.movementY), zoom: vp.zoom });
      }
    };

    const handleMouseUp = (e) => {
      if (e.button !== 2) return;
      const start = rightMouseDownPosRef.current;
      const wasPanning = isPanningRef.current;
      rightMouseDownPosRef.current = null;
      isPanningRef.current = false;
      if (!start || wasPanning) return;

      // Static right-click → open context menu
      const target = document.elementFromPoint(e.clientX, e.clientY);
      const rfNodeEl = target?.closest('.react-flow__node');
      const rfEdgeEl = target?.closest('.react-flow__edge');

      if (rfNodeEl) {
        const nodeId = rfNodeEl.getAttribute('data-id');
        const node = nodesRef.current.find((n) => n.id === nodeId);
        if (node) {
          setContextMenu({
            type: 'node',
            nodeId: node.id,
            node,
            isFrame: node.data.isFrame === true,
            x: e.clientX,
            y: e.clientY,
          });
        }
      } else if (rfEdgeEl) {
        const edgeId = rfEdgeEl.getAttribute('data-testid')?.replace('rf__edge-', '');
        const edge = edgesRef.current.find((ed) => ed.id === edgeId);
        if (edge) {
          setContextMenu({ type: 'edge', edgeId: edge.id, edge, x: e.clientX, y: e.clientY });
        }
      }
    };

    wrapper.addEventListener('contextmenu', suppress);
    wrapper.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      wrapper.removeEventListener('contextmenu', suppress);
      wrapper.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [getViewport, setViewport]);

  useEffect(() => {
    const handleClickOutside = (event) => { if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) setContextMenu(null); };
    if (contextMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [contextMenu]);

  const onNodesDelete = useCallback((deletedNodes) => {
    takeSnapshot();
    const allDeletedIds = new Set(deletedNodes.map(n => n.id));
    const toDeleteBackend = [...deletedNodes];

    // Fix 3: Recursive Frontend Cascade Delete
    const findChildren = (parentIds) => {
      const children = nodes.filter(n =>
        (n.parentId && parentIds.has(n.parentId)) ||
        (n.data?.parentNode && parentIds.has(n.data.parentNode))
      );

      const newFoundIds = new Set();
      for (const child of children) {
        if (!allDeletedIds.has(child.id)) {
          allDeletedIds.add(child.id);
          toDeleteBackend.push(child);
          newFoundIds.add(child.id);
        }
      }

      if (newFoundIds.size > 0) {
        findChildren(newFoundIds);
      }
    };

    findChildren(new Set(deletedNodes.map(n => n.id)));

    // Update local state: remove the nodes and their incoming/outgoing edges
    setNodes(nds => nds.filter(n => !allDeletedIds.has(n.id)));
    setEdges(eds => eds.filter(e => !allDeletedIds.has(e.source) && !allDeletedIds.has(e.target)));

    // Backend calls: only if they have a graphNodeId
    for (const node of toDeleteBackend) {
      if (node.data?.graphNodeId) {
        deleteGraphNode(node.data.graphNodeId).catch(console.error);
      }
    }
    markUnsaved();
  }, [nodes, setNodes, setEdges, takeSnapshot, markUnsaved]);

  const onGoUp = useCallback(async () => {
    if (saveStatus !== 'saved' && saveStateRef.current) {
      await saveStateRef.current();
    }
    setCurrentFolderId(parentFolderId);
  }, [saveStatus, parentFolderId]);

  return (
    <div className="w-full h-full flex flex-col bg-[rgb(var(--color-bg))] overflow-hidden" ref={reactFlowWrapper}>
      <Toolbar
        onCreateNode={createNode}
        onCreateFrame={createFrame}
        saveStatus={saveStatus}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
        onZoomOut={currentFolderId ? onGoUp : null}
        onAddPortal={() => setIsPortalModalOpen(true)}
        onOpenNodeLab={() => setIsNodeLabOpen(true)}
      />

      <div className="flex-1 relative" ref={reactFlowWrapper}>
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
          onNodesDelete={onNodesDelete}
          onEdgesDelete={useCallback((deletedEdges) => { for (const edge of deletedEdges) { if (edge.id.startsWith('conn-')) deleteConnection(edge.id.replace('conn-', '')).catch(console.error); } }, [])}
          onEdgeDoubleClick={useCallback((event, edge) => { event.preventDefault(); event.stopPropagation(); setEditingEdge(edge); }, [])}
          onNodeDragStart={onNodeDragStart}
          onNodeDrag={onNodeDrag}
          onNodeDragStop={onNodeDragStop}
          onNodeClick={onNodeClick}
          onNodeDoubleClick={onNodeDoubleClick}
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

        {currentFolderName && (
          <div className="absolute inset-3 pointer-events-none z-10 flex flex-col items-center justify-start transition-opacity duration-500">
            {/* Border / Frame */}
            <div className="absolute inset-0 border-2 border-cyan-500/30 border-dashed rounded-2xl bg-cyan-500/[0.02]"></div>

            {/* Badge */}
            <div className="relative mt-0 inline-flex items-center gap-2 px-4 py-1.5 bg-[rgb(var(--color-bg))] border-x border-b border-cyan-500/30 rounded-b-lg shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-cyan-500" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <span className="text-[10px] font-bold text-cyan-500 tracking-wider uppercase">
                {currentFolderName}
              </span>
            </div>
          </div>
        )}

        {contextMenu && (
          <div ref={contextMenuRef} className="fixed z-[9999] min-w-[200px] bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-lg shadow-xl py-1.5" style={{ top: contextMenu.y, left: contextMenu.x }}>
            {contextMenu.type === 'node' && (
              <>
                <button type="button" onClick={() => { setEditingNode(contextMenu.node); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer">{t('graphCanvas.contextMenu.properties')}</button>
                <button type="button" onClick={() => toggleFrameMode(contextMenu.nodeId)} className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer">{contextMenu.isFrame ? t('graphCanvas.contextMenu.convertToNode') : t('graphCanvas.contextMenu.convertToFrame')}</button>
                <div className="h-px bg-[rgb(var(--color-border))] my-1 w-full" />
                <button type="button" onClick={() => { deleteElements({ nodes: [{ id: contextMenu.nodeId }] }); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-colors">{t('graphCanvas.contextMenu.deleteNode')}</button>
              </>
            )}
            {contextMenu.type === 'edge' && (
              <>
                <button type="button" onClick={() => { setEditingEdge(contextMenu.edge); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm text-[rgb(var(--color-text))] hover:bg-[rgb(var(--color-bg-secondary))] cursor-pointer">{t('graphCanvas.contextMenu.configureEdge')}</button>
                <div className="h-px bg-[rgb(var(--color-border))] my-1 w-full" />
                <button type="button" onClick={() => { deleteElements({ edges: [{ id: contextMenu.edgeId }] }); setContextMenu(null); }} className="w-full px-4 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-500/10 hover:text-red-400 cursor-pointer transition-colors">{t('graphCanvas.contextMenu.deleteEdge')}</button>
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
      <PortalCreationModal
        isOpen={isPortalModalOpen}
        onClose={() => setIsPortalModalOpen(false)}
        onSelect={createPortalNode}
        projectId={projectId}
      />

      <NodeLabModal
        isOpen={isNodeLabOpen}
        onClose={() => setIsNodeLabOpen(false)}
        onSpawnNode={spawnBlueprintNode}
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

