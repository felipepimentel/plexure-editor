import React, { createContext, useContext, useCallback, useEffect } from 'react';

interface ShortcutDefinition {
  key: string;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsContextType {
  registerShortcut: (shortcut: ShortcutDefinition) => void;
  unregisterShortcut: (key: string) => void;
  shortcuts: Map<string, ShortcutDefinition>;
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | null>(null);

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
}

interface KeyboardShortcutsProviderProps {
  children: React.ReactNode;
}

export function KeyboardShortcutsProvider({ children }: KeyboardShortcutsProviderProps) {
  const shortcuts = React.useRef(new Map<string, ShortcutDefinition>());

  const registerShortcut = useCallback((shortcut: ShortcutDefinition) => {
    shortcuts.current.set(shortcut.key, shortcut);
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    shortcuts.current.delete(key);
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (!event.key) return;

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? event.metaKey : event.ctrlKey;
    
    let shortcutKey = '';
    if (cmdKey) shortcutKey += '⌘+';
    if (event.shiftKey) shortcutKey += 'Shift+';
    if (event.altKey) shortcutKey += 'Alt+';
    shortcutKey += event.key.toUpperCase();

    const shortcut = shortcuts.current.get(shortcutKey);
    if (shortcut) {
      event.preventDefault();
      shortcut.action();
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <KeyboardShortcutsContext.Provider
      value={{
        registerShortcut,
        unregisterShortcut,
        shortcuts: shortcuts.current,
      }}
    >
      {children}
    </KeyboardShortcutsContext.Provider>
  );
} 