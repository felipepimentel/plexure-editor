import React, { useState, useEffect } from 'react';
import { 
  Command,
  Search,
  Settings,
  FileText,
  GitBranch,
  Terminal,
  Play,
  Layout,
  Monitor,
  Keyboard,
  HelpCircle,
  ChevronRight,
  ArrowRight,
  Star,
  Clock,
  History,
  Bookmark,
  Zap
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface CommandItem {
  id: string;
  icon: React.ElementType;
  title: string;
  description?: string;
  shortcut?: string;
  category: 'recent' | 'general' | 'editor' | 'git' | 'tools';
  action: () => void;
}

interface FloatingCommandCenterProps {
  isOpen: boolean;
  onClose: () => void;
  onAction: (action: () => void) => void;
}

export function FloatingCommandCenter({
  isOpen,
  onClose,
  onAction
}: FloatingCommandCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [recentCommands, setRecentCommands] = useState<string[]>([]);

  // Command categories
  const categories = {
    recent: { label: 'Recent', icon: Clock },
    general: { label: 'General', icon: Command },
    editor: { label: 'Editor', icon: FileText },
    git: { label: 'Git', icon: GitBranch },
    tools: { label: 'Tools', icon: Terminal }
  };

  // Command items
  const commands: CommandItem[] = [
    // Recent commands will be added dynamically
    ...recentCommands.map(id => {
      const originalCommand = allCommands.find(cmd => cmd.id === id);
      return {
        ...originalCommand!,
        category: 'recent'
      };
    }),
    // General commands
    {
      id: 'command.palette',
      icon: Command,
      title: 'Command Palette',
      description: 'Show all commands',
      shortcut: '⌘P',
      category: 'general',
      action: () => {}
    },
    {
      id: 'command.settings',
      icon: Settings,
      title: 'Open Settings',
      description: 'Configure editor settings',
      shortcut: '⌘,',
      category: 'general',
      action: () => {}
    },
    // Editor commands
    {
      id: 'editor.preview',
      icon: Play,
      title: 'Toggle Preview',
      description: 'Show/hide preview panel',
      shortcut: '⌘K V',
      category: 'editor',
      action: () => {}
    },
    {
      id: 'editor.layout',
      icon: Layout,
      title: 'Change Layout',
      description: 'Change editor layout',
      category: 'editor',
      action: () => {}
    },
    // Git commands
    {
      id: 'git.commit',
      icon: GitBranch,
      title: 'Commit Changes',
      description: 'Commit staged changes',
      shortcut: '⌘K ⌘Enter',
      category: 'git',
      action: () => {}
    },
    // Tool commands
    {
      id: 'tools.terminal',
      icon: Terminal,
      title: 'New Terminal',
      description: 'Open new terminal',
      shortcut: '⌘`',
      category: 'tools',
      action: () => {}
    }
  ];

  // All available commands
  const allCommands = commands.filter(cmd => cmd.category !== 'recent');

  // Filter commands based on search query
  const filteredCommands = commands.filter(cmd => {
    const search = searchQuery.toLowerCase();
    return (
      cmd.title.toLowerCase().includes(search) ||
      cmd.description?.toLowerCase().includes(search) ||
      cmd.category.toLowerCase().includes(search)
    );
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) {
      acc[cmd.category] = [];
    }
    acc[cmd.category].push(cmd);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(i => 
            i < filteredCommands.length - 1 ? i + 1 : 0
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(i => 
            i > 0 ? i - 1 : filteredCommands.length - 1
          );
          break;
        case 'Enter':
          e.preventDefault();
          const selectedCommand = filteredCommands[selectedIndex];
          if (selectedCommand) {
            handleCommandSelect(selectedCommand);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  // Handle command selection
  const handleCommandSelect = (command: CommandItem) => {
    // Update recent commands
    setRecentCommands(prev => {
      const newRecent = [command.id, ...prev.filter(id => id !== command.id)].slice(0, 5);
      localStorage.setItem('recentCommands', JSON.stringify(newRecent));
      return newRecent;
    });

    onAction(command.action);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Command Center */}
      <div className={cn(
        "relative w-[640px]",
        "bg-gray-900/95 backdrop-blur-sm",
        "border border-gray-800 rounded-lg shadow-2xl",
        "divide-y divide-gray-800",
        "animate-in fade-in slide-in-from-top-4 duration-200"
      )}>
        {/* Search Input */}
        <div className="p-3 flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className={cn(
              "flex-1 bg-transparent",
              "text-gray-200 placeholder-gray-500",
              "text-sm focus:outline-none"
            )}
            autoFocus
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className={cn(
                "p-1 rounded-md",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-800",
                "transition-colors duration-200"
              )}
            >
              <Command className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Command List */}
        <div className="max-h-[60vh] overflow-y-auto">
          {Object.entries(groupedCommands).map(([category, commands]) => (
            <div key={category} className="py-2">
              {/* Category Header */}
              <div className="px-3 py-1.5 flex items-center gap-2">
                {categories[category as keyof typeof categories].icon && (
                  <categories[category as keyof typeof categories].icon 
                    className="w-4 h-4 text-gray-500" 
                  />
                )}
                <span className="text-xs font-medium text-gray-500">
                  {categories[category as keyof typeof categories].label}
                </span>
              </div>

              {/* Commands */}
              <div className="space-y-1">
                {commands.map((command, index) => {
                  const isSelected = filteredCommands.indexOf(command) === selectedIndex;

                  return (
                    <button
                      key={command.id}
                      onClick={() => handleCommandSelect(command)}
                      onMouseEnter={() => setSelectedIndex(filteredCommands.indexOf(command))}
                      className={cn(
                        "w-full px-3 py-2",
                        "flex items-center gap-3",
                        "text-sm text-left",
                        "transition-colors duration-200",
                        isSelected
                          ? "bg-blue-500/10 text-blue-400"
                          : "text-gray-300 hover:bg-gray-800/50"
                      )}
                    >
                      {/* Command Icon */}
                      <div className={cn(
                        "w-8 h-8 flex items-center justify-center",
                        "rounded-lg",
                        isSelected
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-gray-800/50 text-gray-400"
                      )}>
                        <command.icon className="w-4 h-4" />
                      </div>

                      {/* Command Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{command.title}</span>
                          {command.shortcut && (
                            <kbd className={cn(
                              "px-1.5 py-0.5",
                              "text-[10px] font-mono",
                              "rounded border",
                              isSelected
                                ? "bg-blue-500/20 border-blue-500/30 text-blue-400"
                                : "bg-gray-800 border-gray-700 text-gray-400"
                            )}>
                              {command.shortcut}
                            </kbd>
                          )}
                        </div>
                        {command.description && (
                          <div className="text-xs text-gray-500 truncate">
                            {command.description}
                          </div>
                        )}
                      </div>

                      {/* Selection Indicator */}
                      <ArrowRight className={cn(
                        "w-4 h-4",
                        "transition-opacity duration-200",
                        isSelected ? "opacity-100" : "opacity-0",
                        isSelected ? "text-blue-400" : "text-gray-400"
                      )} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Empty State */}
          {filteredCommands.length === 0 && (
            <div className="p-8 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <h3 className="text-sm font-medium text-gray-300 mb-1">
                No commands found
              </h3>
              <p className="text-xs text-gray-500">
                Try a different search term
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span>↑↓ to navigate</span>
            <span>↵ to select</span>
            <span>esc to close</span>
          </div>
          <div className="flex items-center gap-2">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Keyboard Shortcuts</span>
          </div>
        </div>
      </div>
    </div>
  );
} 