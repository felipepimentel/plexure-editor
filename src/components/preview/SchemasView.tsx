import React from 'react';
import { OpenAPI } from 'openapi-types';

interface SchemasViewProps {
  spec: OpenAPI.Document;
  darkMode: boolean;
  searchQuery: string;
}

export function SchemasView({
  spec,
  darkMode,
  searchQuery
}: SchemasViewProps) {
  return (
    <div className="p-4">
      {/* Implementação temporária básica */}
      <div className="space-y-4">
        {Object.entries(spec.components?.schemas || {}).map(([name, schema]) => (
          <div key={name} className={`
            p-4 rounded-lg
            ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
          `}>
            <div className="font-mono text-sm">
              {name}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 