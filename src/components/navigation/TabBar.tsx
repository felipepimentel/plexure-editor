import React from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { File, X, Circle, Save, ChevronDown } from 'lucide-react';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  isDirty?: boolean;
  isPinned?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  onTabPin?: (tabId: string) => void;
  onTabSave?: (tabId: string) => void;
  onTabReorder?: (tabs: Tab[]) => void;
  className?: string;
}

export function TabBar({
  tabs = [],
  activeTab,
  onTabChange,
  onTabClose,
  onTabPin,
  onTabSave,
  onTabReorder,
  className
}: TabBarProps) {
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleTabs, setVisibleTabs] = React.useState<Tab[]>([]);
  const [overflowTabs, setOverflowTabs] = React.useState<Tab[]>([]);

  // Calculate visible and overflow tabs based on container width
  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      let currentWidth = 0;
      const tabWidth = 180; // Approximate width of each tab

      const visible: Tab[] = [];
      const overflow: Tab[] = [];

      (tabs || []).forEach((tab) => {
        if (currentWidth + tabWidth < containerWidth - 50) {
          visible.push(tab);
          currentWidth += tabWidth;
        } else {
          overflow.push(tab);
        }
      });

      setVisibleTabs(visible);
      setOverflowTabs(overflow);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [tabs]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center h-9",
        "bg-gray-900/50 border-b border-gray-800",
        className
      )}
    >
      <Reorder.Group
        axis="x"
        values={visibleTabs}
        onReorder={(newOrder) => {
          const reorderedTabs = [
            ...newOrder,
            ...overflowTabs
          ];
          onTabReorder?.(reorderedTabs);
        }}
        className="flex-1 flex items-center"
      >
        {visibleTabs.map((tab) => (
          <Reorder.Item
            key={tab.id}
            value={tab}
            className={cn(
              "group flex items-center gap-2",
              "min-w-[120px] max-w-[180px] h-9 px-3",
              "border-r border-gray-800",
              "cursor-default select-none",
              activeTab === tab.id
                ? "bg-gray-800"
                : "hover:bg-gray-800/50",
              "transition-colors duration-200"
            )}
          >
            <div className="flex-1 flex items-center gap-2 min-w-0">
              {tab.icon || <File className="w-4 h-4 text-gray-400" />}
              <span className="text-sm text-gray-200 truncate">
                {tab.label}
              </span>
              {tab.isDirty && (
                <Circle className="w-2 h-2 text-blue-400 fill-current flex-none" />
              )}
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              {tab.isDirty && onTabSave && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabSave(tab.id);
                  }}
                  className={cn(
                    "p-0.5 rounded",
                    "text-gray-400 hover:text-gray-300",
                    "hover:bg-gray-700",
                    "transition-colors duration-200"
                  )}
                >
                  <Save className="w-3.5 h-3.5" />
                </button>
              )}
              {onTabPin && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onTabPin(tab.id);
                  }}
                  className={cn(
                    "p-0.5 rounded",
                    "text-gray-400 hover:text-gray-300",
                    "hover:bg-gray-700",
                    "transition-colors duration-200"
                  )}
                >
                  <Circle className={cn(
                    "w-3.5 h-3.5",
                    tab.isPinned && "fill-current text-blue-400"
                  )} />
                </button>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose(tab.id);
                }}
                className={cn(
                  "p-0.5 rounded",
                  "text-gray-400 hover:text-gray-300",
                  "hover:bg-gray-700",
                  "transition-colors duration-200"
                )}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {overflowTabs.length > 0 && (
        <div className="relative flex-none">
          <button
            onClick={() => setIsOverflowMenuOpen(!isOverflowMenuOpen)}
            className={cn(
              "flex items-center justify-center",
              "w-8 h-9",
              "border-l border-gray-800",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800",
              "transition-colors duration-200"
            )}
          >
            <ChevronDown className="w-4 h-4" />
          </button>

          <AnimatePresence>
            {isOverflowMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsOverflowMenuOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className={cn(
                    "absolute top-full right-0 mt-1 z-50",
                    "w-64 py-1",
                    "bg-gray-800 border border-gray-700",
                    "rounded-md shadow-lg"
                  )}
                >
                  {overflowTabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => {
                        onTabChange(tab.id);
                        setIsOverflowMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2",
                        "flex items-center justify-between",
                        "text-sm",
                        activeTab === tab.id
                          ? "bg-gray-700/50 text-gray-200"
                          : "text-gray-400 hover:text-gray-300 hover:bg-gray-700/30",
                        "transition-colors duration-200",
                        "group"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {tab.icon || <File className="w-4 h-4 text-gray-400" />}
                        <span className="truncate">{tab.label}</span>
                        {tab.isDirty && (
                          <Circle className="w-2 h-2 text-blue-400 fill-current flex-none" />
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        {tab.isDirty && onTabSave && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onTabSave(tab.id);
                            }}
                            className={cn(
                              "p-0.5 rounded",
                              "text-gray-400 hover:text-gray-300",
                              "hover:bg-gray-700",
                              "transition-colors duration-200"
                            )}
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onTabClose(tab.id);
                          }}
                          className={cn(
                            "p-0.5 rounded",
                            "text-gray-400 hover:text-gray-300",
                            "hover:bg-gray-700",
                            "transition-colors duration-200"
                          )}
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
} 