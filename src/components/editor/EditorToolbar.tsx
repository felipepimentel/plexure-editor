import React from 'react';
import { cn } from '@/utils/cn';
import {
  Save,
  Undo2,
  Redo2,
  Sun,
  Moon,
  Type,
  Minimize2,
  Maximize2,
  Settings,
  Eye,
  EyeOff,
  Download,
  Upload,
  Layout,
} from 'lucide-react';
import type { EditorSettings } from './hooks/useEditorState';

interface EditorToolbarProps {
  onSave: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDirty: boolean;
  settings: EditorSettings;
  onUpdateSettings: (settings: Partial<EditorSettings>) => void;
  onImport: () => void;
  onExport: () => void;
  onOpenSettings: () => void;
  onTogglePreview: () => void;
  showPreview: boolean;
  className?: string;
}

export const EditorToolbar: React.FC<EditorToolbarProps> = ({
  onSave,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isDirty,
  settings,
  onUpdateSettings,
  onImport,
  onExport,
  onOpenSettings,
  onTogglePreview,
  showPreview,
  className,
}) => {
  return (
    <div className={cn(
      'flex items-center gap-2 p-2 bg-white dark:bg-gray-800 border-b',
      className
    )}>
      {/* File Operations */}
      <div className="flex items-center gap-1 pr-2 border-r">
        <button
          onClick={onSave}
          disabled={!isDirty}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Save (Ctrl+S)"
        >
          <Save className="w-4 h-4" />
        </button>
        <button
          onClick={onImport}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Import OpenAPI"
        >
          <Upload className="w-4 h-4" />
        </button>
        <button
          onClick={onExport}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Export OpenAPI"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>

      {/* Edit Operations */}
      <div className="flex items-center gap-1 pr-2 border-r">
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700',
            'transition-colors duration-200',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
          title="Redo (Ctrl+Y)"
        >
          <Redo2 className="w-4 h-4" />
        </button>
      </div>

      {/* View Settings */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onUpdateSettings({ theme: settings.theme === 'vs-dark' ? 'vs-light' : 'vs-dark' })}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Toggle Theme"
        >
          {settings.theme === 'vs-dark' ? (
            <Sun className="w-4 h-4" />
          ) : (
            <Moon className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => onUpdateSettings({ fontSize: settings.fontSize + 1 })}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Increase Font Size"
        >
          <Type className="w-4 h-4" />
        </button>
        <button
          onClick={() => onUpdateSettings({ minimap: !settings.minimap })}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Toggle Minimap"
        >
          {settings.minimap ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        <button
          onClick={() => onUpdateSettings({ renderWhitespace: settings.renderWhitespace === 'all' ? 'none' : 'all' })}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Toggle Whitespace"
        >
          {settings.renderWhitespace === 'all' ? (
            <EyeOff className="w-4 h-4" />
          ) : (
            <Eye className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Preview and Settings */}
      <div className="flex items-center gap-1 ml-auto">
        <button
          onClick={onTogglePreview}
          className={cn(
            'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200',
            showPreview && 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-200'
          )}
          title="Toggle Preview"
        >
          <Layout className="w-4 h-4" />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
          title="Editor Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}; 