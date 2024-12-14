import React, { useState, useRef, useEffect } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
  delay?: number;
}

export function Tooltip({ 
  children, 
  content, 
  side = 'top', 
  align = 'center',
  delay = 200 
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const showTooltip = () => {
    timeoutRef.current = setTimeout(() => {
      if (triggerRef.current && tooltipRef.current) {
        const triggerRect = triggerRef.current.getBoundingClientRect();
        const tooltipRect = tooltipRef.current.getBoundingClientRect();
        
        let x = 0;
        let y = 0;

        // Calculate position based on side
        switch (side) {
          case 'top':
            y = triggerRect.top - tooltipRect.height - 8;
            break;
          case 'bottom':
            y = triggerRect.bottom + 8;
            break;
          case 'left':
            x = triggerRect.left - tooltipRect.width - 8;
            y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            break;
          case 'right':
            x = triggerRect.right + 8;
            y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
            break;
        }

        // Calculate horizontal alignment for top/bottom
        if (side === 'top' || side === 'bottom') {
          switch (align) {
            case 'start':
              x = triggerRect.left;
              break;
            case 'center':
              x = triggerRect.left + (triggerRect.width - tooltipRect.width) / 2;
              break;
            case 'end':
              x = triggerRect.right - tooltipRect.width;
              break;
          }
        }

        // Calculate vertical alignment for left/right
        if (side === 'left' || side === 'right') {
          switch (align) {
            case 'start':
              y = triggerRect.top;
              break;
            case 'center':
              y = triggerRect.top + (triggerRect.height - tooltipRect.height) / 2;
              break;
            case 'end':
              y = triggerRect.bottom - tooltipRect.height;
              break;
          }
        }

        // Ensure tooltip stays within viewport
        const viewport = {
          width: window.innerWidth,
          height: window.innerHeight
        };

        // Adjust horizontal position
        if (x < 0) x = 8;
        if (x + tooltipRect.width > viewport.width) {
          x = viewport.width - tooltipRect.width - 8;
        }

        // Adjust vertical position
        if (y < 0) y = 8;
        if (y + tooltipRect.height > viewport.height) {
          y = viewport.height - tooltipRect.height - 8;
        }

        setPosition({ x, y });
        setIsVisible(true);
      }
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={triggerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      className="inline-block"
    >
      {children}
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 px-2 py-1 text-xs font-medium text-white bg-gray-900 rounded shadow-lg border border-gray-800 pointer-events-none select-none whitespace-nowrap"
          style={{
            left: position.x,
            top: position.y,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
} 