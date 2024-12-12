import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Type, List, Code, Eye } from 'lucide-react';
import * as Tooltip from '@radix-ui/react-tooltip';

interface SchemaViewerProps {
  schema: any;
  darkMode: boolean;
  isNested?: boolean;
}

export function SchemaViewer({ schema, darkMode, isNested = false }: SchemaViewerProps) {
  const [isExpanded, setIsExpanded] = useState(!isNested);
  const [viewMode, setViewMode] = useState<'visual' | 'json'>('visual');

  if (!schema) return null;

  const getTypeColor = (type: string) => {
    const colors = {
      string: 'text-emerald-400',
      number: 'text-blue-400',
      integer: 'text-blue-400',
      boolean: 'text-yellow-400',
      array: 'text-purple-400',
      object: 'text-pink-400'
    };
    return colors[type] || 'text-gray-400';
  };

  return (
    <div className={`
      rounded-lg overflow-hidden
      ${darkMode ? 'bg-gray-900 border border-gray-800' : 'bg-white border border-gray-200'}
    `}>
      {/* Schema Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 rounded hover:bg-gray-800"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )}
          </button>
          <div className="flex items-center gap-2">
            <Type className="w-4 h-4 text-gray-400" />
            <span className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
              {schema.title || 'Schema'}
            </span>
            <Tooltip.Provider>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <span className={`text-xs font-mono cursor-help ${getTypeColor(schema.type)}`}>
                    {schema.type}
                    {schema.format && `(${schema.format})`}
                  </span>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    className="rounded px-2 py-1 text-xs bg-gray-900 text-gray-200 z-50"
                    sideOffset={5}
                  >
                    {`Type: ${schema.type}${schema.format ? ` (${schema.format})` : ''}`}
                    <Tooltip.Arrow className="fill-gray-900" />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setViewMode('visual')}
            className={`
              p-1.5 rounded text-xs transition-colors
              ${viewMode === 'visual'
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('json')}
            className={`
              p-1.5 rounded text-xs transition-colors
              ${viewMode === 'json'
                ? 'bg-blue-500/10 text-blue-400'
                : 'text-gray-400 hover:text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            <Code className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Schema Content */}
      {isExpanded && (
        <div className="p-3">
          {viewMode === 'visual' ? (
            <div className="space-y-4">
              {/* Description */}
              {schema.description && (
                <p className="text-sm text-gray-400">
                  {schema.description}
                </p>
              )}

              {/* Properties */}
              {schema.type === 'object' && schema.properties && (
                <div className="space-y-2">
                  {Object.entries(schema.properties).map(([propName, propSchema]: [string, any]) => (
                    <Tooltip.Provider key={propName}>
                      <div className="p-2 rounded-lg bg-gray-800/50">
                        <div className="flex items-center gap-2">
                          <Tooltip.Root>
                            <Tooltip.Trigger asChild>
                              <span className="font-mono text-sm text-gray-300 cursor-help">
                                {propName}
                              </span>
                            </Tooltip.Trigger>
                            <Tooltip.Portal>
                              <Tooltip.Content
                                className="rounded px-2 py-1 text-xs bg-gray-900 text-gray-200 z-50"
                                sideOffset={5}
                              >
                                {propSchema.description || propName}
                                <Tooltip.Arrow className="fill-gray-900" />
                              </Tooltip.Content>
                            </Tooltip.Portal>
                          </Tooltip.Root>
                          <span className={`text-xs ${getTypeColor(propSchema.type)}`}>
                            {propSchema.type}
                          </span>
                          {schema.required?.includes(propName) && (
                            <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500/10 text-red-400">
                              required
                            </span>
                          )}
                        </div>
                        {propSchema.description && (
                          <p className="mt-1 text-xs text-gray-400">
                            {propSchema.description}
                          </p>
                        )}
                        {propSchema.type === 'object' && (
                          <div className="mt-2 pl-4">
                            <SchemaViewer
                              schema={propSchema}
                              darkMode={darkMode}
                              isNested
                            />
                          </div>
                        )}
                      </div>
                    </Tooltip.Provider>
                  ))}
                </div>
              )}

              {/* Array Items */}
              {schema.type === 'array' && schema.items && (
                <div className="pl-4 border-l-2 border-gray-800">
                  <div className="flex items-center gap-2 mb-2">
                    <List className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      Array Items
                    </span>
                  </div>
                  <SchemaViewer
                    schema={schema.items}
                    darkMode={darkMode}
                    isNested
                  />
                </div>
              )}
            </div>
          ) : (
            <pre className="p-4 rounded-lg bg-gray-800/50 font-mono text-sm text-gray-300 overflow-auto">
              {JSON.stringify(schema, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
