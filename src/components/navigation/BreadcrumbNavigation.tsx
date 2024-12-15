import React, { useState, useRef } from 'react';
import { ChevronRight, Home, File, Folder, MoreVertical, Copy, FileSearch, Share2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface BreadcrumbSegment {
  label: string;
  type: 'file' | 'folder';
  path: string;
}

interface BreadcrumbNavigationProps {
  segments: BreadcrumbSegment[];
  onSegmentClick?: (segment: BreadcrumbSegment) => void;
  onAction?: (action: string, segment: BreadcrumbSegment) => void;
  className?: string;
}

export function BreadcrumbNavigation({
  segments,
  onSegmentClick,
  onAction,
  className
}: BreadcrumbNavigationProps) {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleContextMenu = (e: React.MouseEvent, segment: BreadcrumbSegment) => {
    e.preventDefault();
    setActiveMenu(segment.path);
  };

  const handleAction = (action: string, segment: BreadcrumbSegment) => {
    setActiveMenu(null);
    onAction?.(action, segment);
  };

  const SegmentIcon = ({ type }: { type: 'file' | 'folder' }) => {
    const Icon = type === 'file' ? File : Folder;
    return <Icon className="w-3.5 h-3.5" />;
  };

  return (
    <div className={cn(
      "h-9 flex items-center px-2 gap-1",
      "bg-gray-900/90 backdrop-blur-sm",
      "border-b border-gray-800",
      className
    )}>
      {/* Home Segment */}
      <button
        onClick={() => onSegmentClick?.({ label: 'Home', type: 'folder', path: '/' })}
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md",
          "text-sm text-gray-400 hover:text-gray-300",
          "hover:bg-gray-800/50 transition-colors duration-200"
        )}
      >
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </button>

      <ChevronRight className="w-4 h-4 text-gray-600" />

      {/* Path Segments */}
      {segments.map((segment, index) => (
        <React.Fragment key={segment.path}>
          <div className="relative">
            <button
              onClick={() => onSegmentClick?.(segment)}
              onContextMenu={(e) => handleContextMenu(e, segment)}
              className={cn(
                "group flex items-center gap-1 px-2 py-1 rounded-md",
                "text-sm transition-colors duration-200",
                index === segments.length - 1
                  ? "text-gray-200 bg-gray-800/50"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50"
              )}
            >
              <SegmentIcon type={segment.type} />
              <span>{segment.label}</span>
              <MoreVertical className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </button>

            {/* Context Menu */}
            {activeMenu === segment.path && (
              <div
                ref={menuRef}
                className={cn(
                  "absolute z-50 top-full left-0 mt-1",
                  "w-48 p-1 rounded-lg shadow-xl",
                  "bg-gray-900/95 backdrop-blur-sm",
                  "border border-gray-800",
                  "animate-in fade-in slide-in-from-top-2 duration-200"
                )}
              >
                <button
                  onClick={() => handleAction('reveal', segment)}
                  className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  <FileSearch className="w-4 h-4" />
                  Reveal in Explorer
                </button>
                <button
                  onClick={() => handleAction('copy-path', segment)}
                  className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  <Copy className="w-4 h-4" />
                  Copy Path
                </button>
                <button
                  onClick={() => handleAction('share', segment)}
                  className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            )}
          </div>
          {index < segments.length - 1 && (
            <ChevronRight className="w-4 h-4 text-gray-600" />
          )}
        </React.Fragment>
      ))}
    </div>
  );
} 