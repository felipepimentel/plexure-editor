import React, { useState } from 'react';
import { NavigationHeader } from './navigation/NavigationHeader';
import { NavigationTree } from './navigation/NavigationTree';

interface OutlineNavigatorProps {
  spec: any;
  darkMode: boolean;
  onNavigate: (path: string) => void;
}

export function OutlineNavigator({ spec, darkMode, onNavigate }: OutlineNavigatorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const filters = ['GET', 'POST', 'PUT', 'DELETE', 'Schemas', 'Parameters'];

  const handleFilterToggle = (filter: string) => {
    setActiveFilters(prev => 
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  return (
    <div className="h-full flex flex-col">
      <NavigationHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filters={filters}
        activeFilters={activeFilters}
        onFilterToggle={handleFilterToggle}
        darkMode={darkMode}
      />
      <div className="flex-1 overflow-auto min-h-0">
        <NavigationTree
          spec={spec}
          darkMode={darkMode}
          searchQuery={searchQuery}
          activeFilters={activeFilters}
        />
      </div>
    </div>
  );
}