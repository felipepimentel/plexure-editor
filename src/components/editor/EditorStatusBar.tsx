import React from 'react';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react';

interface EditorStatusBarProps {
  darkMode: boolean;
  errorCount: number;
  warningCount: number;
  cursorPosition: { line: number; column: number };
  documentInfo: {
    lineCount: number;
    version: string;
    format: 'yaml' | 'json';
  };
}

export function EditorStatusBar({
  darkMode,
  errorCount = 0,
  warningCount = 0,
  cursorPosition = { line: 1, column: 1 },
  documentInfo = {
    lineCount: 0,
    version: '1.0.0',
    format: 'yaml' as const
  }
}: EditorStatusBarProps) {
  return (
    <div className={`h-6 border-t flex items-center justify-between px-4 text-xs ${
      darkMode ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center gap-4">
        {/* Validation Status */}
        <div className="flex items-center gap-4">
          {errorCount > 0 ? (
            <div className="flex items-center gap-1 text-red-500">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorCount} error{errorCount !== 1 ? 's' : ''}</span>
            </div>
          ) : warningCount > 0 ? (
            <div className="flex items-center gap-1 text-yellow-500">
              <Info className="w-3.5 h-3.5" />
              <span>{warningCount} warning{warningCount !== 1 ? 's' : ''}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-green-500">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>No problems</span>
            </div>
          )}
        </div>

        {/* Cursor Position */}
        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          Ln {cursorPosition.line}, Col {cursorPosition.column}
        </div>
      </div>

      {/* Document Info */}
      <div className="flex items-center gap-4">
        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {documentInfo.lineCount} lines
        </div>
        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          {documentInfo.format.toUpperCase()}
        </div>
        <div className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
          v{documentInfo.version}
        </div>
      </div>
    </div>
  );
} 