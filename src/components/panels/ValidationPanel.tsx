import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ValidationError {
  path: string;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface ValidationPanelProps {
  errors: ValidationError[];
  darkMode: boolean;
  collapsed?: boolean;
}

export function ValidationPanel({
  errors,
  darkMode,
  collapsed = false
}: ValidationPanelProps) {
  if (collapsed) {
    return (
      <div className="h-full flex flex-col items-center py-4">
        <button className="p-2 rounded-lg hover:bg-gray-800">
          <AlertTriangle className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    );
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Validation Header */}
      <div className="h-12 border-b border-gray-800 flex items-center justify-between px-4">
        <h2 className={`font-medium ${
          darkMode ? 'text-gray-200' : 'text-gray-800'
        }`}>
          Validation
        </h2>
        <div className="flex items-center gap-2">
          {errors.length > 0 && (
            <span className={`text-sm ${
              darkMode ? 'text-gray-400' : 'text-gray-600'
            }`}>
              {errors.length} issue{errors.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Validation Content */}
      <div className="flex-1 overflow-auto">
        {errors.length === 0 ? (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Info className={`w-12 h-12 mx-auto mb-4 ${
                darkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                No validation issues found
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {errors.map((error, index) => (
              <div
                key={`${error.path}-${index}`}
                className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-800' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(error.severity)}
                  <div>
                    <p className={`text-sm ${
                      darkMode ? 'text-gray-200' : 'text-gray-800'
                    }`}>
                      {error.message}
                    </p>
                    {error.path && (
                      <p className={`mt-1 text-xs font-mono ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        at {error.path}
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