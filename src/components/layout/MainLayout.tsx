import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/Resizable';
import { ActivityBar } from '@/components/sidebar/ActivityBar';
import { LeftSidebar } from '@/components/sidebar/LeftSidebar';
import { RightSidebar } from '@/components/sidebar/RightSidebar';
import { Editor } from '@/components/editor/Editor';
import { useSidebarLayout } from '@/contexts/SidebarLayoutContext';
import { cn } from '@/lib/utils';

interface ParsedSpec {
  // TODO: Define parsed spec type
  [key: string]: any;
}

export const MainLayout: React.FC = () => {
  const [parsedSpec, setParsedSpec] = React.useState<ParsedSpec | null>(null);
  const {
    leftSidebarExpanded,
    rightSidebarExpanded,
    leftActivityBarExpanded,
    rightActivityBarExpanded,
  } = useSidebarLayout();

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left Navigation */}
        {leftActivityBarExpanded && (
          <div className="flex transition-all duration-300">
            <ActivityBar position="left" />
          </div>
        )}

        {/* Main Content */}
        <ResizablePanelGroup 
          direction="horizontal" 
          className="flex-1"
          id="main-layout"
          autoSaveId="main-layout"
        >
          <ResizablePanel
            id="left-sidebar"
            defaultSize={20}
            minSize={15}
            maxSize={35}
            style={{ visibility: leftSidebarExpanded ? 'visible' : 'hidden' }}
          >
            <LeftSidebar />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            id="editor"
            defaultSize={60}
            minSize={30}
          >
            <Editor className="h-full" onSpecChange={setParsedSpec} />
          </ResizablePanel>

          <ResizableHandle withHandle />

          <ResizablePanel
            id="right-sidebar"
            defaultSize={20}
            minSize={15}
            maxSize={35}
            style={{ visibility: rightSidebarExpanded ? 'visible' : 'hidden' }}
          >
            <RightSidebar parsedSpec={parsedSpec} />
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Right Navigation */}
        {rightActivityBarExpanded && (
          <div className="flex transition-all duration-300">
            <ActivityBar position="right" />
          </div>
        )}
      </div>
    </div>
  );
};
