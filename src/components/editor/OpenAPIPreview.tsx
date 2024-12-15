import React, { useEffect, useState } from 'react';
import { parse } from 'yaml';
import { OpenAPIV3 } from 'openapi-types';
import { cn } from '@/utils/cn';
import {
  Book,
  Code,
  Link as LinkIcon,
  ChevronRight,
  ChevronDown,
  Hash,
  Tag,
  Server,
  Shield,
  Search,
  Filter,
} from 'lucide-react';

interface OpenAPIPreviewProps {
  content: string;
  className?: string;
}

interface EndpointProps {
  path: string;
  method: string;
  operation: OpenAPIV3.OperationObject;
  expanded?: boolean;
  onToggle?: () => void;
}

const MethodBadge: React.FC<{ method: string }> = ({ method }) => {
  const colors = {
    get: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    post: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    put: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    delete: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    patch: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    options: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
    head: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  };

  return (
    <span className={cn(
      'px-2 py-1 rounded text-xs font-medium uppercase',
      colors[method as keyof typeof colors] || colors.get
    )}>
      {method}
    </span>
  );
};

const Endpoint: React.FC<EndpointProps> = ({
  path,
  method,
  operation,
  expanded = false,
  onToggle
}) => {
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className={cn(
          'w-full flex items-center gap-3 p-3',
          'hover:bg-gray-50 dark:hover:bg-gray-800',
          'transition-colors duration-200'
        )}
      >
        <div className="flex items-center gap-2">
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
          <MethodBadge method={method} />
        </div>
        <span className="font-mono text-sm">{path}</span>
        {operation.summary && (
          <span className="text-sm text-gray-500 truncate">
            {operation.summary}
          </span>
        )}
        {operation.deprecated && (
          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">
            Deprecated
          </span>
        )}
      </button>

      {expanded && (
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          {/* Tags */}
          {operation.tags && operation.tags.length > 0 && (
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-gray-400" />
              {operation.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Description */}
          {operation.description && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Book className="w-4 h-4 text-gray-400" />
                Description
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-300 pl-6">
                {operation.description}
              </p>
            </div>
          )}

          {/* Security */}
          {operation.security && operation.security.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Shield className="w-4 h-4 text-gray-400" />
                Security
              </h4>
              <div className="space-y-1 pl-6">
                {operation.security.map((security, index) => (
                  <div key={index} className="text-sm">
                    {Object.entries(security).map(([scheme, scopes]) => (
                      <div key={scheme} className="flex items-start gap-2">
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {scheme}
                        </span>
                        {scopes.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {scopes.map(scope => (
                              <span
                                key={scope}
                                className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded"
                              >
                                {scope}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Parameters */}
          {operation.parameters && operation.parameters.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-400" />
                Parameters
              </h4>
              <div className="space-y-3 pl-6">
                {operation.parameters.map((param, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-1 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-medium">
                        {param.name}
                      </span>
                      <span className="px-1.5 py-0.5 text-xs bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded">
                        {param.in}
                      </span>
                      {param.required && (
                        <span className="text-red-500 text-xs">Required</span>
                      )}
                    </div>
                    {param.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        {param.description}
                      </p>
                    )}
                    {param.schema && (
                      <div className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">
                        {JSON.stringify(param.schema, null, 2)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Request Body */}
          {operation.requestBody && (
            <div className="mb-4">
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Code className="w-4 h-4 text-gray-400" />
                Request Body
              </h4>
              <div className="pl-6 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
                {(operation.requestBody as OpenAPIV3.RequestBodyObject).description && (
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                    {(operation.requestBody as OpenAPIV3.RequestBodyObject).description}
                  </p>
                )}
                {(operation.requestBody as OpenAPIV3.RequestBodyObject).required && (
                  <p className="text-red-500 text-xs mb-2">Required</p>
                )}
                {(operation.requestBody as OpenAPIV3.RequestBodyObject).content && (
                  <div className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">
                    {JSON.stringify((operation.requestBody as OpenAPIV3.RequestBodyObject).content, null, 2)}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Responses */}
          {operation.responses && (
            <div>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                <Hash className="w-4 h-4 text-gray-400" />
                Responses
              </h4>
              <div className="space-y-2 pl-6">
                {Object.entries(operation.responses).map(([code, response]) => (
                  <div
                    key={code}
                    className="p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        'px-2 py-0.5 rounded text-xs font-mono',
                        code.startsWith('2') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        code.startsWith('4') ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                        code.startsWith('5') ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' :
                        'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                      )}>
                        {code}
                      </span>
                      {(response as OpenAPIV3.ResponseObject).description && (
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {(response as OpenAPIV3.ResponseObject).description}
                        </span>
                      )}
                    </div>
                    {(response as OpenAPIV3.ResponseObject).content && (
                      <div className="text-xs font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">
                        {JSON.stringify((response as OpenAPIV3.ResponseObject).content, null, 2)}
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
};

export const OpenAPIPreview: React.FC<OpenAPIPreviewProps> = ({
  content,
  className
}) => {
  const [spec, setSpec] = useState<OpenAPIV3.Document | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedEndpoints, setExpandedEndpoints] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const parsed = parse(content) as OpenAPIV3.Document;
      setSpec(parsed);
      setError(null);
    } catch (err) {
      setSpec(null);
      setError(err instanceof Error ? err.message : 'Failed to parse OpenAPI specification');
    }
  }, [content]);

  const toggleEndpoint = (path: string, method: string) => {
    const key = `${method}:${path}`;
    setExpandedEndpoints(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => {
      const next = new Set(prev);
      if (next.has(tag)) {
        next.delete(tag);
      } else {
        next.add(tag);
      }
      return next;
    });
  };

  if (error) {
    return (
      <div className={cn('p-4 bg-red-50 text-red-800 rounded-lg', className)}>
        <h3 className="font-medium mb-2">Error parsing OpenAPI specification</h3>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className={cn('p-4 text-gray-500', className)}>
        No preview available
      </div>
    );
  }

  // Get all unique tags
  const allTags = new Set<string>();
  if (spec.paths) {
    Object.values(spec.paths).forEach(pathItem => {
      Object.values(pathItem || {}).forEach(operation => {
        if (operation && 'tags' in operation) {
          operation.tags?.forEach(tag => allTags.add(tag));
        }
      });
    });
  }

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Header */}
      <div className="flex-shrink-0 p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold mb-2">{spec.info.title}</h2>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <span>Version {spec.info.version}</span>
          {spec.info.license && (
            <>
              <span>•</span>
              <span>{spec.info.license.name}</span>
            </>
          )}
        </div>
        {spec.info.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {spec.info.description}
          </p>
        )}

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search endpoints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'w-full pl-9 pr-4 py-2 text-sm',
                'bg-white dark:bg-gray-800',
                'border border-gray-200 dark:border-gray-700',
                'rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            />
          </div>

          {allTags.size > 0 && (
            <div className="flex flex-wrap gap-2">
              {Array.from(allTags).map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={cn(
                    'px-2 py-1 text-xs font-medium rounded-full',
                    'transition-colors duration-200',
                    selectedTags.has(tag)
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                  )}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {/* Servers */}
        {spec.servers && spec.servers.length > 0 && (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
              <Server className="w-4 h-4 text-gray-400" />
              Servers
            </h3>
            <div className="space-y-2">
              {spec.servers.map((server, index) => (
                <div
                  key={index}
                  className="p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm"
                >
                  <div className="font-mono text-gray-700 dark:text-gray-300">
                    {server.url}
                  </div>
                  {server.description && (
                    <div className="text-gray-500 text-xs mt-1">
                      {server.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endpoints */}
        <div className="p-4 space-y-2">
          {spec.paths && Object.entries(spec.paths)
            .filter(([path, pathItem]) => {
              if (searchTerm) {
                const searchLower = searchTerm.toLowerCase();
                if (!path.toLowerCase().includes(searchLower)) {
                  const operations = Object.values(pathItem || {});
                  return operations.some(op => {
                    if (!op || typeof op !== 'object') return false;
                    return (
                      op.summary?.toLowerCase().includes(searchLower) ||
                      op.description?.toLowerCase().includes(searchLower)
                    );
                  });
                }
                return true;
              }
              return true;
            })
            .map(([path, pathItem]) => (
              <React.Fragment key={path}>
                {Object.entries(pathItem || {}).map(([method, operation]) => {
                  if (method === '$ref' || !operation) return null;
                  if (selectedTags.size > 0 && (!operation.tags || !operation.tags.some(tag => selectedTags.has(tag)))) {
                    return null;
                  }
                  const key = `${method}:${path}`;
                  return (
                    <Endpoint
                      key={key}
                      path={path}
                      method={method}
                      operation={operation as OpenAPIV3.OperationObject}
                      expanded={expandedEndpoints.has(key)}
                      onToggle={() => toggleEndpoint(path, method)}
                    />
                  );
                })}
              </React.Fragment>
            ))}
        </div>
      </div>
    </div>
  );
}; 