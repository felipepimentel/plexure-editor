import { useEffect } from 'react';

interface ShortcutHandlers {
  onSave?: () => void;
  onSearch?: () => void;
  onFormat?: () => void;
  onTogglePreview?: () => void;
  onToggleDarkMode?: () => void;
  onToggleShortcuts?: () => void;
  onShowCommandPalette?: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      if (!modifier) return;

      switch (e.key.toLowerCase()) {
        case 's':
          e.preventDefault();
          handlers.onSave?.();
          break;
        case 'f':
          e.preventDefault();
          handlers.onSearch?.();
          break;
        case 'l':
          e.preventDefault();
          handlers.onFormat?.();
          break;
        case 'p':
          e.preventDefault();
          handlers.onTogglePreview?.();
          break;
        case 'd':
          e.preventDefault();
          handlers.onToggleDarkMode?.();
          break;
        case 'k':
          e.preventDefault();
          handlers.onShowCommandPalette?.();
          break;
        case '/':
          e.preventDefault();
          handlers.onToggleShortcuts?.();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers]);
}