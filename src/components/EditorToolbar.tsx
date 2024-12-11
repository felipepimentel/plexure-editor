import React from 'react';
import {
  Search,
  Copy,
  Trash2,
  FileCode,
  AlertCircle,
  AlertTriangle,
  Keyboard,
  FileJson,
  CheckCircle2
} from 'lucide-react';

interface EditorToolbarProps {
  onShowShortcuts: () => void;
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  darkMode: boolean;
  onSearch: () => void;
  onCopy: () => void;
  onClear: () => void;
  onFormat: () => void;
  onConvertFormat: () => void;
}

export function EditorToolbar({
  onShowShortcuts,
  isValid,
  errorCount,
  warningCount,
  darkMode,
  onSearch,
  onCopy,
  onClear,
  onFormat,
  onConvertFormat
}: EditorToolbarProps) {
  return (
    <div className={`flex items-center justify-between p-2 border-b ${
      darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    }`}>
      {/* Left side - Status indicators */}
      <div className="flex items-center space-x-4">
        <div className={`flex items-center ${
          isValid ? 'text-green-500' : 'text-gray-400'
        }`}>
          {isValid ? (
            <CheckCircle2 className="w-5 h-5" />
          ) : (
            <FileCode className="w-5 h-5" />
          )}
        </div>
        
        {errorCount > 0 && (
          <div className="flex items-center space-x-1 text-red-500">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm font-medium">{errorCount}</span>
          </div>
        )}
        
        {warningCount > 0 && (
          <div className="flex items-center space-x-1 text-yellow-500">
            <AlertTriangle className="w-5 h-5" />
            <span className="text-sm font-medium">{warningCount}</span>
          </div>
        )}
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={onSearch}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Search (⌘F)"
        >
          <Search className="w-5 h-5" />
        </button>

        <button
          onClick={onCopy}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Copy to clipboard"
        >
          <Copy className="w-5 h-5" />
        </button>

        <button
          onClick={onClear}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Clear editor"
        >
          <Trash2 className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-current opacity-10" />

        <button
          onClick={onFormat}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Format document (⇧⌥F)"
        >
          <FileCode className="w-5 h-5" />
        </button>

        <button
          onClick={onConvertFormat}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Convert YAML/JSON"
        >
          <FileJson className="w-5 h-5" />
        </button>

        <div className="w-px h-6 bg-current opacity-10" />

        <button
          onClick={onShowShortcuts}
          className={`p-2 rounded-lg transition-colors ${
            darkMode
              ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
              : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
          }`}
          title="Keyboard shortcuts (⌘H)"
        >
          <Keyboard className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}