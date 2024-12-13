import React, { useState } from 'react';
import { FileJson, FileText, Play, Code } from 'lucide-react';
import { MethodBadge } from '../common/MethodBadge';
import { ApiTester } from './ApiTester';
import { SchemaVisualizer } from './SchemaVisualizer';
import { BaseCard } from '../../ui/Card';
import { BaseButton } from '../../ui/Button';

interface EndpointCardProps {
  path: string;
  method: string;
  details: any;
  darkMode: boolean;
}

export function EndpointCard({ path, method, details, darkMode }: EndpointCardProps) {
  const [showTester, setShowTester] = useState(false);
  const [showSchema, setShowSchema] = useState(false);

  return (
    <BaseCard
      title={
        <div className="flex items-center gap-2">
          <MethodBadge method={method} />
          <span className={`font-mono text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            {path}
          </span>
        </div>
      }
      subtitle={details.summary}
      darkMode={darkMode}
      isExpandable
    >
      <div className="space-y-4">
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
          <BaseButton
            onClick={() => setShowTester(!showTester)}
            variant="ghost"
            size="sm"
            darkMode={darkMode}
            icon={<Play className="w-4 h-4" />}
            className="text-blue-600 hover:text-blue-700"
          >
            Try it
          </BaseButton>
          <BaseButton
            onClick={() => setShowSchema(!showSchema)}
            variant="ghost"
            size="sm"
            darkMode={darkMode}
            icon={<Code className="w-4 h-4" />}
            className="text-purple-600 hover:text-purple-700"
          >
            Schema
          </BaseButton>
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
    </BaseCard>
  );
}