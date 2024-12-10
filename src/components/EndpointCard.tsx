import React, { useState } from 'react';
import { ChevronDown, ChevronRight, FileJson, FileText, Play, Code } from 'lucide-react';
import { MethodBadge } from './MethodBadge';
import { ApiTester } from './ApiTester';
import { SchemaVisualizer } from './SchemaVisualizer';

interface EndpointCardProps {
  path: string;
  method: string;
  details: any;
  darkMode: boolean;
}

export function EndpointCard({ path, method, details, darkMode }: EndpointCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showTester, setShowTester] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  return (
    <div className={`border rounded-lg p-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          <MethodBadge method={method} />
          <span className={`font-mono text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {path}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        ) : (
          <ChevronRight className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        )}
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-4">
          {details.summary && (
            <div>
              <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Summary
              </h4>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {details.summary}
              </p>
            </div>
          )}

          {details.description && (
            <div>
              <h4 className={`text-sm font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Description
              </h4>
              <p className={`mt-1 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {details.description}
              </p>
            </div>
          )}

          <div className="flex gap-4">
            {details.parameters && (
              <div className="flex items-center gap-1">
                <FileText size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {details.parameters.length} Parameters
                </span>
              </div>
            )}
            {details.requestBody && (
              <div className="flex items-center gap-1">
                <FileJson size={16} className={darkMode ? 'text-gray-400' : 'text-gray-600'} />
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Request Body
                </span>
              </div>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowTester(!showTester);
              }}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
            >
              <Play size={16} />
              <span className="text-sm">Try it</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSchema(!showSchema);
              }}
              className="flex items-center gap-1 text-purple-600 hover:text-purple-700"
            >
              <Code size={16} />
              <span className="text-sm">Schema</span>
            </button>
          </div>

          {showTester && (
            <ApiTester
              method={method}
              path={path}
              parameters={details.parameters}
              requestBody={details.requestBody}
              darkMode={darkMode}
            />
          )}

          {showSchema && details.requestBody?.content?.['application/json']?.schema && (
            <div className="mt-4">
              <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Request Schema
              </h4>
              <SchemaVisualizer
                schema={details.requestBody.content['application/json'].schema}
                darkMode={darkMode}
              />
            </div>
          )}

          {showSchema && details.responses?.['200']?.content?.['application/json']?.schema && (
            <div className="mt-4">
              <h4 className={`text-sm font-semibold mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Response Schema
              </h4>
              <SchemaVisualizer
                schema={details.responses['200'].content['application/json'].schema}
                darkMode={darkMode}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}