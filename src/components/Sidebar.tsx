import React from 'react';
import { cn } from '../lib/utils';
import {
  ChevronRight,
  FileJson,
  FolderOpen,
  Folder,
  File,
  Plus,
  Search,
  Settings,
  Code2,
  Braces,
  FileText,
  Boxes,
  Box,
  AlertCircle,
  Info,
  Network,
  Shield,
  Tag,
  Globe,
  Book,
  PlayCircle,
  Webhook,
  GitBranch,
  Trash,
  Copy,
  MoreVertical,
  Check
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface SidebarProps {
  className?: string;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

interface FileTreeItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeItem[];
  modified?: boolean;
  path: string;
}

const NavigationItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  badge?: number;
  onClick?: () => void;
}> = ({ icon, label, isActive, badge, onClick }) => (
  <button
    onClick={onClick}
    className={cn(
      'flex items-center gap-2 w-full p-2 rounded-md text-sm transition-colors',
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-muted-foreground hover:bg-muted/80 hover:text-foreground'
    )}
  >
    {icon}
    <span className="flex-1 truncate">{label}</span>
    {badge !== undefined && (
      <span className={cn(
        'px-1.5 py-0.5 rounded-full text-[10px] font-medium',
        isActive
          ? 'bg-primary/20'
          : 'bg-muted text-muted-foreground'
      )}>
        {badge}
      </span>
    )}
  </button>
);

const FileTreeNode: React.FC<{
  item: FileTreeItem;
  level?: number;
  onSelect?: (item: FileTreeItem) => void;
  selectedPath?: string;
}> = ({
  item,
  level = 0,
  onSelect,
  selectedPath
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [copiedPath, setCopiedPath] = React.useState(false);

  const handleCopyPath = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(item.path);
      setCopiedPath(true);
      setTimeout(() => setCopiedPath(false), 2000);
    } catch (error) {
      console.error('Failed to copy path:', error);
    }
  };

  const getFileIcon = () => {
    if (item.type === 'folder') {
      return isExpanded ? <FolderOpen className="w-4 h-4" /> : <Folder className="w-4 h-4" />;
    }
    
    const extension = item.name.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'json':
        return <FileJson className="w-4 h-4 text-orange-500" />;
      case 'yaml':
      case 'yml':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'md':
        return <FileText className="w-4 h-4 text-purple-500" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  return (
    <div>
      <div
        className={cn(
          'group flex items-center gap-1 py-1 px-2 rounded-md cursor-pointer',
          selectedPath === item.path
            ? 'bg-primary/10 text-primary'
            : 'hover:bg-muted/80',
          item.modified && 'font-medium'
        )}
        style={{ paddingLeft: `${(level * 12) + 8}px` }}
        onClick={() => {
          if (item.type === 'folder') {
            setIsExpanded(!isExpanded);
          } else {
            onSelect?.(item);
          }
        }}
      >
        <ChevronRight
          className={cn(
            'w-4 h-4 text-muted-foreground transition-transform',
            item.type === 'file' && 'invisible',
            isExpanded && 'rotate-90'
          )}
        />
        {getFileIcon()}
        <span className="flex-1 truncate text-sm">
          {item.name}
        </span>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content={copiedPath ? 'Copied!' : 'Copy path'}>
            <button
              onClick={handleCopyPath}
              className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedPath ? (
                <Check className="w-3.5 h-3.5" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </Tooltip>
          <div className="relative">
            <Tooltip content="More actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <MoreVertical className="w-3.5 h-3.5" />
              </button>
            </Tooltip>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors text-destructive hover:text-destructive"
                >
                  <Trash className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {item.type === 'folder' && isExpanded && item.children && (
        <div>
          {item.children.map((child) => (
            <FileTreeNode
              key={child.id}
              item={child}
              level={level + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  className,
  isCollapsed = false,
  onCollapse,
}) => {
  const [activeTab, setActiveTab] = React.useState<'files' | 'navigation'>('navigation');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedPath, setSelectedPath] = React.useState<string>();

  // Example file tree data
  const fileTree: FileTreeItem[] = [
    {
      id: '1',
      name: 'api',
      type: 'folder',
      path: '/api',
      children: [
        {
          id: '2',
          name: 'openapi.yaml',
          type: 'file',
          path: '/api/openapi.yaml',
          modified: true,
        },
        {
          id: '3',
          name: 'schemas',
          type: 'folder',
          path: '/api/schemas',
          children: [
            {
              id: '4',
              name: 'user.yaml',
              type: 'file',
              path: '/api/schemas/user.yaml',
            },
            {
              id: '5',
              name: 'product.yaml',
              type: 'file',
              path: '/api/schemas/product.yaml',
            },
          ],
        },
      ],
    },
    {
      id: '6',
      name: 'docs',
      type: 'folder',
      path: '/docs',
      children: [
        {
          id: '7',
          name: 'README.md',
          type: 'file',
          path: '/docs/README.md',
        },
      ],
    },
  ];

  const navigationItems = [
    { icon: <Code2 className="w-4 h-4" />, label: 'Endpoints', badge: 12 },
    { icon: <Boxes className="w-4 h-4" />, label: 'Schemas', badge: 8 },
    { icon: <Shield className="w-4 h-4" />, label: 'Security', badge: 3 },
    { icon: <Network className="w-4 h-4" />, label: 'Servers', badge: 2 },
    { icon: <Webhook className="w-4 h-4" />, label: 'Webhooks', badge: 1 },
    { icon: <Tag className="w-4 h-4" />, label: 'Tags', badge: 5 },
    { icon: <Book className="w-4 h-4" />, label: 'Documentation' },
    { icon: <PlayCircle className="w-4 h-4" />, label: 'Examples' },
  ];

  return (
    <div className={cn(
      'flex flex-col w-80 border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      isCollapsed && 'w-16',
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Braces className="w-4 h-4 text-primary" />
        </div>
        {!isCollapsed && (
          <>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold truncate">OpenAPI Editor</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <GitBranch className="w-3.5 h-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  main • v1.0.0
                </span>
              </div>
            </div>
            <Tooltip content={isCollapsed ? 'Expand' : 'Collapse'}>
              <button
                onClick={onCollapse}
                className="p-1 rounded-md hover:bg-muted/80 transition-colors"
              >
                <ChevronRight className={cn(
                  'w-4 h-4 transition-transform',
                  !isCollapsed && 'rotate-180'
                )} />
              </button>
            </Tooltip>
          </>
        )}
      </div>

      {!isCollapsed && (
        <>
          {/* Tabs */}
          <div className="flex items-center gap-1 p-1 mx-4 mt-4 rounded-lg bg-muted/50">
            <button
              onClick={() => setActiveTab('navigation')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-sm transition-colors',
                activeTab === 'navigation'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              )}
            >
              <Globe className="w-4 h-4" />
              Navigation
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded-md text-sm transition-colors',
                activeTab === 'files'
                  ? 'bg-background shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/80'
              )}
            >
              <Folder className="w-4 h-4" />
              Files
            </button>
          </div>

          {/* Search */}
          <div className="relative mx-4 mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={activeTab === 'navigation' ? 'Search navigation...' : 'Search files...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-md border bg-background text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto mt-4">
            {activeTab === 'navigation' ? (
              <nav className="px-2 space-y-1">
                {navigationItems.map((item) => (
                  <NavigationItem
                    key={item.label}
                    {...item}
                  />
                ))}
              </nav>
            ) : (
              <div className="px-2">
                {fileTree.map((item) => (
                  <FileTreeNode
                    key={item.id}
                    item={item}
                    onSelect={(item) => setSelectedPath(item.path)}
                    selectedPath={selectedPath}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t">
            <button className="flex items-center gap-2 w-full p-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors">
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar; 