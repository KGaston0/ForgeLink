import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import apiClient from '@/services/api/apiClient';
import LoadingSpinner from '@/components/ui/loading-spinner';

const PortalCreationModal = ({ isOpen, onClose, onSelect, projectId }) => {
  const { t } = useTranslation();
  const [graphs, setGraphs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedGraphUuid, setSelectedGraphUuid] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && projectId) {
      setLoading(true);
      apiClient.get(`/graphs/?project=${projectId}`)
        .then(response => {
          // Filter out results if needed, but for now we show all in project
          setGraphs(response.data.results || []);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error fetching graphs:', err);
          setError(t('graphs.portalModal.errorFetching'));
          setLoading(false);
        });
    }
  }, [isOpen, projectId, t]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    const selectedGraph = graphs.find(g => g.uuid === selectedGraphUuid);
    if (selectedGraph) {
      onSelect(selectedGraph.uuid, selectedGraph.name);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="w-full max-w-md bg-[rgb(var(--color-bg))] border border-[rgb(var(--color-border))] rounded-2xl shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="portal-modal-title"
      >
        <div className="px-6 py-4 border-b border-[rgb(var(--color-border))] flex justify-between items-center bg-[rgb(var(--color-bg-secondary))]">
          <h3 id="portal-modal-title" className="text-lg font-bold text-[rgb(var(--color-text))] flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {t('graphs.portalModal.title')}
          </h3>
          <button onClick={onClose} className="text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-[rgb(var(--color-text-secondary))]">
            {t('graphs.portalModal.description')}
          </p>

          {loading ? (
            <div className="py-8 flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm" role="alert">
              {error}
            </div>
          ) : (
            <div className="space-y-2">
              <label htmlFor="graph-select" className="text-xs font-bold text-[rgb(var(--color-text-secondary))] uppercase tracking-wider">
                {t('graphs.portalModal.selectLabel')}
              </label>
              <select
                id="graph-select"
                value={selectedGraphUuid}
                onChange={(e) => setSelectedGraphUuid(e.target.value)}
                className="w-full px-4 py-2.5 bg-[rgb(var(--color-bg-secondary))] border border-[rgb(var(--color-border))] rounded-xl text-[rgb(var(--color-text))] focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none appearance-none"
              >
                <option value="" disabled>{t('graphs.portalModal.placeholder')}</option>
                {graphs.map(graph => (
                  <option key={graph.uuid} value={graph.uuid}>{graph.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-[rgb(var(--color-bg-secondary))] border-t border-[rgb(var(--color-border))] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-[rgb(var(--color-text-secondary))] hover:text-[rgb(var(--color-text))] transition-colors"
          >
            {t('common.cancel')}
          </button>
          <button
            onClick={handleConfirm}
            disabled={!selectedGraphUuid || loading}
            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95"
          >
            {t('graphs.portalModal.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortalCreationModal;
