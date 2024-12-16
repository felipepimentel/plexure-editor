import React, { useCallback } from 'react';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, File, Folder } from 'lucide-react';
import { TreeNode } from '@/features/explorer/useExplorer';

interface FileTreeProps {
  selectedFile?: string;
  expandedFolders: string[];
  onFileSelect: (fileId: string) => void;
  onFolderToggle: (folderId: string) => void;
  treeData?: TreeNode[];
  className?: string;
}

export function FileTree({
  selectedFile,
  expandedFolders,
  onFileSelect,
  onFolderToggle,
  treeData = [],
  className
}: FileTreeProps) {
  const handleKeyDown = useCallback((
    event: React.KeyboardEvent,
    node: TreeNode
  ) => {
    const isFolder = node.type === 'folder';
    
    switch (event.key) {
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (isFolder) {
          onFolderToggle(node.id);
        } else {
          onFileSelect(node.id);
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (isFolder && !expandedFolders.includes(node.id)) {
          onFolderToggle(node.id);
        }
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (isFolder && expandedFolders.includes(node.id)) {
          onFolderToggle(node.id);
        }
        break;
    }
  }, [expandedFolders, onFileSelect, onFolderToggle]);

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.includes(node.id);
    const isSelected = node.id === selectedFile;

    return (
      <div key={node.id} className="select-none">
        <div
          className={cn(
            'flex items-center gap-1 py-1 px-2 hover:bg-muted/50 cursor-pointer',
            isSelected && 'bg-primary/10 text-primary',
            level > 0 && 'ml-4'
          )}
          onClick={() => isFolder ? onFolderToggle(node.id) : onFileSelect(node.id)}
          onKeyDown={(e) => handleKeyDown(e, node)}
          role={isFolder ? 'treeitem' : 'link'}
          aria-expanded={isFolder ? isExpanded : undefined}
          aria-selected={isSelected}
          tabIndex={0}
          data-path={node.path}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 shrink-0" />
              )}
              <Folder className="w-4 h-4 shrink-0" />
            </>
          ) : (
            <>
              <span className="w-4" />
              <File className="w-4 h-4 shrink-0" />
            </>
          )}
          <span className="truncate">{node.name}</span>
        </div>
        
        {isFolder && isExpanded && node.children?.map(child => 
          renderTreeNode(child, level + 1)
        )}
      </div>
    );
  };

  return (
    <div 
      className={cn("py-2", className)}
      role="tree"
      aria-label="File Explorer"
    >
      {treeData.map(node => renderTreeNode(node))}
    </div>
  );
} 