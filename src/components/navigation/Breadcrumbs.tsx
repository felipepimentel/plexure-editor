import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbsProps {
  path: string[];
  darkMode: boolean;
  onNavigate: (path: string[]) => void;
}

export function Breadcrumbs({ path, darkMode, onNavigate }: BreadcrumbsProps) {
  return (
    <div className={`flex items-center gap-1 px-4 py-2 text-sm border-b ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      <button
        onClick={() => onNavigate(['root'])}
        className={`p-1 rounded hover:bg-opacity-80 ${
          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        }`}
      >
        <Home className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
      </button>
      
      {path.map((segment, index) => (
        <React.Fragment key={index}>
          <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-600' : 'text-gray-400'}`} />
          <button
            onClick={() => onNavigate(path.slice(0, index + 1))}
            className={`px-2 py-1 rounded ${
              index === path.length - 1
                ? darkMode
                  ? 'bg-gray-700 text-gray-200'
                  : 'bg-gray-100 text-gray-800'
                : darkMode
                ? 'text-gray-400 hover:bg-gray-700'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            {segment}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}