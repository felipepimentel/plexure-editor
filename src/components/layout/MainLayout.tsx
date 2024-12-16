import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/Resizable';
import { ActivityBar } from '../navigation/ActivityBar';
import { LeftSidebar } from '../navigation/LeftSidebar/LeftSidebar';
import { RightSidebar } from '../navigation/RightSidebar';
import { Editor } from '../editor/Editor';
import { useSidebarLayout } from '@/contexts/SidebarLayoutContext';
import { cn } from '@/lib/utils';

export const MainLayout = () => {
  const [parsedSpec, setParsedSpec] = React.useState(null);
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
        <div className={cn(
          'flex transition-all duration-300',
          !leftActivityBarExpanded && 'w-0 opacity-0'
        )}>
          <ActivityBar position="left" />
        </div>

        {/* Main Content */}
        <ResizablePanelGroup 
          direction="horizontal" 
          className="flex-1"
          id="main-layout"
        >
          <ResizablePanel 
            id="left-sidebar"
            defaultSize={20} 
            minSize={15}
            maxSize={35}
            collapsible={true}
            collapsedSize={0}
            onCollapse={() => {}}
            className={cn(
              'transition-all duration-300',
              !leftSidebarExpanded && 'min-w-0'
            )}
          >
            <LeftSidebar />
          </ResizablePanel>
          
          <ResizableHandle withHandle id="left-handle" />
          
          <ResizablePanel 
            id="editor"
            defaultSize={60} 
            minSize={30}
          >
            <Editor className="h-full" onSpecChange={setParsedSpec} />
          </ResizablePanel>
          
          <ResizableHandle withHandle id="right-handle" />
          
          <ResizablePanel 
            id="right-sidebar"
            defaultSize={20} 
            minSize={15}
            maxSize={35}
            collapsible={true}
            collapsedSize={0}
            onCollapse={() => {}}
            className={cn(
              'transition-all duration-300',
              !rightSidebarExpanded && 'min-w-0'
            )}
          >
            <RightSidebar parsedSpec={parsedSpec} />
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Right Navigation */}
        <div className={cn(
          'flex transition-all duration-300',
          !rightActivityBarExpanded && 'w-0 opacity-0'
        )}>
          <ActivityBar position="right" />
        </div>
      </div>
    </div>
  );
};
