import React from 'react';
import { Play } from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

interface OpenAPIInfo {
  title: string;
  version: string;
  description?: string;
}

interface OpenAPIEndpoint {
  path: string;
  method: string;
  summary: string;
  description?: string;
}

interface OpenAPISchema {
  name: string;
  type: string;
  required: string[];
  properties: Record<string, {
    type: string;
    format?: string;
    description?: string;
  }>;
}

interface APIPreviewProps {
  info: OpenAPIInfo;
  endpoints: OpenAPIEndpoint[];
  schemas: OpenAPISchema[];
}

export function APIPreview({ info, endpoints, schemas }: APIPreviewProps) {
  const getMethodColor = (method: string) => {
    const colors = {
      GET: 'bg-emerald-400/10 text-emerald-400',
      POST: 'bg-blue-400/10 text-blue-400',
      PUT: 'bg-yellow-400/10 text-yellow-400',
      DELETE: 'bg-red-400/10 text-red-400',
      PATCH: 'bg-purple-400/10 text-purple-400',
    };
    return colors[method as keyof typeof colors] || 'bg-gray-400/10 text-gray-400';
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-none p-4 border-b border-white/[0.05] flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-300">API Preview</h2>
        <Tooltip content="Test Endpoint">
          <button className="p-1.5 text-gray-400 hover:text-gray-300 hover:bg-white/[0.05] rounded">
            <Play className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-6">
          {/* API Info */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-2">API Information</h3>
            <div className="space-y-2">
              <div className="p-3 bg-white/[0.02] rounded-md">
                <div className="text-sm font-medium text-gray-300">{info.title}</div>
                <div className="text-xs text-gray-500 mt-1">Version {info.version}</div>
                {info.description && (
                  <div className="text-xs text-gray-400 mt-2">{info.description}</div>
                )}
              </div>
            </div>
          </div>

          {/* Endpoints */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-2">Endpoints</h3>
            <div className="space-y-2">
              {endpoints.map((endpoint, index) => (
                <div key={index} className="p-3 bg-white/[0.02] rounded-md">
                  <div className="text-sm font-medium text-gray-300">{endpoint.path}</div>
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-1 rounded ${getMethodColor(endpoint.method)}`}>
                        {endpoint.method}
                      </span>
                      <span className="text-xs text-gray-400">{endpoint.summary}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schemas */}
          <div>
            <h3 className="text-xs font-medium text-gray-400 mb-2">Schemas</h3>
            <div className="space-y-2">
              {schemas.map((schema, index) => (
                <div key={index} className="p-3 bg-white/[0.02] rounded-md">
                  <div className="text-sm font-medium text-gray-300">{schema.name}</div>
                  <div className="mt-2 space-y-1">
                    {Object.entries(schema.properties).map(([name, prop]) => (
                      <div key={name} className="text-xs text-gray-400">
                        <span className="text-gray-500">{name}</span>
                        {' - '}
                        {prop.type}
                        {prop.format && ` (${prop.format})`}
                        {schema.required.includes(name) && (
                          <span className="text-red-400 ml-1">*</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 