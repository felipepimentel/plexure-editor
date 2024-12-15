import React from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface ResizablePanelGroupProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

interface ResizablePanelProps {
  children: React.ReactNode;
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  className?: string;
}

interface ResizableHandleProps {
  onResize?: (delta: number) => void;
  className?: string;
}

export function ResizablePanelGroup({
  children,
  direction = 'horizontal',
  className
}: ResizablePanelGroupProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === 'horizontal' ? "flex-row" : "flex-col",
        "h-full",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ResizablePanel({
  children,
  defaultSize = 100,
  minSize = 0,
  maxSize = 100,
  className
}: ResizablePanelProps) {
  const [size, setSize] = React.useState(defaultSize);
  const lastSize = React.useRef(size);

  const handleResize = React.useCallback((delta: number) => {
    setSize(prev => {
      const newSize = Math.max(minSize, Math.min(maxSize, prev + delta));
      lastSize.current = newSize;
      return newSize;
    });
  }, [minSize, maxSize]);

  return (
    <motion.div
      className={cn("relative", className)}
      style={{ flex: `${size} ${size} 0%` }}
      layout
    >
      {children}
    </motion.div>
  );
}

export function ResizableHandle({
  onResize,
  className
}: ResizableHandleProps) {
  const [isDragging, setIsDragging] = React.useState(false);
  const startPos = React.useRef({ x: 0, y: 0 });

  const handleDragStart = (event: React.PointerEvent) => {
    setIsDragging(true);
    startPos.current = { x: event.clientX, y: event.clientY };
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleDragMove = (event: React.PointerEvent) => {
    if (!isDragging) return;

    const delta = {
      x: event.clientX - startPos.current.x,
      y: event.clientY - startPos.current.y
    };

    onResize?.(delta.x);
    startPos.current = { x: event.clientX, y: event.clientY };
  };

  const handleDragEnd = (event: React.PointerEvent) => {
    setIsDragging(false);
    event.currentTarget.releasePointerCapture(event.pointerId);
  };

  return (
    <div
      onPointerDown={handleDragStart}
      onPointerMove={handleDragMove}
      onPointerUp={handleDragEnd}
      className={cn(
        "absolute top-0 right-0 bottom-0",
        "w-1 cursor-col-resize",
        "group",
        isDragging && "select-none",
        className
      )}
    >
      <div className={cn(
        "absolute inset-y-0 -left-1 w-3",
        "flex items-center justify-center",
        "group-hover:bg-blue-500/10",
        isDragging && "bg-blue-500/10"
      )}>
        <div className={cn(
          "w-0.5 h-8",
          "bg-gray-700 rounded-full",
          "group-hover:bg-blue-400",
          isDragging && "bg-blue-400"
        )} />
      </div>
    </div>
  );
} 