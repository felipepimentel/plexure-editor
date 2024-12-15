import React from 'react';
import { 
  GitBranch,
  GitCommit,
  GitPullRequest,
  Bell,
  Zap,
  Wifi,
  WifiOff,
  Check,
  AlertCircle,
  XCircle,
  Clock,
  FileText,
  ChevronRight,
  Split,
  Maximize2,
  Minimize2,
  Monitor,
  Cpu,
  HardDrive,
  Database,
  Server,
  Activity,
  Terminal,
  Code,
  FileCode,
  Settings,
  RefreshCw,
  MoreVertical
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Tooltip } from '@/components/ui/Tooltip';

interface StatusBarProps {
  editorLayout: 'single' | 'split';
  isMaximized: boolean;
  onToggleLayout: () => void;
  onToggleMaximize: () => void;
  className?: string;
}

interface StatusItem {
  id: string;
  icon: React.ElementType;
  label: string;
  value?: string;
  tooltip?: string;
  onClick?: () => void;
  status?: 'success' | 'warning' | 'error' | 'info';
  loading?: boolean;
  position?: 'left' | 'center' | 'right';
  priority?: number;
}

export function StatusBar({
  editorLayout,
  isMaximized,
  onToggleLayout,
  onToggleMaximize,
  className
}: StatusBarProps) {
  // Status items configuration
  const statusItems: StatusItem[] = [
    // Left items
    {
      id: 'git.branch',
      icon: GitBranch,
      label: 'main',
      tooltip: 'Current Git Branch',
      onClick: () => {},
      position: 'left',
      priority: 1
    },
    {
      id: 'git.changes',
      icon: GitCommit,
      label: '+2 ~1',
      tooltip: '2 additions, 1 modification',
      onClick: () => {},
      position: 'left',
      priority: 2
    },
    {
      id: 'git.sync',
      icon: RefreshCw,
      label: '↑2 ↓1',
      tooltip: '2 unpushed, 1 unpulled changes',
      onClick: () => {},
      position: 'left',
      priority: 3
    },
    {
      id: 'git.pr',
      icon: GitPullRequest,
      label: 'PR #123',
      tooltip: 'Active Pull Request',
      onClick: () => {},
      position: 'left',
      priority: 4
    },
    // Center items
    {
      id: 'editor.file',
      icon: FileCode,
      label: 'swagger.yaml',
      tooltip: 'Current File',
      onClick: () => {},
      position: 'center',
      priority: 1
    },
    {
      id: 'editor.path',
      icon: ChevronRight,
      label: 'src/api/v1',
      tooltip: 'File Path',
      onClick: () => {},
      position: 'center',
      priority: 2
    },
    {
      id: 'editor.size',
      icon: HardDrive,
      label: '2.3 KB',
      tooltip: 'File Size',
      position: 'center',
      priority: 3
    },
    // Right items
    {
      id: 'status.notifications',
      icon: Bell,
      label: '2',
      tooltip: '2 notifications',
      onClick: () => {},
      position: 'right',
      priority: 1
    },
    {
      id: 'status.problems',
      icon: AlertCircle,
      label: '3 warnings',
      tooltip: '3 validation warnings',
      onClick: () => {},
      status: 'warning',
      position: 'right',
      priority: 2
    },
    {
      id: 'status.server',
      icon: Server,
      label: 'Connected',
      tooltip: 'Server Status',
      status: 'success',
      position: 'right',
      priority: 3
    },
    {
      id: 'status.performance',
      icon: Activity,
      label: '120ms',
      tooltip: 'Response Time',
      position: 'right',
      priority: 4
    },
    {
      id: 'status.memory',
      icon: Cpu,
      label: '256MB',
      tooltip: 'Memory Usage',
      position: 'right',
      priority: 5
    }
  ];

  // Group items by position
  const leftItems = statusItems
    .filter(item => item.position === 'left')
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  const centerItems = statusItems
    .filter(item => item.position === 'center')
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  const rightItems = statusItems
    .filter(item => item.position === 'right')
    .sort((a, b) => (a.priority || 0) - (b.priority || 0));

  // Render status item
  const StatusItem = ({ item }: { item: StatusItem }) => {
    const Icon = item.icon;

    return (
      <Tooltip content={item.tooltip || item.label}>
        <button
          onClick={item.onClick}
          className={cn(
            "h-full px-2",
            "flex items-center gap-1.5",
            "text-xs",
            "hover:bg-gray-800/50",
            "transition-colors duration-200",
            item.onClick ? "cursor-pointer" : "cursor-default",
            item.status === 'success' && "text-green-400",
            item.status === 'warning' && "text-yellow-400",
            item.status === 'error' && "text-red-400",
            item.status === 'info' && "text-blue-400",
            !item.status && "text-gray-400"
          )}
        >
          <Icon className={cn(
            "w-3.5 h-3.5",
            item.loading && "animate-spin"
          )} />
          {item.label && (
            <span className="font-medium">{item.label}</span>
          )}
        </button>
      </Tooltip>
    );
  };

  return (
    <div className={cn(
      "h-6 flex items-stretch",
      "bg-gray-900/95 backdrop-blur-sm",
      "border-t border-gray-800",
      className
    )}>
      {/* Left Section */}
      <div className="flex-none flex items-stretch divide-x divide-gray-800">
        {leftItems.map(item => (
          <StatusItem key={item.id} item={item} />
        ))}
      </div>

      {/* Center Section */}
      <div className="flex-1 flex items-stretch justify-center divide-x divide-gray-800">
        {centerItems.map(item => (
          <StatusItem key={item.id} item={item} />
        ))}
      </div>

      {/* Right Section */}
      <div className="flex-none flex items-stretch divide-x divide-gray-800">
        {rightItems.map(item => (
          <StatusItem key={item.id} item={item} />
        ))}

        {/* Editor Layout Controls */}
        <Tooltip content={`${editorLayout === 'single' ? 'Split' : 'Single'} Editor`}>
          <button
            onClick={onToggleLayout}
            className={cn(
              "h-full px-2",
              "flex items-center",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800/50",
              "transition-colors duration-200"
            )}
          >
            <Split className="w-3.5 h-3.5" />
          </button>
        </Tooltip>

        <Tooltip content={isMaximized ? 'Restore Editor' : 'Maximize Editor'}>
          <button
            onClick={onToggleMaximize}
            className={cn(
              "h-full px-2",
              "flex items-center",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800/50",
              "transition-colors duration-200"
            )}
          >
            {isMaximized ? (
              <Minimize2 className="w-3.5 h-3.5" />
            ) : (
              <Maximize2 className="w-3.5 h-3.5" />
            )}
          </button>
        </Tooltip>

        {/* Settings */}
        <Tooltip content="Status Bar Settings">
          <button
            onClick={() => {}}
            className={cn(
              "h-full px-2",
              "flex items-center",
              "text-gray-400 hover:text-gray-300",
              "hover:bg-gray-800/50",
              "transition-colors duration-200"
            )}
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </Tooltip>
      </div>
    </div>
  );
} 