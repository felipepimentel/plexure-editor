import React from 'react';
import { cn } from '@/utils/cn';
import { ChevronRight, Folder, File, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BreadcrumbItem {
  id: string;
  label: string;
  type: 'folder' | 'file';
  children?: BreadcrumbItem[];
}

interface BreadcrumbProps {
  items?: BreadcrumbItem[];
  onNavigate?: (itemId: string) => void;
  className?: string;
}

interface BreadcrumbDropdownProps {
  item: BreadcrumbItem;
  onSelect: (itemId: string) => void;
}

function BreadcrumbDropdown({ item, onSelect }: BreadcrumbDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-1 px-1.5 py-1 rounded",
          "text-sm text-gray-300",
          "hover:bg-gray-800",
          "transition-colors duration-200",
          "group"
        )}
      >
        {item.type === 'folder' ? (
          <Folder className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
        ) : (
          <File className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
        )}
        <span>{item.label}</span>
        {item.children && item.children.length > 0 && (
          <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && item.children && item.children.length > 0 && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute top-full left-0 mt-1 z-50",
                "w-48 py-1",
                "bg-gray-800 border border-gray-700",
                "rounded-md shadow-lg"
              )}
            >
              {item.children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => {
                    onSelect(child.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2",
                    "flex items-center gap-2",
                    "text-sm text-gray-200",
                    "hover:bg-gray-700/50",
                    "transition-colors duration-200",
                    "group"
                  )}
                >
                  {child.type === 'folder' ? (
                    <Folder className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                  ) : (
                    <File className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                  )}
                  {child.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function BreadcrumbNavigation({ items = [], onNavigate, className }: BreadcrumbProps) {
  const [isOverflowMenuOpen, setIsOverflowMenuOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [visibleItems, setVisibleItems] = React.useState<BreadcrumbItem[]>([]);
  const [overflowItems, setOverflowItems] = React.useState<BreadcrumbItem[]>([]);

  // Calculate visible and overflow items based on container width
  React.useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver(() => {
      const container = containerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      let currentWidth = 0;
      const itemWidth = 120; // Approximate width of each item

      const visible: BreadcrumbItem[] = [];
      const overflow: BreadcrumbItem[] = [];

      items.forEach((item, index) => {
        if (currentWidth + itemWidth < containerWidth - 100) {
          visible.push(item);
          currentWidth += itemWidth;
        } else {
          overflow.push(item);
        }
      });

      setVisibleItems(visible);
      setOverflowItems(overflow);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [items]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "flex items-center h-9 px-2",
        "overflow-hidden",
        className
      )}
    >
      {overflowItems.length > 0 && (
        <div className="relative">
          <button
            onClick={() => setIsOverflowMenuOpen(!isOverflowMenuOpen)}
            className={cn(
              "flex items-center justify-center",
              "w-6 h-6 rounded",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800",
              "transition-colors duration-200"
            )}
          >
            <MoreHorizontal className="w-4 h-4" />
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
                    "absolute top-full left-0 mt-1 z-50",
                    "w-48 py-1",
                    "bg-gray-800 border border-gray-700",
                    "rounded-md shadow-lg"
                  )}
                >
                  {overflowItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate?.(item.id);
                        setIsOverflowMenuOpen(false);
                      }}
                      className={cn(
                        "w-full px-3 py-2",
                        "flex items-center gap-2",
                        "text-sm text-gray-200",
                        "hover:bg-gray-700/50",
                        "transition-colors duration-200",
                        "group"
                      )}
                    >
                      {item.type === 'folder' ? (
                        <Folder className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                      ) : (
                        <File className="w-4 h-4 text-gray-400 group-hover:text-gray-300" />
                      )}
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      )}

      {visibleItems.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 mx-1 text-gray-600 flex-none" />
          )}
          <BreadcrumbDropdown
            item={item}
            onSelect={(itemId) => {
              onNavigate?.(itemId);
            }}
          />
        </React.Fragment>
      ))}
    </div>
  );
} 