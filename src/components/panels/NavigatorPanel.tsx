import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { NavigationTree } from '../navigation/NavigationTree';
import { OpenAPI } from 'openapi-types';

interface NavigatorPanelProps {
  darkMode: boolean;
  spec: OpenAPI.Document | null;
  collapsed?: boolean;
  selectedPath?: string;
  onPathSelect: (path: string) => void;
}

export function NavigatorPanel({
  darkMode,
  spec,
  collapsed = false,
  selectedPath,
  onPathSelect
}: NavigatorPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 space-y-4">
        <button className={`p-2 rounded-lg transition-colors ${
          darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
        }`}>
          <Search className="w-5 h-5 text-gray-400" />
        </button>
        <button className={`p-2 rounded-lg transition-colors ${
          darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
        }`}>
          <Filter className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Navigator Header */}
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
        <h2 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Navigator
        </h2>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`p-1.5 rounded-lg transition-colors ${
            darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
          }`}
        >
          <Filter className={`w-4 h-4 ${
            showFilters
              ? 'text-blue-500'
              : darkMode
                ? 'text-gray-400'
                : 'text-gray-500'
          }`} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-2">
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
          darkMode ? 'bg-gray-800' : 'bg-gray-100'
        }`}>
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter endpoints & schemas..."
            className={`w-full bg-transparent border-none outline-none text-sm ${
              darkMode ? 'text-gray-200' : 'text-gray-800'
            } placeholder-gray-400`}
          />
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className={`p-2 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          {/* Adicione seus filtros aqui */}
        </div>
      )}

      {/* Navigation Tree */}
      <div className="flex-1 overflow-auto">
        <NavigationTree
          spec={spec}
          darkMode={darkMode}
          selectedPath={selectedPath}
          onSelect={onPathSelect}
        />
      </div>
    </div>
  );
} 