import React from 'react';
import { ChevronRight, Circle, AlertTriangle } from 'lucide-react';
import { Badge } from '../common/Badge';

interface NavigationTreeItemProps {
  label: string;
  method?: string;
  path?: string;
  isExpanded?: boolean;
  isSelected?: boolean;
  hasChildren?: boolean;
  level: number;
  darkMode: boolean;
  isDeprecated?: boolean;
  onToggle?: (e?: React.MouseEvent) => void;
  onClick?: () => void;
}

export function NavigationTreeItem({
  label,
  method,
  path,
  isExpanded,
  isSelected,
  hasChildren,
  level,
  darkMode,
  isDeprecated,
  onToggle,
  onClick
}: NavigationTreeItemProps) {
  const getMethodColor = (method?: string) => {
    switch (method?.toLowerCase()) {
      case 'get': return 'text-blue-500';
      case 'post': return 'text-green-500';
      case 'put': return 'text-yellow-500';
      case 'delete': return 'text-red-500';
      case 'patch': return 'text-purple-500';
      default: return darkMode ? 'text-gray-400' : 'text-gray-600';
    }
  };

  return (
    <div
      className={`
        group flex items-center py-1 px-2 rounded-lg cursor-pointer
        transition-colors duration-150
        ${isSelected
          ? darkMode
            ? 'bg-gray-800 text-blue-400'
            : 'bg-gray-100 text-blue-600'
          : darkMode
            ? 'hover:bg-gray-800/50'
            : 'hover:bg-gray-100/50'
        }
      `}
      style={{ paddingLeft: `${(level * 12) + 8}px` }}
      onClick={onClick}
    >
      {hasChildren && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.(e);
          }}
          className={`
            p-0.5 rounded-sm transition-colors
            ${darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}
          `}
        >
          <ChevronRight
            className={`
              w-4 h-4 transition-transform duration-150
              ${isExpanded ? 'rotate-90' : ''}
              ${darkMode ? 'text-gray-400' : 'text-gray-500'}
            `}
          />
        </button>
      )}

      <div className="flex items-center gap-2 ml-1">
        {method && (
          <Badge
            variant={method.toLowerCase() as any}
            size="sm"
            className="uppercase font-mono"
          >
            {method}
          </Badge>
        )}
        
        <span className={`text-sm ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          {label}
        </span>

        {isDeprecated && (
          <AlertTriangle className="w-4 h-4 text-yellow-500" />
        )}
      </div>

      {path && (
        <span className={`
          ml-auto text-xs opacity-0 group-hover:opacity-100 transition-opacity
          ${darkMode ? 'text-gray-500' : 'text-gray-400'}
        `}>
          {path}
        </span>
      )}
    </div>
  );
} 