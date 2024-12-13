import React from 'react';
import { ChevronRight, ChevronDown, FileJson, FolderOpen, Folder } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TreeItemProps {
  label: string;
  level: number;
  isExpanded?: boolean;
  isFolder?: boolean;
  onToggle?: () => void;
  onClick?: () => void;
  isSelected?: boolean;
}

function TreeItem({
  label,
  level,
  isExpanded = false,
  isFolder = false,
  onToggle,
  onClick,
  isSelected = false,
}: TreeItemProps) {
  return (
    <div
      className={cn(
        'flex items-center py-1 px-2 text-sm text-gray-400 hover:bg-white/[0.02] rounded cursor-pointer select-none',
        isSelected && 'bg-white/[0.05] text-gray-200'
      )}
      style={{ paddingLeft: `${level * 16}px` }}
      onClick={onClick}
    >
      {isFolder ? (
        <button
          className="p-0.5 hover:bg-white/[0.05] rounded"
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
        >
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
      ) : (
        <span className="w-5" />
      )}
      <span className="w-5 h-5 flex items-center justify-center mr-1.5">
        {isFolder ? (
          isExpanded ? (
            <FolderOpen className="w-4 h-4 text-gray-400" />
          ) : (
            <Folder className="w-4 h-4 text-gray-400" />
          )
        ) : (
          <FileJson className="w-4 h-4 text-gray-400" />
        )}
      </span>
      <span className="truncate">{label}</span>
    </div>
  );
}

interface NavigationTreeProps {
  className?: string;
}

export function NavigationTree({ className }: NavigationTreeProps) {
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set(['paths', 'components']));
  const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

  const toggleItem = (path: string) => {
    setExpandedItems((prev) => {
      const next = new Set(prev);
      if (next.has(path)) {
        next.delete(path);
      } else {
        next.add(path);
      }
      return next;
    });
  };

  const isExpanded = (path: string) => expandedItems.has(path);

  return (
    <div className={cn('text-sm', className)}>
      <TreeItem
        label="openapi: 3.0.0"
        level={0}
        isSelected={selectedItem === 'openapi'}
        onClick={() => setSelectedItem('openapi')}
      />
      <TreeItem
        label="info"
        level={0}
        isFolder
        isExpanded={isExpanded('info')}
        onToggle={() => toggleItem('info')}
        isSelected={selectedItem === 'info'}
        onClick={() => setSelectedItem('info')}
      />
      {isExpanded('info') && (
        <>
          <TreeItem
            label="title: Sample API"
            level={1}
            isSelected={selectedItem === 'info.title'}
            onClick={() => setSelectedItem('info.title')}
          />
          <TreeItem
            label="version: 1.0.0"
            level={1}
            isSelected={selectedItem === 'info.version'}
            onClick={() => setSelectedItem('info.version')}
          />
          <TreeItem
            label="description"
            level={1}
            isSelected={selectedItem === 'info.description'}
            onClick={() => setSelectedItem('info.description')}
          />
        </>
      )}
      <TreeItem
        label="servers"
        level={0}
        isFolder
        isExpanded={isExpanded('servers')}
        onToggle={() => toggleItem('servers')}
        isSelected={selectedItem === 'servers'}
        onClick={() => setSelectedItem('servers')}
      />
      {isExpanded('servers') && (
        <TreeItem
          label="Production server"
          level={1}
          isSelected={selectedItem === 'servers.0'}
          onClick={() => setSelectedItem('servers.0')}
        />
      )}
      <TreeItem
        label="paths"
        level={0}
        isFolder
        isExpanded={isExpanded('paths')}
        onToggle={() => toggleItem('paths')}
        isSelected={selectedItem === 'paths'}
        onClick={() => setSelectedItem('paths')}
      />
      {isExpanded('paths') && (
        <>
          <TreeItem
            label="/users"
            level={1}
            isFolder
            isExpanded={isExpanded('paths.users')}
            onToggle={() => toggleItem('paths.users')}
            isSelected={selectedItem === 'paths.users'}
            onClick={() => setSelectedItem('paths.users')}
          />
          {isExpanded('paths.users') && (
            <>
              <TreeItem
                label="GET"
                level={2}
                isSelected={selectedItem === 'paths.users.get'}
                onClick={() => setSelectedItem('paths.users.get')}
              />
              <TreeItem
                label="POST"
                level={2}
                isSelected={selectedItem === 'paths.users.post'}
                onClick={() => setSelectedItem('paths.users.post')}
              />
            </>
          )}
        </>
      )}
      <TreeItem
        label="components"
        level={0}
        isFolder
        isExpanded={isExpanded('components')}
        onToggle={() => toggleItem('components')}
        isSelected={selectedItem === 'components'}
        onClick={() => setSelectedItem('components')}
      />
      {isExpanded('components') && (
        <>
          <TreeItem
            label="schemas"
            level={1}
            isFolder
            isExpanded={isExpanded('components.schemas')}
            onToggle={() => toggleItem('components.schemas')}
            isSelected={selectedItem === 'components.schemas'}
            onClick={() => setSelectedItem('components.schemas')}
          />
          {isExpanded('components.schemas') && (
            <>
              <TreeItem
                label="User"
                level={2}
                isSelected={selectedItem === 'components.schemas.User'}
                onClick={() => setSelectedItem('components.schemas.User')}
              />
              <TreeItem
                label="UserInput"
                level={2}
                isSelected={selectedItem === 'components.schemas.UserInput'}
                onClick={() => setSelectedItem('components.schemas.UserInput')}
              />
            </>
          )}
        </>
      )}
    </div>
  );
} 