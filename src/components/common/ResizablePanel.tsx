import React, { useState, useCallback, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResizablePanelProps {
  children: React.ReactNode;
  side: 'left' | 'right';
  darkMode: boolean;
  defaultWidth: number;
  minWidth: number;
  maxWidth: number;
  isCollapsed: boolean;
  onCollapse: (collapsed: boolean) => void;
  onResize: (width: number) => void;
}

export function ResizablePanel({
  children,
  side,
  darkMode,
  defaultWidth,
  minWidth,
  maxWidth,
  isCollapsed,
  onCollapse,
  onResize
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);
  const [isResizing, setIsResizing] = useState(false);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startXRef = useRef<number>(0);
  const startWidthRef = useRef<number>(0);

  useEffect(() => {
    setWidth(defaultWidth);
  }, [defaultWidth]);

  const startResize = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    startXRef.current = e.pageX;
    startWidthRef.current = width;
  }, [width]);

  const stopResize = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      onResize(width);
    }
  }, [isResizing, width, onResize]);

  const resize = useCallback((e: MouseEvent) => {
    if (isResizing) {
      e.preventDefault();
      const diff = side === 'left'
        ? e.pageX - startXRef.current
        : startXRef.current - e.pageX;
      
      const newWidth = Math.min(
        Math.max(startWidthRef.current + diff, minWidth),
        maxWidth
      );
      
      setWidth(newWidth);
    }
  }, [isResizing, side, minWidth, maxWidth]);

  useEffect(() => {
    document.addEventListener('mousemove', resize);
    document.addEventListener('mouseup', stopResize);
    return () => {
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };
  }, [resize, stopResize]);

  if (isCollapsed) {
    return (
      <div className="relative">
        <button
          onClick={() => onCollapse(false)}
          className={`absolute top-4 ${
            side === 'left' ? '-right-3' : '-left-3'
          } z-10 p-0.5 rounded-full ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-white hover:bg-gray-100 text-gray-600 shadow-sm'
          }`}
        >
          {side === 'left' ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: `${width}px` }}
    >
      <div
        ref={resizeRef}
        onMouseDown={startResize}
        className={`absolute ${
          side === 'left' ? 'right-0' : 'left-0'
        } top-0 bottom-0 w-1 cursor-col-resize group ${
          darkMode ? 'hover:bg-gray-600' : 'hover:bg-gray-300'
        }`}
      >
        <div className={`absolute top-0 bottom-0 ${
          side === 'left' ? '-right-0.5' : '-left-0.5'
        } w-px transition-colors ${
          isResizing
            ? darkMode ? 'bg-blue-500' : 'bg-blue-500'
            : darkMode ? 'bg-gray-700' : 'bg-gray-200'
        }`} />
      </div>

      <div className="h-full relative">
        <button
          onClick={() => onCollapse(true)}
          className={`absolute top-4 ${
            side === 'left' ? '-right-3' : '-left-3'
          } z-10 p-0.5 rounded-full ${
            darkMode
              ? 'bg-gray-700 hover:bg-gray-600 text-gray-300'
              : 'bg-white hover:bg-gray-100 text-gray-600 shadow-sm'
          }`}
        >
          {side === 'left' ? (
            <ChevronLeft className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        {children}
      </div>
    </div>
  );
}