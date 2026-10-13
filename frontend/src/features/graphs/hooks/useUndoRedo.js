import { useCallback, useEffect, useRef, useState } from 'react';

const MAX_HISTORY_SIZE = 50;

export default function useUndoRedo(nodes, edges, setNodes, setEdges, markUnsaved) {
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);

  // We use references (refs) to always have the most current state without causing
  // useCallback to be re-rendered (this saves React Flow performance).
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
    setFuture([]); // If you do something new, you lose the future (Redo empties itself)
  }, []);

  const undo = useCallback(() => {
    setPast((currentPast) => {
      if (currentPast.length === 0) return currentPast;

      const previous = currentPast[currentPast.length - 1];
      const newPast = currentPast.slice(0, currentPast.length - 1);

      setFuture((f) => [{ nodes: currentNodes.current, edges: currentEdges.current }, ...f]);

      setNodes(previous.nodes);
      setEdges(previous.edges);
      markUnsaved(); // We are announcing a change to the auto-save feature.

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
      markUnsaved(); // We are announcing a change to the auto-save feature.

      return newFuture;
    });
  }, [setNodes, setEdges, markUnsaved]);

  // Universal keyboard shortcuts (Ctrl+Z and Ctrl+Y)
  useEffect(() => {
    const handleKeyDown = (e) => {
      // We ignore whether the user is typing inside an input or textarea
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