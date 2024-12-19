import React from 'react';
import { cn } from '../lib/utils';
import {
  FileJson,
  FileCode,
  X,
  Plus,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Save,
  Copy,
  Trash,
  FileDown
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface Tab {
  id: string;
  name: string;
  path: string;
  isModified: boolean;
  type: 'yaml' | 'json';
}

interface TabsBarProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onNewTab: () => void;
  onSaveTab: (tabId: string) => void;
  onDuplicateTab: (tabId: string) => void;
  onDownloadTab: (tabId: string) => void;
  className?: string;
}

export const TabsBar: React.FC<TabsBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  onTabClose,
  onNewTab,
  onSaveTab,
  onDuplicateTab,
  onDownloadTab,
  className
}) => {
  const [scrollPosition, setScrollPosition] = React.useState(0);
  const [showTabMenu, setShowTabMenu] = React.useState<string | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    const container = scrollContainerRef.current;
    const scrollAmount = direction === 'left' ? -200 : 200;
    container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    setScrollPosition(container.scrollLeft + scrollAmount);
  };

  const handleTabContextMenu = (e: React.MouseEvent, tabId: string) => {
    e.preventDefault();
    setShowTabMenu(showTabMenu === tabId ? null : tabId);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showTabMenu) {
        setShowTabMenu(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [showTabMenu]);

  return (
    <div className={cn(
      'flex items-center h-9 border-b bg-muted/50',
      className
    )}>
      {/* Scroll left button */}
      <button
        onClick={() => handleScroll('left')}
        className={cn(
          'flex-shrink-0 p-1 hover:bg-muted transition-colors',
          scrollPosition <= 0 && 'opacity-50 cursor-not-allowed'
        )}
        disabled={scrollPosition <= 0}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {/* Tabs container */}
      <div
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto scrollbar-none"
        onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
      >
        <div className="flex items-center min-w-max">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className="relative group"
              onContextMenu={(e) => handleTabContextMenu(e, tab.id)}
            >
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-1.5 border-r',
                  'hover:bg-background/50 transition-colors',
                  activeTab === tab.id && 'bg-background text-foreground',
                  'group relative'
                )}
              >
                {tab.type === 'yaml' ? (
                  <FileCode className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <FileJson className="h-4 w-4 text-muted-foreground" />
                )}
                <span className="text-sm">
                  {tab.name}
                  {tab.isModified && (
                    <span className="ml-1 text-muted-foreground">•</span>
                  )}
                </span>
                <Tooltip content="Close">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onTabClose(tab.id);
                    }}
                    className={cn(
                      'p-0.5 rounded-sm opacity-0 group-hover:opacity-100',
                      'hover:bg-muted transition-opacity'
                    )}
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Tooltip>
              </button>

              {/* Tab context menu */}
              {showTabMenu === tab.id && (
                <div className="absolute top-full left-0 mt-1 w-48 rounded-md border bg-popover p-1 shadow-md z-50">
                  <button
                    onClick={() => {
                      onSaveTab(tab.id);
                      setShowTabMenu(null);
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted"
                  >
                    <Save className="h-4 w-4" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      onDuplicateTab(tab.id);
                      setShowTabMenu(null);
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </button>
                  <button
                    onClick={() => {
                      onDownloadTab(tab.id);
                      setShowTabMenu(null);
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted"
                  >
                    <FileDown className="h-4 w-4" />
                    Download
                  </button>
                  <div className="h-px bg-border my-1" />
                  <button
                    onClick={() => {
                      onTabClose(tab.id);
                      setShowTabMenu(null);
                    }}
                    className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted text-destructive"
                  >
                    <Trash className="h-4 w-4" />
                    Close
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Scroll right button */}
      <button
        onClick={() => handleScroll('right')}
        className={cn(
          'flex-shrink-0 p-1 hover:bg-muted transition-colors',
          scrollPosition >= (scrollContainerRef.current?.scrollWidth || 0) - (scrollContainerRef.current?.clientWidth || 0) &&
          'opacity-50 cursor-not-allowed'
        )}
        disabled={scrollPosition >= (scrollContainerRef.current?.scrollWidth || 0) - (scrollContainerRef.current?.clientWidth || 0)}
      >
        <ChevronRight className="h-4 w-4" />
      </button>

      {/* New tab button */}
      <Tooltip content="New File">
        <button
          onClick={onNewTab}
          className="flex-shrink-0 p-2 hover:bg-muted transition-colors border-l"
        >
          <Plus className="h-4 w-4" />
        </button>
      </Tooltip>
    </div>
  );
};

export default TabsBar; 