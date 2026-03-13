import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Sidebar from '@/components/layout/Sidebar';
import { useAuth } from '../../context/AuthContext';
import ResumeWork from './components/ResumeWork';
import QuickActions from './components/QuickActions';
import ActivityFeed from './components/ActivityFeed';
import SystemUpdates from './components/SystemUpdates';
import useLastGraph from './useLastGraph';
import useActivityFeed from './useActivityFeed';

/**
 * Dashboard - Command Center
 *
 * A responsive Bento Grid layout featuring:
 * - ResumeWork (Hero): Last modified graph with continue editing
 * - QuickActions: New Project, Quick Note, Global Search buttons
 * - ActivityFeed: Technical timeline of recent actions (side column)
 * - SystemUpdates: What's New section with release notes
 */
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Extraemos datos y loading del último grafo
  const { graph, loading: graphLoading, error: graphError } = useLastGraph();

  // Extraemos actividades
  const { activities } = useActivityFeed();

  const handleNewProject = () => {
    navigate('/projects');
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 overflow-y-auto p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">{t('dashboard.commandCenter')}</h1>
            <p className="text-muted-foreground mt-2">
              {t('dashboard.header.greeting', { username: user?.user?.username || 'Explorer' })}
            </p>
          </header>

          {/* Command Center Grid - Responsive Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column: Main content (2/3 width on desktop) */}
            <div className="lg:col-span-2 space-y-6">
              {/* ResumeWork - Hero Section */}
              <section role="region" aria-label="Resume work section">
                <ResumeWork graph={graph} loading={graphLoading} error={graphError} />
              </section>

              {/* QuickActions */}
              <section role="region" aria-label="Quick actions">
                <QuickActions onNewProject={handleNewProject} />
              </section>

              {/* SystemUpdates */}
              <section role="region" aria-label="System updates">
                <SystemUpdates />
              </section>
            </div>

            {/* Right column: Sidebar (1/3 width on desktop) */}
            <div>
              {/* Le pasamos ambas props al feed */}
              <ActivityFeed activities={activities} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}