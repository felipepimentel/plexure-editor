import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PanelResizerProps {
  darkMode: boolean;
  position: 'left' | 'right';
  collapsed: boolean;
  onToggle: () => void;
}

export function PanelResizer({
  darkMode,
  position,
  collapsed,
  onToggle
}: PanelResizerProps) {
  return (
    <div className={`
      absolute ${position}-0 top-1/2 -translate-y-1/2
      ${position === 'left' ? '-translate-x-1/2' : 'translate-x-1/2'}
      z-50
    `}>
      <button
        onClick={onToggle}
        className={`
          flex items-center justify-center w-5 h-10 rounded-full
          transition-colors shadow-lg
          ${darkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-gray-400'
            : 'bg-white hover:bg-gray-100 text-gray-600'
          }
        `}
        title={collapsed ? 'Expand panel' : 'Collapse panel'}
      >
        {position === 'left' ? (
          collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )
        ) : (
          collapsed ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )
        )}
      </button>
    </div>
  );
} 