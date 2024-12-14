import React, { createContext, useContext, useEffect, useCallback } from 'react';

interface Shortcut {
  key: string;
  description: string;
  action: () => void;
}

interface KeyboardShortcutsContextType {
  registerShortcut: (shortcut: Shortcut) => void;
  unregisterShortcut: (key: string) => void;
  shortcuts: Shortcut[];
}

const KeyboardShortcutsContext = createContext<KeyboardShortcutsContextType | undefined>(undefined);

export function KeyboardShortcutsProvider({ children }: { children: React.ReactNode }) {
  const [shortcuts, setShortcuts] = React.useState<Shortcut[]>([]);

  const registerShortcut = useCallback((shortcut: Shortcut) => {
    setShortcuts(prev => {
      // Remove any existing shortcut with the same key
      const filtered = prev.filter(s => s.key !== shortcut.key);
      return [...filtered, shortcut];
    });
  }, []);

  const unregisterShortcut = useCallback((key: string) => {
    setShortcuts(prev => prev.filter(s => s.key !== key));
  }, []);

  // Convert key string to event key format
  const normalizeKey = (key: string): string => {
    return key
      .toLowerCase()
      .replace('⌘', 'meta+')
      .replace('shift+', 'shift+')
      .replace('alt+', 'alt+')
      .replace('ctrl+', 'control+');
  };

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Build the key string from the event
      const keys: string[] = [];
      if (event.metaKey) keys.push('meta');
      if (event.shiftKey) keys.push('shift');
      if (event.altKey) keys.push('alt');
      if (event.ctrlKey) keys.push('control');
      if (event.key.toLowerCase() !== 'meta' && 
          event.key.toLowerCase() !== 'shift' && 
          event.key.toLowerCase() !== 'alt' && 
          event.key.toLowerCase() !== 'control') {
        keys.push(event.key.toLowerCase());
      }
      const keyString = keys.join('+');

      // Find and execute matching shortcut
      shortcuts.forEach(shortcut => {
        const normalizedShortcutKey = normalizeKey(shortcut.key);
        if (normalizedShortcutKey === keyString) {
          event.preventDefault();
          shortcut.action();
        }
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return (
    <KeyboardShortcutsContext.Provider value={{ registerShortcut, unregisterShortcut, shortcuts }}>
      {children}
    </KeyboardShortcutsContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardShortcutsContext);
  if (context === undefined) {
    throw new Error('useKeyboardShortcuts must be used within a KeyboardShortcutsProvider');
  }
  return context;
} 