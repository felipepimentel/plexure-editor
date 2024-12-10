import React, { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ResizablePanelProps {
  children: React.ReactNode;
  side: 'left' | 'right';
  defaultWidth?: number;
  minWidth?: number;
  maxWidth?: number;
  darkMode: boolean;
  isCollapsed?: boolean;
  onCollapse?: () => void;
  onExpand?: () => void;
}

export function ResizablePanel({
  children,
  side,
  defaultWidth = 320,
  minWidth = 200,
  maxWidth = 600,
  darkMode,
  isCollapsed = false,
  onCollapse,
  onExpand
}: ResizablePanelProps) {
  const [width, setWidth] = useState(defaultWidth);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = width;

    const handleMouseMove = (e: MouseEvent) => {
      const delta = side === 'left' ? e.clientX - startX : startX - e.clientX;
      const newWidth = Math.min(Math.max(startWidth + delta, minWidth), maxWidth);
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [width, side, minWidth, maxWidth]);

  if (isCollapsed) {
    return (
      <div className={`flex-none w-8 ${side === 'left' ? 'border-r' : 'border-l'} ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <button
          onClick={onExpand}
          className={`w-full h-8 flex items-center justify-center hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          {side === 'left' ? (
            <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          ) : (
            <ChevronLeft className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          )}
        </button>
      </div>
    );
  }

  return (
    <div 
      className="relative flex-none"
      style={{ width }}
    >
      {children}
      
      <div
        className={`absolute ${side === 'left' ? '-right-1' : '-left-1'} top-0 bottom-0 w-2 cursor-col-resize group`}
        onMouseDown={handleMouseDown}
      >
        <div className={`absolute ${side === 'left' ? 'right-0' : 'left-0'} top-0 bottom-0 w-px transition-colors ${
          darkMode ? 'bg-gray-700 group-hover:bg-blue-500' : 'bg-gray-200 group-hover:bg-blue-400'
        }`} />
      </div>

      <button
        onClick={onCollapse}
        className={`absolute ${side === 'left' ? 'right-2' : 'left-2'} top-2 p-1 rounded hover:bg-opacity-80 ${
          darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
        }`}
      >
        {side === 'left' ? (
          <ChevronLeft className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        ) : (
          <ChevronRight className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        )}
      </button>
    </div>
  );
}