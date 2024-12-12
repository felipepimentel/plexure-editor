import React from 'react';
import { Badge } from '../common/Badge';
import { 
  ChevronDown, 
  Code, 
  Lock, 
  Shield, 
  Tag,
  ExternalLink,
  AlertTriangle
} from 'lucide-react';

interface EndpointPreviewProps {
  method: string;
  path: string;
  operation: any;
  darkMode: boolean;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export function EndpointPreview({
  method,
  path,
  operation,
  darkMode,
  isExpanded,
  onToggle
}: EndpointPreviewProps) {
  const generateExample = (operation: any) => {
    const example: any = {
      url: path,
      method: method.toUpperCase(),
      headers: {},
      body: null
    };

    // Add security headers if needed
    if (operation.security) {
      example.headers['Authorization'] = 'Bearer <token>';
    }

    // Add content type if there's a request body
    if (operation.requestBody?.content) {
      example.headers['Content-Type'] = Object.keys(operation.requestBody.content)[0];
      
      // Try to generate example body
      const schema = operation.requestBody.content[example.headers['Content-Type']]?.schema;
      if (schema) {
        example.body = generateExampleFromSchema(schema);
      }
    }

    return example;
  };

  return (
    <div className={`
      border rounded-lg overflow-hidden mb-4 transition-all duration-200
      ${darkMode ? 'border-gray-800' : 'border-gray-200'}
      ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}
    `}>
      {/* Header */}
      <div
        onClick={onToggle}
        className={`
          flex items-center justify-between p-4 cursor-pointer
          ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
        `}
      >
        <div className="flex items-center gap-3">
          <Badge
            variant={method.toLowerCase() as any}
            size="md"
            className="font-mono"
          >
            {method.toUpperCase()}
          </Badge>
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className={`font-mono text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {path}
              </span>
              {operation.deprecated && (
                <AlertTriangle className="w-4 h-4 text-yellow-500" />
              )}
            </div>
            {operation.summary && (
              <span className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {operation.summary}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {operation.security && (
            <Lock className={`w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          )}
          {operation.tags?.length > 0 && (
            <Tag className={`w-4 h-4 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          )}
          <ChevronDown className={`
            w-4 h-4 transition-transform
            ${isExpanded ? 'rotate-180' : ''}
            ${darkMode ? 'text-gray-400' : 'text-gray-500'}
          `} />
        </div>
      </div>

      {/* Content */}
      {isExpanded && (
        <div className={`p-4 border-t ${
          darkMode ? 'border-gray-800' : 'border-gray-200'
        }`}>
          {/* Description */}
          {operation.description && (
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Description
              </h4>
              <p className={`text-sm ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {operation.description}
              </p>
            </div>
          )}

          {/* Parameters */}
          {operation.parameters?.length > 0 && (
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Parameters
              </h4>
              <div className={`
                rounded-lg border overflow-hidden
                ${darkMode ? 'border-gray-800' : 'border-gray-200'}
              `}>
                {operation.parameters.map((param: any, index: number) => (
                  <div
                    key={param.name}
                    className={`
                      flex items-center justify-between p-2
                      ${index !== 0 ? (
                        darkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'
                      ) : ''}
                      ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {param.name}
                        </span>
                        <Badge
                          variant={param.required ? 'warning' : 'get'}
                          size="sm"
                        >
                          {param.in}
                        </Badge>
                      </div>
                      {param.description && (
                        <p className={`text-xs mt-1 ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {param.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className={`text-xs px-2 py-1 rounded ${
                        darkMode
                          ? 'bg-gray-800 text-gray-300'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {param.schema?.type || 'any'}
                      </code>
                      {param.required && (
                        <Shield className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Responses */}
          {operation.responses && (
            <div>
              <h4 className={`text-sm font-medium mb-2 ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Responses
              </h4>
              <div className={`
                rounded-lg border overflow-hidden
                ${darkMode ? 'border-gray-800' : 'border-gray-200'}
              `}>
                {Object.entries(operation.responses).map(([code, response]: [string, any], index) => (
                  <div
                    key={code}
                    className={`
                      flex items-start justify-between p-2
                      ${index !== 0 ? (
                        darkMode ? 'border-t border-gray-800' : 'border-t border-gray-200'
                      ) : ''}
                      ${darkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'}
                    `}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={code.startsWith('2') ? 'post' : code.startsWith('4') ? 'delete' : 'get'}
                          size="sm"
                        >
                          {code}
                        </Badge>
                        <span className={`text-sm ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          {response.description}
                        </span>
                      </div>
                    </div>
                    {response.content && (
                      <div className="flex items-center gap-2">
                        <Code className={`w-4 h-4 ${
                          darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`} />
                        <span className={`text-xs ${
                          darkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {Object.keys(response.content).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example Request */}
          <div className="mt-4">
            <h4 className={`text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Example Request
            </h4>
            <div className={`
              rounded-lg border overflow-hidden font-mono text-sm
              ${darkMode ? 'border-gray-800' : 'border-gray-200'}
            `}>
              <pre className={`p-4 overflow-auto ${
                darkMode ? 'bg-gray-900' : 'bg-gray-50'
              }`}>
                <code className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                  {JSON.stringify(generateExample(operation), null, 2)}
                </code>
              </pre>
            </div>
          </div>

          {/* Tags */}
          {operation.tags?.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {operation.tags.map(tag => (
                <Badge
                  key={tag}
                  variant="get"
                  size="sm"
                  className="bg-opacity-10"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
} 