import { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

export interface TreeNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: TreeNode[];
  path: string;
}

interface ExplorerState {
  isExpanded: boolean;
  selectedFile?: string;
  expandedFolders: string[];
  treeData: TreeNode[];
}

interface ExplorerActions {
  toggleExpanded: () => void;
  selectFile: (fileId: string) => void;
  toggleFolder: (folderId: string) => void;
  refreshTree: () => Promise<void>;
}

export function useExplorer(): ExplorerState & ExplorerActions {
  // Persistent state
  const [isExpanded, setIsExpanded] = useLocalStorage('explorer-expanded', true);
  const [selectedFile, setSelectedFile] = useLocalStorage<string | undefined>('explorer-selected-file', undefined);
  const [expandedFolders, setExpandedFolders] = useLocalStorage<string[]>('explorer-expanded-folders', []);
  
  // Tree data state
  const [treeData, setTreeData] = useState<TreeNode[]>([]);

  // Actions
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, [setIsExpanded]);

  const selectFile = useCallback((fileId: string) => {
    setSelectedFile(fileId);
    // TODO: Integrate with editor context to open file
  }, [setSelectedFile]);

  const toggleFolder = useCallback((folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  }, [setExpandedFolders]);

  const refreshTree = useCallback(async () => {
    try {
      // TODO: Integrate with file system API to get real data
      const mockData: TreeNode[] = [
        {
          id: 'src',
          name: 'src',
          type: 'folder',
          path: '/src',
          children: [
            {
              id: 'components',
              name: 'components',
              type: 'folder',
              path: '/src/components',
              children: []
            }
          ]
        }
      ];
      setTreeData(mockData);
    } catch (error) {
      console.error('Failed to refresh file tree:', error);
    }
  }, []);

  // Initial load
  useEffect(() => {
    refreshTree();
  }, [refreshTree]);

  return {
    // State
    isExpanded,
    selectedFile,
    expandedFolders,
    treeData,
    // Actions
    toggleExpanded,
    selectFile,
    toggleFolder,
    refreshTree,
  };
} 