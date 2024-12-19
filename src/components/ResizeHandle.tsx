import React from 'react';
import { PanelResizeHandle } from 'react-resizable-panels';
import { GripVertical } from 'lucide-react';
import { cn } from '../lib/utils';

interface ResizeHandleProps {
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export const ResizeHandle: React.FC<ResizeHandleProps> = ({
  direction = 'horizontal',
  className,
}) => {
  const [isResizing, setIsResizing] = React.useState(false);

  return (
    <PanelResizeHandle
      onDragging={setIsResizing}
      className={cn(
        'group relative flex items-center justify-center',
        direction === 'horizontal'
          ? 'w-1.5 mx-1'
          : 'h-1.5 my-1',
        className
      )}
    >
      {/* Handle line */}
      <div
        className={cn(
          'absolute transition-[width,height,opacity] duration-150',
          direction === 'horizontal'
            ? 'w-0.5 h-full group-hover:w-1 group-hover:opacity-100'
            : 'w-full h-0.5 group-hover:h-1 group-hover:opacity-100',
          isResizing
            ? 'bg-primary/60 w-1 opacity-100'
            : 'bg-border opacity-0 group-hover:opacity-100'
        )}
      />

      {/* Grip icon */}
      <div
        className={cn(
          'absolute rounded-md opacity-0 group-hover:opacity-100 transition-opacity',
          direction === 'horizontal'
            ? '-rotate-90 p-1.5'
            : 'p-1.5',
          isResizing && 'opacity-100'
        )}
      >
        <GripVertical className="w-2.5 h-2.5 text-muted-foreground" />
      </div>

      {/* Active state overlay */}
      {isResizing && (
        <div
          className={cn(
            'absolute bg-primary/10 z-50 transition-all',
            direction === 'horizontal'
              ? 'w-64 h-full -translate-x-1/2'
              : 'h-64 w-full -translate-y-1/2'
          )}
        />
      )}
    </PanelResizeHandle>
  );
};

export default ResizeHandle; 