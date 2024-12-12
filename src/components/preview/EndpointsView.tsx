import React from 'react';
import { OpenAPI } from 'openapi-types';

interface EndpointsViewProps {
  spec: OpenAPI.Document;
  darkMode: boolean;
  searchQuery: string;
  expandedPaths: Set<string>;
  expandedOperations: Set<string>;
  onTogglePath: (path: string) => void;
  onToggleOperation: (operationId: string) => void;
}

export function EndpointsView({
  spec,
  darkMode,
  searchQuery,
  expandedPaths,
  expandedOperations,
  onTogglePath,
  onToggleOperation
}: EndpointsViewProps) {
  return (
    <div className="p-4">
      {/* Implementação temporária básica */}
      <div className="space-y-4">
        {Object.entries(spec.paths || {}).map(([path, methods]) => (
          <div key={path} className={`
            p-4 rounded-lg
            ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
          `}>
            <div className="font-mono text-sm">
              {path}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 