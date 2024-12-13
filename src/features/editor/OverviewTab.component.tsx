import React from 'react';
import { Tag, AlertCircle, Shield } from 'lucide-react';
import { BaseCard } from '../../ui/Card';
import { MarkdownContent } from '../common/MarkdownContent';
import { ParameterList } from './ParameterList';
import { SchemaViewer } from './SchemaViewer';

interface OverviewTabProps {
  operation: any;
  darkMode: boolean;
}

export function OverviewTab({ operation, darkMode }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Description and Metadata */}
      <BaseCard
        darkMode={darkMode}
        className="border-0 shadow-none"
      >
        {operation.description && (
          <div className="mb-4">
            <MarkdownContent 
              content={operation.description}
              darkMode={darkMode}
            />
          </div>
        )}
        
        <div className="flex flex-wrap gap-3">
          {operation.tags?.map(tag => (
            <div key={tag} className={`
              flex items-center gap-1.5 px-2 py-1 rounded-full text-xs
              ${darkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}
            `}>
              <Tag className="w-3 h-3" />
              {tag}
            </div>
          ))}
          
          {operation.deprecated && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-400">
              <AlertCircle className="w-3 h-3" />
              Deprecated
            </div>
          )}
          
          {operation.security && (
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-full text-xs bg-blue-500/10 text-blue-400">
              <Shield className="w-3 h-3" />
              Requires Authentication
            </div>
          )}
        </div>
      </BaseCard>

      {/* Parameters */}
      {operation.parameters && operation.parameters.length > 0 && (
        <BaseCard
          title="Parameters"
          darkMode={darkMode}
          className="border-0 shadow-none"
        >
          <ParameterList 
            parameters={operation.parameters}
            darkMode={darkMode}
          />
        </BaseCard>
      )}

      {/* Request Body */}
      {operation.requestBody && (
        <BaseCard
          title="Request Body"
          darkMode={darkMode}
          className="border-0 shadow-none"
        >
          <div className="space-y-4">
            {Object.entries(operation.requestBody.content).map(([mediaType, content]: [string, any]) => (
              <div key={mediaType}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {mediaType}
                  </span>
                  {operation.requestBody.required && (
                    <span className="px-1.5 py-0.5 text-xs rounded-full bg-red-500/10 text-red-400">
                      required
                    </span>
                  )}
                </div>
                <SchemaViewer 
                  schema={content.schema}
                  darkMode={darkMode}
                />
              </div>
            ))}
          </div>
        </BaseCard>
      )}
    </div>
  );
} 