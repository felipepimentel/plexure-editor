import React from 'react';
import { cn } from '../lib/utils';
import {
  FileJson,
  FileCode,
  Settings,
  MessageSquare,
  AlertCircle,
  AlertTriangle,
  Info,
  ChevronRight,
  ChevronLeft,
  Files,
  FolderOpen,
  Plus,
  Search,
  History,
  GitBranch,
  Trash
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
  validationMessages: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
  }>;
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  activeTab,
  onTabChange,
  validationMessages,
  className
}) => {
  const errors = validationMessages.filter(m => m.type === 'error').length;
  const warnings = validationMessages.filter(m => m.type === 'warning').length;
  const infos = validationMessages.filter(m => m.type === 'info').length;

  const tabs = [
    {
      id: 'files',
      icon: <Files className="h-4 w-4" />,
      label: 'Files',
      badge: null
    },
    {
      id: 'chat',
      icon: <MessageSquare className="h-4 w-4" />,
      label: 'Chat',
      badge: null
    },
    {
      id: 'validation',
      icon: <AlertCircle className="h-4 w-4" />,
      label: 'Validation',
      badge: errors + warnings + infos || null,
      badgeColor: errors ? 'text-destructive bg-destructive/10' :
                 warnings ? 'text-warning bg-warning/10' :
                 infos ? 'text-info bg-info/10' : null
    }
  ];

  return (
    <div className={cn(
      'flex h-full bg-muted/50 border-r transition-all duration-300',
      isCollapsed ? 'w-[48px]' : 'w-[240px]',
      className
    )}>
      {/* Tabs */}
      <div className="flex flex-col h-full">
        <div className="flex flex-col flex-1 p-2 gap-1">
          {tabs.map(tab => (
            <Tooltip
              key={tab.id}
              content={isCollapsed ? tab.label : null}
              side="right"
            >
              <button
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  'flex items-center gap-3 px-2 py-1.5 rounded-md text-sm transition-colors relative group',
                  activeTab === tab.id
                    ? 'bg-primary/10 text-primary'
                    : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.icon}
                {!isCollapsed && (
                  <span className="flex-1">{tab.label}</span>
                )}
                {tab.badge && (
                  <span className={cn(
                    'px-1.5 py-0.5 rounded-full text-xs font-medium',
                    tab.badgeColor
                  )}>
                    {tab.badge}
                  </span>
                )}
              </button>
            </Tooltip>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="p-2 border-t">
          <Tooltip
            content={isCollapsed ? 'Settings' : null}
            side="right"
          >
            <button
              className={cn(
                'flex items-center gap-3 w-full px-2 py-1.5 rounded-md text-sm transition-colors',
                'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Settings className="h-4 w-4" />
              {!isCollapsed && <span>Settings</span>}
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Collapse button */}
      <div className="flex flex-col items-center py-2 border-l">
        <Tooltip
          content={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          side="right"
        >
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default Sidebar; 