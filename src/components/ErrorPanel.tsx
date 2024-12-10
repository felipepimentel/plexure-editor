import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronRight, X } from 'lucide-react';
import { ValidationResult } from '../types/styleGuide';

interface ErrorPanelProps {
  syntaxError: string | null;
  validationResults: ValidationResult[];
  darkMode: boolean;
  onClose: () => void;
  onNavigateToError?: (line: number, column: number) => void;
}

export function ErrorPanel({ 
  syntaxError, 
  validationResults, 
  darkMode,
  onClose,
  onNavigateToError 
}: ErrorPanelProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const errorCount = (syntaxError ? 1 : 0) + validationResults.filter(r => r.rule.severity === 'error').length;
  const warningCount = validationResults.filter(r => r.rule.severity === 'warning').length;
  const infoCount = validationResults.filter(r => r.rule.severity === 'info').length;

  const getSeverityIcon = (severity: 'error' | 'warning' | 'info') => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  if (errorCount === 0 && warningCount === 0 && infoCount === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${
      darkMode ? 'bg-gray-800 border-t border-gray-700' : 'bg-white border-t border-gray-200'
    } shadow-lg`}>
      <div className="container mx-auto">
        <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center gap-2"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Problems
            </span>
            <div className="flex items-center gap-4 ml-4">
              {errorCount > 0 && (
                <div className="flex items-center gap-1 text-red-500">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">{errorCount}</span>
                </div>
              )}
              {warningCount > 0 && (
                <div className="flex items-center gap-1 text-yellow-500">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm">{warningCount}</span>
                </div>
              )}
              {infoCount > 0 && (
                <div className="flex items-center gap-1 text-blue-500">
                  <Info className="w-4 h-4" />
                  <span className="text-sm">{infoCount}</span>
                </div>
              )}
            </div>
          </button>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {!isCollapsed && (
          <div className="max-h-48 overflow-y-auto">
            {syntaxError && (
              <div className={`p-3 border-b ${
                darkMode ? 'border-gray-700' : 'border-gray-200'
              }`}>
                <div className="flex items-start gap-2">
                  {getSeverityIcon('error')}
                  <div>
                    <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      Syntax Error
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {syntaxError}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {validationResults.map((result, index) => (
              <div
                key={`${result.rule.id}-${index}`}
                className={`p-3 border-b ${
                  darkMode ? 'border-gray-700' : 'border-gray-200'
                } cursor-pointer hover:bg-opacity-80 ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
                onClick={() => onNavigateToError?.(1, 1)} // You'll need to implement proper line/column mapping
              >
                <div className="flex items-start gap-2">
                  {getSeverityIcon(result.rule.severity)}
                  <div>
                    <p className={`${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {result.rule.name}
                    </p>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {result.message}
                    </p>
                    {result.path && (
                      <p className={`text-sm mt-1 font-mono ${
                        darkMode ? 'text-gray-500' : 'text-gray-500'
                      }`}>
                        at {result.path}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}