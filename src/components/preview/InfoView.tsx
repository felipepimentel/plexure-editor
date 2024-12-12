import React from 'react';
import { OpenAPI } from 'openapi-types';

interface InfoViewProps {
  spec: OpenAPI.Document;
  darkMode: boolean;
}

export function InfoView({
  spec,
  darkMode
}: InfoViewProps) {
  return (
    <div className="p-4">
      {/* Implementação temporária básica */}
      <div className={`
        p-4 rounded-lg
        ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
      `}>
        <h3 className={`text-lg font-bold mb-2 ${
          darkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          {spec.info?.title}
        </h3>
        {spec.info?.description && (
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {spec.info.description}
          </p>
        )}
      </div>
    </div>
  );
} 