import { useState, useEffect, useCallback } from 'react';
import apiClient from '../../services/api/apiClient';

/**
 * Fetches real-time dashboard statistics and recent projects
 * for the authenticated user.
 *
 * @returns {{ stats, recentProjects, loading, error, refresh }}
 */
export default function useDashboardStats() {
  const [stats, setStats] = useState({ projects: 0, graphs: 0, nodes: 0 });
  const [recentProjects, setRecentProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalizeList = (data) =>
    Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const [projectsRes, graphsRes, nodesRes, recentRes] = await Promise.all([
        apiClient.get('/projects/'),
        apiClient.get('/graphs/'),
        apiClient.get('/nodes/'),
        apiClient.get('/projects/recent/'),
      ]);

      const projectsList = normalizeList(projectsRes.data);
      const graphsList = normalizeList(graphsRes.data);
      const nodesList = normalizeList(nodesRes.data);
      const recent = normalizeList(recentRes.data);

      setStats({
        projects: projectsList.length,
        graphs: graphsList.length,
        nodes: nodesList.length,
      });
      setRecentProjects(recent);
    } catch {
      setError('Could not load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { stats, recentProjects, loading, error, refresh: fetchAll };
}

