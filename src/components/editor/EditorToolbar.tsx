import React from 'react';
import { 
  Download, 
  Upload, 
  FileCode,
  Settings,
  RotateCcw,
  RotateCw
} from 'lucide-react';

interface EditorToolbarProps {
  darkMode: boolean;
  onImport: () => void;
  onExport: () => void;
  onFormat: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export function EditorToolbar({
  darkMode,
  onImport,
  onExport,
  onFormat,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}: EditorToolbarProps) {
  const buttonClass = `p-2 rounded-lg transition-colors ${
    darkMode 
      ? 'hover:bg-gray-800 text-gray-400 hover:text-gray-300' 
      : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
  }`;

  const disabledClass = `p-2 rounded-lg ${
    darkMode ? 'text-gray-600' : 'text-gray-400'
  } cursor-not-allowed`;

  return (
    <div className={`h-12 border-b flex items-center justify-between px-4 ${
      darkMode ? 'border-gray-800' : 'border-gray-200'
    }`}>
      <div className="flex items-center gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={canUndo ? buttonClass : disabledClass}
          title="Undo (⌘Z)"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={canRedo ? buttonClass : disabledClass}
          title="Redo (⇧⌘Z)"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className={`w-px h-4 mx-2 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`} />

        <button
          onClick={onFormat}
          className={buttonClass}
          title="Format Document (⇧⌥F)"
        >
          <FileCode className="w-4 h-4" />
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onImport}
          className={buttonClass}
          title="Import Specification"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          onClick={onExport}
          className={buttonClass}
          title="Export Specification"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 