import { useState } from 'react';

export function useExplorerState() {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedFile, setSelectedFile] = useState<string>();

  const toggleExpanded = () => setIsExpanded(prev => !prev);

  return {
    isExpanded,
    toggleExpanded,
    selectedFile,
    setSelectedFile
  };
} 