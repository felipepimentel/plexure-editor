import React from 'react';
import { cn } from '../lib/utils';
import {
  Search,
  Filter,
  ChevronRight,
  Circle,
  AlertCircle,
  CheckCircle2,
  Tag,
  Lock,
  LockOpen,
  ArrowRight,
  Copy,
  ExternalLink
} from 'lucide-react';

interface APIEndpointsProps {
  spec: any;
  className?: string;
}

const methodColors = {
  get: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  post: 'bg-green-500/10 text-green-500 border-green-500/20',
  put: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
  delete: 'bg-red-500/10 text-red-500 border-red-500/20',
  patch: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  options: 'bg-purple-500/10 text-purple-500 border-purple-500/20',
  head: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20',
  trace: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
};

export const APIEndpoints: React.FC<APIEndpointsProps> = ({
  spec,
  className
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [expandedPaths, setExpandedPaths] = React.useState<string[]>([]);

  // Extract all tags from the spec
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    if (spec?.paths) {
      Object.values(spec.paths).forEach((path: any) => {
        Object.values(path).forEach((operation: any) => {
          if (operation.tags) {
            operation.tags.forEach((tag: string) => tags.add(tag));
          }
        });
      });
    }
    return Array.from(tags);
  }, [spec]);

  // Group endpoints by tag
  const endpointsByTag = React.useMemo(() => {
    const grouped: Record<string, Array<{ path: string; method: string; operation: any }>> = {
      Other: []
    };

    if (spec?.paths) {
      Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          const tags = operation.tags || ['Other'];
          tags.forEach(tag => {
            if (!grouped[tag]) {
              grouped[tag] = [];
            }
            grouped[tag].push({ path, method, operation });
          });
        });
      });
    }

    // Only include "Other" if it has endpoints
    if (grouped.Other.length === 0) {
      delete grouped.Other;
    }

    return grouped;
  }, [spec]);

  const togglePathExpansion = (path: string) => {
    setExpandedPaths(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredEndpoints = React.useMemo(() => {
    let filtered = { ...endpointsByTag };

    // Filter by search term
    if (searchTerm) {
      Object.keys(filtered).forEach(tag => {
        filtered[tag] = filtered[tag].filter(({ path, operation }) =>
          path.toLowerCase().includes(searchTerm.toLowerCase()) ||
          operation.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          operation.description?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    // Filter by selected tags
    if (selectedTags.length > 0) {
      filtered = Object.fromEntries(
        Object.entries(filtered).filter(([tag]) =>
          selectedTags.includes(tag)
        )
      );
    }

    // Remove empty tags
    filtered = Object.fromEntries(
      Object.entries(filtered).filter(([_, endpoints]) =>
        endpoints.length > 0
      )
    );

    return filtered;
  }, [endpointsByTag, searchTerm, selectedTags]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Search and Filter Bar */}
      <div className="flex flex-col gap-2 p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search endpoints..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={cn(
              'w-full pl-9 pr-4 py-2 rounded-md border bg-background',
              'focus:outline-none focus:ring-2 focus:ring-primary/50',
              'placeholder:text-muted-foreground text-sm'
            )}
          />
        </div>
        
        {/* Tags Filter */}
        <div className="flex flex-wrap gap-2">
          {allTags.map(tag => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs',
                'border transition-colors duration-200',
                selectedTags.includes(tag)
                  ? 'bg-primary/10 border-primary/20 text-primary'
                  : 'hover:bg-muted'
              )}
            >
              <Tag className="h-3 w-3" />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Endpoints List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredEndpoints).map(([tag, endpoints]) => (
          <div key={tag} className="border-b last:border-b-0">
            <div className="flex items-center gap-2 p-4 bg-muted/50">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-medium">{tag}</h3>
              <span className="text-xs text-muted-foreground">
                ({endpoints.length} endpoints)
              </span>
            </div>
            <div className="divide-y">
              {endpoints.map(({ path, method, operation }) => {
                const isExpanded = expandedPaths.includes(path);
                const hasAuth = operation.security && operation.security.length > 0;
                const hasDeprecated = operation.deprecated;

                return (
                  <div key={`${path}-${method}`} className="group">
                    <button
                      onClick={() => togglePathExpansion(path)}
                      className="w-full text-left p-4 hover:bg-muted/50 transition-colors duration-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          'px-2 py-1 rounded text-xs font-medium border uppercase',
                          methodColors[method as keyof typeof methodColors]
                        )}>
                          {method}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm truncate">
                              {path}
                            </span>
                            {hasAuth && (
                              <Lock className="h-3 w-3 text-muted-foreground" />
                            )}
                            {hasDeprecated && (
                              <AlertCircle className="h-3 w-3 text-destructive" />
                            )}
                          </div>
                          {operation.summary && (
                            <p className="text-sm text-muted-foreground truncate mt-1">
                              {operation.summary}
                            </p>
                          )}
                        </div>
                        <ChevronRight className={cn(
                          'h-4 w-4 text-muted-foreground transition-transform duration-200',
                          isExpanded && 'rotate-90'
                        )} />
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div className="px-4 pb-4">
                        {operation.description && (
                          <p className="text-sm text-muted-foreground mb-4">
                            {operation.description}
                          </p>
                        )}
                        
                        {/* Parameters */}
                        {operation.parameters && operation.parameters.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2">Parameters</h4>
                            <div className="space-y-2">
                              {operation.parameters.map((param: any, index: number) => (
                                <div
                                  key={index}
                                  className="text-sm p-2 rounded-md bg-muted"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono">{param.name}</span>
                                    <span className="text-xs text-muted-foreground">
                                      in {param.in}
                                    </span>
                                    {param.required && (
                                      <span className="text-xs text-destructive">
                                        required
                                      </span>
                                    )}
                                  </div>
                                  {param.description && (
                                    <p className="text-xs text-muted-foreground mt-1">
                                      {param.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Response Codes */}
                        {operation.responses && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Responses</h4>
                            <div className="space-y-2">
                              {Object.entries(operation.responses).map(([code, response]: [string, any]) => (
                                <div
                                  key={code}
                                  className="text-sm p-2 rounded-md bg-muted"
                                >
                                  <div className="flex items-center gap-2">
                                    <span className={cn(
                                      'px-1.5 py-0.5 rounded-md text-xs',
                                      code.startsWith('2') && 'bg-green-500/10 text-green-500',
                                      code.startsWith('4') && 'bg-orange-500/10 text-orange-500',
                                      code.startsWith('5') && 'bg-red-500/10 text-red-500'
                                    )}>
                                      {code}
                                    </span>
                                    <span className="text-muted-foreground">
                                      {response.description}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 