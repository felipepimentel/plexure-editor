import React from 'react';
import { Plus, Search } from 'lucide-react';

interface SpecificationHeaderProps {
  darkMode: boolean;
  onCreateNew: () => void;
  onSearch: (query: string) => void;
  specCount: number;
}

export function SpecificationHeader({ darkMode, onCreateNew, onSearch, specCount }: SpecificationHeaderProps) {
  return (
    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className={`flex-1 flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          darkMode ? 'bg-gray-700' : 'bg-gray-100'
        }`}>
          <Search className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
          <input
            type="text"
            placeholder={`Search ${specCount} specification${specCount !== 1 ? 's' : ''}...`}
            onChange={(e) => onSearch(e.target.value)}
            className={`w-full bg-transparent border-none focus:ring-0 text-sm ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            } placeholder-gray-400`}
          />
        </div>
        <button
          onClick={onCreateNew}
          className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ${
            darkMode 
              ? 'bg-blue-600 hover:bg-blue-700 text-white' 
              : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">New Spec</span>
        </button>
      </div>
    </div>
  );
}