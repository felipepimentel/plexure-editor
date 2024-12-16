import React from 'react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/Resizable';
import { ActivityBar } from '../navigation/ActivityBar';
import { LeftSidebar } from '../navigation/LeftSidebar/LeftSidebar';
import { RightSidebar } from '../navigation/RightSidebar/RightSidebar';
import { Editor } from '../editor/Editor';

export const MainLayout = () => {
  const [parsedSpec, setParsedSpec] = React.useState(null);

  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex">
        {/* Left Navigation */}
        <ActivityBar position="left" />

        {/* Main Content */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          <ResizablePanel defaultSize={20} minSize={15}>
            <LeftSidebar />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={60}>
            <Editor className="h-full" onSpecChange={setParsedSpec} />
          </ResizablePanel>
          
          <ResizableHandle />
          
          <ResizablePanel defaultSize={20} minSize={15}>
            <RightSidebar parsedSpec={parsedSpec} />
          </ResizablePanel>
        </ResizablePanelGroup>

        {/* Right Navigation */}
        <ActivityBar position="right" />
      </div>
    </div>
  );
};
