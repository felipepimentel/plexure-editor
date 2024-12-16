import React from 'react';
import { Files } from 'lucide-react';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { FileTree } from './FileTree';
import { useExplorer } from '@/features/explorer/useExplorer';
import { useSidebarLayout } from '@/contexts/SidebarLayoutContext';

export function Explorer() {
  const { 
    selectedFile,
    expandedFolders,
    selectFile,
    toggleFolder,
    treeData
  } = useExplorer();

  const {
    leftSidebarExpanded: isExpanded,
    toggleLeftSidebar: toggleExpanded
  } = useSidebarLayout();

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Explorer"
        icon={Files}
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
      />
      <div className="flex-1 overflow-auto">
        <FileTree 
          selectedFile={selectedFile}
          expandedFolders={expandedFolders}
          onFileSelect={selectFile}
          onFolderToggle={toggleFolder}
          treeData={treeData}
        />
      </div>
    </div>
  );
} 