import React from 'react';
import { cn } from '@/lib/utils';
import { ResizablePanel } from '@/components/ui/Resizable';

interface SidebarPanelProps {
  position?: 'left' | 'right';
  children: React.ReactNode;
  className?: string;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  isCollapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  onResize?: (size: number) => void;
}

export function SidebarPanel({
  position = 'left',
  children,
  className,
  defaultSize = 20,
  minSize = 15,
  maxSize = 35,
  isCollapsed = false,
  onCollapse,
  onResize
}: SidebarPanelProps) {
  return (
    <ResizablePanel
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      collapsible
      collapsedSize={0}
      onCollapse={onCollapse}
      onResize={onResize}
      className={cn(
        'transition-all duration-300',
        position === 'left' ? 'border-r' : 'border-l',
        isCollapsed && 'min-w-0',
        className
      )}
    >
      <div className="h-full bg-background">
        {children}
      </div>
    </ResizablePanel>
  );
} 