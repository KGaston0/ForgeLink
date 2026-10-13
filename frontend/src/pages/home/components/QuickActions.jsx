import { useTranslation } from 'react-i18next';
import { Plus, Lightbulb, Search } from 'lucide-react';

/**
 * QuickActions Component
 *
 * Grid of 3 action buttons:
 * - New Project: Opens project creation flow
 * - Quick Note: Mock action for future node creation
 * - Global Search: Mock action for future search
 */
export default function QuickActions({ onNewProject }) {
  const { t } = useTranslation();

  const actions = [
    {
      id: 'new-project',
      label: t('dashboard.quickActions.newProject.label'),
      icon: Plus,
      description: t('dashboard.quickActions.newProject.description'),
      onClick: onNewProject,
    },
    {
      id: 'quick-note',
      label: t('dashboard.quickActions.quickNote.label'),
      icon: Lightbulb,
      description: t('dashboard.quickActions.quickNote.description'),
      onClick: () => {
        // Mock action - prepared for future node creation
        console.log('Quick note action triggered');
      },
    },
    {
      id: 'global-search',
      label: t('dashboard.quickActions.globalSearch.label'),
      icon: Search,
      description: t('dashboard.quickActions.globalSearch.description'),
      onClick: () => {
        // Mock action - prepared for future global search
        console.log('Global search action triggered');
      },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {actions.map(({ id, label, icon: Icon, description, onClick }) => (
        <button
          key={id}
          onClick={onClick}
          className="btn-secondary flex flex-col items-center justify-center gap-3 py-6 h-32 hover:scale-105 transition-transform"
          aria-label={description}
        >
          <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
          <span className="text-sm font-medium">{label}</span>
        </button>
      ))}
    </div>
  );
}

