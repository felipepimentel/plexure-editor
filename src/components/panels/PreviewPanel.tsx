import React, { useState, useEffect } from 'react';
import { OpenAPI } from 'openapi-types';
import { Eye, Search, Filter, AlertTriangle } from 'lucide-react';
import { PanelHeader } from '../common/PanelHeader';
import { EndpointPreview } from '../preview/EndpointPreview';
import { Badge } from '../common/Badge';

interface PreviewPanelProps {
  spec: OpenAPI.Document | null;
  darkMode: boolean;
  errors: any[];
  collapsed?: boolean;
}

export function PreviewPanel({
  spec,
  darkMode,
  errors,
  collapsed = false
}: PreviewPanelProps) {
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    methods: {
      get: true,
      post: true,
      put: true,
      delete: true,
      patch: true
    },
    showDeprecated: false,
    selectedTags: new Set<string>()
  });

  // Debug logs
  useEffect(() => {
    console.log('PreviewPanel spec:', spec);
    if (spec?.paths) {
      console.log('Paths:', Object.keys(spec.paths));
    }
  }, [spec]);

  const stats = React.useMemo(() => {
    if (!spec?.paths) return null;
    
    const paths = Object.entries(spec.paths);
    const methods = paths.reduce((acc, [_, pathItem]) => {
      Object.keys(pathItem || {}).forEach(method => {
        acc[method] = (acc[method] || 0) + 1;
      });
      return acc;
    }, {} as Record<string, number>);

    const tags = new Set();
    paths.forEach(([_, pathItem]) => {
      Object.values(pathItem || {}).forEach(operation => {
        operation?.tags?.forEach(tag => tags.add(tag));
      });
    });

    return {
      endpoints: paths.length,
      methods,
      tags: tags.size,
      deprecated: paths.reduce((acc, [_, pathItem]) => {
        return acc + Object.values(pathItem || {})
          .filter(op => op?.deprecated).length;
      }, 0)
    };
  }, [spec]);

  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <button className="p-2 rounded-lg hover:bg-gray-800">
          <Eye className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  }

  const toggleEndpoint = (endpointId: string) => {
    setExpandedEndpoints(prev => {
      const next = new Set(prev);
      if (next.has(endpointId)) {
        next.delete(endpointId);
      } else {
        next.add(endpointId);
      }
      return next;
    });
  };

  const filteredPaths = spec?.paths ? Object.entries(spec.paths).filter(([path, methods]) => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return path.toLowerCase().includes(query) ||
      Object.entries(methods || {}).some(([method, operation]) => 
        operation?.summary?.toLowerCase().includes(query) ||
        operation?.description?.toLowerCase().includes(query)
      );
  }) : [];

  return (
    <div className="h-full flex flex-col">
      <PanelHeader title="Preview" darkMode={darkMode} />

      {/* Search and Filters */}
      <div className="border-b border-gray-800">
        {/* Search Bar */}
        <div className="p-2">
          <div className={`
            flex items-center gap-2 px-3 py-2 rounded-lg
            ${darkMode 
              ? 'bg-gray-800 focus-within:bg-gray-700' 
              : 'bg-gray-100 focus-within:bg-gray-50'
            }
          `}>
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search endpoints..."
              className={`
                w-full bg-transparent border-none outline-none text-sm
                ${darkMode ? 'text-gray-200' : 'text-gray-800'}
                placeholder-gray-400
              `}
            />
          </div>
        </div>

        {/* Method Filters */}
        <div className="px-4 py-2 flex items-center gap-2">
          <div className="flex items-center gap-1">
            {Object.entries(filters.methods).map(([method, enabled]) => (
              <button
                key={method}
                onClick={() => setFilters(prev => ({
                  ...prev,
                  methods: {
                    ...prev.methods,
                    [method]: !enabled
                  }
                }))}
                className={`
                  px-2 py-1 rounded-lg text-xs font-medium transition-colors
                  ${enabled
                    ? method === 'get' ? 'bg-blue-500/10 text-blue-500'
                    : method === 'post' ? 'bg-green-500/10 text-green-500'
                    : method === 'put' ? 'bg-yellow-500/10 text-yellow-500'
                    : method === 'delete' ? 'bg-red-500/10 text-red-500'
                    : 'bg-purple-500/10 text-purple-500'
                    : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
                  }
                `}
              >
                {method.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-gray-800" />

          <button
            onClick={() => setFilters(prev => ({
              ...prev,
              showDeprecated: !prev.showDeprecated
            }))}
            className={`
              flex items-center gap-1 px-2 py-1 rounded-lg text-xs
              ${filters.showDeprecated
                ? 'bg-yellow-500/10 text-yellow-500'
                : darkMode ? 'bg-gray-800 text-gray-400' : 'bg-gray-100 text-gray-500'
              }
            `}
          >
            <AlertTriangle className="w-3 h-3" />
            Deprecated
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        {!spec ? (
          <div className="h-full flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No API specification loaded
            </p>
          </div>
        ) : filteredPaths.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No endpoints found
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Info Section */}
            {spec.info && (
              <div className={`p-4 rounded-lg ${
                darkMode ? 'bg-gray-800/50' : 'bg-gray-50'
              }`}>
                <h1 className={`text-xl font-bold mb-2 ${
                  darkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>
                  {spec.info.title || 'API Documentation'}
                </h1>
                {spec.info.description && (
                  <p className={`text-sm ${
                    darkMode ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {spec.info.description}
                  </p>
                )}
                {spec.info.version && (
                  <div className="mt-2">
                    <Badge variant="get" size="sm">
                      v{spec.info.version}
                    </Badge>
                  </div>
                )}
              </div>
            )}

            {/* Endpoints */}
            {filteredPaths.map(([path, methods]) => 
              Object.entries(methods || {}).map(([method, operation]) => (
                <EndpointPreview
                  key={`${path}-${method}`}
                  method={method}
                  path={path}
                  operation={operation}
                  darkMode={darkMode}
                  isExpanded={expandedEndpoints.has(`${path}-${method}`)}
                  onToggle={() => toggleEndpoint(`${path}-${method}`)}
                />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
} 