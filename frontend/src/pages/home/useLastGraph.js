import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api/apiClient';

/**
 * Hook to fetch the last modified graph
 *
 * Returns the most recently updated graph for display in ResumeWork
 *
 * @returns {{ graph, loading, error, refresh }}
 */
export default function useLastGraph() {
  const [graph, setGraph] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchLastGraph = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Fetch all graphs, paginated with ordering by updated_at
      const response = await apiClient.get('/graphs/?ordering=-updated_at&limit=1');
      const graphs = Array.isArray(response.data?.results)
        ? response.data.results
        : Array.isArray(response.data)
        ? response.data
        : [];

      if (graphs.length > 0) {
        // Ya no necesitamos hacer otro fetch, el backend nos manda 'project_name'
        setGraph(graphs[0]);
      } else {
        setGraph(null);
      }
    } catch (err) {
      setError('Could not load recent graph');
      setGraph(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLastGraph();
  }, [fetchLastGraph]);

  return { graph, loading, error, refresh: fetchLastGraph };
}