import React from 'react';
import { Lock, Code, Play, FileJson, MessageSquare, Shield } from 'lucide-react';
import { MethodBadge } from '../common/MethodBadge';
import { CodeBlock } from '../common/CodeBlock';
import { SchemaViewer } from './SchemaViewer';
import { TabGroup, Tab } from '../common/TabGroup';

interface EndpointOperationProps {
  path: string;
  method: string;
  operation: any;
  darkMode: boolean;
  isExpanded: boolean;
  onToggle: () => void;
}

export function EndpointOperation({
  path,
  method,
  operation,
  darkMode,
  isExpanded,
  onToggle
}: EndpointOperationProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'try' | 'code'>('overview');

  // Gera exemplo de código para diferentes linguagens
  const codeExamples = React.useMemo(() => ({
    curl: generateCurlExample(path, method, operation),
    javascript: generateJavaScriptExample(path, method, operation),
    python: generatePythonExample(path, method, operation)
  }), [path, method, operation]);

  return (
    <div className={`
      rounded-lg border overflow-hidden transition-all duration-200
      ${darkMode ? 'border-gray-800' : 'border-gray-200'}
      ${isExpanded ? 'shadow-lg' : 'hover:shadow-md'}
    `}>
      {/* Operation Header */}
      <div
        onClick={onToggle}
        className={`
          flex items-center gap-3 p-3 cursor-pointer
          ${darkMode ? 'bg-gray-800/50 hover:bg-gray-800' : 'bg-gray-50 hover:bg-gray-100'}
        `}
      >
        <MethodBadge method={method.toUpperCase()} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`
              text-sm font-medium truncate
              ${darkMode ? 'text-gray-200' : 'text-gray-700'}
            `}>
              {operation.summary || operation.description || method}
            </span>
            {operation.deprecated && (
              <span className="px-1.5 py-0.5 text-xs rounded-full bg-yellow-500/10 text-yellow-400">
                Deprecated
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className={`text-xs font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {path}
            </span>
            {operation.security && (
              <div className="flex items-center gap-1">
                <Lock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-400">Authenticated</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Operation Details */}
      {isExpanded && (
        <div className="border-t border-gray-800">
          <TabGroup
            value={activeTab}
            onChange={setActiveTab}
            tabs={[
              { id: 'overview', label: 'Overview', icon: FileJson },
              { id: 'try', label: 'Try It', icon: Play },
              { id: 'code', label: 'Code', icon: Code }
            ]}
          />

          <div className="p-4">
            {activeTab === 'overview' && (
              <OverviewTab
                operation={operation}
                darkMode={darkMode}
              />
            )}
            {activeTab === 'try' && (
              <TryItTab
                path={path}
                method={method}
                operation={operation}
                darkMode={darkMode}
              />
            )}
            {activeTab === 'code' && (
              <CodeTab
                examples={codeExamples}
                darkMode={darkMode}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
} 