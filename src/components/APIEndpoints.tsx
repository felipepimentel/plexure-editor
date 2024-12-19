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
  ExternalLink,
  FileJson,
  Code2,
  PlayCircle,
  Info,
  Settings,
  ChevronDown,
  X,
  Loader2,
  FileCode,
  Globe,
  Server,
  Shield,
  Webhook,
  Link2,
  Check,
  MoreVertical,
  Braces,
  FileText,
  Share2
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface APIEndpointsProps {
  spec: any;
  className?: string;
  searchQuery?: string;
  onTest?: (path: string, method: string) => void;
}

const methodColors = {
  get: 'bg-blue-500/10 text-blue-500 border-blue-500/20 hover:bg-blue-500/20 group-hover:border-blue-500/30',
  post: 'bg-green-500/10 text-green-500 border-green-500/20 hover:bg-green-500/20 group-hover:border-green-500/30',
  put: 'bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20 group-hover:border-orange-500/30',
  delete: 'bg-red-500/10 text-red-500 border-red-500/20 hover:bg-red-500/20 group-hover:border-red-500/30',
  patch: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20 group-hover:border-yellow-500/30',
  options: 'bg-purple-500/10 text-purple-500 border-purple-500/20 hover:bg-purple-500/20 group-hover:border-purple-500/30',
  head: 'bg-cyan-500/10 text-cyan-500 border-cyan-500/20 hover:bg-cyan-500/20 group-hover:border-cyan-500/30',
  trace: 'bg-gray-500/10 text-gray-500 border-gray-500/20 hover:bg-gray-500/20 group-hover:border-gray-500/30'
};

export const APIEndpoints: React.FC<APIEndpointsProps> = ({
  spec,
  className,
  searchQuery = '',
  onTest
}) => {
  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);
  const [expandedPaths, setExpandedPaths] = React.useState<string[]>([]);
  const [copiedPath, setCopiedPath] = React.useState<string | null>(null);
  const [showEndpointMenu, setShowEndpointMenu] = React.useState<string | null>(null);

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

  const copyPath = async (path: string) => {
    try {
      await navigator.clipboard.writeText(path);
      setCopiedPath(path);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (error) {
      console.error('Failed to copy path:', error);
    }
  };

  const filteredEndpoints = React.useMemo(() => {
    let filtered = { ...endpointsByTag };

    // Filter by search term
    if (searchQuery) {
      Object.keys(filtered).forEach(tag => {
        filtered[tag] = filtered[tag].filter(({ path, operation }) =>
          path.toLowerCase().includes(searchQuery.toLowerCase()) ||
          operation.summary?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          operation.description?.toLowerCase().includes(searchQuery.toLowerCase())
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
  }, [endpointsByTag, searchQuery, selectedTags]);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Tags Filter */}
      <div className="flex flex-wrap gap-1.5 mb-4 px-4">
        {allTags.map(tag => (
          <button
            key={tag}
            onClick={() => toggleTag(tag)}
            className={cn(
              'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs transition-all duration-200',
              'border hover:shadow-sm',
              selectedTags.includes(tag)
                ? 'bg-primary/10 border-primary/20 text-primary hover:bg-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Tag className="h-3 w-3" />
            {tag}
          </button>
        ))}
      </div>

      {/* Endpoints List */}
      <div className="flex-1 -mx-4">
        {Object.entries(filteredEndpoints).map(([tag, endpoints]) => (
          <div key={tag} className="mb-4">
            <div className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider bg-muted/30">
              <Tag className="h-3.5 w-3.5" />
              {tag}
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted">
                {endpoints.length}
              </span>
            </div>
            <div>
              {endpoints.map(({ path, method, operation }) => {
                const isExpanded = expandedPaths.includes(path);
                const hasAuth = operation.security && operation.security.length > 0;
                const hasDeprecated = operation.deprecated;
                const endpointId = `${path}-${method}`;

                return (
                  <div
                    key={endpointId}
                    className={cn(
                      'group border-l-2 border-transparent transition-all duration-200',
                      isExpanded ? 'bg-muted/30 border-l-primary/50' : 'hover:bg-muted/30 hover:border-l-primary/20'
                    )}
                  >
                    <div className="flex items-center px-4 py-2">
                      <button
                        onClick={() => togglePathExpansion(path)}
                        className="flex-1 text-left"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'px-2 py-1 rounded-md text-xs font-medium border uppercase transition-all duration-200',
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
                                <Tooltip content="Requires authentication">
                                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                </Tooltip>
                              )}
                              {hasDeprecated && (
                                <Tooltip content="Deprecated">
                                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                                </Tooltip>
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
                      <div className="flex items-center gap-1 ml-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Tooltip content={copiedPath === path ? 'Copied!' : 'Copy path'}>
                          <button
                            onClick={() => copyPath(path)}
                            className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {copiedPath === path ? (
                              <Check className="h-3.5 w-3.5" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </button>
                        </Tooltip>
                        <div className="relative">
                          <Tooltip content="More actions">
                            <button
                              onClick={() => setShowEndpointMenu(showEndpointMenu === endpointId ? null : endpointId)}
                              className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                            >
                              <MoreVertical className="h-3.5 w-3.5" />
                            </button>
                          </Tooltip>
                          {showEndpointMenu === endpointId && (
                            <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                              <button
                                onClick={() => {
                                  onTest?.(path, method);
                                  setShowEndpointMenu(null);
                                }}
                                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                              >
                                <PlayCircle className="h-3.5 w-3.5" />
                                Test Endpoint
                              </button>
                              <button
                                onClick={() => setShowEndpointMenu(null)}
                                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                              >
                                <FileJson className="h-3.5 w-3.5" />
                                View Schema
                              </button>
                              <button
                                onClick={() => setShowEndpointMenu(null)}
                                className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                              >
                                <Share2 className="h-3.5 w-3.5" />
                                Share
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {isExpanded && (
                      <div className="px-4 pb-3 animate-in slide-in-from-top-2 duration-200">
                        {operation.description && (
                          <div className="flex items-start gap-2 mb-4 p-3 rounded-md bg-muted/50 text-sm text-muted-foreground">
                            <Info className="w-4 h-4 mt-0.5" />
                            <p className="flex-1 whitespace-pre-wrap">
                              {operation.description}
                            </p>
                          </div>
                        )}
                        
                        {/* Parameters */}
                        {operation.parameters && operation.parameters.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <Settings className="h-4 w-4" />
                              Parameters
                            </h4>
                            <div className="space-y-2">
                              {operation.parameters.map((param: any, index: number) => (
                                <div
                                  key={index}
                                  className="flex items-start gap-3 p-2 rounded-md bg-muted/30 text-sm"
                                >
                                  <div className="flex-shrink-0">
                                    <span className={cn(
                                      'px-1.5 py-0.5 rounded-md text-[10px] font-medium uppercase',
                                      param.required
                                        ? 'bg-destructive/10 text-destructive'
                                        : 'bg-muted text-muted-foreground'
                                    )}>
                                      {param.in}
                                    </span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-xs">
                                        {param.name}
                                      </span>
                                      {param.required && (
                                        <span className="text-[10px] text-destructive">*required</span>
                                      )}
                                    </div>
                                    {param.description && (
                                      <p className="text-xs text-muted-foreground mt-1">
                                        {param.description}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-xs text-muted-foreground font-mono">
                                    {param.type || param.schema?.type}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {operation.requestBody && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <ArrowRight className="h-4 w-4" />
                              Request Body
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(operation.requestBody.content).map(([contentType, schema]: [string, any]) => (
                                <div
                                  key={contentType}
                                  className="p-2 rounded-md bg-muted/30 text-sm"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <Code2 className="h-4 w-4 text-muted-foreground" />
                                    <span className="font-mono text-xs">{contentType}</span>
                                  </div>
                                  {schema.schema && (
                                    <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
                                      {JSON.stringify(schema.schema, null, 2)}
                                    </pre>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Responses */}
                        {operation.responses && (
                          <div>
                            <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                              <ArrowRight className="h-4 w-4 rotate-180" />
                              Responses
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(operation.responses).map(([status, response]: [string, any]) => (
                                <div
                                  key={status}
                                  className="p-2 rounded-md bg-muted/30 text-sm"
                                >
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className={cn(
                                      'px-1.5 py-0.5 rounded-md text-[10px] font-medium',
                                      status.startsWith('2')
                                        ? 'bg-green-500/10 text-green-500'
                                        : status.startsWith('4')
                                        ? 'bg-orange-500/10 text-orange-500'
                                        : status.startsWith('5')
                                        ? 'bg-red-500/10 text-red-500'
                                        : 'bg-blue-500/10 text-blue-500'
                                    )}>
                                      {status}
                                    </span>
                                    <span className="text-xs text-muted-foreground">
                                      {response.description}
                                    </span>
                                  </div>
                                  {response.content && (
                                    <div className="space-y-2">
                                      {Object.entries(response.content).map(([contentType, schema]: [string, any]) => (
                                        <div key={contentType}>
                                          <div className="flex items-center gap-2 mb-1">
                                            <Code2 className="h-3.5 w-3.5 text-muted-foreground" />
                                            <span className="font-mono text-xs">{contentType}</span>
                                          </div>
                                          {schema.schema && (
                                            <pre className="text-xs bg-muted/50 p-2 rounded-md overflow-x-auto">
                                              {JSON.stringify(schema.schema, null, 2)}
                                            </pre>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}
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

export default APIEndpoints; 