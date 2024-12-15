import React, { useState } from 'react';
import * as monaco from 'monaco-editor';
import { AlertCircle, AlertTriangle, Info, ChevronDown, ChevronUp, X } from 'lucide-react';
import { cn } from '@/utils/cn';

interface ValidationPanelProps {
  diagnostics: monaco.editor.IMarkerData[];
  onGotoError: (marker: monaco.editor.IMarkerData) => void;
  className?: string;
}

interface ValidationGroup {
  type: 'error' | 'warning' | 'info';
  items: monaco.editor.IMarkerData[];
}

export const ValidationPanel: React.FC<ValidationPanelProps> = ({
  diagnostics,
  onGotoError,
  className
}) => {
  const [expanded, setExpanded] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState<'error' | 'warning' | 'info' | null>(null);

  // Group diagnostics by severity
  const groups: ValidationGroup[] = [
    {
      type: 'error',
      items: diagnostics.filter(d => d.severity === monaco.MarkerSeverity.Error)
    },
    {
      type: 'warning',
      items: diagnostics.filter(d => d.severity === monaco.MarkerSeverity.Warning)
    },
    {
      type: 'info',
      items: diagnostics.filter(d => d.severity === monaco.MarkerSeverity.Info)
    }
  ].filter(group => group.items.length > 0);

  const getGroupIcon = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getGroupColor = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return 'text-red-600 dark:text-red-400';
      case 'warning':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'info':
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getGroupBadgeColor = (type: 'error' | 'warning' | 'info') => {
    switch (type) {
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'info':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  if (diagnostics.length === 0) {
    return (
      <div className={cn(
        'flex items-center justify-center p-4',
        'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400',
        'border-t border-green-200 dark:border-green-900',
        className
      )}>
        <span className="text-sm">No issues found</span>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col bg-white dark:bg-gray-800', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronUp className="w-4 h-4" />
            )}
          </button>
          <div className="flex items-center gap-3">
            {groups.map(group => (
              <button
                key={group.type}
                onClick={() => setSelectedGroup(selectedGroup === group.type ? null : group.type)}
                className={cn(
                  'flex items-center gap-1.5 px-2 py-1 rounded text-sm',
                  'transition-colors duration-200',
                  selectedGroup === group.type && 'bg-gray-100 dark:bg-gray-700'
                )}
              >
                {getGroupIcon(group.type)}
                <span className={getGroupColor(group.type)}>
                  {group.items.length} {group.type}
                  {group.items.length !== 1 && 's'}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {expanded && (
        <div className="overflow-y-auto max-h-64">
          {groups
            .filter(group => !selectedGroup || group.type === selectedGroup)
            .map(group => (
              <div key={group.type} className="p-2">
                {group.items.map((diagnostic, index) => (
                  <button
                    key={index}
                    onClick={() => onGotoError(diagnostic)}
                    className={cn(
                      'w-full flex items-start gap-3 p-2 rounded text-left',
                      'hover:bg-gray-50 dark:hover:bg-gray-700/50',
                      'transition-colors duration-200'
                    )}
                  >
                    {getGroupIcon(group.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          'px-1.5 py-0.5 text-xs font-medium rounded',
                          getGroupBadgeColor(group.type)
                        )}>
                          {group.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          Line {diagnostic.startLineNumber}, Column {diagnostic.startColumn}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-gray-300 break-words">
                        {diagnostic.message}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            ))}
        </div>
      )}
    </div>
  );
}; 