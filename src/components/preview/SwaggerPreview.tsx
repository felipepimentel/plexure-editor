import React from 'react';
import { parse } from 'yaml';
import { AlertCircle, ChevronDown, ChevronRight, Code, Server, Shield, Tag } from 'lucide-react';

interface SwaggerPreviewProps {
  content: string;
}

export function SwaggerPreview({ content }: SwaggerPreviewProps) {
  const [spec, setSpec] = React.useState<any>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [expandedPaths, setExpandedPaths] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    try {
      const parsed = parse(content);
      setSpec(parsed);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid YAML');
      setSpec(null);
    }
  }, [content]);

  const togglePath = (path: string) => {
    setExpandedPaths(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-300 p-4">
        <div className="flex flex-col items-center gap-2">
          <AlertCircle className="w-8 h-8 text-yellow-500" />
          <p className="text-sm">Invalid OpenAPI Specification</p>
          <p className="text-xs text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-900 text-gray-300">
        <p className="text-sm">No valid OpenAPI specification</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto bg-gray-900 text-gray-100">
      <div className="sticky top-0 z-10 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 p-4">
        {/* API Info Section */}
        {spec.info && (
          <div>
            <h1 className="text-2xl font-bold mb-2">{spec.info.title || 'Untitled API'}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Code className="w-4 h-4" />
                <span>Version: {spec.info.version || 'n/a'}</span>
              </div>
              {spec.info.license && (
                <div className="flex items-center gap-1">
                  <Shield className="w-4 h-4" />
                  <span>License: {spec.info.license.name}</span>
                </div>
              )}
            </div>
            {spec.info.description && (
              <p className="text-gray-300 text-sm mt-3 whitespace-pre-wrap">{spec.info.description}</p>
            )}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Servers Section */}
        {spec.servers && spec.servers.length > 0 && (
          <div className="mb-6">
            <h2 className="text-sm font-semibold text-gray-400 mb-2 flex items-center gap-2">
              <Server className="w-4 h-4" />
              SERVERS
            </h2>
            <div className="space-y-2">
              {spec.servers.map((server: any, index: number) => (
                <div key={index} className="bg-gray-800/50 rounded-md p-3">
                  <div className="text-sm font-mono text-blue-400">{server.url}</div>
                  {server.description && (
                    <div className="text-xs text-gray-400 mt-1">{server.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Endpoints Section */}
        {spec.paths && Object.entries(spec.paths).map(([path, methods]: [string, any]) => (
          <div key={path} className="mb-4 bg-gray-800/50 rounded-lg overflow-hidden">
            <div 
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-800/80"
              onClick={() => togglePath(path)}
            >
              <div className="flex items-center gap-2">
                {expandedPaths[path] ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <h2 className="text-lg font-mono text-gray-200">{path}</h2>
              </div>
              <div className="flex gap-1">
                {Object.keys(methods).map((method) => (
                  <span key={method} className={`uppercase text-xs font-mono px-2 py-1 rounded ${
                    method === 'get' ? 'bg-blue-600/30 text-blue-400' :
                    method === 'post' ? 'bg-green-600/30 text-green-400' :
                    method === 'put' ? 'bg-yellow-600/30 text-yellow-400' :
                    method === 'delete' ? 'bg-red-600/30 text-red-400' :
                    'bg-gray-600/30 text-gray-400'
                  }`}>
                    {method}
                  </span>
                ))}
              </div>
            </div>

            {expandedPaths[path] && (
              <div className="border-t border-gray-700">
                {Object.entries(methods).map(([method, operation]: [string, any]) => (
                  <div key={`${path}-${method}`} className="p-4 border-b border-gray-700/50 last:border-0">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`uppercase text-xs font-mono px-2 py-1 rounded ${
                        method === 'get' ? 'bg-blue-600/30 text-blue-400' :
                        method === 'post' ? 'bg-green-600/30 text-green-400' :
                        method === 'put' ? 'bg-yellow-600/30 text-yellow-400' :
                        method === 'delete' ? 'bg-red-600/30 text-red-400' :
                        'bg-gray-600/30 text-gray-400'
                      }`}>
                        {method}
                      </span>
                      <span className="text-sm font-medium">{operation.summary}</span>
                      {operation.tags && operation.tags.map((tag: string) => (
                        <span key={tag} className="flex items-center gap-1 text-xs text-gray-400 bg-gray-700/30 px-2 py-1 rounded">
                          <Tag className="w-3 h-3" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {operation.description && (
                      <p className="text-sm text-gray-400 mb-4">{operation.description}</p>
                    )}

                    {/* Parameters Section */}
                    {operation.parameters && operation.parameters.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">PARAMETERS</h4>
                        <div className="space-y-2">
                          {operation.parameters.map((param: any, index: number) => (
                            <div key={index} className="flex items-start gap-2 text-sm bg-gray-800/50 p-2 rounded">
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-blue-400">{param.name}</span>
                                  <span className="text-xs text-gray-500">({param.in})</span>
                                  {param.required && (
                                    <span className="text-xs text-red-400">required</span>
                                  )}
                                </div>
                                {param.description && (
                                  <p className="text-xs text-gray-400 mt-1">{param.description}</p>
                                )}
                              </div>
                              <div className="text-xs text-gray-400">
                                {param.schema?.type}
                                {param.schema?.format && ` (${param.schema.format})`}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Request Body Section */}
                    {operation.requestBody && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">REQUEST BODY</h4>
                        <div className="bg-gray-800/50 p-2 rounded">
                          {Object.entries(operation.requestBody.content).map(([contentType, content]: [string, any]) => (
                            <div key={contentType}>
                              <div className="text-xs font-mono text-blue-400">{contentType}</div>
                              {content.schema && (
                                <pre className="text-xs text-gray-400 mt-1 overflow-auto">
                                  {JSON.stringify(content.schema, null, 2)}
                                </pre>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Response Section */}
                    {operation.responses && (
                      <div>
                        <h4 className="text-xs font-semibold text-gray-500 mb-2">RESPONSES</h4>
                        <div className="space-y-2">
                          {Object.entries(operation.responses).map(([code, response]: [string, any]) => (
                            <div key={code} className="bg-gray-800/50 p-2 rounded">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-mono ${
                                  code.startsWith('2') ? 'text-green-400' :
                                  code.startsWith('4') ? 'text-yellow-400' :
                                  code.startsWith('5') ? 'text-red-400' :
                                  'text-gray-400'
                                }`}>
                                  {code}
                                </span>
                                <span className="text-sm text-gray-300">{response.description}</span>
                              </div>
                              {response.content && (
                                <div className="mt-2 pl-4 border-l border-gray-700">
                                  {Object.entries(response.content).map(([contentType, content]: [string, any]) => (
                                    <div key={contentType} className="mt-1">
                                      <div className="text-xs font-mono text-blue-400">{contentType}</div>
                                      {content.schema && (
                                        <pre className="text-xs text-gray-400 mt-1 overflow-auto">
                                          {JSON.stringify(content.schema, null, 2)}
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
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 