import React, { useCallback, useRef } from 'react';

interface ResizeHandleProps {
  darkMode: boolean;
  onResize: (delta: number) => void;
}

export function ResizeHandle({ darkMode, onResize }: ResizeHandleProps) {
  const startXRef = useRef<number | null>(null);
  const lastDeltaRef = useRef(0);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    startXRef.current = e.clientX;
    lastDeltaRef.current = 0;

    const handleMouseMove = (e: MouseEvent) => {
      if (startXRef.current === null) return;

      const currentDelta = e.clientX - startXRef.current;
      const deltaDiff = currentDelta - lastDeltaRef.current;
      
      if (deltaDiff !== 0) {
        onResize(deltaDiff);
        lastDeltaRef.current = currentDelta;
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
      startXRef.current = null;
      lastDeltaRef.current = 0;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  }, [onResize]);

  return (
    <div
      className="w-1 flex-shrink-0 cursor-col-resize group relative"
      onMouseDown={handleMouseDown}
    >
      <div className="absolute inset-0 w-4 -left-1.5 group-hover:bg-blue-500/10" />
      <div className={`absolute inset-y-0 w-px left-0 transition-colors ${
        darkMode 
          ? 'bg-gray-700 group-hover:bg-blue-500'
          : 'bg-gray-200 group-hover:bg-blue-400'
      }`} />
    </div>
  );
}