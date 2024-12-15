import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Command, 
  Settings, 
  HelpCircle, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  PanelLeft,
  PanelRight,
  LayoutTemplate,
  Maximize2,
  Minimize2,
  Monitor,
  Moon,
  Sun,
  Sidebar,
  Layout,
  ChevronRight as ChevronRightIcon,
  Home,
  File,
  Folder,
  Split,
  Columns,
  Maximize,
  PanelLeftClose,
  PanelRightClose,
  Map,
  Code,
  MoreVertical,
  Copy,
  Trash,
  Save,
  FileCode,
  Plus,
  XCircle,
  CircleDot,
  RefreshCw,
  Search,
  Settings2,
  Terminal,
  GitBranch,
  GitMerge,
  GitPullRequest,
  FileSearch,
  FilePlus,
  FileEdit,
  Keyboard,
  Palette,
  Zap,
  Wrench,
  Bug,
  Play,
  Download,
  Upload,
  Share2,
  BookOpen,
  Bookmark,
  GripVertical,
  ArrowLeftRight,
  ArrowUpDown,
  LayoutGrid,
  Combine,
  SplitSquareHorizontal,
  SplitSquareVertical,
  Rows,
  Columns as ColumnsIcon,
  Maximize as MaximizeIcon,
  Minimize as MinimizeIcon,
  PanelTop,
  PanelBottom,
  PanelLeftOpen,
  PanelRightOpen,
  Focus,
  Grid,
  Grid2x2,
  Grid3x3,
  LayoutPanelLeft,
  LayoutPanelTop,
  LayoutDashboard,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  MoveHorizontal,
  MoveVertical,
  Maximize as MaxIcon,
  Minimize as MinIcon,
  RotateCcw,
  RotateCw,
  Divide,
  Lock,
  Unlock,
  Pin,
  PinOff,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { StatusBar } from '@/components/statusbar/StatusBar';
import { CommandPalette } from '@/components/ui/CommandPalette';
import { useKeyboardShortcuts } from '@/contexts/KeyboardShortcutsContext';
import { useTheme } from '@/contexts/ThemeContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { Tooltip } from '@/components/ui/Tooltip';
import { ActivityBar } from '@/components/navigation/ActivityBar';
import { SidebarManager } from '@/components/navigation/SidebarManager';
import { RightSidebarManager } from '@/components/sidebar/RightSidebarManager';
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
import { BreadcrumbNavigation } from '@/components/navigation/BreadcrumbNavigation';
import { TabBar } from '@/components/navigation/TabBar';
import { QuickDiffViewer } from '@/components/editor/QuickDiffViewer';
import { SearchResultsPanel } from '@/components/search/SearchResultsPanel';
import { Project, ApiContract, StyleGuide, ValidationResult } from '@/types/project';
import { useStyleGuideValidation } from '@/hooks/useStyleGuideValidation';
import { validateOpenAPI } from '@/utils/swagger';
import { ValidationPanel } from '@/components/validation/ValidationPanel';
import { GatesPanel } from '@/components/gates/GatesPanel';
import { CollaborationPanel } from '@/components/collaboration/CollaborationPanel';

interface EditorTab {
  id: string;
  title: string;
  path: string;
  icon?: React.ElementType;
  isDirty?: boolean;
  isPinned?: boolean;
}

interface EditorGroup {
  id: string;
  tabs: EditorTab[];
  activeTabId?: string;
  layout: 'horizontal' | 'vertical';
  size?: number;
  gridArea?: string;
  isLocked?: boolean;
  isPinned?: boolean;
  ratio?: number;
  minSize?: number;
  maxSize?: number;
}

type GridLayout = '1x1' | '1x2' | '2x1' | '2x2' | '3x1' | '1x3' | '3x3';

interface MainLayoutProps {
  children: React.ReactNode;
  content?: string;
  filePath?: string;
  tabs?: EditorTab[];
  activeTabId?: string;
  onTabChange?: (tabId: string) => void;
  onTabClose?: (tabId: string) => void;
  onTabPin?: (tabId: string) => void;
  groups?: EditorGroup[];
  activeGroupId?: string;
  onGroupChange?: (groupId: string) => void;
  onTabMove?: (tabId: string, sourceGroupId: string, targetGroupId: string) => void;
  onTabReorder?: (sourceIndex: number, targetIndex: number) => void;
  onLayoutChange?: (layout: 'horizontal' | 'vertical') => void;
  onGroupSizeChange?: (groupId: string, size: number) => void;
  onGridLayoutChange?: (layout: GridLayout) => void;
  onGroupLock?: (groupId: string, locked: boolean) => void;
  onGroupPin?: (groupId: string, pinned: boolean) => void;
  projects?: Project[];
  activeProject?: Project;
  contracts?: ApiContract[];
  activeContract?: ApiContract;
  styleGuides?: StyleGuide[];
  activeStyleGuide?: StyleGuide;
  onProjectChange?: (projectId: string) => void;
  onContractChange?: (contractId: string) => void;
  onStyleGuideChange?: (guideId: string) => void;
}

const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 480;

// Quick Action type
interface QuickAction {
  id: string;
  icon: React.ElementType;
  label: string;
  shortcut?: string;
  category: 'editor' | 'git' | 'tools' | 'view' | 'help';
  action: () => void;
}

// Add SortableTab component before MainLayout
const SortableTab = ({ tab, isActive }: { tab: EditorTab; isActive: boolean }) => {
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

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex-none"
    >
      <EditorTab
        tab={tab}
        isActive={isActive}
      />
    </div>
  );
};

// Add new interfaces
interface Gate {
  id: string;
  name: string;
  description: string;
  type: 'validation' | 'approval' | 'custom';
  status: 'pending' | 'passed' | 'failed';
  validate: () => Promise<boolean>;
}

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  path?: string;
  line?: number;
}

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  status: 'online' | 'offline';
}

export function MainLayout({ 
  children, 
  content = '', 
  filePath = '',
  tabs = [],
  activeTabId,
  onTabChange,
  onTabClose,
  onTabPin,
  groups = [],
  activeGroupId,
  onGroupChange,
  onTabMove,
  onTabReorder,
  onLayoutChange,
  onGroupSizeChange,
  onGridLayoutChange,
  onGroupLock,
  onGroupPin,
  projects = [],
  activeProject,
  contracts = [],
  activeContract,
  styleGuides = [],
  activeStyleGuide,
  onProjectChange,
  onContractChange,
  onStyleGuideChange
}: MainLayoutProps) {
  const { theme, setTheme } = useTheme();
  const { preferences, updatePreference } = usePreferences();
  const { registerShortcut } = useKeyboardShortcuts();
  
  // UI State
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [currentActivity, setCurrentActivity] = useState<'explorer' | 'search' | 'history' | 'settings' | 'help'>('explorer');
  const [isHeaderMenuOpen, setIsHeaderMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isQuickDiffVisible, setIsQuickDiffVisible] = useState(false);
  const [diffHunks, setDiffHunks] = useState<any[]>([]);
  
  // Search state
  const [isSearchPanelOpen, setIsSearchPanelOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Sidebar State
  const [leftSidebarCollapsed, setLeftSidebarCollapsed] = useState(false);
  const [rightSidebarCollapsed, setRightSidebarCollapsed] = useState(false);
  const [leftSidebarWidth, setLeftSidebarWidth] = useState(320);
  const [rightSidebarWidth, setRightSidebarWidth] = useState(384);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const headerMenuRef = useRef<HTMLDivElement>(null);

  // Editor layout state
  const [editorLayout, setEditorLayout] = useState<'single' | 'split'>('single');
  const [maximizedEditor, setMaximizedEditor] = useState(false);
  
  // New state for editor features
  const [isMinimapVisible, setIsMinimapVisible] = useState(true);
  const [isQuickActionsOpen, setIsQuickActionsOpen] = useState(false);
  const [quickActionsAnchor, setQuickActionsAnchor] = useState<{ x: number; y: number } | null>(null);
  
  // Quick actions
  const quickActions: QuickAction[] = [
    // Editor Actions
    {
      id: 'format',
      icon: Code,
      label: 'Format Document',
      shortcut: '⇧⌥F',
      category: 'editor',
      action: () => {}
    },
    {
      id: 'search-replace',
      icon: Search,
      label: 'Search and Replace',
      shortcut: '⌘⇧F',
      category: 'editor',
      action: () => {}
    },
    {
      id: 'toggle-preview',
      icon: Play,
      label: 'Toggle Preview',
      shortcut: '⌘K V',
      category: 'view',
      action: () => {}
    },
    {
      id: 'validate',
      icon: Zap,
      label: 'Validate Schema',
      category: 'tools',
      action: () => {}
    },
    {
      id: 'git-branch',
      icon: GitBranch,
      label: 'Create Branch',
      category: 'git',
      action: () => {}
    },
    {
      id: 'git-merge',
      icon: GitMerge,
      label: 'Merge Changes',
      category: 'git',
      action: () => {}
    },
    {
      id: 'terminal',
      icon: Terminal,
      label: 'Open Terminal',
      shortcut: '⌘`',
      category: 'tools',
      action: () => {}
    },
    {
      id: 'settings',
      icon: Settings2,
      label: 'Open Settings',
      shortcut: '⌘,',
      category: 'tools',
      action: () => setIsSettingsOpen(true)
    },
    {
      id: 'keyboard-shortcuts',
      icon: Keyboard,
      label: 'Keyboard Shortcuts',
      shortcut: '⌘K ⌘S',
      category: 'help',
      action: () => {}
    },
    {
      id: 'documentation',
      icon: BookOpen,
      label: 'Documentation',
      category: 'help',
      action: () => {}
    }
  ];

  // Editor group state
  const [groupLayout, setGroupLayout] = useState<'horizontal' | 'vertical'>('horizontal');
  const [isResizingGroup, setIsResizingGroup] = useState(false);
  const [resizingGroupId, setResizingGroupId] = useState<string | null>(null);
  const [groupSizes, setGroupSizes] = useState<Record<string, number>>({});

  // New state for advanced layout features
  const [gridLayout, setGridLayout] = useState<GridLayout>('1x1');
  const [isGridMode, setIsGridMode] = useState(false);
  const [lockedGroups, setLockedGroups] = useState<Set<string>>(new Set());
  const [pinnedGroups, setPinnedGroups] = useState<Set<string>>(new Set());
  const [groupRatios, setGroupRatios] = useState<Record<string, number>>({});
  const [isDraggingGroup, setIsDraggingGroup] = useState(false);
  const [draggedGroupId, setDraggedGroupId] = useState<string | null>(null);

  // Layout presets
  const layoutPresets = {
    'single': { grid: '1x1', name: 'Single' },
    'sideBySide': { grid: '1x2', name: 'Side by Side' },
    'topBottom': { grid: '2x1', name: 'Top and Bottom' },
    'grid2x2': { grid: '2x2', name: '2x2 Grid' },
    'threeColumns': { grid: '1x3', name: 'Three Columns' },
    'threeRows': { grid: '3x1', name: 'Three Rows' },
    'grid3x3': { grid: '3x3', name: '3x3 Grid' }
  };

  // Enhanced keyboard shortcuts
  useEffect(() => {
    const shortcuts = [
      { key: '⌘+B', description: 'Toggle left sidebar', action: () => setLeftSidebarCollapsed(prev => !prev) },
      { key: '⌘+\\', description: 'Toggle right sidebar', action: () => setRightSidebarCollapsed(prev => !prev) },
      { key: '⌘+P', description: 'Open command palette', action: () => setIsCommandPaletteOpen(true) },
      { key: '⌘+E', description: 'Focus explorer', action: () => setCurrentActivity('explorer') },
      { key: '⌘+F', description: 'Focus search', action: () => setCurrentActivity('search') },
      { key: '⌘+,', description: 'Open settings', action: () => setIsSettingsOpen(true) },
      { key: '⌘+/', description: 'Open help', action: () => setIsHelpOpen(true) },
      { 
        key: 'Escape', 
        description: 'Close menus', 
        action: () => {
          setIsHeaderMenuOpen(false);
          setIsCommandPaletteOpen(false);
          setIsSettingsOpen(false);
          setIsHelpOpen(false);
        } 
      },
      { key: '⌘+\\', description: 'Split editor', action: () => setEditorLayout(l => l === 'single' ? 'split' : 'single') },
      { key: '⌘+M', description: 'Toggle maximize editor', action: () => setMaximizedEditor(m => !m) },
      { key: '⌘+B', description: 'Toggle minimap', action: () => setIsMinimapVisible(v => !v) },
      { key: '⌘+.', description: 'Show quick actions', action: () => setIsQuickActionsOpen(true) },
    ];

    shortcuts.forEach(shortcut => registerShortcut(shortcut));
  }, [registerShortcut]);

  // Handle sidebar resizing with smooth transitions
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      if (isResizingLeft) {
        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, e.clientX - containerRect.left)
        );
        requestAnimationFrame(() => setLeftSidebarWidth(newWidth));
      }

      if (isResizingRight) {
        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, containerRect.right - e.clientX)
        );
        requestAnimationFrame(() => setRightSidebarWidth(newWidth));
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
      document.body.style.cursor = '';
    };

    if (isResizingLeft || isResizingRight) {
      document.body.style.cursor = 'col-resize';
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.body.style.cursor = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  // Handle click outside header menu
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target as Node)) {
        setIsHeaderMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Layout actions
  const toggleLeftSidebar = () => setLeftSidebarCollapsed(prev => !prev);
  const toggleRightSidebar = () => setRightSidebarCollapsed(prev => !prev);
  const resetLayout = () => {
    setLeftSidebarWidth(320);
    setRightSidebarWidth(384);
    setLeftSidebarCollapsed(false);
    setRightSidebarCollapsed(false);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Error toggling fullscreen:', err);
    }
  };

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  // Render header action button
  const HeaderAction = ({ 
    icon: Icon, 
    label, 
    onClick, 
    shortcut,
    active = false
  }: { 
    icon: React.ElementType; 
    label: string; 
    onClick: () => void; 
    shortcut?: string;
    active?: boolean;
  }) => (
    <Tooltip content={shortcut ? `${label} (${shortcut})` : label}>
      <button
        onClick={onClick}
        className={cn(
          "p-2 rounded-md transition-all duration-200",
          "hover:bg-gray-800/80 active:scale-95",
          active
            ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
            : "text-gray-400 hover:text-gray-300"
        )}
      >
        <Icon className="w-4 h-4" />
      </button>
    </Tooltip>
  );

  // Render breadcrumb segment
  const BreadcrumbSegment = ({ text, icon: Icon, isLast = false }: { text: string; icon: React.ElementType; isLast?: boolean }) => (
    <div className="flex items-center">
      <button
        className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-md text-sm",
          "transition-colors duration-200",
          isLast
            ? "text-gray-200 bg-gray-800/50"
            : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/30"
        )}
      >
        <Icon className="w-3.5 h-3.5" />
        <span>{text}</span>
      </button>
      {!isLast && (
        <ChevronRightIcon className="w-4 h-4 text-gray-600 mx-0.5" />
      )}
    </div>
  );

  // Render editor tab
  const EditorTab = ({ tab, isActive }: { tab: EditorTab; isActive: boolean }) => {
    const [showContextMenu, setShowContextMenu] = useState(false);
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      setContextMenuPosition({ x: e.clientX, y: e.clientY });
      setShowContextMenu(true);
    };

    return (
      <>
        <div
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
                onTabPin?.(tab.id);
              }}
              className={cn(
                "p-1 rounded-sm",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-700/50",
                "transition-colors duration-200",
                tab.isPinned && "text-blue-400 hover:text-blue-300"
              )}
            >
              <CircleDot className="w-3 h-3" />
            </button>

            {/* Close Button */}
            {!tab.isPinned && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTabClose?.(tab.id);
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
        {showContextMenu && (
          <TabContextMenu
            tab={tab}
            x={contextMenuPosition.x}
            y={contextMenuPosition.y}
            onClose={() => setShowContextMenu(false)}
          />
        )}
      </>
    );
  };

  // Add handleDragEnd function
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = tabs.findIndex(tab => tab.id === active.id);
      const newIndex = tabs.findIndex(tab => tab.id === over.id);
      onTabReorder?.(oldIndex, newIndex);
    }
  };

  // Enhanced EditorToolbar with more layout options
  const EditorToolbar = () => (
    <div className="flex flex-col border-b border-gray-800">
      {/* Layout Controls */}
      <div className="h-9 flex items-center justify-between px-2 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        {/* Left Section - Layout Modes */}
        <div className="flex items-center gap-1">
          <HeaderAction
            icon={isGridMode ? Grid : (groupLayout === 'horizontal' ? SplitSquareVertical : SplitSquareHorizontal)}
            label="Toggle Layout Mode"
            onClick={() => setIsGridMode(prev => !prev)}
            active={isGridMode}
          />
          <div className="h-4 w-px bg-gray-800 mx-1" />
          {isGridMode ? (
            <>
              <HeaderAction
                icon={Grid}
                label="1x1 Grid"
                onClick={() => {
                  setGridLayout('1x1');
                  onGridLayoutChange?.('1x1');
                }}
                active={gridLayout === '1x1'}
              />
              <HeaderAction
                icon={Grid2x2}
                label="2x2 Grid"
                onClick={() => {
                  setGridLayout('2x2');
                  onGridLayoutChange?.('2x2');
                }}
                active={gridLayout === '2x2'}
              />
              <HeaderAction
                icon={Grid3x3}
                label="3x3 Grid"
                onClick={() => {
                  setGridLayout('3x3');
                  onGridLayoutChange?.('3x3');
                }}
                active={gridLayout === '3x3'}
              />
            </>
          ) : (
            <>
              <HeaderAction
                icon={LayoutPanelLeft}
                label="Side by Side"
                onClick={() => setGroupLayout('horizontal')}
                active={!isGridMode && groupLayout === 'horizontal'}
              />
              <HeaderAction
                icon={LayoutPanelTop}
                label="Top and Bottom"
                onClick={() => setGroupLayout('vertical')}
                active={!isGridMode && groupLayout === 'vertical'}
              />
            </>
          )}
        </div>

        {/* Center Section - Layout Presets */}
        <div className="flex items-center gap-1">
          <HeaderAction
            icon={LayoutDashboard}
            label="Layout Presets"
            onClick={() => {}}
          />
          <HeaderAction
            icon={RotateCcw}
            label="Rotate Left"
            onClick={() => {}}
          />
          <HeaderAction
            icon={RotateCw}
            label="Rotate Right"
            onClick={() => {}}
          />
        </div>

        {/* Right Section - Group Actions */}
        <div className="flex items-center gap-1">
          <HeaderAction
            icon={Combine}
            label="Join Groups"
            onClick={() => {}}
          />
          <HeaderAction
            icon={Divide}
            label="Split Group"
            onClick={() => {}}
          />
          <div className="h-4 w-px bg-gray-800 mx-1" />
          <HeaderAction
            icon={Focus}
            label="Focus Active Group"
            onClick={() => {}}
            shortcut="⌘K ⌘F"
          />
        </div>
      </div>

      {/* Group Layout Controls */}
      <div className="h-9 flex items-center px-2 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex items-center gap-1">
          <HeaderAction
            icon={groupLayout === 'horizontal' ? SplitSquareVertical : SplitSquareHorizontal}
            label={`Switch to ${groupLayout === 'horizontal' ? 'Vertical' : 'Horizontal'} Layout`}
            onClick={() => {
              const newLayout = groupLayout === 'horizontal' ? 'vertical' : 'horizontal';
              setGroupLayout(newLayout);
              onLayoutChange?.(newLayout);
            }}
          />
          <HeaderAction
            icon={LayoutGrid}
            label="Grid Layout"
            onClick={() => {}}
          />
          <div className="h-4 w-px bg-gray-800 mx-1" />
          <HeaderAction
            icon={Focus}
            label="Focus Active Group"
            onClick={() => {}}
            shortcut="⌘K ⌘F"
          />
        </div>
      </div>

      {/* Tabs Row */}
      <DndContext
        sensors={useSensors(
          useSensor(PointerSensor),
          useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
          })
        )}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="flex items-center h-9 bg-gray-900/95 backdrop-blur-sm">
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
                />
              ))}
            </SortableContext>

            {/* New Tab Button */}
            <button
              className={cn(
                "h-9 px-3 flex items-center",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-800/30",
                "transition-colors duration-200"
              )}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </DndContext>

      {/* Breadcrumbs Row */}
      <div className={cn(
        "h-9 flex items-center justify-between px-4",
        "bg-gray-900/90 backdrop-blur-sm"
      )}>
        {/* Breadcrumbs */}
        <div className="flex items-center gap-1 overflow-x-auto">
          <BreadcrumbSegment text="Home" icon={Home} />
          {pathSegments.map((segment, index) => (
            <BreadcrumbSegment
              key={segment}
              text={segment}
              icon={index === pathSegments.length - 1 ? File : Folder}
              isLast={index === pathSegments.length - 1}
            />
          ))}
        </div>

        {/* Editor Actions */}
        <div className="flex items-center gap-2">
          <HeaderAction
            icon={editorLayout === 'single' ? Split : Columns}
            label={editorLayout === 'single' ? 'Split Editor' : 'Single Editor'}
            onClick={() => setEditorLayout(l => l === 'single' ? 'split' : 'single')}
            shortcut="⌘\\"
          />
          <HeaderAction
            icon={maximizedEditor ? Minimize : Maximize}
            label={maximizedEditor ? 'Restore Editor' : 'Maximize Editor'}
            onClick={() => setMaximizedEditor(m => !m)}
            shortcut="⌘M"
          />
          <div className="h-4 w-px bg-gray-800 mx-1" />
          <HeaderAction
            icon={Save}
            label="Save"
            onClick={() => {}}
            shortcut="⌘S"
          />
          <HeaderAction
            icon={Copy}
            label="Duplicate"
            onClick={() => {}}
          />
          <HeaderAction
            icon={Trash}
            label="Delete"
            onClick={() => {}}
          />
        </div>
      </div>
    </div>
  );

  // Enhanced EditorGroups with grid support
  const EditorGroups = () => {
    const gridTemplateAreas = {
      '1x1': "'a'",
      '1x2': "'a b'",
      '2x1': "'a' 'b'",
      '2x2': "'a b' 'c d'",
      '3x1': "'a' 'b' 'c'",
      '1x3': "'a b c'",
      '3x3': "'a b c' 'd e f' 'g h i'"
    };

    return (
      <div 
        className={cn(
          "flex-1 min-h-0",
          isGridMode ? "grid gap-1 p-1" : "flex",
          !isGridMode && (groupLayout === 'horizontal' ? "flex-row" : "flex-col")
        )}
        style={isGridMode ? {
          gridTemplateAreas: gridTemplateAreas[gridLayout],
          gridTemplateColumns: gridLayout.includes('x2') ? '1fr 1fr' : gridLayout.includes('x3') ? '1fr 1fr 1fr' : '1fr',
          gridTemplateRows: gridLayout.includes('2x') ? '1fr 1fr' : gridLayout.includes('3x') ? '1fr 1fr 1fr' : '1fr'
        } : undefined}
      >
        {groups.map((group, index) => (
          <React.Fragment key={group.id}>
            <div 
              className={cn(
                "flex-1 min-w-0 flex flex-col",
                "relative",
                "rounded-lg overflow-hidden",
                activeGroupId === group.id && "ring-1 ring-blue-500/20",
                isDraggingGroup && "transition-transform duration-200",
                isDraggingGroup && draggedGroupId === group.id && "opacity-50 scale-95",
                isGridMode && "bg-gray-900/50"
              )}
              style={{
                ...(!isGridMode && {
                  flexBasis: groupSizes[group.id] ? `${groupSizes[group.id] * 100}%` : undefined
                }),
                ...(isGridMode && {
                  gridArea: group.gridArea || `area-${index + 1}`
                })
              }}
              onClick={() => onGroupChange?.(group.id)}
              draggable={!lockedGroups.has(group.id)}
              onDragStart={() => handleGroupDragStart(group.id)}
              onDragEnd={handleGroupDragEnd}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.style.transform = 'scale(1.02)';
              }}
              onDragLeave={(e) => {
                e.currentTarget.style.transform = '';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.style.transform = '';
                handleGroupDrop(group.id);
              }}
            >
              {/* Group Header */}
              <div className={cn(
                "h-8 flex items-center justify-between px-2",
                "bg-gray-900/50 border-b border-gray-800"
              )}>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400">
                    Group {index + 1}
                  </span>
                  {group.isLocked && (
                    <Lock className="w-3 h-3 text-orange-400" />
                  )}
                  {group.isPinned && (
                    <Pin className="w-3 h-3 text-blue-400" />
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isLocked = lockedGroups.has(group.id);
                      if (isLocked) {
                        lockedGroups.delete(group.id);
                      } else {
                        lockedGroups.add(group.id);
                      }
                      setLockedGroups(new Set(lockedGroups));
                      onGroupLock?.(group.id, !isLocked);
                    }}
                    className={cn(
                      "p-1 rounded-md",
                      "text-gray-400 hover:text-gray-300",
                      "hover:bg-gray-800/50",
                      "transition-colors duration-200",
                      lockedGroups.has(group.id) && "text-orange-400"
                    )}
                  >
                    {lockedGroups.has(group.id) ? (
                      <Lock className="w-3 h-3" />
                    ) : (
                      <Unlock className="w-3 h-3" />
                    )}
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      const isPinned = pinnedGroups.has(group.id);
                      if (isPinned) {
                        pinnedGroups.delete(group.id);
                      } else {
                        pinnedGroups.add(group.id);
                      }
                      setPinnedGroups(new Set(pinnedGroups));
                      onGroupPin?.(group.id, !isPinned);
                    }}
                    className={cn(
                      "p-1 rounded-md",
                      "text-gray-400 hover:text-gray-300",
                      "hover:bg-gray-800/50",
                      "transition-colors duration-200",
                      pinnedGroups.has(group.id) && "text-blue-400"
                    )}
                  >
                    {pinnedGroups.has(group.id) ? (
                      <Pin className="w-3 h-3" />
                    ) : (
                      <PinOff className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Group Content */}
              <div className="flex-1 min-h-0">
                {children}
              </div>

              {/* Group Actions */}
              <div className={cn(
                "absolute top-2 right-2",
                "flex items-center gap-1",
                "opacity-0 group-hover:opacity-100",
                "transition-opacity duration-200"
              )}>
                <HeaderAction
                  icon={groupLayout === 'horizontal' ? PanelLeftOpen : PanelTop}
                  label="New Group to Left/Top"
                  onClick={() => {}}
                />
                <HeaderAction
                  icon={groupLayout === 'horizontal' ? PanelRightOpen : PanelBottom}
                  label="New Group to Right/Bottom"
                  onClick={() => {}}
                />
                <HeaderAction
                  icon={MaxIcon}
                  label="Maximize Group"
                  onClick={() => {}}
                />
              </div>
            </div>

            {/* Enhanced Resize Handle */}
            {!isGridMode && index < groups.length - 1 && !lockedGroups.has(group.id) && (
              <div
                className={cn(
                  "flex items-center justify-center",
                  groupLayout === 'horizontal' 
                    ? "w-1 cursor-col-resize" 
                    : "h-1 cursor-row-resize",
                  "group hover:bg-blue-500/30",
                  "transition-colors duration-200",
                  "relative"
                )}
                onMouseDown={() => {
                  setIsResizingGroup(true);
                  setResizingGroupId(group.id);
                }}
              >
                {/* Resize Handle Indicator */}
                <div className={cn(
                  "absolute",
                  groupLayout === 'horizontal' ? "w-4 h-24" : "w-24 h-4",
                  "flex items-center justify-center",
                  "opacity-0 group-hover:opacity-100",
                  "transition-all duration-200",
                  isResizingGroup && resizingGroupId === group.id && "opacity-100 scale-110"
                )}>
                  <div className={cn(
                    "bg-blue-500/20 backdrop-blur-sm",
                    "border border-blue-500/30",
                    "rounded-full",
                    groupLayout === 'horizontal' ? "w-1 h-full" : "w-full h-1"
                  )} />
                  {groupLayout === 'horizontal' ? (
                    <MoveHorizontal className="absolute w-4 h-4 text-blue-400" />
                  ) : (
                    <MoveVertical className="absolute w-4 h-4 text-blue-400" />
                  )}
                </div>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  // Quick Actions Menu
  const QuickActions = () => {
    if (!isQuickActionsOpen || !quickActionsAnchor) return null;

    const categories = {
      editor: 'Editor',
      git: 'Git',
      tools: 'Tools',
      view: 'View',
      help: 'Help'
    };

    const groupedActions = quickActions.reduce((acc, action) => {
      if (!acc[action.category]) {
        acc[action.category] = [];
      }
      acc[action.category].push(action);
      return acc;
    }, {} as Record<string, QuickAction[]>);

    return (
      <div
        className={cn(
          "absolute z-50",
          "w-80 p-2",
          "bg-gray-900/95 backdrop-blur-sm",
          "border border-gray-800 rounded-lg shadow-xl",
          "divide-y divide-gray-800",
          "animate-in fade-in slide-in-from-top-2 duration-200"
        )}
        style={{
          left: quickActionsAnchor.x,
          top: quickActionsAnchor.y + 8
        }}
      >
        {Object.entries(groupedActions).map(([category, actions]) => (
          <div key={category} className="py-2 first:pt-0 last:pb-0">
            <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">
              {categories[category as keyof typeof categories]}
            </div>
            <div className="space-y-1">
              {actions.map(action => (
                <button
                  key={action.id}
                  onClick={() => {
                    setIsQuickActionsOpen(false);
                    action.action();
                  }}
                  className={cn(
                    "w-full px-2 py-1.5 rounded-md",
                    "flex items-center gap-2",
                    "text-sm text-gray-400",
                    "hover:text-gray-300 hover:bg-gray-800",
                    "transition-colors duration-200",
                    "group"
                  )}
                >
                  <action.icon className="w-4 h-4" />
                  <span>{action.label}</span>
                  {action.shortcut && (
                    <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded group-hover:bg-gray-700">
                      {action.shortcut}
                    </kbd>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Tab context menu
  const TabContextMenu = ({ 
    tab,
    x,
    y,
    onClose 
  }: { 
    tab: EditorTab; 
    x: number; 
    y: number;
    onClose: () => void;
  }) => {
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (e: MouseEvent) => {
        if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
          onClose();
        }
      };

      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    const menuItems = [
      {
        icon: Save,
        label: 'Save',
        shortcut: '⌘S',
        action: () => {}
      },
      {
        icon: Copy,
        label: 'Duplicate',
        action: () => {}
      },
      {
        icon: CircleDot,
        label: tab.isPinned ? 'Unpin' : 'Pin',
        action: () => onTabPin?.(tab.id)
      },
      {
        icon: FileSearch,
        label: 'Reveal in Explorer',
        action: () => {}
      },
      {
        icon: Share2,
        label: 'Copy Path',
        action: () => {}
      },
      { type: 'separator' as const },
      {
        icon: PanelLeftClose,
        label: 'Close to the Left',
        action: () => {}
      },
      {
        icon: PanelRightClose,
        label: 'Close to the Right',
        action: () => {}
      },
      {
        icon: X,
        label: 'Close',
        shortcut: '⌘W',
        action: () => onTabClose?.(tab.id)
      }
    ];

    return (
      <div
        ref={menuRef}
        className={cn(
          "absolute z-50",
          "w-64 p-1",
          "bg-gray-900/95 backdrop-blur-sm",
          "border border-gray-800 rounded-lg shadow-xl",
          "divide-y divide-gray-800",
          "animate-in fade-in zoom-in-95 duration-100"
        )}
        style={{ left: x, top: y }}
      >
        <div className="space-y-1">
          {menuItems.map((item, index) => (
            item.type === 'separator' ? (
              <div key={index} className="my-1 border-t border-gray-800" />
            ) : (
              <button
                key={index}
                onClick={() => {
                  onClose();
                  item.action();
                }}
                className={cn(
                  "w-full px-2 py-1.5 rounded-md",
                  "flex items-center gap-2",
                  "text-sm text-gray-400",
                  "hover:text-gray-300 hover:bg-gray-800",
                  "transition-colors duration-200",
                  "group"
                )}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.shortcut && (
                  <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded group-hover:bg-gray-700">
                    {item.shortcut}
                  </kbd>
                )}
              </button>
            )
          ))}
        </div>
      </div>
    );
  };

  // Enhanced group resize handling
  const handleGroupResize = useCallback((groupId: string, size: number) => {
    if (lockedGroups.has(groupId)) return;

    const minSize = groups.find(g => g.id === groupId)?.minSize ?? 0.2;
    const maxSize = groups.find(g => g.id === groupId)?.maxSize ?? 0.8;
    const newSize = Math.max(minSize, Math.min(maxSize, size));

    setGroupSizes(prev => ({
      ...prev,
      [groupId]: newSize
    }));
    onGroupSizeChange?.(groupId, newSize);
  }, [groups, lockedGroups, onGroupSizeChange]);

  // Group drag-and-drop handlers
  const handleGroupDragStart = (groupId: string) => {
    if (lockedGroups.has(groupId)) return;
    setIsDraggingGroup(true);
    setDraggedGroupId(groupId);
  };

  const handleGroupDragEnd = () => {
    setIsDraggingGroup(false);
    setDraggedGroupId(null);
  };

  const handleGroupDrop = (targetGroupId: string) => {
    if (!draggedGroupId || draggedGroupId === targetGroupId) return;
    
    // Swap group positions
    const updatedGroups = [...groups];
    const sourceIndex = groups.findIndex(g => g.id === draggedGroupId);
    const targetIndex = groups.findIndex(g => g.id === targetGroupId);
    
    [updatedGroups[sourceIndex], updatedGroups[targetIndex]] = 
    [updatedGroups[targetIndex], updatedGroups[sourceIndex]];

    // Update group sizes
    const sourceSizes = { ...groupSizes };
    [sourceSizes[draggedGroupId], sourceSizes[targetGroupId]] = 
    [sourceSizes[targetGroupId], sourceSizes[draggedGroupId]];

    setGroupSizes(sourceSizes);
  };

  // Register keyboard shortcuts for new functionality
  useEffect(() => {
    const shortcuts = [
      {
        key: '⌘+Shift+F',
        description: 'Toggle search panel',
        action: () => setIsSearchPanelOpen(prev => !prev)
      },
      {
        key: '⌘+K ⌘+D',
        description: 'Toggle quick diff viewer',
        action: () => setIsQuickDiffVisible(prev => !prev)
      },
      {
        key: '⌘+K ⌘+T',
        description: 'Focus tab bar',
        action: () => document.querySelector('.tab-bar')?.focus()
      },
      {
        key: '⌘+K ⌘+B',
        description: 'Focus breadcrumb navigation',
        action: () => document.querySelector('.breadcrumb-nav')?.focus()
      }
    ];

    shortcuts.forEach(({ key, description, action }) => {
      registerShortcut({ key, description, action });
    });
  }, [registerShortcut]);

  // Path segments for breadcrumb
  const pathSegments = filePath.split('/').filter(Boolean);

  // Handle tab actions
  const handleTabAction = (action: string, tab: any) => {
    switch (action) {
      case 'close':
        onTabClose?.(tab.id);
        break;
      case 'pin':
        onTabPin?.(tab.id);
        break;
      // Add more actions as needed
    }
  };

  // Handle search result click
  const handleSearchResultClick = (filePath: string, line: number) => {
    // Implement navigation to search result
  };

  // Add new state for API contract management
  const [validationResults, setValidationResults] = useState<ValidationResult[]>([]);
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [collaborators, setCollaborators] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [gates, setGates] = useState<any[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  // Add style guide validation hook
  const styleGuideResults = useStyleGuideValidation(content);

  // Add validation effect
  useEffect(() => {
    const validateContent = async () => {
      if (!content) return;
      
      setIsValidating(true);
      try {
        const error = validateOpenAPI(content);
        if (error) {
          setValidationError(error);
          setValidationResults([]);
        } else {
          setValidationError(null);
          // Combine OpenAPI validation with style guide results
          setValidationResults(styleGuideResults);
        }
      } catch (err) {
        setValidationError(err instanceof Error ? err.message : 'Validation failed');
        setValidationResults([]);
      } finally {
        setIsValidating(false);
      }
    };

    validateContent();
  }, [content, styleGuideResults]);

  // Add project/contract selection handlers
  const handleProjectChange = (projectId: string) => {
    onProjectChange?.(projectId);
  };

  const handleContractChange = (contractId: string) => {
    onContractChange?.(contractId);
  };

  const handleStyleGuideChange = (guideId: string) => {
    onStyleGuideChange?.(guideId);
  };

  // Add publishing workflow
  const handlePublish = async () => {
    if (!activeContract) return;
    
    setIsPublishing(true);
    try {
      // Validate all gates
      const passedGates = await Promise.all(gates.map(gate => gate.validate()));
      if (passedGates.every(passed => passed)) {
        // Publish contract logic here
      }
    } finally {
      setIsPublishing(false);
    }
  };

  // Add collaboration handlers
  const handleAddComment = (comment: any) => {
    setComments(prev => [...prev, comment]);
  };

  const handleAddCollaborator = (collaborator: any) => {
    setCollaborators(prev => [...prev, collaborator]);
  };

  // Add new state
  const [selectedPanel, setSelectedPanel] = useState<'validation' | 'gates' | 'collaboration'>('validation');

  // Add gates management
  const [customGates, setCustomGates] = useState<Gate[]>([
    {
      id: 'security-check',
      name: 'Security Check',
      description: 'Verify security requirements and best practices',
      type: 'validation',
      status: 'pending',
      validate: async () => {
        // Implement security validation logic
        return true;
      }
    },
    {
      id: 'tech-lead-approval',
      name: 'Tech Lead Approval',
      description: 'Requires approval from technical lead',
      type: 'approval',
      status: 'pending',
      validate: async () => {
        // Implement approval validation logic
        return false;
      }
    }
  ]);

  // Add gate management handlers
  const handleAddGate = (gate: Gate) => {
    setCustomGates(prev => [...prev, gate]);
  };

  const handleRemoveGate = (gateId: string) => {
    setCustomGates(prev => prev.filter(g => g.id !== gateId));
  };

  const handleUpdateGate = (gateId: string, updates: Partial<Gate>) => {
    setCustomGates(prev => prev.map(g => g.id === gateId ? { ...g, ...updates } : g));
  };

  return (
    <div className={cn(
      "h-screen flex flex-col overflow-hidden",
      "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
      "transition-colors duration-300"
    )}>
      {/* Add Project/Contract Selection Header */}
      <div className="flex-none border-b border-gray-800 bg-gray-900/90 backdrop-blur-sm">
        <div className="flex items-center gap-4 px-4 h-12">
          {/* Project Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Project:</span>
            <select 
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
              value={activeProject?.id}
              onChange={(e) => handleProjectChange(e.target.value)}
            >
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Contract Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Contract:</span>
            <select
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
              value={activeContract?.id}
              onChange={(e) => handleContractChange(e.target.value)}
            >
              {contracts.map(contract => (
                <option key={contract.id} value={contract.id}>
                  {contract.name} (v{contract.version})
                </option>
              ))}
            </select>
          </div>

          {/* Style Guide Selector */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-400">Style Guide:</span>
            <select
              className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-sm text-gray-200"
              value={activeStyleGuide?.id}
              onChange={(e) => handleStyleGuideChange(e.target.value)}
            >
              {styleGuides.map(guide => (
                <option key={guide.id} value={guide.id}>
                  {guide.name}
                </option>
              ))}
            </select>
          </div>

          {/* Validation Status */}
          <div className="flex items-center gap-2 ml-auto">
            {isValidating ? (
              <div className="flex items-center gap-2 text-yellow-400">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span className="text-sm">Validating...</span>
              </div>
            ) : validationError ? (
              <div className="flex items-center gap-2 text-red-400">
                <XCircle className="w-4 h-4" />
                <span className="text-sm">{validationError}</span>
              </div>
            ) : validationResults.length > 0 ? (
              <div className="flex items-center gap-2 text-yellow-400">
                <AlertCircle className="w-4 h-4" />
                <span className="text-sm">{validationResults.length} issues found</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-4 h-4" />
                <span className="text-sm">Valid API Contract</span>
              </div>
            )}

            {/* Publish Button */}
            <button
              onClick={handlePublish}
              disabled={isPublishing || Boolean(validationError) || validationResults.length > 0}
              className={cn(
                "px-3 py-1.5 rounded-md text-sm font-medium",
                "transition-all duration-200",
                isPublishing || Boolean(validationError) || validationResults.length > 0
                  ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                  : "bg-blue-500 text-white hover:bg-blue-600 active:scale-95"
              )}
            >
              {isPublishing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Publishing...
                </div>
              ) : (
                "Publish"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className={cn(
        "flex-none h-12 flex items-center justify-between gap-4 px-4",
        "border-b border-gray-800",
        "bg-gray-900/90 backdrop-blur-sm",
        "transition-all duration-300"
      )}>
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsHeaderMenuOpen(!isHeaderMenuOpen)}
              className={cn(
                "p-1.5 rounded-md",
                "hover:bg-gray-800/80 active:scale-95",
                "text-gray-400 hover:text-gray-300",
                "transition-all duration-200",
                isHeaderMenuOpen && "bg-gray-800 text-gray-300"
              )}
            >
              {isHeaderMenuOpen ? (
                <X className="w-4 h-4" />
              ) : (
                <Menu className="w-4 h-4" />
              )}
            </button>
            <div className={cn(
              "p-1.5 rounded-md",
              "bg-gradient-to-br from-blue-500 to-blue-600",
              "transform transition-transform duration-200",
              "hover:scale-105"
            )}>
              <FileText className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-gray-200">
              Swagger Editor
            </span>
          </div>

          <div className="h-6 w-px bg-gray-800" />

          <div className="flex items-center gap-1">
            <HeaderAction
              icon={PanelLeft}
              label="Toggle Left Sidebar"
              onClick={toggleLeftSidebar}
              shortcut="⌘B"
              active={!leftSidebarCollapsed}
            />
            <HeaderAction
              icon={Layout}
              label="Reset Layout"
              onClick={resetLayout}
            />
            <HeaderAction
              icon={PanelRight}
              label="Toggle Right Sidebar"
              onClick={toggleRightSidebar}
              shortcut="⌘\"
              active={!rightSidebarCollapsed}
            />
          </div>
        </div>

        {/* Center Section */}
        <div className="flex-1 flex justify-center">
          <button
            className={cn(
              "inline-flex items-center px-3 py-1.5",
              "text-xs text-gray-400",
              "bg-gray-800/50 hover:bg-gray-800/80",
              "rounded-full transition-all duration-200",
              "hover:scale-105 active:scale-95"
            )}
            onClick={() => setIsCommandPaletteOpen(true)}
          >
            <Command className="w-3 h-3" />
            <span className="ml-2">Command Palette</span>
            <kbd className="ml-2 px-1.5 py-0.5 text-[10px] font-mono bg-gray-900/50 rounded">⌘P</kbd>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <HeaderAction
            icon={theme === 'dark' ? Sun : Moon}
            label={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`}
            onClick={toggleTheme}
          />
          <HeaderAction
            icon={isFullscreen ? Minimize2 : Maximize2}
            label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            onClick={toggleFullscreen}
          />
          <div className="h-6 w-px bg-gray-800" />
          <HeaderAction
            icon={Settings}
            label="Settings"
            onClick={() => setIsSettingsOpen(true)}
            shortcut="⌘,"
          />
          <HeaderAction
            icon={HelpCircle}
            label="Help"
            onClick={() => setIsHelpOpen(true)}
            shortcut="⌘/"
          />
        </div>
      </header>

      {/* Header Menu */}
      {isHeaderMenuOpen && (
        <div 
          ref={headerMenuRef}
          className={cn(
            "absolute top-12 left-4 w-64 z-50",
            "bg-gray-900/95 backdrop-blur-sm",
            "border border-gray-800 rounded-lg shadow-xl",
            "divide-y divide-gray-800",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}
        >
          {/* Layout Section */}
          <div className="p-2 space-y-1">
            <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">
              Layout
            </div>
            <button
              onClick={toggleLeftSidebar}
              className={cn(
                "w-full px-2 py-1.5 rounded-md",
                "flex items-center gap-2",
                "text-sm transition-colors duration-200",
                leftSidebarCollapsed
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
              )}
            >
              <PanelLeft className="w-4 h-4" />
              {leftSidebarCollapsed ? 'Show Primary Sidebar' : 'Hide Primary Sidebar'}
              <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">⌘B</kbd>
            </button>
            <button
              onClick={toggleRightSidebar}
              className={cn(
                "w-full px-2 py-1.5 rounded-md",
                "flex items-center gap-2",
                "text-sm transition-colors duration-200",
                rightSidebarCollapsed
                  ? "text-gray-400 hover:bg-gray-800"
                  : "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
              )}
            >
              <PanelRight className="w-4 h-4" />
              {rightSidebarCollapsed ? 'Show Secondary Sidebar' : 'Hide Secondary Sidebar'}
              <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">⌘\</kbd>
            </button>
            <button
              onClick={resetLayout}
              className="w-full px-2 py-1.5 rounded-md flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            >
              <LayoutTemplate className="w-4 h-4" />
              Reset Layout
            </button>
          </div>

          {/* View Section */}
          <div className="p-2 space-y-1">
            <div className="px-2 py-1.5 text-xs text-gray-500 font-medium">
              View
            </div>
            <button
              onClick={() => setCurrentActivity('explorer')}
              className={cn(
                "w-full px-2 py-1.5 rounded-md",
                "flex items-center gap-2",
                "text-sm transition-colors duration-200",
                currentActivity === 'explorer'
                  ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
                  : "text-gray-400 hover:bg-gray-800"
              )}
            >
              Show Explorer
              <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">⌘E</kbd>
            </button>
            <button
              onClick={() => setCurrentActivity('search')}
              className={cn(
                "w-full px-2 py-1.5 rounded-md",
                "flex items-center gap-2",
                "text-sm transition-colors duration-200",
                currentActivity === 'search'
                  ? "text-blue-400 bg-blue-500/10 hover:bg-blue-500/20"
                  : "text-gray-400 hover:bg-gray-800"
              )}
            >
              Show Search
              <kbd className="ml-auto px-1.5 py-0.5 text-[10px] font-mono bg-gray-800 rounded">⌘F</kbd>
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex min-h-0" ref={containerRef}>
        {/* Activity Bar */}
        <ActivityBar
          currentActivity={currentActivity}
          onActivityChange={setCurrentActivity}
          isCollapsed={leftSidebarCollapsed || maximizedEditor}
          onToggleCollapse={toggleLeftSidebar}
        />

        {/* Left Sidebar */}
        <div 
          className={cn(
            "border-r border-gray-800",
            "bg-gray-900/95 backdrop-blur-sm",
            "transition-all duration-300 ease-in-out",
            (leftSidebarCollapsed || maximizedEditor) ? "w-0 opacity-0" : "opacity-100"
          )}
          style={{ 
            width: (leftSidebarCollapsed || maximizedEditor) ? 0 : leftSidebarWidth,
            visibility: (leftSidebarCollapsed || maximizedEditor) ? 'hidden' : 'visible'
          }}
        >
          <SidebarManager
            activity={currentActivity}
            content={content}
            onNavigate={() => {}}
            isCollapsed={leftSidebarCollapsed || maximizedEditor}
          />
          
          {/* Resize Handle */}
          {!leftSidebarCollapsed && !maximizedEditor && (
            <div
              className={cn(
                "absolute right-0 top-0 bottom-0 w-1",
                "cursor-col-resize group",
                isResizingLeft ? "bg-blue-500/50" : "hover:bg-blue-500/30",
                "transition-colors duration-200"
              )}
              onMouseDown={() => setIsResizingLeft(true)}
            >
              <div className={cn(
                "absolute inset-0 flex items-center justify-center",
                "opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                isResizingLeft && "opacity-100"
              )}>
                <div className="w-0.5 h-8 bg-blue-500/80 rounded-full" />
              </div>
            </div>
          )}
        </div>

        {/* Editor Area */}
        <div className={cn(
          "flex-1 min-w-0 flex flex-col",
          "bg-gray-900/95 backdrop-blur-sm",
          "transition-all duration-300 ease-in-out"
        )}>
          {/* New Tab Bar */}
          <TabBar
            tabs={tabs}
            activeTabId={activeTabId}
            onTabSelect={onTabChange}
            onTabClose={onTabClose}
            onTabsReorder={onTabReorder}
            onTabAction={handleTabAction}
            className="flex-none"
          />

          {/* New Breadcrumb Navigation */}
          <BreadcrumbNavigation
            segments={pathSegments.map((segment, index) => ({
              label: segment,
              type: index === pathSegments.length - 1 ? 'file' : 'folder',
              path: pathSegments.slice(0, index + 1).join('/')
            }))}
            onSegmentClick={(segment) => {
              // Handle segment click
            }}
            onAction={(action, segment) => {
              // Handle segment action
            }}
            className="flex-none"
          />

          {/* Enhanced Editor Toolbar */}
          <div className="flex-none h-10 border-b border-gray-800 bg-gray-900/95 backdrop-blur-sm">
            <div className="flex items-center justify-between h-full px-2">
              {/* Left Section - File Actions */}
              <div className="flex items-center gap-1">
                <HeaderAction
                  icon={Save}
                  label="Save"
                  onClick={() => {}}
                  shortcut="⌘S"
                />
                <HeaderAction
                  icon={Search}
                  label="Find in File"
                  onClick={() => setIsSearchPanelOpen(true)}
                  shortcut="⌘F"
                />
                <div className="h-4 w-px bg-gray-800 mx-1" />
                <HeaderAction
                  icon={Split}
                  label="Split Editor"
                  onClick={() => setEditorLayout(l => l === 'single' ? 'split' : 'single')}
                  shortcut="⌘\\"
                />
              </div>

              {/* Center Section - View Actions */}
              <div className="flex items-center gap-1">
                <HeaderAction
                  icon={Maximize}
                  label="Toggle Maximized"
                  onClick={() => setMaximizedEditor(m => !m)}
                  shortcut="⌘M"
                />
                <HeaderAction
                  icon={Grid}
                  label="Toggle Grid Layout"
                  onClick={() => setIsGridMode(m => !m)}
                />
              </div>

              {/* Right Section - Additional Actions */}
              <div className="flex items-center gap-1">
                <HeaderAction
                  icon={isQuickDiffVisible ? X : FileText}
                  label="Toggle Quick Diff"
                  onClick={() => setIsQuickDiffVisible(v => !v)}
                  active={isQuickDiffVisible}
                />
              </div>
            </div>
          </div>

          {/* Editor Content */}
          <div className="flex-1 min-h-0 flex">
            {/* Main Editor */}
            <div className={cn(
              "flex-1 min-w-0",
              isQuickDiffVisible && "border-r border-gray-800"
            )}>
              <EditorGroups />
            </div>

            {/* Quick Diff Viewer */}
            {isQuickDiffVisible && (
              <QuickDiffViewer
                filePath={filePath}
                hunks={diffHunks}
                onRefresh={() => {
                  // Refresh diff
                }}
                onSettings={() => {
                  // Open diff settings
                }}
                className="w-[400px]"
              />
            )}
          </div>
        </div>

        {/* Right Sidebar with Validation, Gates, and Collaboration */}
        <div 
          className={cn(
            "border-l border-gray-800",
            "bg-gray-900/95 backdrop-blur-sm",
            "transition-all duration-300 ease-in-out",
            (rightSidebarCollapsed || maximizedEditor) ? "w-0 opacity-0" : "opacity-100"
          )}
          style={{ 
            width: (rightSidebarCollapsed || maximizedEditor) ? 0 : rightSidebarWidth,
            visibility: (rightSidebarCollapsed || maximizedEditor) ? 'hidden' : 'visible'
          }}
        >
          {/* Panel Selection Tabs */}
          <div className="flex border-b border-gray-800">
            <button
              onClick={() => setSelectedPanel('validation')}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium",
                "transition-colors duration-200",
                selectedPanel === 'validation'
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              Validation
            </button>
            <button
              onClick={() => setSelectedPanel('gates')}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium",
                "transition-colors duration-200",
                selectedPanel === 'gates'
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              Gates
            </button>
            <button
              onClick={() => setSelectedPanel('collaboration')}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium",
                "transition-colors duration-200",
                selectedPanel === 'collaboration'
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-gray-400 hover:text-gray-300"
              )}
            >
              Collaboration
            </button>
          </div>

          {/* Panel Content */}
          <div className="flex-1 overflow-auto">
            {selectedPanel === 'validation' && (
              <ValidationPanel
                results={validationResults}
                error={validationError}
                isValidating={isValidating}
                onFixIssue={(result) => {
                  // Implement fix issue logic
                }}
                onIgnoreIssue={(result) => {
                  // Implement ignore issue logic
                }}
              />
            )}

            {selectedPanel === 'gates' && (
              <GatesPanel
                gates={customGates}
                onAddGate={handleAddGate}
                onRemoveGate={handleRemoveGate}
                onUpdateGate={handleUpdateGate}
                onValidateGate={async (gateId) => {
                  const gate = customGates.find(g => g.id === gateId);
                  if (gate) {
                    const passed = await gate.validate();
                    handleUpdateGate(gateId, { status: passed ? 'passed' : 'failed' });
                  }
                }}
              />
            )}

            {selectedPanel === 'collaboration' && (
              <CollaborationPanel
                collaborators={collaborators}
                comments={comments}
                onAddComment={handleAddComment}
                onAddCollaborator={handleAddCollaborator}
                onRemoveCollaborator={(id) => {
                  setCollaborators(prev => prev.filter(c => c.id !== id));
                }}
                onUpdateCollaborator={(id, updates) => {
                  setCollaborators(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <StatusBar
        editorLayout={editorLayout}
        isMaximized={maximizedEditor}
        onToggleLayout={() => setEditorLayout(l => l === 'single' ? 'split' : 'single')}
        onToggleMaximize={() => setMaximizedEditor(m => !m)}
      />

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
} 