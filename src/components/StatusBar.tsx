import React from 'react';
import { cn } from '../lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  FileJson,
  FileCode,
  GitBranch,
  GitCommit,
  Clock,
  Loader2,
  Wifi,
  WifiOff
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';

interface StatusBarProps {
  validationMessages: Array<{
    type: 'error' | 'warning' | 'info';
    message: string;
  }>;
  isValidating: boolean;
  currentFile?: {
    name: string;
    path: string;
    type: string;
    size: number;
  };
  className?: string;
}

export const StatusBar: React.FC<StatusBarProps> = ({
  validationMessages,
  isValidating,
  currentFile,
  className
}) => {
  const errors = validationMessages.filter(m => m.type === 'error').length;
  const warnings = validationMessages.filter(m => m.type === 'warning').length;
  const infos = validationMessages.filter(m => m.type === 'info').length;

  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className={cn(
      'flex items-center justify-between h-6 px-2 text-xs border-t bg-muted/50',
      className
    )}>
      {/* Left section */}
      <div className="flex items-center gap-3">
        {/* Validation status */}
        <div className="flex items-center gap-2">
          {isValidating ? (
            <div className="flex items-center gap-1 text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              <span>Validating...</span>
            </div>
          ) : errors > 0 ? (
            <Tooltip content={`${errors} error${errors === 1 ? '' : 's'}`}>
              <div className="flex items-center gap-1 text-destructive">
                <AlertCircle className="h-3 w-3" />
                <span>{errors}</span>
              </div>
            </Tooltip>
          ) : warnings > 0 ? (
            <Tooltip content={`${warnings} warning${warnings === 1 ? '' : 's'}`}>
              <div className="flex items-center gap-1 text-warning">
                <AlertTriangle className="h-3 w-3" />
                <span>{warnings}</span>
              </div>
            </Tooltip>
          ) : (
            <Tooltip content="No issues found">
              <div className="flex items-center gap-1 text-success">
                <CheckCircle2 className="h-3 w-3" />
                <span>Valid</span>
              </div>
            </Tooltip>
          )}
        </div>

        {/* File info */}
        {currentFile && (
          <>
            <div className="h-3 border-l" />
            <div className="flex items-center gap-1 text-muted-foreground">
              <FileCode className="h-3 w-3" />
              <span>{currentFile.name}</span>
              <span className="text-muted-foreground/60">
                ({(currentFile.size / 1024).toFixed(1)} KB)
              </span>
            </div>
          </>
        )}

        {/* Git info (placeholder) */}
        <div className="h-3 border-l" />
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="flex items-center gap-1">
            <GitBranch className="h-3 w-3" />
            <span>main</span>
          </div>
          <div className="flex items-center gap-1">
            <GitCommit className="h-3 w-3" />
            <span>3e7a1f2</span>
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Last saved */}
        {lastSaved && (
          <Tooltip content={lastSaved.toLocaleString()}>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>Saved {formatTimeAgo(lastSaved)}</span>
            </div>
          </Tooltip>
        )}

        {/* Connection status */}
        <div className="h-3 border-l" />
        <Tooltip content={isOnline ? 'Connected' : 'Offline'}>
          <div className={cn(
            'flex items-center gap-1',
            isOnline ? 'text-success' : 'text-destructive'
          )}>
            {isOnline ? (
              <Wifi className="h-3 w-3" />
            ) : (
              <WifiOff className="h-3 w-3" />
            )}
          </div>
        </Tooltip>

        {/* File format */}
        <div className="h-3 border-l" />
        <div className="flex items-center gap-1 text-muted-foreground">
          <FileJson className="h-3 w-3" />
          <span>OpenAPI 3.0.0</span>
        </div>
      </div>
    </div>
  );
};

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

export default StatusBar; 