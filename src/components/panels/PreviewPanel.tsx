import React, { useState, useCallback } from 'react';
import { 
  Search, List, Code, Info, Tag, Globe, Book, 
  Server, ExternalLink, Copy, ChevronDown,
  CheckCircle2, Filter, X
} from 'lucide-react';
import { EndpointsView } from '../preview/EndpointsView';
import { OpenAPI } from 'openapi-types';
import { toast } from 'react-hot-toast';

interface PreviewPanelProps {
  darkMode: boolean;
  spec: OpenAPI.Document | null;
  errors: any[];
  collapsed?: boolean;
}

type ViewMode = 'list' | 'code';
type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export function PreviewPanel({ darkMode, spec, errors, collapsed }: PreviewPanelProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedPaths, setExpandedPaths] = useState<Set<string>>(new Set());
  const [showInfo, setShowInfo] = useState(true);
  const [selectedServer, setSelectedServer] = useState(0);
  const [showServers, setShowServers] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [activeMethodFilters, setActiveMethodFilters] = useState<Set<HttpMethod>>(new Set());
  const [showDeprecated, setShowDeprecated] = useState(true);

  if (!spec) return <EmptyState darkMode={darkMode} />;

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!', {
      style: {
        background: darkMode ? '#1F2937' : '#FFFFFF',
        color: darkMode ? '#E5E7EB' : '#1F2937',
        border: `1px solid ${darkMode ? '#374151' : '#E5E7EB'}`
      }
    });
  };

  const toggleMethodFilter = (method: HttpMethod) => {
    const newFilters = new Set(activeMethodFilters);
    if (newFilters.has(method)) {
      newFilters.delete(method);
    } else {
      newFilters.add(method);
    }
    setActiveMethodFilters(newFilters);
  };

  const clearFilters = () => {
    setActiveMethodFilters(new Set());
    setShowDeprecated(true);
    setSearchQuery('');
  };

  const hasActiveFilters = activeMethodFilters.size > 0 || !showDeprecated || searchQuery;

  return (
    <div className="h-full flex flex-col">
      {/* Header padrão */}
      <div className="h-14 flex items-center justify-between flex-shrink-0 px-4
        bg-blue-500/10 text-blue-400 border-b border-blue-500/20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium uppercase tracking-wider">Preview</span>
          {hasActiveFilters && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500">
                {activeMethodFilters.size > 0 && `${activeMethodFilters.size} methods`}
                {!showDeprecated && ' • Hide deprecated'}
                {searchQuery && ' • Search active'}
              </span>
              <button
                onClick={clearFilters}
                className="p-1 hover:bg-gray-800 rounded-full"
                title="Clear all filters"
              >
                <X className="w-3 h-3 text-gray-500" />
              </button>
            </div>
          )}
        </div>
        <div className="text-gray-400">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setShowInfo(!showInfo)}
              className={`p-1.5 rounded-lg transition-colors hover:bg-gray-800
                ${showInfo ? 'bg-gray-800' : ''}`}
              title="API Info"
            >
              <Info className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={() => setViewMode(viewMode === 'list' ? 'code' : 'list')}
              className={`p-1.5 rounded-lg transition-colors hover:bg-gray-800
                ${viewMode === 'code' ? 'bg-gray-800' : ''}`}
              title={viewMode === 'list' ? 'Switch to Code View' : 'Switch to List View'}
            >
              <Code className="w-4 h-4 text-gray-400" />
            </button>
            <button 
              onClick={() => setShowDeprecated(!showDeprecated)}
              className={`p-1.5 rounded-lg transition-colors hover:bg-gray-800
                ${!showDeprecated ? 'bg-gray-800' : ''}`}
              title={showDeprecated ? 'Hide Deprecated' : 'Show Deprecated'}
            >
              <Filter className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* API Info Section - Mantido o anterior... */}

      {/* Search and Filters */}
      <div className="border-b border-gray-800">
        <div className="px-4 py-3 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoints..."
              className="w-full h-9 bg-gray-800 text-gray-200 pl-9 pr-4 rounded-lg
                border border-gray-700 hover:border-gray-600 focus:border-gray-600
                focus:bg-gray-700 outline-none placeholder-gray-500 text-sm"
            />
          </div>

          {/* Method Filters */}
          <div className="flex flex-wrap gap-2">
            {(['get', 'post', 'put', 'delete', 'patch'] as const).map(method => (
              <button
                key={method}
                onClick={() => toggleMethodFilter(method)}
                className={`
                  px-3 py-1 text-xs font-medium rounded-full transition-colors
                  flex items-center gap-1.5
                  ${getMethodStyles(method, activeMethodFilters.has(method))}
                `}
              >
                {activeMethodFilters.has(method) && (
                  <CheckCircle2 className="w-3 h-3" />
                )}
                {method.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <EndpointsView
        spec={spec}
        darkMode={darkMode}
        searchQuery={searchQuery}
        expandedPaths={expandedPaths}
        viewMode={viewMode}
        methodFilters={activeMethodFilters}
        showDeprecated={showDeprecated}
        selectedServer={selectedServer}
        onTogglePath={(path) => {
          const newExpanded = new Set(expandedPaths);
          if (newExpanded.has(path)) {
            newExpanded.delete(path);
          } else {
            newExpanded.add(path);
          }
          setExpandedPaths(newExpanded);
        }}
      />
    </div>
  );
}

function getMethodStyles(method: HttpMethod, isActive: boolean): string {
  const baseStyles = {
    get: 'hover:bg-blue-500/20 ',
    post: 'hover:bg-green-500/20',
    put: 'hover:bg-yellow-500/20',
    delete: 'hover:bg-red-500/20',
    patch: 'hover:bg-purple-500/20'
  };

  const activeStyles = {
    get: 'bg-blue-500/20 text-blue-400',
    post: 'bg-green-500/20 text-green-400',
    put: 'bg-yellow-500/20 text-yellow-400',
    delete: 'bg-red-500/20 text-red-400',
    patch: 'bg-purple-500/20 text-purple-400'
  };

  const inactiveStyles = {
    get: 'text-blue-400/70',
    post: 'text-green-400/70',
    put: 'text-yellow-400/70',
    delete: 'text-red-400/70',
    patch: 'text-purple-400/70'
  };

  return `${baseStyles[method]} ${isActive ? activeStyles[method] : inactiveStyles[method]}`;
}

function EmptyState({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="h-full flex items-center justify-center">
      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No API specification loaded
      </p>
    </div>
  );
} 