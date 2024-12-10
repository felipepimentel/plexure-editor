import React from 'react';
import { Filter } from 'lucide-react';

interface NavigationFilterProps {
  filters: string[];
  activeFilters: string[];
  onFilterChange: (filter: string) => void;
  darkMode: boolean;
}

export function NavigationFilter({ 
  filters, 
  activeFilters, 
  onFilterChange,
  darkMode 
}: NavigationFilterProps) {
  return (
    <div className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center gap-2">
        <Filter className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <div className="flex flex-wrap gap-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-2 py-0.5 rounded-full text-xs ${
                activeFilters.includes(filter)
                  ? darkMode
                    ? 'bg-blue-600 text-white'
                    : 'bg-blue-100 text-blue-700'
                  : darkMode
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}