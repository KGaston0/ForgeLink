import { useTranslation } from 'react-i18next';
import Sidebar from '@/components/layout/Sidebar';
import GraphCanvas from '../../features/graphs/components/GraphCanvas';
import { useParams } from 'react-router-dom';

export default function GraphCanvasPage() {
  const { id } = useParams();
  const { t } = useTranslation();

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-hidden relative">
        {id ? (
          <GraphCanvas graphUuid={id} />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-[rgb(var(--color-text-secondary))]">
            {t('graphCanvas.selectGraph')}
          </div>
        )}
      </main>
    </div>
  );
}
