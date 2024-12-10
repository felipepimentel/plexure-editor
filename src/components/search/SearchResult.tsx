import React from 'react';
import { ChevronRight, FileText, Hash } from 'lucide-react';
import { MethodBadge } from '../common/MethodBadge';

interface SearchResultProps {
  type: 'path' | 'method' | 'schema';
  title: string;
  path: string;
  method?: string;
  darkMode: boolean;
  onClick: () => void;
}

export function SearchResult({ type, title, path, method, darkMode, onClick }: SearchResultProps) {
  const getIcon = () => {
    switch (type) {
      case 'path':
        return <Hash className="w-4 h-4 text-blue-500" />;
      case 'schema':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return method ? <MethodBadge method={method} /> : null;
    }
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2 p-2 rounded-lg ${
        darkMode
          ? 'hover:bg-gray-800'
          : 'hover:bg-gray-100'
      }`}
    >
      {getIcon()}
      <div className="flex-1 text-left">
        <div className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {title}
        </div>
        <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          {path}
        </div>
      </div>
      <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
    </button>
  );
}