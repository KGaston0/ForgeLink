import { useTranslation } from 'react-i18next';
import { Star, ArrowRight } from 'lucide-react';

/**
 * SystemUpdates Component
 *
 * "What's New" section with landing-style mock updates
 * Displays version, title, date, and description
 */
export default function SystemUpdates() {
  const { t } = useTranslation();

  const updates = t('dashboard.systemUpdates.updates', { returnObjects: true });

  return (
    <div
      className="p-6 bg-[rgb(var(--color-bg-secondary))] border border-border rounded-2xl"
      role="complementary"
      aria-label="System updates and release notes"
    >
      <div className="flex items-center gap-2 mb-6">
        <Star className="h-5 w-5 text-primary" aria-hidden="true" />
        <h3 className="text-lg font-semibold text-foreground">{t('dashboard.systemUpdates.title')}</h3>
      </div>

      <div className="space-y-4">
        {updates.map((update) => {
          const releaseDate = new Date(update.date).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          });

          return (
            <div
              key={update.version}
              className="p-4 bg-[rgb(var(--color-bg))] rounded-lg hover:bg-[rgb(var(--color-bg))]/80 transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <span className="text-xl shrink-0" aria-hidden="true">
                  {update.icon}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="text-xs font-mono text-primary font-bold">
                      {update.version}
                    </span>
                    <h4 className="text-sm font-semibold text-foreground">
                      {update.title}
                    </h4>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {update.description}
                  </p>
                  <span className="text-xs text-muted-foreground font-mono">
                    {releaseDate}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" aria-hidden="true" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

