import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { BaseCard } from '../../ui/Card';

interface ErrorPanelProps {
  errors: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
    path?: string;
    line?: number;
  }>;
  darkMode: boolean;
  onSelect?: (line: number) => void;
}

export function ErrorPanel({ errors, darkMode, onSelect }: ErrorPanelProps) {
  const getIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getBackgroundColor = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return darkMode ? 'bg-red-900/20' : 'bg-red-50';
      case 'warning':
        return darkMode ? 'bg-yellow-900/20' : 'bg-yellow-50';
      default:
        return darkMode ? 'bg-blue-900/20' : 'bg-blue-50';
    }
  };

  const getTextColor = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return darkMode ? 'text-red-400' : 'text-red-600';
      case 'warning':
        return darkMode ? 'text-yellow-400' : 'text-yellow-600';
      default:
        return darkMode ? 'text-blue-400' : 'text-blue-600';
    }
  };

  return (
    <div className="space-y-2">
      {errors.map((error, index) => (
        <BaseCard
          key={index}
          darkMode={darkMode}
          className={`${getBackgroundColor(error.type)} border-0`}
          onSelect={error.line ? () => onSelect?.(error.line!) : undefined}
        >
          <div className="flex items-start gap-3">
            {getIcon(error.type)}
            <div className="flex-1">
              <p className={`text-sm ${getTextColor(error.type)}`}>
                {error.message}
              </p>
              {error.path && (
                <p className={`text-xs mt-1 font-mono ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  at {error.path}
                </p>
              )}
              {error.line && (
                <p className={`text-xs mt-1 font-mono ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  line {error.line}
                </p>
              )}
            </div>
          </div>
        </BaseCard>
      ))}
    </div>
  );
} 