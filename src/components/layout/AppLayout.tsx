import { cn } from '@/lib/utils';
import React from 'react';
import { ActivityBar } from '../navigation/ActivityBar';
import { Sidebar } from '../navigation/Sidebar';
import { TopNav } from '../navigation/TopNav';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/Resizable';
import { ValidationPanel } from '../validation/ValidationPanel';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, className }) => {
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showValidationPanel, setShowValidationPanel] = React.useState(true);

  return (
    <div className={cn('h-screen flex flex-col bg-background', className)}>
      {/* Top Navigation */}
      <TopNav className="flex-none" />

      {/* Main Content */}
      <div className="flex-1 flex min-h-0">
        {/* Activity Bar */}
        <ActivityBar className="flex-none w-12 border-r" />

        {/* Main Content Area */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {/* Left Sidebar */}
          {showSidebar && (
            <>
              <ResizablePanel
                defaultSize={20}
                minSize={15}
                maxSize={30}
                className="min-h-0"
              >
                <Sidebar />
              </ResizablePanel>
              <ResizableHandle withHandle />
            </>
          )}

          {/* Editor Area */}
          <ResizablePanel
            defaultSize={showValidationPanel ? 60 : 80}
            className="min-h-0"
          >
            <div className="h-full">
              {children}
            </div>
          </ResizablePanel>

          {/* Right Panel */}
          {showValidationPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                defaultSize={20}
                minSize={15}
                maxSize={30}
                className="min-h-0"
              >
                <ValidationPanel />
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>

      {/* Status Bar */}
      <div className="flex-none h-6 border-t bg-muted/50 flex items-center px-2 text-xs text-muted-foreground">
        <div className="flex items-center gap-4">
          <span>main</span>
          <span>Connected</span>
          <span>OpenAPI v3 1.0.0</span>
        </div>
      </div>
    </div>
  );
};
