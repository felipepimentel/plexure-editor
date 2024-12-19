import React from 'react';
import {
  CheckCircle2,
  AlertTriangle,
  XCircle,
  X,
  Info,
  Loader2,
} from 'lucide-react';
import { cn } from '../lib/utils';

export type NotificationType = 'success' | 'error' | 'warning' | 'info' | 'loading';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationsProps {
  notifications: Notification[];
  onDismiss: (id: string) => void;
  className?: string;
}

export const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onDismiss,
  className,
}) => {
  const getIcon = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="w-4 h-4 text-success" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'info':
        return <Info className="w-4 h-4 text-primary" />;
      case 'loading':
        return <Loader2 className="w-4 h-4 text-primary animate-spin" />;
    }
  };

  const getProgressColor = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return 'bg-success';
      case 'error':
        return 'bg-destructive';
      case 'warning':
        return 'bg-warning';
      case 'info':
      case 'loading':
        return 'bg-primary';
    }
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full',
        className
      )}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            'relative flex items-start gap-3 p-4 pr-8 rounded-lg border bg-card shadow-lg',
            'animate-in slide-in-from-right-5 fade-in duration-200'
          )}
        >
          {/* Icon */}
          <div className="mt-1">
            {getIcon(notification.type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm">{notification.title}</h3>
            {notification.message && (
              <p className="text-sm text-muted-foreground mt-1">
                {notification.message}
              </p>
            )}
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="text-sm text-primary hover:underline mt-2"
              >
                {notification.action.label}
              </button>
            )}
          </div>

          {/* Close button */}
          <button
            onClick={() => onDismiss(notification.id)}
            className="absolute top-4 right-4 p-1 rounded-sm opacity-70 hover:opacity-100 hover:bg-accent"
          >
            <X className="w-3 h-3" />
          </button>

          {/* Progress bar */}
          {notification.duration && notification.duration > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1">
              <div
                className={cn(
                  'h-full rounded-b-lg transition-all duration-100',
                  getProgressColor(notification.type)
                )}
                style={{
                  animation: `shrink ${notification.duration}ms linear forwards`,
                }}
              />
            </div>
          )}
        </div>
      ))}

      <style jsx>{`
        @keyframes shrink {
          from {
            width: 100%;
          }
          to {
            width: 0%;
          }
        }
      `}</style>
    </div>
  );
};

export default Notifications; 