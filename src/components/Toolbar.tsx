import React from 'react';
import { Search, Copy, Trash2 } from 'lucide-react';

interface ToolbarProps {
  onSearch: () => void;
  onCopy: () => void;
  onClear: () => void;
  darkMode: boolean;
}

export function Toolbar({ onSearch, onCopy, onClear, darkMode }: ToolbarProps) {
  return (
    <div className={`flex items-center gap-2 p-2 border-b ${
      darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-gray-50'
    }`}>
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
        onClick={onClear}
        className={`p-1.5 rounded hover:bg-opacity-80 ${
          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
        }`}
        title="Clear editor"
      >
        <Trash2 className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
      </button>
    </div>
  );
}