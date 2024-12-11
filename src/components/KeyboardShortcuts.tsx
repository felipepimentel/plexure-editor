import React from 'react';
import { X } from 'lucide-react';

interface KeyboardShortcutsProps {
  darkMode: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ darkMode, onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    { key: '⌘F', description: 'Search in specification' },
    { key: '⌘S', description: 'Save changes' },
    { key: '⇧⌥F', description: 'Format document' },
    { key: '⌘H', description: 'Show keyboard shortcuts' },
    { key: '⌘Z', description: 'Undo' },
    { key: '⇧⌘Z', description: 'Redo' },
    { key: '⌘/', description: 'Toggle line comment' },
    { key: '⌘]', description: 'Indent line' },
    { key: '⌘[', description: 'Outdent line' },
    { key: '⌥↑', description: 'Move line up' },
    { key: '⌥↓', description: 'Move line down' },
    { key: '⌘D', description: 'Add selection to next find match' },
    { key: '⌘K ⌘C', description: 'Add line comment' },
    { key: '⌘K ⌘U', description: 'Remove line comment' }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`relative w-full max-w-lg rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <h2 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 text-gray-400 hover:text-gray-300'
                : 'hover:bg-gray-100 text-gray-600 hover:text-gray-900'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[70vh] overflow-y-auto">
          <div className="grid gap-3">
            {shortcuts.map(({ key, description }) => (
              <div
                key={key}
                className="flex items-center justify-between"
              >
                <span className={`text-sm ${
                  darkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  {description}
                </span>
                <kbd className={`px-2 py-1 text-sm font-medium rounded ${
                  darkMode
                    ? 'bg-gray-700 text-gray-300'
                    : 'bg-gray-100 text-gray-900'
                }`}>
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className={`p-4 border-t ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <p className={`text-sm ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Press <kbd className={`px-2 py-1 text-sm font-medium rounded ${
              darkMode
                ? 'bg-gray-700 text-gray-300'
                : 'bg-gray-100 text-gray-900'
            }`}>Esc</kbd> to close
          </p>
        </div>
      </div>
    </div>
  );
} 