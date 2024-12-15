import React from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  GitBranch,
  Clock,
  Bell,
  CheckCircle2,
  AlertCircle,
  Wifi,
  WifiOff,
  Lock,
  Users
} from 'lucide-react';

interface StatusBarProps {
  project: {
    name: string;
    branch: string;
    lastSaved?: string;
    collaborators?: number;
    hasChanges?: boolean;
  };
  contract: {
    name: string;
    version: string;
    isValid: boolean;
    lastValidated?: string;
  };
  onNotificationCenterOpen: () => void;
}

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  text: string;
  onClick?: () => void;
  color?: 'default' | 'success' | 'warning' | 'error';
}

function StatusItem({
  icon,
  label,
  text,
  onClick,
  color = 'default'
}: StatusItemProps) {
  return (
    <Tooltip content={label}>
      <button
        onClick={onClick}
        className={cn(
          "h-6 px-2",
          "flex items-center gap-1.5",
          "text-xs",
          "hover:bg-gray-800",
          "transition-colors duration-200",
          color === 'default' && "text-gray-400 hover:text-gray-300",
          color === 'success' && "text-green-400 hover:text-green-300",
          color === 'warning' && "text-yellow-400 hover:text-yellow-300",
          color === 'error' && "text-red-400 hover:text-red-300"
        )}
      >
        {icon}
        <span>{text}</span>
      </button>
    </Tooltip>
  );
}

export function StatusBar({
  project,
  contract,
  onNotificationCenterOpen
}: StatusBarProps) {
  const [isOnline, setIsOnline] = React.useState(true);

  // Monitor online/offline status
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
      "h-6 flex items-center justify-between px-2",
      "bg-gray-900/50 border-t border-gray-800",
      "text-xs text-gray-400"
    )}>
      {/* Left Section */}
      <div className="flex items-center divide-x divide-gray-800">
        <StatusItem
          icon={<GitBranch className="w-3.5 h-3.5" />}
          label="Current Branch"
          text={project.branch}
        />
        {project.lastSaved && (
          <StatusItem
            icon={<Clock className="w-3.5 h-3.5" />}
            label="Last Saved"
            text={project.lastSaved}
          />
        )}
        {project.collaborators && (
          <StatusItem
            icon={<Users className="w-3.5 h-3.5" />}
            label="Active Collaborators"
            text={`${project.collaborators} online`}
          />
        )}
      </div>

      {/* Center Section */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center divide-x divide-gray-800">
        <StatusItem
          icon={contract.isValid ? (
            <CheckCircle2 className="w-3.5 h-3.5" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5" />
          )}
          label="Contract Status"
          text={contract.isValid ? 'Valid' : 'Invalid'}
          color={contract.isValid ? 'success' : 'error'}
        />
        <StatusItem
          icon={<Lock className="w-3.5 h-3.5" />}
          label="Contract Version"
          text={contract.version}
        />
      </div>

      {/* Right Section */}
      <div className="flex items-center divide-x divide-gray-800">
        <StatusItem
          icon={isOnline ? (
            <Wifi className="w-3.5 h-3.5" />
          ) : (
            <WifiOff className="w-3.5 h-3.5" />
          )}
          label="Connection Status"
          text={isOnline ? 'Connected' : 'Offline'}
          color={isOnline ? 'success' : 'error'}
        />
        <StatusItem
          icon={<Bell className="w-3.5 h-3.5" />}
          label="Notifications"
          text="3 new"
          onClick={onNotificationCenterOpen}
          color="warning"
        />
      </div>
    </div>
  );
} 