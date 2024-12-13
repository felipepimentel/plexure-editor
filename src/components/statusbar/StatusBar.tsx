import React, { useState, useEffect } from 'react';
import { GitBranch, Wifi, Clock, HardDrive, Zap, FileJson, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Tooltip } from '@/components/ui/Tooltip';

interface StatusBarProps {
  className?: string;
}

export function StatusBar({ className = '' }: StatusBarProps) {
  const { theme } = useTheme();
  const { user } = useAuth();
  const [time, setTime] = useState(new Date());
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet';
    const diff = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
  };

  return (
    <div className={`h-6 flex items-center justify-between px-4 text-xs bg-gray-900/90 text-gray-400 border-t border-white/[0.05] ${className}`}>
      <div className="flex items-center space-x-4">
        <Tooltip content="Current branch">
          <div className="flex items-center gap-1">
            <GitBranch className="w-3.5 h-3.5" />
            <span>main</span>
          </div>
        </Tooltip>
        <Tooltip content="Connection status">
          <div className="flex items-center gap-1">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-emerald-400">Connected</span>
          </div>
        </Tooltip>
        <Tooltip content="Last saved">
          <div className="flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5" />
            <span>{formatLastSaved()}</span>
          </div>
        </Tooltip>
      </div>
      <div className="flex items-center space-x-4">
        <Tooltip content="Current file">
          <div className="flex items-center gap-1">
            <FileJson className="w-3.5 h-3.5 text-blue-400" />
            <span>swagger.yaml</span>
          </div>
        </Tooltip>
        <Tooltip content="Active users">
          <div className="flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>2 online</span>
          </div>
        </Tooltip>
        <Tooltip content="Editor status">
          <div className="flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Ready</span>
          </div>
        </Tooltip>
        <Tooltip content="Current time">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{time.toLocaleTimeString()}</span>
          </div>
        </Tooltip>
      </div>
    </div>
  );
} 