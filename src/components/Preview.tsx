import React from 'react';
import { OpenAPI } from 'openapi-types';
import { EndpointCard } from './EndpointCard';

interface PreviewProps {
  spec: OpenAPI.Document | null;
  error: string | null;
  darkMode: boolean;
}

export function Preview({ spec, error, darkMode }: PreviewProps) {
  if (!spec) return null;

  return (
    <div className={`h-full overflow-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="p-6">
        <div className="mb-6">
          <h2 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {spec.info?.title || 'API Documentation'}
          </h2>
          <div className={`flex items-center gap-2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <span className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
              Version: {spec.info?.version}
            </span>
            {spec.info?.license && (
              <span className={`px-2 py-1 rounded ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}>
                License: {spec.info.license.name}
              </span>
            )}
          </div>
          {spec.info?.description && (
            <p className={`mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              {spec.info.description}
            </p>
          )}
        </div>
        
        <div className="space-y-4">
          {Object.entries(spec.paths || {}).map(([path, methods]: [string, any]) => (
            <div key={path} className="space-y-2">
              {Object.entries(methods).map(([method, details]: [string, any]) => (
                <EndpointCard
                  key={`${path}-${method}`}
                  path={path}
                  method={method}
                  details={details}
                  darkMode={darkMode}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}