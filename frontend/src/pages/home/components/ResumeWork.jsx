import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Clock } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

/**
 * ResumeWork Component (Hero Section)
 *
 * Displays the last modified graph with:
 * - Graph name and project
 * - Last modified timestamp
 * - Continue Editing button linking to graph editor
 */
export default function ResumeWork({ graph, loading, error }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (loading) {
    return (
      <div
        className="p-8 bg-[rgb(var(--color-bg-secondary))] border border-border rounded-2xl flex items-center justify-center min-h-[240px]"
        role="status"
        aria-busy={true}
        aria-label="Loading recent graph"
      >
        <LoadingSpinner size="medium" fullScreen={false} />
      </div>
    );
  }

  if (error || !graph) {
    return (
      <div className="p-8 bg-[rgb(var(--color-bg-secondary))] border border-border rounded-2xl text-center">
        <p className="text-muted-foreground mb-4">
          {error || t('dashboard.resumeWork.noGraphs')}
        </p>
      </div>
    );
  }

  const lastModified = new Date(graph.updated_at).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="p-8 bg-gradient-to-br from-[rgb(var(--color-bg-secondary))] to-[rgb(var(--color-bg-secondary))]/50 border border-primary/20 rounded-2xl hover:border-primary/40 transition-colors">
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-foreground mb-2 font-sans tracking-tight">
            {graph.name}
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            {graph.project_name}
          </p>
        </div>
        <Clock className="h-6 w-6 text-primary/60 shrink-0 ml-4" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-2 mb-6 pb-4 border-b border-border/50">
        <span className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
          {t('dashboard.resumeWork.title')}
        </span>
        <span className="text-sm text-foreground font-sans">
          {lastModified}
        </span>
      </div>

      <button
        onClick={() => navigate(`/graphs/${graph.uuid}`)}
        className="btn-primary flex items-center gap-2 group"
        aria-label={t('dashboard.resumeWork.ariaLabel', { graphName: graph.name })}
      >
        {t('dashboard.resumeWork.continueEditing')}
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
      </button>
    </div>
  );
}

