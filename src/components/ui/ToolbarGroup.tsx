import React from 'react';
import { cn } from '../../lib/utils';

interface ToolbarGroupProps {
  children: React.ReactNode;
  className?: string;
}

export const ToolbarGroup: React.FC<ToolbarGroupProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        'flex items-center',
        'bg-background/50 rounded-md border shadow-sm',
        'p-0.5 gap-0.5',
        'transition-all duration-200 ease-in-out',
        'hover:bg-background/80',
        className
      )}
    >
      {children}
    </div>
  );
}; 