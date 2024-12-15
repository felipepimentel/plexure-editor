import React from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Command,
  FileCode,
  Settings,
  GitBranch,
  Users,
  MessageSquare,
  Shield,
  Lock,
  Bell,
  Search,
  Plus,
  ChevronRight
} from 'lucide-react';

interface FloatingCommandCenterProps {
  className?: string;
}

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  shortcut?: string[];
  category: string;
  icon?: React.ElementType;
  action: () => void;
}

export function FloatingCommandCenter({ className }: FloatingCommandCenterProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  const categories = {
    editor: {
      label: 'Editor',
      icon: FileCode
    },
    git: {
      label: 'Git',
      icon: GitBranch
    },
    collaboration: {
      label: 'Collaboration',
      icon: Users
    },
    security: {
      label: 'Security',
      icon: Shield
    },
    settings: {
      label: 'Settings',
      icon: Settings
    }
  };

  const commands: CommandItem[] = [
    {
      id: 'new-file',
      label: 'New File',
      description: 'Create a new file',
      shortcut: ['⌘', 'N'],
      category: 'editor',
      icon: Plus,
      action: () => console.log('New file')
    },
    {
      id: 'search',
      label: 'Search',
      description: 'Search in files',
      shortcut: ['⌘', 'F'],
      category: 'editor',
      icon: Search,
      action: () => console.log('Search')
    },
    {
      id: 'commit',
      label: 'Commit Changes',
      description: 'Commit your changes',
      shortcut: ['⌘', 'K'],
      category: 'git',
      icon: GitBranch,
      action: () => console.log('Commit')
    },
    {
      id: 'invite',
      label: 'Invite Collaborator',
      description: 'Invite someone to collaborate',
      category: 'collaboration',
      icon: Users,
      action: () => console.log('Invite')
    },
    {
      id: 'comment',
      label: 'Add Comment',
      description: 'Add a comment to the current line',
      shortcut: ['⌘', '/'],
      category: 'collaboration',
      icon: MessageSquare,
      action: () => console.log('Comment')
    },
    {
      id: 'gates',
      label: 'Manage Gates',
      description: 'Configure security gates',
      category: 'security',
      icon: Lock,
      action: () => console.log('Gates')
    },
    {
      id: 'notifications',
      label: 'Notifications',
      description: 'View notifications',
      category: 'collaboration',
      icon: Bell,
      action: () => console.log('Notifications')
    }
  ];

  // Filter commands based on search and category
  const filteredCommands = commands.filter(command => {
    const matchesSearch = search.length === 0 || (
      command.label.toLowerCase().includes(search.toLowerCase()) ||
      command.description?.toLowerCase().includes(search.toLowerCase())
    );
    const matchesCategory = !selectedCategory || command.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Group commands by category
  const groupedCommands = filteredCommands.reduce((acc, command) => {
    const category = command.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(command);
    return acc;
  }, {} as Record<string, CommandItem[]>);

  return (
    <div className={cn("fixed bottom-12 right-12", className)}>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "flex items-center justify-center",
          "w-12 h-12 rounded-full",
          "bg-gray-800 border border-gray-700",
          "text-gray-400 hover:text-gray-300",
          "shadow-lg hover:shadow-xl",
          "transition-all duration-200",
          "hover:scale-105"
        )}
      >
        <Command className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "fixed bottom-28 right-12 z-50",
                "w-[640px]",
                "bg-gray-900 border border-gray-800",
                "rounded-lg shadow-2xl"
              )}
            >
              {/* Search Input */}
              <div className="p-3 border-b border-gray-800">
                <input
                  type="text"
                  placeholder="Type a command or search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className={cn(
                    "w-full px-3 py-2 rounded-md",
                    "bg-gray-800/50",
                    "text-sm text-gray-200",
                    "placeholder-gray-500",
                    "border border-gray-700",
                    "focus:outline-none focus:border-blue-500"
                  )}
                />
              </div>

              {/* Command List */}
              <div className="max-h-[400px] overflow-y-auto">
                {Object.entries(groupedCommands).map(([category, items]) => (
                  <div key={category}>
                    {/* Category Header */}
                    <div className="px-3 py-1.5 flex items-center gap-2">
                      {categories[category as keyof typeof categories].icon && (
                        <div className="w-4 h-4 text-gray-500">
                          {React.createElement(categories[category as keyof typeof categories].icon)}
                        </div>
                      )}
                      <span className="text-xs font-medium text-gray-500">
                        {categories[category as keyof typeof categories].label}
                      </span>
                    </div>

                    {/* Category Items */}
                    {items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          item.action();
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setSelectedItem(item.id)}
                        className={cn(
                          "w-full px-3 py-2",
                          "flex items-center gap-3",
                          "text-left",
                          "transition-colors duration-200",
                          selectedItem === item.id
                            ? "bg-gray-800 text-gray-200"
                            : "text-gray-400 hover:text-gray-300"
                        )}
                      >
                        {item.icon && (
                          <div className="w-4 h-4">
                            {React.createElement(item.icon)}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">
                              {item.label}
                            </span>
                            {item.shortcut && (
                              <div className="flex items-center gap-0.5">
                                {item.shortcut.map((key, index) => (
                                  <React.Fragment key={index}>
                                    {index > 0 && <span className="text-gray-600">+</span>}
                                    <kbd className={cn(
                                      "px-1.5 py-0.5 text-xs",
                                      "bg-gray-800 rounded border border-gray-700",
                                      "font-medium"
                                    )}>
                                      {key}
                                    </kbd>
                                  </React.Fragment>
                                ))}
                              </div>
                            )}
                          </div>
                          {item.description && (
                            <p className="text-xs text-gray-500 truncate">
                              {item.description}
                            </p>
                          )}
                        </div>
                        <ChevronRight className="w-4 h-4 text-gray-600" />
                      </button>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
} 