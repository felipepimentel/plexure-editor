import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Input } from '../ui/input';
import {
  ChevronDown,
  ChevronRight,
  File,
  Folder,
  FolderOpen,
  Search,
  Plus,
  MoreHorizontal,
  RefreshCw
} from 'lucide-react';

interface SidebarProps {
  className?: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  children?: FileNode[];
  expanded?: boolean;
}

const demoFiles: FileNode[] = [
  {
    name: 'src',
    type: 'folder',
    expanded: true,
    children: [
      {
        name: 'components',
        type: 'folder',
        expanded: true,
        children: [
          { name: 'Button.tsx', type: 'file' },
          { name: 'Input.tsx', type: 'file' },
          { name: 'Select.tsx', type: 'file' },
        ]
      },
      {
        name: 'pages',
        type: 'folder',
        children: [
          { name: 'index.tsx', type: 'file' },
          { name: 'about.tsx', type: 'file' },
        ]
      },
      { name: 'App.tsx', type: 'file' },
      { name: 'index.tsx', type: 'file' },
    ]
  },
  {
    name: 'public',
    type: 'folder',
    children: [
      { name: 'index.html', type: 'file' },
      { name: 'favicon.ico', type: 'file' },
    ]
  },
  { name: 'package.json', type: 'file' },
  { name: 'tsconfig.json', type: 'file' },
];

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [files, setFiles] = React.useState<FileNode[]>(demoFiles);
  const [searchQuery, setSearchQuery] = React.useState('');

  const toggleFolder = (path: string[]) => {
    const updateNode = (nodes: FileNode[], currentPath: string[]): FileNode[] => {
      return nodes.map(node => {
        if (node.name === currentPath[0]) {
          if (currentPath.length === 1) {
            return { ...node, expanded: !node.expanded };
          }
          return {
            ...node,
            children: node.children ? updateNode(node.children, currentPath.slice(1)) : undefined
          };
        }
        return node;
      });
    };

    setFiles(updateNode(files, path));
  };

  const renderTree = (nodes: FileNode[], path: string[] = []) => {
    return nodes.map((node, index) => {
      const currentPath = [...path, node.name];
      const isFolder = node.type === 'folder';
      const isExpanded = node.expanded;

      if (!node.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        if (!node.children?.some(child => 
          child.name.toLowerCase().includes(searchQuery.toLowerCase())
        )) {
          return null;
        }
      }

      return (
        <div key={node.name + index} className="flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              'h-8 justify-start gap-2 px-2 hover:bg-muted/50',
              path.length > 0 && 'pl-[calc(theme(space.2)*1.5*var(--depth))]'
            )}
            style={{ '--depth': path.length } as React.CSSProperties}
            onClick={() => isFolder && toggleFolder(currentPath)}
          >
            {isFolder ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              )
            ) : (
              <div className="w-4" />
            )}
            {isFolder ? (
              isExpanded ? (
                <FolderOpen className="h-4 w-4 shrink-0 text-muted-foreground" />
              ) : (
                <Folder className="h-4 w-4 shrink-0 text-muted-foreground" />
              )
            ) : (
              <File className="h-4 w-4 shrink-0 text-muted-foreground" />
            )}
            <span className="truncate">{node.name}</span>
          </Button>
          {isFolder && isExpanded && node.children && (
            <div className="flex flex-col">
              {renderTree(node.children, currentPath)}
            </div>
          )}
        </div>
      );
    });
  };

  return (
    <div className={cn('flex h-full w-full flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-2 py-2">
        <span className="text-sm font-medium">Explorer</span>
        <div className="flex items-center gap-0.5">
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Plus className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Search */}
      <div className="border-b px-2 py-2">
        <div className="flex items-center gap-2 rounded-md border bg-background px-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 border-0 bg-transparent p-0 text-sm focus-visible:ring-0"
          />
        </div>
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1 px-2 py-2">
        <div className="flex flex-col gap-0.5">
          {renderTree(files)}
        </div>
      </ScrollArea>
    </div>
  );
};
