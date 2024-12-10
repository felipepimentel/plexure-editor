import React from 'react';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbsProps {
  path: string[];
  darkMode: boolean;
  onNavigate: (path: string[]) => void;
}

export function Breadcrumbs({ path, darkMode, onNavigate }: BreadcrumbsProps) {
  return (
    <div className={`flex items-center gap-2 px-4 py-2 text-sm border-b ${
      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
    }`}>
      {path.map((segment, index) => (
        <React.Fragment key={index}>
          {index > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          <button
            onClick={() => onNavigate(path.slice(0, index + 1))}
            className={`hover:underline ${
              index === path.length - 1
                ? darkMode
                  ? 'text-gray-200 font-medium'
                  : 'text-gray-800 font-medium'
                : darkMode
                ? 'text-gray-400'
                : 'text-gray-600'
            }`}
          >
            {segment}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}