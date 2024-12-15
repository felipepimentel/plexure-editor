import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/utils/cn';

interface MinimapProps {
  content: string;
  scrollPosition: number;
  viewportHeight: number;
  totalHeight: number;
  onScroll: (scrollTop: number) => void;
  className?: string;
}

export function Minimap({
  content,
  scrollPosition,
  viewportHeight,
  totalHeight,
  onScroll,
  className
}: MinimapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lines, setLines] = useState<string[]>([]);
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);

  // Calculate dimensions
  const scale = 0.2; // 20% of original size
  const minimapHeight = totalHeight * scale;
  const sliderHeight = (viewportHeight / totalHeight) * minimapHeight;
  const sliderPosition = (scrollPosition / totalHeight) * minimapHeight;

  // Process content into lines on mount
  useEffect(() => {
    setLines(content.split('\n'));
  }, [content]);

  // Handle mouse interactions
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    document.body.style.userSelect = 'none';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const y = Math.max(0, Math.min(e.clientY - rect.top, minimapHeight - sliderHeight));
    const scrollTop = (y / minimapHeight) * totalHeight;
    onScroll(scrollTop);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  // Add/remove event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Handle click to scroll
  const handleClick = (e: React.MouseEvent) => {
    if (!containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const scrollTop = (y / minimapHeight) * totalHeight;
    onScroll(scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative select-none",
        "border-l border-gray-800",
        className
      )}
      style={{ height: minimapHeight }}
      onClick={handleClick}
      onMouseLeave={() => setHoveredLine(null)}
    >
      {/* Code Preview */}
      <div 
        className="absolute inset-0 overflow-hidden opacity-30"
        style={{ 
          transform: `scale(${scale})`,
          transformOrigin: 'top left'
        }}
      >
        {lines.map((line, index) => (
          <div
            key={index}
            className={cn(
              "px-2 py-0.5 whitespace-pre font-mono text-xs",
              hoveredLine === index && "bg-blue-500/20"
            )}
            onMouseEnter={() => setHoveredLine(index)}
          >
            {line || ' '}
          </div>
        ))}
      </div>

      {/* Viewport Slider */}
      <div
        className={cn(
          "absolute right-0 w-2",
          "bg-blue-500/20 hover:bg-blue-500/30",
          "transition-colors duration-200",
          isDragging && "bg-blue-500/40"
        )}
        style={{
          height: sliderHeight,
          transform: `translateY(${sliderPosition}px)`
        }}
        onMouseDown={handleMouseDown}
      >
        {/* Slider Handle */}
        <div className={cn(
          "absolute inset-y-0 -left-0.5 w-0.5",
          "bg-blue-500",
          "transition-opacity duration-200",
          isDragging ? "opacity-100" : "opacity-0"
        )} />
      </div>

      {/* Hover Indicator */}
      {hoveredLine !== null && (
        <div
          className="absolute left-0 h-px bg-blue-500/50"
          style={{
            top: hoveredLine * scale,
            width: '2px'
          }}
        />
      )}
    </div>
  );
} 