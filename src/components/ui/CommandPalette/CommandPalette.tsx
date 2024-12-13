import React, { useState, useEffect } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import { Search, FileText, Settings, HelpCircle, ChevronRight, Keyboard, Book } from 'lucide-react';
import { useKeyboardShortcuts } from '@/contexts/KeyboardShortcutsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useNavigation } from '@/contexts/NavigationContext';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandItem {
  id: string;
  name: string;
  shortcut?: string;
  icon?: React.ReactNode;
  action: () => void;
  category: string;
  keywords?: string[];
}

const commandCategories = {
  File: 'File operations',
  Edit: 'Edit operations',
  View: 'View options',
  Help: 'Help and documentation',
  Navigation: 'Navigation options',
} as const;

type CommandCategory = keyof typeof commandCategories;

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState('');
  const { getShortcuts } = useKeyboardShortcuts();
  const { theme } = useTheme();
  const { addItem } = useNavigation();

  const commands: CommandItem[] = [
    {
      id: 'new-file',
      name: 'New File',
      shortcut: '⌘+N',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        addItem('root', {
          name: 'new-file.yaml',
          type: 'file',
          path: '/new-file.yaml',
        });
        onClose();
      },
      category: 'File',
      keywords: ['create', 'add', 'file', 'new'],
    },
    {
      id: 'settings',
      name: 'Open Settings',
      shortcut: '⌘+,',
      icon: <Settings className="w-4 h-4" />,
      action: () => {
        onClose();
      },
      category: 'View',
      keywords: ['preferences', 'config', 'options'],
    },
    {
      id: 'shortcuts',
      name: 'Keyboard Shortcuts',
      shortcut: '⌘+K',
      icon: <Keyboard className="w-4 h-4" />,
      action: () => {
        onClose();
      },
      category: 'Help',
      keywords: ['keyboard', 'keys', 'bindings'],
    },
    {
      id: 'docs',
      name: 'Documentation',
      icon: <Book className="w-4 h-4" />,
      action: () => {
        onClose();
      },
      category: 'Help',
      keywords: ['help', 'docs', 'guide', 'manual'],
    },
  ];

  useEffect(() => {
    if (isOpen) {
      setSearch('');
    }
  }, [isOpen]);

  const filteredCommands = (query: string) => {
    if (!query) return commands;

    const searchTerms = query.toLowerCase().split(' ');
    return commands.filter(command => {
      const searchableText = [
        command.name.toLowerCase(),
        command.category.toLowerCase(),
        ...(command.keywords || []).map(k => k.toLowerCase()),
      ].join(' ');

      return searchTerms.every(term => searchableText.includes(term));
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      <CommandPrimitive
        className="relative w-[640px] max-h-[400px] overflow-hidden rounded-xl border border-white/10 bg-gray-900/90 shadow-2xl backdrop-blur-xl"
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === 'Escape') {
            onClose();
          }
        }}
      >
        <div className="flex items-center border-b border-white/10 px-3">
          <Search className="w-4 h-4 text-gray-400" />
          <CommandPrimitive.Input
            value={search}
            onValueChange={setSearch}
            className="flex-1 bg-transparent py-3 px-2 text-sm text-gray-100 placeholder-gray-400 outline-none"
            placeholder="Type a command or search..."
            autoFocus
          />
        </div>

        <CommandPrimitive.List className="max-h-[300px] overflow-auto p-2 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
          <CommandPrimitive.Empty className="py-6 text-center text-sm text-gray-400">
            No results found.
          </CommandPrimitive.Empty>

          {Object.entries(
            filteredCommands(search).reduce<Record<CommandCategory, CommandItem[]>>((acc, item) => {
              const category = item.category as CommandCategory;
              if (!acc[category]) {
                acc[category] = [];
              }
              acc[category].push(item);
              return acc;
            }, {} as Record<CommandCategory, CommandItem[]>)
          ).map(([category, items]) => (
            items.length > 0 && (
              <CommandPrimitive.Group
                key={category}
                heading={
                  <div className="px-2 py-1 text-xs font-medium text-gray-400">
                    {category} - {commandCategories[category as CommandCategory]}
                  </div>
                }
              >
                {items.map((item) => (
                  <CommandPrimitive.Item
                    key={item.id}
                    value={item.name}
                    onSelect={() => item.action()}
                    className="group flex items-center justify-between rounded-md px-2 py-1.5 text-sm text-gray-300 hover:bg-white/5 aria-selected:bg-white/10"
                  >
                    <div className="flex items-center gap-2">
                      {item.icon}
                      <span>{item.name}</span>
                    </div>
                    {item.shortcut && (
                      <div className="flex items-center gap-1">
                        {item.shortcut.split('+').map((key, index) => (
                          <kbd
                            key={index}
                            className="min-w-[1.5rem] rounded border border-white/20 bg-white/5 px-1.5 py-0.5 text-xs font-medium text-gray-400"
                          >
                            {key}
                          </kbd>
                        ))}
                      </div>
                    )}
                  </CommandPrimitive.Item>
                ))}
              </CommandPrimitive.Group>
            )
          ))}

          <div className="mt-4 border-t border-white/10 px-2 py-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-2">
                <span>↑↓</span>
                <span>to navigate</span>
              </div>
              <div className="flex items-center gap-2">
                <span>↵</span>
                <span>to select</span>
              </div>
              <div className="flex items-center gap-2">
                <span>esc</span>
                <span>to close</span>
              </div>
            </div>
          </div>
        </CommandPrimitive.List>
      </CommandPrimitive>
    </div>
  );
} 