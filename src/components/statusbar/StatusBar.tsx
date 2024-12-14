import React from 'react';
import { 
  FileJson, 
  GitBranch, 
  Wifi, 
  WifiOff,
  Check,
  AlertCircle,
  Clock
} from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function StatusBar() {
  const { theme } = useTheme();
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);
  const [lastSaved, setLastSaved] = React.useState<Date | null>(null);
  const [validationStatus, setValidationStatus] = React.useState<'valid' | 'invalid' | 'checking'>('checking');

  // Monitor online status
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
    <div className="h-6 border-t border-gray-800 bg-gray-900/90 backdrop-blur-sm flex items-center px-3 text-xs text-gray-400">
      <div className="flex-1 flex items-center gap-4">
        {/* File Type */}
        <div className="flex items-center gap-1.5">
          <FileJson className="w-3.5 h-3.5" />
          <span>OpenAPI (YAML)</span>
        </div>

        {/* Git Info */}
        <div className="flex items-center gap-1.5">
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </div>

        {/* Validation Status */}
        <div className="flex items-center gap-1.5">
          {validationStatus === 'valid' && (
            <>
              <Check className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Valid OpenAPI Schema</span>
            </>
          )}
          {validationStatus === 'invalid' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-yellow-400" />
              <span className="text-yellow-400">Schema Validation Issues</span>
            </>
          )}
          {validationStatus === 'checking' && (
            <>
              <AlertCircle className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-400">Checking Schema...</span>
            </>
          )}
        </div>

        {/* Last Saved */}
        {lastSaved && (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Saved {formatTimeAgo(lastSaved)}</span>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        {/* Connection Status */}
        <div className="flex items-center gap-1.5">
          {isOnline ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-green-400" />
              <span className="text-green-400">Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <span className="text-red-400">Offline</span>
            </>
          )}
        </div>

        {/* Editor Info */}
        <div className="flex items-center gap-3 pl-3 border-l border-gray-800">
          <span>Spaces: 2</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>YAML</span>
        </div>
      </div>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const hours = Math.floor(minutes / 60);

  if (minutes < 1) return 'just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
} 