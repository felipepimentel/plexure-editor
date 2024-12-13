import React from 'react';
import { BaseModal, BaseModalActions } from '../../ui/Modal';
import { BaseButton } from '../../ui/Button';

interface KeyboardShortcutsDialogProps {
  isOpen: boolean;
  darkMode: boolean;
  onClose: () => void;
}

export function KeyboardShortcutsDialog({ isOpen, darkMode, onClose }: KeyboardShortcutsDialogProps) {
  const shortcuts = [
    { key: '⌘F', description: 'Search in document' },
    { key: '⌘S', description: 'Save changes' },
    { key: '⇧⌥F', description: 'Format document' },
    { key: '⌘Z', description: 'Undo' },
    { key: '⇧⌘Z', description: 'Redo' },
    { key: '⌘/', description: 'Toggle comment' },
    { key: '⌘H', description: 'Show keyboard shortcuts' },
    { key: 'Esc', description: 'Close dialog' }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      darkMode={darkMode}
      title="Keyboard Shortcuts"
      size="sm"
    >
      <div className="space-y-4">
        <div className="grid gap-2">
          {shortcuts.map((shortcut, index) => (
            <div
              key={index}
              className="flex items-center justify-between"
            >
              <span className={`text-sm ${
                darkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                {shortcut.description}
              </span>
              <kbd className={`px-2 py-1 text-xs font-mono rounded ${
                darkMode
                  ? 'bg-gray-700 text-gray-300 border-gray-600'
                  : 'bg-gray-100 text-gray-700 border-gray-200'
              } border`}>
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>

        <BaseModalActions darkMode={darkMode} align="right">
          <BaseButton
            onClick={onClose}
            darkMode={darkMode}
          >
            Close
          </BaseButton>
        </BaseModalActions>
      </div>
    </BaseModal>
  );
} 