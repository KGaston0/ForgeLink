import { createContext, useContext, useState, useCallback } from 'react';

/**
 * ActivityFeedContext
 *
 * Provides a way to invalidate the activity feed cache when new items are created.
 * This ensures the feed is refreshed whenever a project, graph, or node is created.
 */
const ActivityFeedContext = createContext();

export function ActivityFeedProvider({ children }) {
  const [invalidationCount, setInvalidationCount] = useState(0);

  const invalidateActivityFeed = useCallback(() => {
    setInvalidationCount((prev) => prev + 1);
  }, []);

  const value = {
    invalidationCount,
    invalidateActivityFeed,
  };

  return (
    <ActivityFeedContext.Provider value={value}>
      {children}
    </ActivityFeedContext.Provider>
  );
}

export function useActivityFeedInvalidation() {
  const context = useContext(ActivityFeedContext);
  if (!context) {
    throw new Error('useActivityFeedInvalidation must be used within ActivityFeedProvider');
  }
  return context;
}

