import React, { useState } from 'react';
import { Widget } from './Widget';
import { NavigationTree } from '../navigation/NavigationTree';
import { SearchBar } from '../search/SearchBar';

interface NavigatorWidgetProps {
  spec: any;
  darkMode: boolean;
  onNavigate: (path: string[]) => void;
}

export function NavigatorWidget({ spec, darkMode, onNavigate }: NavigatorWidgetProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filters = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'Schemas'];

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <Widget title="Navigator" darkMode={darkMode}>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 space-y-4 border-b border-gray-200 dark:border-gray-700">
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            darkMode={darkMode}
            placeholder="Filter endpoints & schemas..."
          />
          <div className="flex flex-wrap gap-1">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => handleFilterToggle(filter)}
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
        <div className="flex-1 overflow-auto">
          <NavigationTree
            spec={spec}
            darkMode={darkMode}
            searchQuery={searchQuery}
            activeFilters={activeFilters}
          />
        </div>
      </div>
    </Widget>
  );
}