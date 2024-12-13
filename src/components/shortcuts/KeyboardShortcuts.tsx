import React from 'react';
import { BaseModal } from '@/components/ui/Modal/Modal';
import { KeyboardKey } from '@/components/ui/KeyboardKey/KeyboardKey';
import { Text } from '@/components/ui/Text/Text';
import { KEYBOARD_SHORTCUTS } from './constants';

interface KeyboardShortcutsProps {
  darkMode: boolean;
  onClose: () => void;
}

export function KeyboardShortcuts({ darkMode, onClose }: KeyboardShortcutsProps) {
  return (
    <BaseModal
      title="Keyboard Shortcuts"
      darkMode={darkMode}
      onClose={onClose}
    >
      <div className="space-y-8">
        {KEYBOARD_SHORTCUTS.map((section) => (
          <div key={section.category}>
            <Text
              variant="subtitle"
              darkMode={darkMode}
              className="mb-4"
            >
              {section.category}
            </Text>
            <div className="space-y-3">
              {section.items.map((shortcut, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between text-sm"
                >
                  <Text darkMode={darkMode}>
                    {shortcut.description}
                  </Text>
                  <div className="flex items-center gap-1">
                    {shortcut.keys.map((key, keyIndex) => (
                      <React.Fragment key={keyIndex}>
                        <KeyboardKey darkMode={darkMode}>
                          {key}
                        </KeyboardKey>
                        {keyIndex < shortcut.keys.length - 1 && (
                          <Text
                            darkMode={darkMode}
                            variant="small"
                            className={darkMode ? 'text-gray-600' : 'text-gray-400'}
                          >
                            +
                          </Text>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </BaseModal>
  );
} 