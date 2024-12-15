import React from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  Folder,
  File,
  FileJson,
  FileCode,
  Settings,
  Plus,
  MoreHorizontal,
  Search,
  RefreshCw
} from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

interface ExplorerItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: ExplorerItem[];
  icon?: React.ReactNode;
  modified?: boolean;
}

interface ExplorerProps {
  activePanel: 'explorer' | 'search' | 'extensions';
}

interface TreeItemProps {
  item: ExplorerItem;
  level: number;
  isExpanded?: boolean;
  isSelected?: boolean;
  onToggle: () => void;
  onSelect: () => void;
}

function TreeItem({
  item,
  level,
  isExpanded,
  isSelected,
  onToggle,
  onSelect
}: TreeItemProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const getIcon = () => {
    if (item.icon) return item.icon;
    if (item.type === 'folder') return <Folder className="w-4 h-4" />;
    if (item.name.endsWith('.json')) return <FileJson className="w-4 h-4" />;
    if (item.name.endsWith('.ts') || item.name.endsWith('.tsx')) {
      return <FileCode className="w-4 h-4" />;
    }
    return <File className="w-4 h-4" />;
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ paddingLeft: `${level * 12}px` }}
      className={cn(
        "group relative flex items-center h-6",
        "cursor-pointer select-none",
        isSelected
          ? "bg-gray-800 text-gray-200"
          : "text-gray-400 hover:text-gray-300",
        "transition-colors duration-200"
      )}
    >
      {/* Expand/Collapse Button */}
      {item.type === 'folder' && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className={cn(
            "absolute left-0 top-1/2 -translate-y-1/2",
            "p-0.5 rounded",
            "text-gray-500 hover:text-gray-400",
            "transition-colors duration-200",
            "transform",
            isExpanded && "rotate-90"
          )}
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}

      {/* Item Content */}
      <div
        onClick={onSelect}
        className="flex-1 flex items-center gap-2 px-6"
      >
        <span className="text-gray-400">
          {getIcon()}
        </span>
        <span className="text-sm truncate">
          {item.name}
        </span>
        {item.modified && (
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
        )}
      </div>

      {/* Actions */}
      {isHovered && (
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // Handle more actions
            }}
            className={cn(
              "p-0.5 rounded",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-700",
              "transition-colors duration-200"
            )}
          >
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

function TreeView({ items }: { items: ExplorerItem[] }) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set());
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  const toggleItem = (itemId: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const renderItems = (items: ExplorerItem[], level: number = 0) => {
    return items.map(item => (
      <React.Fragment key={item.id}>
        <TreeItem
          item={item}
          level={level}
          isExpanded={expandedItems.has(item.id)}
          isSelected={selectedItem === item.id}
          onToggle={() => toggleItem(item.id)}
          onSelect={() => setSelectedItem(item.id)}
        />
        {item.children && expandedItems.has(item.id) && (
          <AnimatePresence>
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {renderItems(item.children, level + 1)}
            </motion.div>
          </AnimatePresence>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="py-1">
      {renderItems(items)}
    </div>
  );
}

export function Explorer({ activePanel }: ExplorerProps) {
  // Mock data - replace with real data
  const items: ExplorerItem[] = [
    {
      id: '1',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: '2',
          name: 'components',
          type: 'folder',
          children: [
            {
              id: '3',
              name: 'Editor.tsx',
              type: 'file',
              modified: true
            },
            {
              id: '4',
              name: 'Preview.tsx',
              type: 'file'
            }
          ]
        },
        {
          id: '5',
          name: 'types',
          type: 'folder',
          children: [
            {
              id: '6',
              name: 'schema.ts',
              type: 'file'
            }
          ]
        }
      ]
    },
    {
      id: '7',
      name: 'swagger.json',
      type: 'file',
      modified: true
    }
  ];

  if (activePanel !== 'explorer') return null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none flex items-center justify-between p-2 border-b border-gray-800">
        <h2 className="text-sm font-medium text-gray-200">
          Explorer
        </h2>
        <div className="flex items-center gap-1">
          <Tooltip content="Search in Files">
            <button className={cn(
              "p-1 rounded",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800",
              "transition-colors duration-200"
            )}>
              <Search className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Refresh">
            <button className={cn(
              "p-1 rounded",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800",
              "transition-colors duration-200"
            )}>
              <RefreshCw className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="New File">
            <button className={cn(
              "p-1 rounded",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800",
              "transition-colors duration-200"
            )}>
              <Plus className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Explorer Settings">
            <button className={cn(
              "p-1 rounded",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800",
              "transition-colors duration-200"
            )}>
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Tree View */}
      <div className="flex-1 overflow-y-auto">
        <TreeView items={items} />
      </div>
    </div>
  );
} 