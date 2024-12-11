import React from 'react';

interface PanelHeaderProps {
  title: string;
  darkMode: boolean;
  children?: React.ReactNode;
}

export function PanelHeader({ title, darkMode, children }: PanelHeaderProps) {
  return (
    <div className={`
      h-14 flex items-center justify-between flex-shrink-0 px-4
      ${darkMode 
        ? 'bg-blue-500/10 text-blue-400 border-b border-blue-500/20' 
        : 'bg-blue-50 text-blue-600 border-b border-blue-100'
      }
    `}>
      <span className="text-xs font-medium uppercase tracking-wider">
        {title}
      </span>
      {children && (
        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {children}
        </div>
      )}
    </div>
  );
} 