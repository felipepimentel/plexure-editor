import React, { useState, useEffect } from 'react';
import { Command, Search, FileCode, Settings, Book, Play, Save } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  darkMode: boolean;
  onAction: (action: string) => void;
}

export function CommandPalette({ isOpen, onClose, darkMode, onAction }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands = [
    { id: 'save', label: 'Save Specification', icon: Save, shortcut: '⌘S' },
    { id: 'format', label: 'Format Document', icon: FileCode, shortcut: '⌘L' },
    { id: 'preview', label: 'Toggle Preview', icon: Play, shortcut: '⌘P' },
    { id: 'style-guide', label: 'Open Style Guide', icon: Book, shortcut: '⌘G' },
    { id: 'settings', label: 'Open Settings', icon: Settings, shortcut: '⌘,' },
  ];

  const filteredCommands = commands.filter(command =>
    command.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => Math.min(i + 1, filteredCommands.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => Math.max(i - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (filteredCommands[selectedIndex]) {
            onAction(filteredCommands[selectedIndex].id);
            onClose();
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
  }, [isOpen, selectedIndex, filteredCommands, onAction, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-[20vh] z-50">
      <div className={`w-[640px] rounded-lg shadow-2xl overflow-hidden ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Command className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="Type a command or search..."
              className={`w-full bg-transparent border-none focus:ring-0 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              } placeholder-gray-400`}
              autoFocus
            />
          </div>
        </div>

        <div className="max-h-[320px] overflow-y-auto">
          {filteredCommands.map((command, index) => (
            <button
              key={command.id}
              className={`w-full px-4 py-3 flex items-center justify-between ${
                index === selectedIndex
                  ? darkMode
                    ? 'bg-gray-700'
                    : 'bg-gray-100'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => {
                onAction(command.id);
                onClose();
              }}
            >
              <div className="flex items-center gap-3">
                <command.icon className={`w-5 h-5 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
                <span className={darkMode ? 'text-gray-200' : 'text-gray-800'}>
                  {command.label}
                </span>
              </div>
              <kbd className={`px-2 py-1 rounded text-xs font-mono ${
                darkMode
                  ? 'bg-gray-900 text-gray-400 border border-gray-700'
                  : 'bg-gray-100 text-gray-600 border border-gray-300'
              }`}>
                {command.shortcut}
              </kbd>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}