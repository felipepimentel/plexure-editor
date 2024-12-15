import React, { useState, useEffect } from 'react';
import { 
  Bell,
  BellOff,
  Check,
  AlertCircle,
  Info,
  X,
  ChevronRight,
  ChevronDown,
  Clock,
  Star,
  Pin,
  Archive,
  Trash2,
  Settings,
  Filter,
  RefreshCw,
  MoreVertical,
  MessageSquare,
  GitPullRequest,
  GitCommit,
  FileText,
  Terminal,
  Zap,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';
import { Tooltip } from '@/components/ui/Tooltip';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  pinned: boolean;
  source: 'system' | 'git' | 'editor' | 'terminal';
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Notification[];
  onNotificationAction: (id: string, action: string) => void;
  className?: string;
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onNotificationAction,
  className
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<'all' | 'unread' | 'pinned'>('all');
  const [selectedSource, setSelectedSource] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set(['today']));

  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, notification) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    const notificationDate = new Date(notification.timestamp);
    
    let group = 'older';
    if (notificationDate.toDateString() === today.toDateString()) {
      group = 'today';
    } else if (notificationDate.toDateString() === yesterday.toDateString()) {
      group = 'yesterday';
    } else if (today.getTime() - notificationDate.getTime() < 7 * 24 * 60 * 60 * 1000) {
      group = 'thisWeek';
    }
    
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(notification);
    return acc;
  }, {} as Record<string, Notification[]>);

  // Filter notifications
  const filteredNotifications = Object.entries(groupedNotifications).reduce(
    (acc, [group, notifications]) => {
      acc[group] = notifications.filter(notification => {
        if (filter === 'unread' && notification.read) return false;
        if (filter === 'pinned' && !notification.pinned) return false;
        if (selectedSource && notification.source !== selectedSource) return false;
        return true;
      });
      return acc;
    },
    {} as Record<string, Notification[]>
  );

  // Source icons
  const sourceIcons = {
    system: Info,
    git: GitCommit,
    editor: FileText,
    terminal: Terminal
  };

  // Type icons and styles
  const typeConfig = {
    info: { icon: Info, color: 'blue' },
    success: { icon: Check, color: 'green' },
    warning: { icon: AlertTriangle, color: 'yellow' },
    error: { icon: XCircle, color: 'red' }
  };

  // Format relative time
  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'just now';
    if (minutes === 1) return '1 minute ago';
    if (minutes < 60) return `${minutes} minutes ago`;
    if (hours === 1) return '1 hour ago';
    if (hours < 24) return `${hours} hours ago`;
    if (days === 1) return 'yesterday';
    return `${days} days ago`;
  };

  // Toggle group expansion
  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
      } else {
        next.add(group);
      }
      return next;
    });
  };

  if (!isOpen) return null;

  return (
    <div className={cn(
      "fixed inset-y-0 right-0 w-96",
      "bg-gray-900/95 backdrop-blur-sm",
      "border-l border-gray-800",
      "flex flex-col",
      "animate-in slide-in-from-right duration-200",
      className
    )}>
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-200">Notifications</h2>
          <div className="flex items-center gap-2">
            <Tooltip content="Refresh">
              <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800">
                <RefreshCw className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Settings">
              <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800">
                <Settings className="w-4 h-4" />
              </button>
            </Tooltip>
            <Tooltip content="Close">
              <button 
                onClick={onClose}
                className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>
            </Tooltip>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-2.5 py-1.5 rounded-md text-sm",
              "transition-colors duration-200",
              filter === 'all'
                ? "bg-blue-500/10 text-blue-400"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              "px-2.5 py-1.5 rounded-md text-sm",
              "transition-colors duration-200",
              filter === 'unread'
                ? "bg-blue-500/10 text-blue-400"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            )}
          >
            Unread
          </button>
          <button
            onClick={() => setFilter('pinned')}
            className={cn(
              "px-2.5 py-1.5 rounded-md text-sm",
              "transition-colors duration-200",
              filter === 'pinned'
                ? "bg-blue-500/10 text-blue-400"
                : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
            )}
          >
            Pinned
          </button>
          <div className="flex-1" />
          <Tooltip content="Filter by Source">
            <button className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800">
              <Filter className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Notification List */}
      <div className="flex-1 overflow-y-auto">
        {Object.entries(filteredNotifications).map(([group, notifications]) => {
          if (notifications.length === 0) return null;

          const isExpanded = expandedGroups.has(group);
          const groupTitle = {
            today: 'Today',
            yesterday: 'Yesterday',
            thisWeek: 'This Week',
            older: 'Older'
          }[group];

          return (
            <div key={group} className="border-b border-gray-800 last:border-0">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group)}
                className={cn(
                  "w-full px-4 py-2",
                  "flex items-center justify-between",
                  "text-sm font-medium",
                  "hover:bg-gray-800/50",
                  "transition-colors duration-200"
                )}
              >
                <span className="text-gray-400">{groupTitle}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">
                    {notifications.length} 
                    {notifications.length === 1 ? ' notification' : ' notifications'}
                  </span>
                  {isExpanded ? (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-500" />
                  )}
                </div>
              </button>

              {/* Notifications */}
              {isExpanded && (
                <div className="divide-y divide-gray-800">
                  {notifications.map(notification => {
                    const TypeIcon = typeConfig[notification.type].icon;
                    const SourceIcon = sourceIcons[notification.source];

                    return (
                      <div
                        key={notification.id}
                        className={cn(
                          "p-4 hover:bg-gray-800/30",
                          "transition-colors duration-200",
                          !notification.read && "bg-gray-800/20"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          {/* Type Icon */}
                          <div className={cn(
                            "flex-none w-8 h-8",
                            "flex items-center justify-center",
                            "rounded-lg",
                            notification.type === 'info' && "bg-blue-500/20 text-blue-400",
                            notification.type === 'success' && "bg-green-500/20 text-green-400",
                            notification.type === 'warning' && "bg-yellow-500/20 text-yellow-400",
                            notification.type === 'error' && "bg-red-500/20 text-red-400"
                          )}>
                            <TypeIcon className="w-4 h-4" />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-medium text-gray-200">
                                {notification.title}
                              </h3>
                              {notification.pinned && (
                                <Pin className="w-3 h-3 text-blue-400" />
                              )}
                            </div>
                            <p className="text-sm text-gray-400 mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <SourceIcon className="w-3 h-3" />
                                <span>{notification.source}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatRelativeTime(notification.timestamp)}</span>
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex-none flex items-center gap-1">
                            {notification.action && (
                              <Tooltip content={notification.action.label}>
                                <button
                                  onClick={() => notification.action?.onClick()}
                                  className="p-1.5 rounded-md text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                >
                                  <Zap className="w-4 h-4" />
                                </button>
                              </Tooltip>
                            )}
                            <Tooltip content={notification.pinned ? 'Unpin' : 'Pin'}>
                              <button
                                onClick={() => onNotificationAction(notification.id, 'pin')}
                                className={cn(
                                  "p-1.5 rounded-md",
                                  "transition-colors duration-200",
                                  notification.pinned
                                    ? "text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
                                    : "text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                                )}
                              >
                                <Pin className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Archive">
                              <button
                                onClick={() => onNotificationAction(notification.id, 'archive')}
                                className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                              >
                                <Archive className="w-4 h-4" />
                              </button>
                            </Tooltip>
                            <Tooltip content="Delete">
                              <button
                                onClick={() => onNotificationAction(notification.id, 'delete')}
                                className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Empty State */}
        {Object.values(filteredNotifications).every(group => group.length === 0) && (
          <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-800/50 mb-4">
              <BellOff className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-sm font-medium text-gray-300 mb-1">
              No notifications
            </h3>
            <p className="text-xs text-gray-500">
              {filter === 'all'
                ? "You're all caught up!"
                : filter === 'unread'
                ? "No unread notifications"
                : "No pinned notifications"}
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex-none p-4 border-t border-gray-800">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            {Object.values(filteredNotifications)
              .reduce((acc, group) => acc + group.length, 0)} notifications
          </span>
          <button
            onClick={() => onNotificationAction('all', 'clear')}
            className="text-gray-400 hover:text-gray-300"
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
} 