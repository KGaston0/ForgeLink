import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import ConnectionHandles from './ConnectionHandles';

/**
 * PortalNode component for cross-graph navigation.
 * Visually distinct from standard nodes and frames.
 */
const PortalNode = ({ id, data, selected }) => {
  const { t } = useTranslation();
  return (
    <div
      className={`relative group transition-all duration-300 ${
        selected ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-transparent scale-105' : 'hover:scale-102'
      }`}
    >
      <div className="flex flex-col items-center gap-2">
        {/* Portal Circle */}
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 shadow-xl flex items-center justify-center border-2 border-white/20 relative overflow-hidden group-hover:shadow-indigo-500/40">
          {/* Animated rings */}
          <div className="absolute inset-0 animate-spin opacity-30" style={{ animationDuration: '3s' }}>
             <div className="absolute inset-0 border-2 border-dashed border-white rounded-full"></div>
          </div>
          
          {/* Link Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8 text-white drop-shadow-md"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          
          {/* Gloss effect */}
          <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent"></div>
        </div>

        {/* Label */}
        <div className="px-3 py-1 bg-slate-900/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
          <span className="text-[10px] font-bold text-white whitespace-nowrap tracking-wide uppercase">
            {data.label || t('graphCanvas.toolbar.addPortal')}
          </span>
        </div>
      </div>

      <ConnectionHandles id={id} />
    </div>
  );
};

export default memo(PortalNode);
