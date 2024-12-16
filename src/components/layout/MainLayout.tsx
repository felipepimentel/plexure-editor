import React from 'react';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '../ui/Resizable';
import { TopNav } from '../navigation/TopNav';
import { ActivityBar } from '../navigation/ActivityBar';
import { SecondaryActivityBar } from '../navigation/SecondaryActivityBar';
import { Sidebar } from '../navigation/Sidebar';
import { Editor } from '../editor/Editor';
import { ValidationPanel } from '../validation/ValidationPanel';
import { TooltipProvider } from '@/components/ui/Tooltip';

export const MainLayout = () => {
  return (
    <TooltipProvider>
      <div className="flex h-screen w-full flex-col bg-background">
        <TopNav />
        <div className="relative flex h-[calc(100vh-3.5rem)] w-full">
          {/* Primary Activity Bar */}
          <ActivityBar className="z-10 shrink-0" />

          {/* Main Content */}
          <ResizablePanelGroup
            direction="horizontal"
            className="w-full"
          >
            <ResizablePanel
              defaultSize={20}
              minSize={10}
              className="min-h-0"
            >
              <Sidebar />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel
              defaultSize={60}
              className="min-h-0"
            >
              <Editor />
            </ResizablePanel>
            
            <ResizableHandle withHandle />
            
            <ResizablePanel
              defaultSize={20}
              minSize={10}
              className="min-h-0"
            >
              <ValidationPanel />
            </ResizablePanel>
          </ResizablePanelGroup>

          {/* Secondary Activity Bar */}
          <SecondaryActivityBar className="z-10 shrink-0" />
        </div>
      </div>
    </TooltipProvider>
  );
};
