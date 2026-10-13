import { useState, useEffect, useCallback, useRef } from 'react';
import apiClient from '../../services/api/apiClient';
import { useActivityFeedInvalidation } from '../../context/ActivityFeedContext';

/**
 * Hook to fetch user activity feed
 *
 * Aggregates recent activities from graphs, projects, and nodes
 * by their updated_at timestamps, showing the most recent 5 items.
 *
 * Fetches safely using Promise.allSettled to prevent full crashes
 * if a single endpoint fails.
 *
 * @returns {{ activities, loading, error, refresh }}
 */
export default function useActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const pollIntervalRef = useRef(null);
  const { invalidationCount } = useActivityFeedInvalidation();

  const normalizeList = (data) =>
    Array.isArray(data?.results) ? data.results : Array.isArray(data) ? data : [];

  const fetchActivityFeed = useCallback(async () => {

    setLoading(true);
    setError('');

    try {
      // Fetch all graphs, projects, and nodes in parallel - SAFELY
      const results = await Promise.allSettled([
        apiClient.get('/graphs/?ordering=-updated_at'),
        apiClient.get('/projects/?ordering=-updated_at'),
        apiClient.get('/nodes/?ordering=-updated_at'),
      ]);

      // Extraemos la data solo si la promesa se resolvió bien ('fulfilled')
      const graphs = results[0].status === 'fulfilled' ? normalizeList(results[0].value.data) : [];
      const projects = results[1].status === 'fulfilled' ? normalizeList(results[1].value.data) : [];
      const nodes = results[2].status === 'fulfilled' ? normalizeList(results[2].value.data) : [];

      // Build activity items from all sources
      const fetchedActivities = [];

      // Add graphs as activities
      graphs.forEach((graph) => {
        fetchedActivities.push({
          id: `graph-${graph.uuid}`,
          action: 'updated',
          target_type: 'graph',
          target_name: graph.name,
          target_uuid: graph.uuid,
          timestamp: graph.updated_at,
          created_at: graph.created_at,
        });
      });

      // Add projects as activities
      projects.forEach((project) => {
        fetchedActivities.push({
          id: `project-${project.uuid}`,
          action: 'updated',
          target_type: 'project',
          target_name: project.name,
          target_uuid: project.uuid,
          timestamp: project.updated_at,
          created_at: project.created_at,
        });
      });

      // Add nodes as activities
      nodes.forEach((node) => {
        fetchedActivities.push({
          id: `node-${node.id}`,
          action: 'updated',
          target_type: 'node',
          target_name: node.title || `Node #${node.id}`,
          target_uuid: node.id,
          timestamp: node.updated_at,
          created_at: node.created_at,
        });
      });

      // Sort by timestamp (most recent first) and take top 5
      const sortedActivities = fetchedActivities
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

      // Enrich with action type based on created_at vs updated_at
      const enrichedActivities = sortedActivities.map((activity) => {
        const createdDate = new Date(activity.created_at);
        const updatedDate = new Date(activity.timestamp);

        // If created and updated are very close (within 1 minute), it's a "created" action
        const timeDiff = Math.abs(updatedDate - createdDate) / 1000; // seconds
        const action = timeDiff < 60 ? 'created' : 'updated';

        return { ...activity, action };
      });

      setActivities(enrichedActivities);
    } catch (err) {
      console.error('Error fetching activity feed:', err);
      setError('Could not load recent activity');
      setActivities([]);
    } finally {
      // Apagamos el estado de carga (esto oculta tu spinner)
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetch immediately on mount or when activity feed is invalidated
    fetchActivityFeed();

    // Cleanup function
    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [fetchActivityFeed, invalidationCount]);

  return { activities, loading, error, refresh: fetchActivityFeed };
}