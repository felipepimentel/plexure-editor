import React from 'react';
import { Search as SearchIcon, Filter } from 'lucide-react';
import { parse } from 'yaml';

interface SearchProps {
  content: string;
}

interface SearchResult {
  type: 'path' | 'schema' | 'parameter' | 'response';
  path: string;
  label: string;
  description?: string;
}

export function Search({ content }: SearchProps) {
  const [query, setQuery] = React.useState('');
  const [results, setResults] = React.useState<SearchResult[]>([]);
  const [filters, setFilters] = React.useState({
    paths: true,
    schemas: true,
    parameters: true,
    responses: true
  });

  const searchSpec = React.useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    try {
      const spec = parse(content);
      const searchResults: SearchResult[] = [];
      const lowerQuery = searchQuery.toLowerCase();

      // Search paths
      if (filters.paths && spec.paths) {
        Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
          if (path.toLowerCase().includes(lowerQuery)) {
            searchResults.push({
              type: 'path',
              path: `paths.${path}`,
              label: path,
              description: methods.description
            });
          }

          Object.entries(methods).forEach(([method, operation]: [string, any]) => {
            if (operation.summary?.toLowerCase().includes(lowerQuery) ||
                operation.description?.toLowerCase().includes(lowerQuery)) {
              searchResults.push({
                type: 'path',
                path: `paths.${path}.${method}`,
                label: `${method.toUpperCase()} ${path}`,
                description: operation.summary
              });
            }
          });
        });
      }

      // Search schemas
      if (filters.schemas && spec.components?.schemas) {
        Object.entries(spec.components.schemas).forEach(([name, schema]: [string, any]) => {
          if (name.toLowerCase().includes(lowerQuery) ||
              schema.description?.toLowerCase().includes(lowerQuery)) {
            searchResults.push({
              type: 'schema',
              path: `components.schemas.${name}`,
              label: name,
              description: schema.description
            });
          }
        });
      }

      setResults(searchResults);
    } catch (error) {
      console.error('Error searching spec:', error);
    }
  }, [content, filters]);

  React.useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      searchSpec(query);
    }, 300);

    return () => clearTimeout(debounceTimeout);
  }, [query, searchSpec]);

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="p-2 border-b border-gray-800">
        <div className="relative">
          <SearchIcon className="absolute left-2.5 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-gray-800/50 border border-gray-700 rounded-md pl-9 pr-3 py-1.5 text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="flex items-center gap-2 mt-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <div className="flex gap-2 text-xs">
            {Object.entries(filters).map(([key, value]) => (
              <button
                key={key}
                onClick={() => setFilters(prev => ({ ...prev, [key]: !value }))}
                className={`px-2 py-0.5 rounded ${
                  value ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-800/50 text-gray-400'
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        {results.length > 0 ? (
          <div className="space-y-2">
            {results.map((result, index) => (
              <div
                key={index}
                className="p-2 rounded bg-gray-800/50 hover:bg-gray-800 cursor-pointer group"
              >
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    result.type === 'path' ? 'bg-blue-500/20 text-blue-400' :
                    result.type === 'schema' ? 'bg-green-500/20 text-green-400' :
                    result.type === 'parameter' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {result.type}
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-white">
                    {result.label}
                  </span>
                </div>
                {result.description && (
                  <p className="mt-1 text-xs text-gray-400 line-clamp-2">
                    {result.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : query ? (
          <div className="text-sm text-gray-400 text-center mt-4">
            No results found
          </div>
        ) : null}
      </div>
    </div>
  );
} 