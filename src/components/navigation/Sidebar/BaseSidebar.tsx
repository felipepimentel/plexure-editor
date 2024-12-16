import React from 'react';
import { cn } from '@/lib/utils';
import { ResizablePanel } from '@/components/ui/Resizable';

interface BaseSidebarProps {
  children?: React.ReactNode;
  className?: string;
  position: 'left' | 'right';
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
}

export function BaseSidebar({
  children,
  className,
  position,
  defaultSize = 20,
  minSize = 10,
  maxSize = 30,
}: BaseSidebarProps) {
  return (
    <ResizablePanel 
      defaultSize={defaultSize}
      minSize={minSize}
      maxSize={maxSize}
      className={cn(
        'flex flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        position === 'left' ? 'border-r' : 'border-l',
        className
      )}
    >
      {children}
    </ResizablePanel>
  );
} 