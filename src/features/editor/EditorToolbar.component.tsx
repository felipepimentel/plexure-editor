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
import { BaseButton } from '../ui/Button';

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
        <BaseButton
          variant="ghost"
          size="sm"
          onClick={onSearch}
          darkMode={darkMode}
          icon={<Search className="w-5 h-5" />}
          title="Search (⌘F)"
        />

        <BaseButton
          variant="ghost"
          size="sm"
          onClick={onCopy}
          darkMode={darkMode}
          icon={<Copy className="w-5 h-5" />}
          title="Copy to clipboard"
        />

        <BaseButton
          variant="ghost"
          size="sm"
          onClick={onClear}
          darkMode={darkMode}
          icon={<Trash2 className="w-5 h-5" />}
          title="Clear editor"
        />

        <div className="w-px h-6 bg-current opacity-10" />

        <BaseButton
          variant="ghost"
          size="sm"
          onClick={onFormat}
          darkMode={darkMode}
          icon={<FileCode className="w-5 h-5" />}
          title="Format document (⇧⌥F)"
        />

        <BaseButton
          variant="ghost"
          size="sm"
          onClick={onConvertFormat}
          darkMode={darkMode}
          icon={<FileJson className="w-5 h-5" />}
          title="Convert YAML/JSON"
        />

        <div className="w-px h-6 bg-current opacity-10" />

        <BaseButton
          variant="ghost"
          size="sm"
          onClick={onShowShortcuts}
          darkMode={darkMode}
          icon={<Keyboard className="w-5 h-5" />}
          title="Keyboard shortcuts (⌘H)"
        />
      </div>
    </div>
  );
}