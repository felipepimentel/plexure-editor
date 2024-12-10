import React from 'react';
import { ChevronRight, Type, List, Key } from 'lucide-react';

interface SchemaVisualizerProps {
  schema: any;
  darkMode: boolean;
  level?: number;
}

export function SchemaVisualizer({ schema, darkMode, level = 0 }: SchemaVisualizerProps) {
  if (!schema) return null;

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'string':
        return darkMode ? 'text-green-400' : 'text-green-600';
      case 'number':
      case 'integer':
        return darkMode ? 'text-blue-400' : 'text-blue-600';
      case 'boolean':
        return darkMode ? 'text-purple-400' : 'text-purple-600';
      case 'array':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  const renderProperty = (name: string, prop: any) => {
    const required = schema.required?.includes(name);
    const type = prop.type || (prop.items ? 'array' : 'object');

    return (
      <div key={name} style={{ marginLeft: `${level * 16}px` }}>
        <div className="flex items-center gap-2 py-1">
          {level > 0 && <ChevronRight className="w-4 h-4 text-gray-400" />}
          <Key className={`w-4 h-4 ${required ? 'text-blue-500' : 'text-gray-400'}`} />
          <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
            {name}
          </span>
          {required && (
            <span className="text-xs text-red-500">required</span>
          )}
          <Type className={`w-4 h-4 ${getTypeColor(type)}`} />
          <span className={`text-sm ${getTypeColor(type)}`}>
            {type}
          </span>
          {prop.format && (
            <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              ({prop.format})
            </span>
          )}
        </div>
        
        {prop.description && (
          <p className={`text-sm ml-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {prop.description}
          </p>
        )}

        {type === 'array' && prop.items && (
          <div className="ml-6 flex items-center gap-2">
            <List className="w-4 h-4 text-gray-400" />
            <SchemaVisualizer
              schema={prop.items}
              darkMode={darkMode}
              level={level + 1}
            />
          </div>
        )}

        {type === 'object' && prop.properties && (
          <SchemaVisualizer
            schema={prop}
            darkMode={darkMode}
            level={level + 1}
          />
        )}
      </div>
    );
  };

  return (
    <div className={`rounded-lg ${level === 0 ? 'p-4' : ''} ${
      darkMode ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      {schema.properties && Object.entries(schema.properties).map(([name, prop]) =>
        renderProperty(name, prop)
      )}
    </div>
  );
}