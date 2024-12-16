import { useState, useCallback } from 'react';

export function useExplorerActions() {
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);

  const onFileSelect = useCallback((fileId: string) => {
    // Handle file selection
    console.log('Selected file:', fileId);
  }, []);

  const onFolderToggle = useCallback((folderId: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderId)
        ? prev.filter(id => id !== folderId)
        : [...prev, folderId]
    );
  }, []);

  return {
    expandedFolders,
    onFileSelect,
    onFolderToggle
  };
} 