import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter,
  ChevronDown,
  ChevronRight,
  Maximize2,
  Minimize2,
  Copy,
  RefreshCw,
  MoreHorizontal,
  CheckSquare,
  Square,
  List,
  BarChart2,
  X,
  ChevronLeft,
  Globe,
  Hash,
  Database,
  AlertTriangle,
  Check
} from 'lucide-react';
import { NavigationTree } from '../navigation/NavigationTree';
import { OpenAPI } from 'openapi-types';
import { PanelHeader } from '../common/PanelHeader';
import yaml from 'js-yaml';
import { Tooltip } from '../common/Tooltip';
import { Badge } from '../common/Badge';
import { useNavigatorState } from '../../hooks/useNavigatorState';

interface NavigatorPanelProps {
  darkMode: boolean;
  spec: OpenAPI.Document | null;
  rawSpec: string;
  collapsed?: boolean;
  selectedPath?: string;
  onPathSelect: (path: string) => void;
}

export function NavigatorPanel({
  darkMode,
  spec,
  rawSpec,
  collapsed = false,
  selectedPath,
  onPathSelect
}: NavigatorPanelProps) {
  const {
    searchQuery,
    showFilters,
    parsedSpec,
    parseError,
    expandedNodes,
    viewMode,
    activeCategory,
    filterOptions,
    setSearchQuery,
    setShowFilters,
    parseSpec,
    filterEndpoints,
    expandAll,
    collapseAll,
    toggleNode,
    setViewMode,
    setActiveCategory,
    toggleFilter,
    toggleAllFilters
  } = useNavigatorState(rawSpec);

  useEffect(() => {
    parseSpec(rawSpec);
  }, [rawSpec, parseSpec]);

  const handleExpandAll = () => {
    expandAll();
  };

  const handleCollapseAll = () => {
    collapseAll();
  };

  const handleRefresh = () => {
    parseSpec(rawSpec);
  };

  const ActionButton = ({ icon: Icon, label, onClick }: { icon: any, label: string, onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-colors ${
        darkMode
          ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300'
          : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
      }`}
      title={label}
    >
      <Icon className="w-4 h-4" />
      {!collapsed && <span>{label}</span>}
    </button>
  );

  const stats = React.useMemo(() => {
    if (!parsedSpec?.paths) return null;
    
    const paths = Object.entries(parsedSpec.paths);
    return {
      total: paths.length,
      methods: paths.reduce((acc, [_, methods]) => {
        Object.keys(methods || {}).forEach(method => {
          acc[method] = (acc[method] || 0) + 1;
        });
        return acc;
      }, {} as Record<string, number>),
      deprecated: paths.reduce((acc, [_, methods]) => {
        Object.values(methods || {}).forEach(operation => {
          if (operation?.deprecated) acc++;
        });
        return acc;
      }, 0)
    };
  }, [parsedSpec]);

  const categories = [
    { id: 'endpoints', label: 'Endpoints', icon: Globe },
    { id: 'schemas', label: 'Schemas', icon: Database },
    { id: 'tags', label: 'Tags', icon: Hash },
    { id: 'deprecated', label: 'Deprecated', icon: AlertTriangle, count: stats?.deprecated }
  ];

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4 space-y-4">
        <ActionButton icon={Search} label="Search" onClick={() => {}} />
        <ActionButton icon={Filter} label="Filter" onClick={() => setShowFilters(!showFilters)} />
        <ActionButton icon={Maximize2} label="Expand All" onClick={handleExpandAll} />
        <ActionButton icon={Minimize2} label="Collapse All" onClick={handleCollapseAll} />
        <ActionButton icon={RefreshCw} label="Refresh" onClick={handleRefresh} />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col relative">
      <PanelHeader title="Navigator" darkMode={darkMode}>
        <div className="flex items-center gap-1">
          <Tooltip content="Toggle View Mode">
            <button
              onClick={() => setViewMode(mode => mode === 'tree' ? 'list' : 'tree')}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
            >
              {viewMode === 'tree' ? (
                <List className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </Tooltip>

          <Tooltip content="Statistics">
            <button className={`p-1.5 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}>
              <BarChart2 className="w-4 h-4 text-gray-400" />
            </button>
          </Tooltip>
        </div>
      </PanelHeader>

      <div className="border-b border-gray-800">
        <div className="p-2">
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg
            ${darkMode 
              ? 'bg-gray-800 focus-within:bg-gray-700' 
              : 'bg-gray-100 focus-within:bg-gray-50'
            }
            ${searchQuery ? 'ring-2 ring-blue-500/20' : ''}
          `}>
            <Search className={`w-4 h-4 ${searchQuery ? 'text-blue-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoints & schemas..."
              className={`
                w-full bg-transparent border-none outline-none text-sm
                ${darkMode ? 'text-gray-200' : 'text-gray-800'}
                placeholder-gray-400
              `}
            />
            {searchQuery && (
              <div className="flex items-center gap-1">
                <div className={`text-xs px-1.5 py-0.5 rounded ${
                  darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                }`}>
                  {filterEndpoints(parsedSpec)?.paths 
                    ? Object.keys(filterEndpoints(parsedSpec)?.paths).length 
                    : 0
                  } results
                </div>
                <button
                  onClick={() => setSearchQuery('')}
                  className="p-1 rounded-full hover:bg-gray-700/50"
                >
                  <X className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="px-2 pb-2 flex items-center gap-1">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`
              flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm
              transition-colors
              ${showFilters
                ? darkMode
                  ? 'bg-blue-500/10 text-blue-400'
                  : 'bg-blue-50 text-blue-600'
                : darkMode
                  ? 'text-gray-400 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100'
              }
            `}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </button>

          <div className="h-4 w-px bg-gray-800 mx-1" />

          <Tooltip content="Expand All">
            <button
              onClick={handleExpandAll}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Collapse All">
            <button
              onClick={handleCollapseAll}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Minimize2 className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Refresh">
            <button
              onClick={handleRefresh}
              className={`p-1.5 rounded-lg transition-colors ${
                darkMode ? 'text-gray-400 hover:bg-gray-800' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      <div className={`
        overflow-hidden transition-all duration-200
        ${showFilters ? 'max-h-[280px]' : 'max-h-0'}
      `}>
        <div className={`p-3 border-b ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
          <div className="mb-3">
            <div className="text-sm font-medium mb-2">Categories</div>
            <div className="flex flex-wrap gap-1">
              {categories.map(({ id, label, icon: Icon, count }) => (
                <button
                  key={id}
                  onClick={() => setActiveCategory(id)}
                  className={`
                    flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm
                    transition-colors
                    ${activeCategory === id
                      ? darkMode
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-blue-50 text-blue-600'
                      : darkMode
                        ? 'text-gray-400 hover:bg-gray-800'
                        : 'text-gray-600 hover:bg-gray-100'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                  {count !== undefined && count > 0 && (
                    <span className={`px-1.5 rounded-full text-xs ${
                      darkMode ? 'bg-gray-800' : 'bg-gray-200'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Show Methods</span>
              <button
                onClick={() => setFilterOptions(prev => {
                  const allEnabled = Object.values(prev).every(v => v);
                  return Object.fromEntries(
                    Object.entries(prev).map(([k]) => [k, !allEnabled])
                  );
                })}
                className="text-xs text-blue-500 hover:text-blue-400"
              >
                {Object.values(filterOptions).every(v => v) ? 'Clear All' : 'Select All'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(filterOptions).map(([key, value]) => (
                <button
                  key={key}
                  onClick={() => setFilterOptions(prev => ({ ...prev, [key]: !value }))}
                  className={`
                    flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm
                    transition-all duration-200
                    ${value
                      ? darkMode
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'bg-blue-50 text-blue-600'
                      : darkMode
                        ? 'bg-gray-800 text-gray-400'
                        : 'bg-gray-100 text-gray-600'
                    }
                  `}
                >
                  <div className={`
                    w-4 h-4 rounded transition-colors flex items-center justify-center
                    ${value
                      ? 'bg-blue-500'
                      : darkMode ? 'bg-gray-700' : 'bg-gray-200'
                    }
                  `}>
                    {value && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span>{key.replace('show', '')}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {parseError && (
        <div className={`m-2 p-3 rounded-lg ${
          darkMode ? 'bg-red-900/20 text-red-400' : 'bg-red-50 text-red-600'
        }`}>
          <p className="text-sm">Invalid OpenAPI specification</p>
          <p className="text-xs mt-1 opacity-75">{parseError}</p>
        </div>
      )}

      <div className="flex-1 overflow-auto">
        <NavigationTree
          spec={filterEndpoints(parsedSpec)}
          darkMode={darkMode}
          selectedPath={selectedPath}
          onSelect={onPathSelect}
          expandedNodes={expandedNodes}
          onNodeExpand={toggleNode}
          viewMode={viewMode}
          filterOptions={filterOptions}
        />
      </div>
    </div>
  );
} 