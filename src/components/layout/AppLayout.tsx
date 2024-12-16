import { cn } from '@/lib/utils';
import React from 'react';
import { TopNav } from '../navigation/TopNav';
import { ResizablePanelGroup } from '../ui/Resizable';

interface AppLayoutProps {
  leftNav?: React.ReactNode;
  rightNav?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  showStatusBar?: boolean;
}

export const AppLayout = ({ 
  leftNav,
  rightNav,
  children,
  className,
  showStatusBar = true
}: AppLayoutProps) => {
  // Debug log
  React.useEffect(() => {
    console.log('AppLayout props:', { hasLeftNav: !!leftNav, hasRightNav: !!rightNav });
  }, [leftNav, rightNav]);

  return (
    <div className={cn('h-screen flex flex-col bg-background', className)}>
      {/* Top Navigation */}
      <TopNav />

      {/* Main Content */}
      <div className="flex flex-1 min-h-0 relative">
        {/* Left Navigation */}
        {leftNav}

        {/* Main Content Area */}
        <ResizablePanelGroup direction="horizontal" className="flex-1">
          {children}
        </ResizablePanelGroup>

        {/* Right Navigation */}
        {rightNav}
      </div>

      {/* Status Bar */}
      {showStatusBar && (
        <div className="h-6 border-t bg-muted/50 flex items-center px-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>main</span>
            <span>Connected</span>
            <span>OpenAPI v3 1.0.0</span>
          </div>
        </div>
      )}
    </div>
  );
};
