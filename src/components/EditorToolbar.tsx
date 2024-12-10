import React from 'react';
import { Search, Copy, Trash2, FileJson, FileCode, Keyboard } from 'lucide-react';
import { ValidationBadge } from './ValidationBadge';

interface EditorToolbarProps {
  onSearch: () => void;
  onCopy: () => void;
  onClear: () => void;
  onFormat: () => void;
  onConvertFormat: () => void;
  onShowShortcuts: () => void;
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  darkMode: boolean;
}

export function EditorToolbar({
  onSearch,
  onCopy,
  onClear,
  onFormat,
  onConvertFormat,
  onShowShortcuts,
  isValid,
  errorCount,
  warningCount,
  darkMode
}: EditorToolbarProps) {
  return (
    <div className={`flex items-center justify-between p-2 border-b ${
      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
    }`}>
      <div className="flex items-center gap-2">
        <button
          onClick={onSearch}
          className={`p-1.5 rounded hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          title="Search in specification"
        >
          <Search className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={onCopy}
          className={`p-1.5 rounded hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          title="Copy to clipboard"
        >
          <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={onFormat}
          className={`p-1.5 rounded hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          title="Format specification"
        >
          <FileCode className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={onConvertFormat}
          className={`p-1.5 rounded hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          title="Convert between YAML and JSON"
        >
          <FileJson className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        <div className="w-px h-6 mx-2 bg-gray-300 dark:bg-gray-700" />
        <ValidationBadge
          isValid={isValid}
          errorCount={errorCount}
          warningCount={warningCount}
          darkMode={darkMode}
        />
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={onShowShortcuts}
          className={`p-1.5 rounded hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          title="Show keyboard shortcuts"
        >
          <Keyboard className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
        <button
          onClick={onClear}
          className={`p-1.5 rounded hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
          }`}
          title="Clear editor"
        >
          <Trash2 className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
      </div>
    </div>
  );
}