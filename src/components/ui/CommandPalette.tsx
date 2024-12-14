import React, { useState, useEffect, useRef } from 'react';
import { Command, Search, ArrowRight } from 'lucide-react';
import { useKeyboardShortcuts } from '@/contexts/KeyboardShortcutsContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  title: string;
  description?: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { shortcuts } = useKeyboardShortcuts();

  // Default commands
  const defaultCommands: CommandItem[] = [
    {
      id: 'toggle-preview',
      title: 'Toggle Preview',
      description: 'Show or hide the preview panel',
      shortcut: '⌘+\\',
      icon: <ArrowRight className="w-4 h-4" />,
      action: () => {
        onClose();
        // Add your toggle preview action here
      }
    },
    // Add more default commands here
  ];

  // Convert keyboard shortcuts to commands
  const shortcutCommands: CommandItem[] = shortcuts.map(shortcut => ({
    id: `shortcut-${shortcut.key}`,
    title: shortcut.description,
    shortcut: shortcut.key,
    action: () => {
      onClose();
      shortcut.action();
    }
  }));

  const allCommands = [...defaultCommands, ...shortcutCommands];

  // Filter commands based on search query
  const filteredCommands = allCommands.filter(command => 
    command.title.toLowerCase().includes(query.toLowerCase()) ||
    command.description?.toLowerCase().includes(query.toLowerCase())
  );

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < filteredCommands.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : prev);
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            filteredCommands[selectedIndex].action();
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  // Focus input on open
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command palette */}
      <div className="relative min-h-screen sm:min-h-[unset] sm:h-auto flex items-start sm:items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-gray-900 rounded-lg shadow-2xl border border-gray-800 overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 p-3 border-b border-gray-800">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search..."
              className="flex-1 bg-transparent text-sm text-gray-200 placeholder-gray-500 outline-none"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="p-1 rounded hover:bg-gray-800 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Command list */}
          <div className="max-h-[60vh] overflow-y-auto">
            {filteredCommands.length > 0 ? (
              <div className="p-2">
                {filteredCommands.map((command, index) => (
                  <button
                    key={command.id}
                    onClick={() => command.action()}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-left ${
                      index === selectedIndex
                        ? 'bg-blue-500/10 text-blue-400'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    <div className="w-5 h-5 flex items-center justify-center text-gray-400">
                      {command.icon || <Command className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {command.title}
                        </span>
                        {command.shortcut && (
                          <kbd className="ml-3 px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">
                            {command.shortcut}
                          </kbd>
                        )}
                      </div>
                      {command.description && (
                        <p className="text-xs text-gray-500 truncate">
                          {command.description}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-gray-500">
                No commands found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-800 bg-gray-900/50">
            <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500">
              <div className="flex items-center gap-3">
                <span>↑↓ to navigate</span>
                <span>↵ to select</span>
                <span>esc to close</span>
              </div>
              <div className="flex items-center gap-1">
                <Command className="w-3 h-3" />
                <span>Command Palette</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 