import React from 'react';
import { BaseModal } from './ui/Modal';

interface KeyboardShortcutsProps {
  darkMode: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ darkMode, onClose }: KeyboardShortcutsProps) {
  const shortcuts = [
    { key: 'Ctrl + S', description: 'Save changes' },
    { key: 'Ctrl + Z', description: 'Undo' },
    { key: 'Ctrl + Y', description: 'Redo' },
    { key: 'Ctrl + F', description: 'Find' },
    { key: 'Ctrl + H', description: 'Replace' },
    { key: 'Ctrl + [', description: 'Decrease indent' },
    { key: 'Ctrl + ]', description: 'Increase indent' },
    { key: 'Alt + ↑', description: 'Move line up' },
    { key: 'Alt + ↓', description: 'Move line down' },
    { key: 'Ctrl + /', description: 'Toggle comment' }
  ];

  return (
    <BaseModal
      title="Keyboard Shortcuts"
      darkMode={darkMode}
      onClose={onClose}
    >
      <div className="space-y-4">
        <div className={`grid grid-cols-2 gap-4 ${
          darkMode ? 'text-gray-300' : 'text-gray-600'
        }`}>
          {shortcuts.map(({ key, description }) => (
            <div key={key} className="flex items-center justify-between">
              <span className={`px-2 py-1 rounded text-sm font-mono ${
                darkMode ? 'bg-gray-700' : 'bg-gray-100'
              }`}>
                {key}
              </span>
              <span className="text-sm">{description}</span>
            </div>
          ))}
        </div>
      </div>
    </BaseModal>
  );
} 