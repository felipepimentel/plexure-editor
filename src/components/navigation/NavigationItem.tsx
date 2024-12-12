import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

interface NavigationItemProps {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onClick: () => void;
  darkMode: boolean;
  tooltipSide?: 'left' | 'right' | 'top' | 'bottom';
  badge?: number;
  badgeColor?: 'red' | 'blue' | 'green' | 'yellow';
}

export function NavigationItem({
  icon: Icon,
  label,
  isActive,
  onClick,
  darkMode,
  tooltipSide = 'right',
  badge,
  badgeColor = 'blue'
}: NavigationItemProps) {
  const badgeColors = {
    red: 'bg-red-500/20 text-red-400',
    blue: 'bg-blue-500/20 text-blue-400',
    green: 'bg-green-500/20 text-green-400',
    yellow: 'bg-yellow-500/20 text-yellow-400'
  };

  return (
    <Tooltip content={label} side={tooltipSide}>
      <button
        onClick={onClick}
        className={`
          relative p-2 rounded-lg transition-colors
          ${isActive
            ? darkMode
              ? 'bg-gray-800 text-blue-400'
              : 'bg-gray-100 text-blue-600'
            : darkMode
              ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-800/50'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/50'
          }
        `}
      >
        <Icon className="w-5 h-5" />
        {badge !== undefined && (
          <span className={`
            absolute -top-1 -right-1
            min-w-[18px] h-[18px] px-1
            flex items-center justify-center
            rounded-full text-xs font-medium
            ${darkMode ? badgeColors[badgeColor] : 'bg-gray-100 text-gray-600'}
          `}>
            {badge}
          </span>
        )}
      </button>
    </Tooltip>
  );
} 