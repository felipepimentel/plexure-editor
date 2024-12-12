import React from 'react';
import { OpenAPI } from 'openapi-types';
import { 
  ChevronRight, 
  Lock, 
  MessageSquare, 
  ArrowRight, 
  Database,
  FileJson,
  AlertCircle,
  Terminal
} from 'lucide-react';
import { CodeBlock } from '../common/CodeBlock';
import { SchemaViewer } from './SchemaViewer';

interface EndpointsViewProps {
  spec: OpenAPI.Document;
  darkMode: boolean;
  searchQuery: string;
  expandedPaths: Set<string>;
  methodFilters: Set<string>;
  showDeprecated: boolean;
  selectedServer: number;
  viewMode: 'list' | 'code';
  onTogglePath: (path: string) => void;
}

export function EndpointsView({
  spec,
  darkMode,
  searchQuery,
  expandedPaths,
  methodFilters,
  showDeprecated,
  selectedServer,
  viewMode,
  onTogglePath
}: EndpointsViewProps) {
  return (
    <div className="flex-1 overflow-auto">
      {Object.entries(spec.paths || {})
        .filter(([path, methods]) => {
          if (!showDeprecated && Object.values(methods || {}).some(m => m.deprecated)) {
            return false;
          }
          if (methodFilters.size > 0) {
            const hasFilteredMethod = Object.keys(methods || {}).some(
              method => methodFilters.has(method.toLowerCase())
            );
            if (!hasFilteredMethod) return false;
          }
          return path.toLowerCase().includes(searchQuery.toLowerCase());
        })
        .map(([path, methods]) => (
          <div key={path} className="border-b border-gray-800">
            {/* Path Header */}
            <div
              onClick={() => onTogglePath(path)}
              className="flex items-center px-4 py-3 cursor-pointer hover:bg-gray-800/50"
            >
              <ChevronRight className={`
                w-4 h-4 text-gray-400 mr-2 transition-transform
                ${expandedPaths.has(path) ? 'rotate-90' : ''}
              `} />
              <span className="text-gray-300 font-mono text-sm">{path}</span>
            </div>

            {/* Methods Detail */}
            {expandedPaths.has(path) && (
              <div className="pl-10 pr-4 pb-4 space-y-4">
                {Object.entries(methods || {}).map(([method, operation]: [string, any]) => {
                  if (methodFilters.size > 0 && !methodFilters.has(method.toLowerCase())) {
                    return null;
                  }

                  return (
                    <div
                      key={`${path}-${method}`}
                      className={`
                        rounded-lg border overflow-hidden
                        ${darkMode ? 'border-gray-800' : 'border-gray-200'}
                      `}
                    >
                      {/* Operation Header */}
                      <div className={`
                        p-4 ${getMethodBgColor(method)}
                      `}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`
                              uppercase text-xs font-medium px-2 py-1 rounded
                              ${getMethodColor(method)}
                            `}>
                              {method}
                            </span>
                            <span className="text-gray-200 font-medium">
                              {operation.summary || operation.operationId || path}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {operation.deprecated && (
                              <span className="px-2 py-1 text-xs rounded-full
                                bg-yellow-500/10 text-yellow-400 flex items-center gap-1">
                                <AlertCircle className="w-3 h-3" />
                                Deprecated
                              </span>
                            )}
                            {operation.security && (
                              <span className="px-2 py-1 text-xs rounded-full
                                bg-blue-500/10 text-blue-400 flex items-center gap-1">
                                <Lock className="w-3 h-3" />
                                Secured
                              </span>
                            )}
                          </div>
                        </div>
                        {operation.description && (
                          <p className="mt-2 text-sm text-gray-400">
                            {operation.description}
                          </p>
                        )}
                      </div>

                      {/* Operation Content */}
                      <div className="p-4 space-y-6">
                        {/* Parameters Section */}
                        {operation.parameters && operation.parameters.length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              <Database className="w-4 h-4" />
                              Parameters
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                              {operation.parameters.map((param: any) => (
                                <div
                                  key={`${param.in}-${param.name}`}
                                  className="p-3 rounded-lg bg-gray-800/50"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono text-sm text-gray-300">
                                        {param.name}
                                      </span>
                                      <span className={`
                                        px-1.5 py-0.5 text-xs rounded-full
                                        ${param.required
                                          ? 'bg-red-500/10 text-red-400'
                                          : 'bg-gray-700 text-gray-400'
                                        }
                                      `}>
                                        {param.required ? 'required' : 'optional'}
                                      </span>
                                      <span className="px-1.5 py-0.5 text-xs rounded-full
                                        bg-gray-700 text-gray-400">
                                        {param.in}
                                      </span>
                                    </div>
                                    <span className="text-xs font-mono text-gray-500">
                                      {param.type || param.schema?.type}
                                    </span>
                                  </div>
                                  {param.description && (
                                    <p className="mt-1 text-sm text-gray-400">
                                      {param.description}
                                    </p>
                                  )}
                                  {param.schema && (
                                    <div className="mt-2">
                                      <SchemaViewer
                                        schema={param.schema}
                                        darkMode={darkMode}
                                        isNested
                                      />
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {operation.requestBody && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              <ArrowRight className="w-4 h-4" />
                              Request Body
                            </h4>
                            <div className="space-y-2">
                              {Object.entries(operation.requestBody.content).map(([mediaType, content]: [string, any]) => (
                                <div key={mediaType} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs font-mono text-gray-400">
                                      {mediaType}
                                    </span>
                                    {operation.requestBody.required && (
                                      <span className="px-1.5 py-0.5 text-xs rounded-full
                                        bg-red-500/10 text-red-400">
                                        required
                                      </span>
                                    )}
                                  </div>
                                  <div className="p-3 rounded-lg bg-gray-800/50">
                                    <SchemaViewer
                                      schema={content.schema}
                                      darkMode={darkMode}
                                    />
                                    {content.example && (
                                      <div className="mt-3">
                                        <div className="text-xs font-medium text-gray-400 mb-2">
                                          Example:
                                        </div>
                                        <CodeBlock
                                          code={JSON.stringify(content.example, null, 2)}
                                          language="json"
                                          darkMode={darkMode}
                                        />
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Responses */}
                        {operation.responses && (
                          <div className="space-y-3">
                            <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Responses
                            </h4>
                            <div className="space-y-3">
                              {Object.entries(operation.responses).map(([status, response]: [string, any]) => (
                                <div key={status} className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <span className={`
                                      px-2 py-1 text-xs rounded-full font-medium
                                      ${getStatusColor(status)}
                                    `}>
                                      {status}
                                    </span>
                                    <span className="text-sm text-gray-400">
                                      {response.description}
                                    </span>
                                  </div>
                                  {response.content && (
                                    <div className="space-y-2">
                                      {Object.entries(response.content).map(([mediaType, content]: [string, any]) => (
                                        <div key={mediaType} className="p-3 rounded-lg bg-gray-800/50">
                                          <div className="text-xs font-mono text-gray-400 mb-2">
                                            {mediaType}
                                          </div>
                                          <SchemaViewer
                                            schema={content.schema}
                                            darkMode={darkMode}
                                          />
                                          {content.example && (
                                            <div className="mt-3">
                                              <div className="text-xs font-medium text-gray-400 mb-2">
                                                Example:
                                              </div>
                                              <CodeBlock
                                                code={JSON.stringify(content.example, null, 2)}
                                                language="json"
                                                darkMode={darkMode}
                                              />
                                            </div>
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

                        {/* Code Examples */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-medium text-gray-300 flex items-center gap-2">
                            <Terminal className="w-4 h-4" />
                            Code Examples
                          </h4>
                          <div className="p-3 rounded-lg bg-gray-800/50">
                            <CodeBlock
                              code={generateCodeExample(method, path, operation, spec.servers?.[selectedServer]?.url)}
                              language="bash"
                              darkMode={darkMode}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
    </div>
  );
}

function getMethodColor(method: string): string {
  const colors = {
    get: 'bg-blue-500/10 text-blue-400',
    post: 'bg-green-500/10 text-green-400',
    put: 'bg-yellow-500/10 text-yellow-400',
    delete: 'bg-red-500/10 text-red-400',
    patch: 'bg-purple-500/10 text-purple-400'
  };
  return colors[method.toLowerCase()] || 'bg-gray-500/10 text-gray-400';
}

function getMethodBgColor(method: string): string {
  const colors = {
    get: 'bg-blue-500/10',
    post: 'bg-green-500/10',
    put: 'bg-yellow-500/10',
    delete: 'bg-red-500/10',
    patch: 'bg-purple-500/10'
  };
  return colors[method.toLowerCase()] || 'bg-gray-500/10';
}

function getStatusColor(status: string): string {
  const colors = {
    '200': 'bg-green-500/10 text-green-400',
    '201': 'bg-green-500/10 text-green-400',
    '202': 'bg-green-500/10 text-green-400',
    '204': 'bg-green-500/10 text-green-400',
    '206': 'bg-green-500/10 text-green-400',
    '300': 'bg-yellow-500/10 text-yellow-400',
    '301': 'bg-yellow-500/10 text-yellow-400',
    '302': 'bg-yellow-500/10 text-yellow-400',
    '304': 'bg-yellow-500/10 text-yellow-400',
    '307': 'bg-yellow-500/10 text-yellow-400',
    '308': 'bg-yellow-500/10 text-yellow-400',
    '400': 'bg-red-500/10 text-red-400',
    '401': 'bg-red-500/10 text-red-400',
    '403': 'bg-red-500/10 text-red-400',
    '404': 'bg-red-500/10 text-red-400',
    '405': 'bg-red-500/10 text-red-400',
    '406': 'bg-red-500/10 text-red-400',
    '408': 'bg-red-500/10 text-red-400',
    '409': 'bg-red-500/10 text-red-400',
    '410': 'bg-red-500/10 text-red-400',
    '411': 'bg-red-500/10 text-red-400',
    '412': 'bg-red-500/10 text-red-400',
    '413': 'bg-red-500/10 text-red-400',
    '414': 'bg-red-500/10 text-red-400',
    '415': 'bg-red-500/10 text-red-400',
    '416': 'bg-red-500/10 text-red-400',
    '417': 'bg-red-500/10 text-red-400',
    '418': 'bg-red-500/10 text-red-400',
    '421': 'bg-red-500/10 text-red-400',
    '422': 'bg-red-500/10 text-red-400',
    '423': 'bg-red-500/10 text-red-400',
    '424': 'bg-red-500/10 text-red-400',
    '425': 'bg-red-500/10 text-red-400',
    '426': 'bg-red-500/10 text-red-400',
    '428': 'bg-red-500/10 text-red-400',
    '429': 'bg-red-500/10 text-red-400',
    '431': 'bg-red-500/10 text-red-400',
    '500': 'bg-red-500/10 text-red-400',
    '501': 'bg-red-500/10 text-red-400',
    '502': 'bg-red-500/10 text-red-400',
    '503': 'bg-red-500/10 text-red-400',
    '504': 'bg-red-500/10 text-red-400',
    '505': 'bg-red-500/10 text-red-400'
  };
  return colors[status] || 'bg-gray-500/10 text-gray-400';
}

function generateCodeExample(method: string, path: string, operation: any, baseUrl?: string): string {
  const url = baseUrl ? baseUrl.replace(/\/$/, '') : '';
  const pathParts = path.split('/');
  const methodParts = method.split('');
  const pathTemplate = pathParts.map(part => part.replace(/[{}]/g, '')).join('/');
  const methodTemplate = methodParts.map(part => part.replace(/[{}]/g, '')).join('');
  const urlTemplate = url.replace(/[{}]/g, '');
  const codeExample = `curl -X ${methodTemplate} "${urlTemplate}/${pathTemplate}"`;
  return codeExample;
} 