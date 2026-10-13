import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Sparkles, PencilRuler, Link2, Trash2, Circle } from 'lucide-react';

/**
 * ActivityFeed Component
 *
 * Vertical timeline of the last 5 user actions
 * Displays: action type, target name, and technical timestamp
 *
 * Activity object structure:
 * {
 *   id: string | number,
 *   action: 'created' | 'updated' | 'linked' | 'deleted',
 *   target_type: 'graph' | 'project',
 *   target_name: string,
 *   target_uuid: string (UUID of graph or project),
 *   timestamp: ISO string,
 * }
 */
export default function ActivityFeed({ activities = [] }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const getActivityIcon = (action, targetType = null) => {
    // Iconos por tipo de target (más específico)
    if (targetType === 'graph') return Link2;        // 🔗 Red/gráfico de conexiones
    if (targetType === 'project') return PencilRuler; // ✏️ Lápiz para proyectos
    if (targetType === 'node') return Circle;        // 🔵 Círculo para nodos

    // Iconos por acción (fallback)
    const iconMap = {
      created: Sparkles,      // ✨ Nuevo/creado
      updated: PencilRuler,   // ✏️ Actualizado/editado
      linked: Link2,          // 🔗 Vinculado
      deleted: Trash2,        // 🗑️ Eliminado
    };
    return iconMap[action] || PencilRuler;
  };

  const getActivityColor = (action) => {
    const colorMap = {
      created: 'text-green-500',
      updated: 'text-blue-500',
      linked: 'text-purple-500',
      deleted: 'text-red-500',
    };
    return colorMap[action] || 'text-muted-foreground';
  };

  const handleActivityClick = (activity) => {
    if (!activity.target_uuid) return;

    if (activity.target_type === 'graph') {
      navigate(`/graphs/${activity.target_uuid}`);
    } else if (activity.target_type === 'project') {
      navigate(`/projects/${activity.target_uuid}`);
    } else if (activity.target_type === 'node') {
      // For nodes, we would need the graph UUID - skip navigation for now
      console.log('Node activity:', activity);
    }
  };

  // Show real activities only - no mock data
  const displayActivities = activities.slice(0, 5);

  return (
    <div
      className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-border rounded-2xl h-fit sticky top-8"
      role="complementary"
      aria-label="Recent activity timeline"
    >
      <h3 className="text-lg font-semibold text-foreground mb-6">
        {t('dashboard.activityFeed.title')}
      </h3>

      {displayActivities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="mb-3 text-muted-foreground/50">
            <svg
              className="w-12 h-12 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-sm text-muted-foreground">
            {t('dashboard.activityFeed.noActivity')}
          </p>
          <p className="text-xs text-muted-foreground/70 mt-1">
            {t('dashboard.activityFeed.startMessage')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {displayActivities.map((activity, index) => {
          const Icon = getActivityIcon(activity.action, activity.target_type);
          const colorClass = getActivityColor(activity.action);
          const timeStr = new Date(activity.timestamp).toLocaleString(undefined, {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          });
          const isClickable = Boolean(activity.target_uuid && (activity.target_type === 'graph' || activity.target_type === 'project'));

          return (
            <button
              key={activity.id || index}
              onClick={() => handleActivityClick(activity)}
              disabled={!isClickable}
              className={`w-full text-left flex gap-4 pb-4 last:pb-0 border-b border-border/50 last:border-b-0 transition-all ${
                isClickable
                  ? 'hover:bg-[rgb(var(--color-bg))]/30 rounded px-2 -mx-2 cursor-pointer'
                  : 'cursor-default'
              }`}
              aria-label={`${activity.action} ${activity.target_name}${
                activity.target_type ? ` (${activity.target_type})` : ''
              }`}
            >
              {/* Timeline dot and line */}
              <div className="flex flex-col items-center pt-1 flex-shrink-0">
                <div
                  className={`w-8 h-8 rounded-full bg-[rgb(var(--color-bg))] border-2 border-border flex items-center justify-center ${colorClass}`}
                  aria-hidden="true"
                >
                  <Icon className="h-4 w-4" />
                </div>
                {index !== displayActivities.length - 1 && (
                  <div className="w-0.5 h-8 bg-border/50 mt-2" aria-hidden="true" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-1">
                <p className="text-sm text-foreground truncate">
                  {activity.action === 'created' && 'Created '}
                  {activity.action === 'updated' && 'Updated '}
                  {activity.action === 'linked' && 'Linked '}
                  {activity.action === 'deleted' && 'Deleted '}
                  <span className="font-medium">{activity.target_name}</span>
                  {activity.target_type && (
                    <span className="text-xs text-muted-foreground ml-2">
                      ({activity.target_type})
                    </span>
                  )}
                </p>
                <p className="text-xs text-muted-foreground font-mono mt-1">
                  {timeStr}
                </p>
              </div>
            </button>
          );
        })}
        </div>
      )}
    </div>
  );
}



