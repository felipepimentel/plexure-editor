import React from 'react';
import { cn } from '@/utils/cn';
import {
  Monitor,
  Type,
  Minimize2,
  Ruler,
  Space,
  AlignLeft,
  X,
} from 'lucide-react';
import type { EditorSettings } from './hooks/useEditorState';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  settings: EditorSettings;
  onUpdateSettings: (settings: Partial<EditorSettings>) => void;
  className?: string;
}

export const SettingsDialog: React.FC<SettingsDialogProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  className,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div
        className={cn(
          'w-full max-w-lg bg-white dark:bg-gray-800 rounded-lg shadow-xl',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-lg font-medium">Editor Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Settings */}
        <div className="p-4 space-y-6">
          {/* Theme */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Monitor className="w-4 h-4" />
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => onUpdateSettings({ theme: e.target.value as 'vs-dark' | 'vs-light' })}
              className={cn(
                'w-full px-3 py-2 rounded border bg-transparent',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            >
              <option value="vs-dark">Dark</option>
              <option value="vs-light">Light</option>
            </select>
          </div>

          {/* Font Size */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Type className="w-4 h-4" />
              Font Size
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="12"
                max="24"
                value={settings.fontSize}
                onChange={(e) => onUpdateSettings({ fontSize: parseInt(e.target.value) })}
                className="flex-1"
              />
              <span className="text-sm tabular-nums">{settings.fontSize}px</span>
            </div>
          </div>

          {/* Minimap */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Minimize2 className="w-4 h-4" />
              Show Minimap
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.minimap}
                onChange={(e) => onUpdateSettings({ minimap: e.target.checked })}
                className="sr-only peer"
              />
              <div className={cn(
                'w-11 h-6 rounded-full peer',
                'bg-gray-200 dark:bg-gray-700',
                'peer-checked:bg-blue-600',
                'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
                'after:bg-white after:rounded-full after:h-5 after:w-5',
                'after:transition-all peer-checked:after:translate-x-full'
              )} />
            </label>
          </div>

          {/* Word Wrap */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <AlignLeft className="w-4 h-4" />
              Word Wrap
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.wordWrap === 'on'}
                onChange={(e) => onUpdateSettings({ wordWrap: e.target.checked ? 'on' : 'off' })}
                className="sr-only peer"
              />
              <div className={cn(
                'w-11 h-6 rounded-full peer',
                'bg-gray-200 dark:bg-gray-700',
                'peer-checked:bg-blue-600',
                'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
                'after:bg-white after:rounded-full after:h-5 after:w-5',
                'after:transition-all peer-checked:after:translate-x-full'
              )} />
            </label>
          </div>

          {/* Tab Size */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Space className="w-4 h-4" />
              Tab Size
            </label>
            <select
              value={settings.tabSize}
              onChange={(e) => onUpdateSettings({ tabSize: parseInt(e.target.value) })}
              className={cn(
                'w-full px-3 py-2 rounded border bg-transparent',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            >
              <option value="2">2 spaces</option>
              <option value="4">4 spaces</option>
              <option value="8">8 spaces</option>
            </select>
          </div>

          {/* Rulers */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Ruler className="w-4 h-4" />
              Show Rulers
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.rulers}
                onChange={(e) => onUpdateSettings({ rulers: e.target.checked })}
                className="sr-only peer"
              />
              <div className={cn(
                'w-11 h-6 rounded-full peer',
                'bg-gray-200 dark:bg-gray-700',
                'peer-checked:bg-blue-600',
                'after:content-[""] after:absolute after:top-[2px] after:left-[2px]',
                'after:bg-white after:rounded-full after:h-5 after:w-5',
                'after:transition-all peer-checked:after:translate-x-full'
              )} />
            </label>
          </div>

          {/* Render Whitespace */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium">
              <Space className="w-4 h-4" />
              Show Whitespace
            </label>
            <select
              value={settings.renderWhitespace}
              onChange={(e) => onUpdateSettings({ renderWhitespace: e.target.value as any })}
              className={cn(
                'w-full px-3 py-2 rounded border bg-transparent',
                'focus:outline-none focus:ring-2 focus:ring-blue-500'
              )}
            >
              <option value="none">Never</option>
              <option value="boundary">Boundaries</option>
              <option value="selection">Selection</option>
              <option value="trailing">Trailing</option>
              <option value="all">All</option>
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onClose}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded',
              'text-gray-700 dark:text-gray-200',
              'hover:bg-gray-100 dark:hover:bg-gray-700',
              'transition-colors duration-200'
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}; 