import React from 'react';
import { Info, Link, Shield, Tag, AlertCircle } from 'lucide-react';
import { SchemaViewer } from '../SchemaViewer';
import { ParameterList } from '../ParameterList';
import { ResponseList } from '../ResponseList';
import { MarkdownContent } from '../../common/MarkdownContent';

interface OverviewTabProps {
  operation: any;
  darkMode: boolean;
}

export function OverviewTab({ operation, darkMode }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {/* Descrição e Metadata */}
      <section>
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
      </section>

      {/* Parâmetros */}
      {operation.parameters && operation.parameters.length > 0 && (
        <section>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Parameters
          </h3>
          <ParameterList 
            parameters={operation.parameters}
            darkMode={darkMode}
          />
        </section>
      )}

      {/* Request Body */}
      {operation.requestBody && (
        <section>
          <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Request Body
          </h3>
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
        </section>
      )}

      {/* Responses */}
      <section>
        <h3 className={`text-sm font-medium mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
          Responses
        </h3>
        <ResponseList
          responses={operation.responses}
          darkMode={darkMode}
        />
      </section>
    </div>
  );
} 