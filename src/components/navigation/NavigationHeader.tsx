import React from 'react';
import { Search, Filter } from 'lucide-react';

interface NavigationHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: string[];
  activeFilters: string[];
  onFilterToggle: (filter: string) => void;
  darkMode: boolean;
}

export function NavigationHeader({
  searchQuery,
  onSearchChange,
  filters,
  activeFilters,
  onFilterToggle,
  darkMode
}: NavigationHeaderProps) {
  return (
    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg mb-3 ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <Search className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search endpoints & schemas..."
          className={`w-full bg-transparent border-none focus:ring-0 text-sm ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          } placeholder-gray-400`}
        />
      </div>

      <div className="flex items-center gap-2">
        <Filter className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <div className="flex flex-wrap gap-1">
          {filters.map(filter => (
            <button
              key={filter}
              onClick={() => onFilterToggle(filter)}
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