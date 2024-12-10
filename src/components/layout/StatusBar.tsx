import React from 'react';
import { AlertCircle, AlertTriangle, GitBranch, Clock } from 'lucide-react';

interface StatusBarProps {
  darkMode: boolean;
  errorCount: number;
  warningCount: number;
}

export function StatusBar({ darkMode, errorCount, warningCount }: StatusBarProps) {
  return (
    <div className={`h-6 flex items-center justify-between px-4 text-xs border-t ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-200'
    }`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <GitBranch className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>main</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className={`w-3.5 h-3.5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>Last saved 2m ago</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {errorCount > 0 && (
          <div className="flex items-center space-x-1">
            <AlertCircle className="w-3.5 h-3.5 text-red-500" />
            <span className={`${darkMode ? 'text-red-400' : 'text-red-600'}`}>
              {errorCount} error{errorCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
        {warningCount > 0 && (
          <div className="flex items-center space-x-1">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
            <span className={`${darkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
              {warningCount} warning{warningCount !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}