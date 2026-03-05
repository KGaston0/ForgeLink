import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_HISTORY_SIZE = 50;

export default function useUndoRedo(nodes, edges, setNodes, setEdges, markUnsaved) {
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // Usamos referencias (refs) para siempre tener el estado más actual sin causar
  // que useCallback se re-renderice (esto salva el rendimiento de React Flow).
  const currentNodes = useRef(nodes);
  const currentEdges = useRef(edges);

  useEffect(() => {
    currentNodes.current = nodes;
    currentEdges.current = edges;
  }, [nodes, edges]);

  const takeSnapshot = useCallback(() => {
    setPast((p) => {
      const newPast = [...p, { nodes: currentNodes.current, edges: currentEdges.current }];
      if (newPast.length > MAX_HISTORY_SIZE) {
        return newPast.slice(newPast.length - MAX_HISTORY_SIZE);
      }
      return newPast;
    });
    setFuture([]); // Si haces algo nuevo, pierdes el futuro (Redo se vacía)
  }, []);

  const undo = useCallback(() => {
    setPast((currentPast) => {
      if (currentPast.length === 0) return currentPast;

      const previous = currentPast[currentPast.length - 1];
      const newPast = currentPast.slice(0, currentPast.length - 1);

      setFuture((f) => [{ nodes: currentNodes.current, edges: currentEdges.current }, ...f]);

      setNodes(previous.nodes);
      setEdges(previous.edges);
      markUnsaved(); // Avisamos que hay un cambio para auto-guardar

      return newPast;
    });
  }, [setNodes, setEdges, markUnsaved]);

  const redo = useCallback(() => {
    setFuture((currentFuture) => {
      if (currentFuture.length === 0) return currentFuture;

      const next = currentFuture[0];
      const newFuture = currentFuture.slice(1);

      setPast((p) => [...p, { nodes: currentNodes.current, edges: currentEdges.current }]);

      setNodes(next.nodes);
      setEdges(next.edges);
      markUnsaved(); // Avisamos que hay un cambio para auto-guardar

      return newFuture;
    });
  }, [setNodes, setEdges, markUnsaved]);

  // Atajos de teclado universales (Ctrl+Z y Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignoramos si el usuario está escribiendo adentro de un input o textarea
      if (e.target.tagName.toLowerCase() === 'input' || e.target.tagName.toLowerCase() === 'textarea') {
        return;
      }

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return { undo, redo, takeSnapshot, canUndo: past.length > 0, canRedo: future.length > 0 };
}