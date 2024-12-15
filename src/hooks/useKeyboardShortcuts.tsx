import React from 'react';

interface Shortcut {
  id: string;
  description: string;
  keys: string[];
  action: () => void;
  category: string;
  isCustom?: boolean;
}

interface ShortcutContextValue {
  shortcuts: Shortcut[];
  addShortcut: (shortcut: Omit<Shortcut, 'id'>) => void;
  updateShortcut: (id: string, keys: string[]) => void;
  removeShortcut: (id: string) => void;
  resetToDefault: () => void;
}

const defaultShortcuts: Omit<Shortcut, 'action'>[] = [
  {
    id: 'save',
    description: 'Save file',
    keys: ['Control', 's'],
    category: 'File'
  },
  {
    id: 'save-all',
    description: 'Save all files',
    keys: ['Control', 'Shift', 's'],
    category: 'File'
  },
  {
    id: 'find',
    description: 'Find in file',
    keys: ['Control', 'f'],
    category: 'Edit'
  },
  {
    id: 'replace',
    description: 'Replace in file',
    keys: ['Control', 'h'],
    category: 'Edit'
  },
  {
    id: 'command-palette',
    description: 'Show command palette',
    keys: ['Control', 'p'],
    category: 'View'
  },
  {
    id: 'toggle-sidebar',
    description: 'Toggle sidebar',
    keys: ['Control', 'b'],
    category: 'View'
  }
];

const ShortcutContext = React.createContext<ShortcutContextValue | null>(null);

function formatKeys(keys: string[]): string {
  return keys.map(key => {
    switch (key) {
      case 'Control':
        return '⌃';
      case 'Shift':
        return '⇧';
      case 'Alt':
        return '⌥';
      case 'Meta':
        return '⌘';
      default:
        return key.length === 1 ? key.toUpperCase() : key;
    }
  }).join(' + ');
}

function parseShortcut(shortcut: string): string[] {
  return shortcut.split('+').map(key => key.trim());
}

export function ShortcutProvider({
  children,
  actions
}: {
  children: React.ReactNode;
  actions: Record<string, () => void>;
}) {
  const [shortcuts, setShortcuts] = React.useState<Shortcut[]>(() => {
    const savedShortcuts = localStorage.getItem('editor-shortcuts');
    const parsed = savedShortcuts ? JSON.parse(savedShortcuts) : defaultShortcuts;
    return parsed.map((shortcut: Omit<Shortcut, 'action'>) => ({
      ...shortcut,
      action: actions[shortcut.id]
    }));
  });

  // Persist shortcuts
  React.useEffect(() => {
    const shortcutsToSave = shortcuts.map(({ id, description, keys, category, isCustom }) => ({
      id,
      description,
      keys,
      category,
      isCustom
    }));
    localStorage.setItem('editor-shortcuts', JSON.stringify(shortcutsToSave));
  }, [shortcuts]);

  // Handle keyboard events
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKeys: string[] = [];
      if (e.ctrlKey) pressedKeys.push('Control');
      if (e.shiftKey) pressedKeys.push('Shift');
      if (e.altKey) pressedKeys.push('Alt');
      if (e.metaKey) pressedKeys.push('Meta');
      if (e.key !== 'Control' && e.key !== 'Shift' && e.key !== 'Alt' && e.key !== 'Meta') {
        pressedKeys.push(e.key.toLowerCase());
      }

      const matchingShortcut = shortcuts.find(shortcut =>
        shortcut.keys.length === pressedKeys.length &&
        shortcut.keys.every(key => pressedKeys.includes(key.toLowerCase()))
      );

      if (matchingShortcut) {
        e.preventDefault();
        matchingShortcut.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  const addShortcut = React.useCallback((shortcut: Omit<Shortcut, 'id'>) => {
    const newShortcut: Shortcut = {
      ...shortcut,
      id: crypto.randomUUID(),
      isCustom: true
    };
    setShortcuts(prev => [...prev, newShortcut]);
  }, []);

  const updateShortcut = React.useCallback((id: string, keys: string[]) => {
    setShortcuts(prev => prev.map(shortcut =>
      shortcut.id === id ? { ...shortcut, keys } : shortcut
    ));
  }, []);

  const removeShortcut = React.useCallback((id: string) => {
    setShortcuts(prev => prev.filter(shortcut => shortcut.id !== id));
  }, []);

  const resetToDefault = React.useCallback(() => {
    setShortcuts(defaultShortcuts.map(shortcut => ({
      ...shortcut,
      action: actions[shortcut.id]
    })));
  }, [actions]);

  const value = React.useMemo(() => ({
    shortcuts,
    addShortcut,
    updateShortcut,
    removeShortcut,
    resetToDefault
  }), [
    shortcuts,
    addShortcut,
    updateShortcut,
    removeShortcut,
    resetToDefault
  ]);

  return (
    <ShortcutContext.Provider value={value}>
      {children}
    </ShortcutContext.Provider>
  );
}

export function useKeyboardShortcuts() {
  const context = React.useContext(ShortcutContext);
  if (!context) {
    throw new Error('useKeyboardShortcuts must be used within a ShortcutProvider');
  }
  return {
    ...context,
    formatKeys,
    parseShortcut
  };
} 