import React from 'react';
import { cn } from '@/utils/cn';
import { motion } from 'framer-motion';
import { Tooltip } from '@/components/ui/Tooltip';
import {
  Files,
  Search,
  Settings,
  GitBranch,
  Package,
  Users,
  MessageSquare,
  PanelLeft,
  PanelRight,
  Command,
  Bell
} from 'lucide-react';

interface ActivityBarProps {
  activePanel: 'explorer' | 'search' | 'extensions';
  onPanelChange: (panel: 'explorer' | 'search' | 'extensions') => void;
  onExplorerToggle: () => void;
  onRightSidebarToggle: () => void;
  onCommandPaletteOpen: () => void;
  onNotificationCenterOpen: () => void;
}

interface ActivityBarItemProps {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
  badge?: number;
  shortcut?: string;
}

function ActivityBarItem({
  icon,
  label,
  isActive,
  onClick,
  badge,
  shortcut
}: ActivityBarItemProps) {
  return (
    <Tooltip
      content={
        <div className="flex flex-col gap-1">
          <div className="font-medium">{label}</div>
          {shortcut && (
            <div className="text-xs text-gray-400">
              Press {shortcut} to toggle
            </div>
          )}
        </div>
      }
      side="right"
    >
      <button
        onClick={onClick}
        className={cn(
          "relative w-12 h-12",
          "flex items-center justify-center",
          "text-gray-400 hover:text-gray-300",
          "transition-colors duration-200",
          "group",
          isActive && "text-gray-200"
        )}
      >
        {/* Active Indicator */}
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="absolute left-0 w-0.5 h-6 bg-blue-400 rounded-r"
            transition={{ duration: 0.2 }}
          />
        )}

        {/* Icon */}
        <div className={cn(
          "w-5 h-5",
          isActive && "text-gray-200"
        )}>
          {icon}
        </div>

        {/* Badge */}
        {badge !== undefined && badge > 0 && (
          <div className={cn(
            "absolute top-2.5 right-2.5",
            "min-w-[18px] h-[18px]",
            "flex items-center justify-center",
            "rounded-full text-xs font-medium",
            "bg-blue-500 text-white"
          )}>
            {badge > 99 ? '99+' : badge}
          </div>
        )}
      </button>
    </Tooltip>
  );
}

export function ActivityBar({
  activePanel,
  onPanelChange,
  onExplorerToggle,
  onRightSidebarToggle,
  onCommandPaletteOpen,
  onNotificationCenterOpen
}: ActivityBarProps) {
  return (
    <div className={cn(
      "flex flex-col items-center",
      "w-12 py-2",
      "bg-gray-900/50 border-r border-gray-800"
    )}>
      {/* Top Section */}
      <div className="flex-1 flex flex-col items-center gap-1">
        <ActivityBarItem
          icon={<Files />}
          label="Explorer"
          isActive={activePanel === 'explorer'}
          onClick={() => onPanelChange('explorer')}
          shortcut="⌘+B"
        />
        <ActivityBarItem
          icon={<Search />}
          label="Search"
          isActive={activePanel === 'search'}
          onClick={() => onPanelChange('search')}
          shortcut="⌘+F"
        />
        <ActivityBarItem
          icon={<GitBranch />}
          label="Source Control"
          badge={3}
          onClick={() => {}}
          shortcut="⌘+G"
        />
        <ActivityBarItem
          icon={<Package />}
          label="Extensions"
          isActive={activePanel === 'extensions'}
          onClick={() => onPanelChange('extensions')}
        />
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col items-center gap-1">
        <ActivityBarItem
          icon={<Users />}
          label="Collaborators"
          badge={2}
          onClick={() => {}}
        />
        <ActivityBarItem
          icon={<MessageSquare />}
          label="Comments"
          badge={5}
          onClick={() => {}}
        />
        <ActivityBarItem
          icon={<PanelLeft />}
          label="Toggle Explorer"
          onClick={onExplorerToggle}
          shortcut="⌘+B"
        />
        <ActivityBarItem
          icon={<PanelRight />}
          label="Toggle Right Sidebar"
          onClick={onRightSidebarToggle}
          shortcut="⌘+K B"
        />
        <ActivityBarItem
          icon={<Command />}
          label="Command Palette"
          onClick={onCommandPaletteOpen}
          shortcut="⌘+P"
        />
        <ActivityBarItem
          icon={<Bell />}
          label="Notifications"
          badge={3}
          onClick={onNotificationCenterOpen}
        />
        <ActivityBarItem
          icon={<Settings />}
          label="Settings"
          onClick={() => {}}
          shortcut="⌘+,"
        />
      </div>
    </div>
  );
} 