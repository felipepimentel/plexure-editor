import React from 'react';
import { Keyboard, X } from 'lucide-react';

interface ShortcutsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
}

export function ShortcutsPanel({ isOpen, onClose, darkMode }: ShortcutsPanelProps) {
  if (!isOpen) return null;

  const shortcuts = [
    { action: 'Save', keys: ['Ctrl/⌘', 'S'] },
    { action: 'Search', keys: ['Ctrl/⌘', 'F'] },
    { action: 'Format', keys: ['Ctrl/⌘', 'L'] },
    { action: 'Toggle Preview', keys: ['Ctrl/⌘', 'P'] },
    { action: 'Toggle Dark Mode', keys: ['Ctrl/⌘', 'D'] },
    { action: 'Show Shortcuts', keys: ['Ctrl/⌘', 'K'] },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className={`relative w-96 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Keyboard className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              Keyboard Shortcuts
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
            }`}
          >
            <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        </div>
        <div className="p-4 space-y-3">
          {shortcuts.map(({ action, keys }) => (
            <div key={action} className="flex items-center justify-between">
              <span className={`${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                {action}
              </span>
              <div className="flex items-center gap-1">
                {keys.map((key, index) => (
                  <React.Fragment key={key}>
                    <kbd className={`px-2 py-1 rounded text-sm font-mono ${
                      darkMode
                        ? 'bg-gray-700 text-gray-300 border border-gray-600'
                        : 'bg-gray-100 text-gray-700 border border-gray-300'
                    }`}>
                      {key}
                    </kbd>
                    {index < keys.length - 1 && (
                      <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>+</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}