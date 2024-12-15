import React from 'react';
import { X, CircleDot, FileCode, Pin, Copy, FileSearch, Share2, PanelLeftClose, PanelRightClose } from 'lucide-react';
import { cn } from '@/utils/cn';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Tab {
  id: string;
  title: string;
  path: string;
  icon?: React.ElementType;
  isDirty?: boolean;
  isPinned?: boolean;
}

interface TabBarProps {
  tabs: Tab[];
  activeTabId?: string;
  onTabSelect?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onTabsReorder?: (oldIndex: number, newIndex: number) => void;
  onTabAction?: (action: string, tab: Tab) => void;
  className?: string;
}

// SortableTab component
const SortableTab = ({ 
  tab, 
  isActive,
  onSelect,
  onClose,
  onAction
}: { 
  tab: Tab; 
  isActive: boolean;
  onSelect: () => void;
  onClose: () => void;
  onAction: (action: string) => void;
}) => {
  const [showContextMenu, setShowContextMenu] = React.useState(false);
  const [contextMenuPosition, setContextMenuPosition] = React.useState({ x: 0, y: 0 });
  const contextMenuRef = React.useRef<HTMLDivElement>(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: tab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setShowContextMenu(true);
  };

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(e.target as Node)) {
        setShowContextMenu(false);
      }
    };

    if (showContextMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showContextMenu]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex-none"
    >
      <div
        onClick={onSelect}
        onContextMenu={handleContextMenu}
        className={cn(
          "group relative h-9 flex items-center gap-2 px-3",
          "border-r border-gray-800",
          "transition-colors duration-200",
          isActive
            ? "bg-gray-800/50 text-gray-200"
            : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
        )}
      >
        {/* Tab Icon */}
        {tab.icon ? (
          <tab.icon className="w-4 h-4 flex-none" />
        ) : (
          <FileCode className="w-4 h-4 flex-none" />
        )}

        {/* Tab Title */}
        <span className="text-sm truncate max-w-[120px]">
          {tab.title}
        </span>

        {/* Dirty Indicator */}
        {tab.isDirty && (
          <CircleDot className="w-3 h-3 flex-none text-blue-400" />
        )}

        {/* Tab Actions */}
        <div className={cn(
          "absolute right-1 top-1/2 -translate-y-1/2",
          "flex items-center gap-0.5",
          "opacity-0 group-hover:opacity-100",
          "transition-opacity duration-200"
        )}>
          {/* Pin Button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAction('pin');
            }}
            className={cn(
              "p-1 rounded-sm",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-700/50",
              "transition-colors duration-200",
              tab.isPinned && "text-blue-400 hover:text-blue-300"
            )}
          >
            <Pin className="w-3 h-3" />
          </button>

          {/* Close Button */}
          {!tab.isPinned && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
              className={cn(
                "p-1 rounded-sm",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-700/50",
                "transition-colors duration-200"
              )}
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Context Menu */}
      {showContextMenu && (
        <div
          ref={contextMenuRef}
          className={cn(
            "fixed z-50",
            "w-64 p-1",
            "bg-gray-900/95 backdrop-blur-sm",
            "border border-gray-800 rounded-lg shadow-xl",
            "divide-y divide-gray-800",
            "animate-in fade-in zoom-in-95 duration-100"
          )}
          style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
        >
          <div className="space-y-1">
            <button
              onClick={() => {
                onAction('reveal');
                setShowContextMenu(false);
              }}
              className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            >
              <FileSearch className="w-4 h-4" />
              Reveal in Explorer
            </button>
            <button
              onClick={() => {
                onAction('copy-path');
                setShowContextMenu(false);
              }}
              className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            >
              <Copy className="w-4 h-4" />
              Copy Path
            </button>
            <button
              onClick={() => {
                onAction('share');
                setShowContextMenu(false);
              }}
              className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            >
              <Share2 className="w-4 h-4" />
              Share
            </button>
          </div>
          <div className="space-y-1 pt-1">
            <button
              onClick={() => {
                onAction('close-others');
                setShowContextMenu(false);
              }}
              className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            >
              <PanelLeftClose className="w-4 h-4" />
              Close Others
            </button>
            <button
              onClick={() => {
                onAction('close-right');
                setShowContextMenu(false);
              }}
              className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            >
              <PanelRightClose className="w-4 h-4" />
              Close to the Right
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export function TabBar({
  tabs,
  activeTabId,
  onTabSelect,
  onTabClose,
  onTabsReorder,
  onTabAction,
  className
}: TabBarProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex(tab => tab.id === active.id);
      const newIndex = tabs.findIndex(tab => tab.id === over.id);
      onTabsReorder?.(oldIndex, newIndex);
    }
  };

  return (
    <div className={cn("flex items-center h-9 bg-gray-900/95 backdrop-blur-sm", className)}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex items-center overflow-x-auto">
          <SortableContext
            items={tabs.map(tab => tab.id)}
            strategy={horizontalListSortingStrategy}
          >
            {tabs.map(tab => (
              <SortableTab
                key={tab.id}
                tab={tab}
                isActive={tab.id === activeTabId}
                onSelect={() => onTabSelect?.(tab.id)}
                onClose={() => onTabClose?.(tab.id)}
                onAction={(action) => onTabAction?.(action, tab)}
              />
            ))}
          </SortableContext>
        </div>
      </DndContext>
    </div>
  );
} 