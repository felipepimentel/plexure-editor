import React from 'react';
import { Edit2, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { BaseCardProps } from '@types/ui';
import { theme } from '@constants/theme';

export function BaseCard({
  title,
  subtitle,
  icon,
  isSelected,
  isExpandable,
  darkMode,
  onSelect,
  onEdit,
  onDelete,
  children,
  actions,
  footer,
  className = ''
}: BaseCardProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const mode = darkMode ? 'dark' : 'light';
  const themeMode = theme[mode];

  const baseClasses = `
    border rounded-lg p-4 transition-all
    ${themeMode.bg.primary} ${themeMode.border.primary} ${themeMode.text.primary}
    ${isSelected ? themeMode.ring.selected : ''}
    ${onSelect ? 'cursor-pointer hover:border-blue-400' : ''}
    ${className}
  `;

  return (
    <div 
      className={baseClasses}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {icon && <div className={themeMode.text.tertiary}>{icon}</div>}
          <div>
            <h3 className={`font-medium ${themeMode.text.primary}`}>
              {title}
            </h3>
            {subtitle && (
              <p className={`text-sm ${themeMode.text.tertiary}`}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {actions}
          {onEdit && (
            <button
              onClick={(e) => { e.stopPropagation(); onEdit(); }}
              className={`p-1 rounded ${themeMode.hover.bg}`}
            >
              <Edit2 size={16} className={themeMode.text.tertiary} />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(); }}
              className={`p-1 rounded ${themeMode.hover.bg}`}
            >
              <Trash2 size={16} className={themeMode.text.tertiary} />
            </button>
          )}
          {isExpandable && (
            <button
              onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
              className={`p-1 rounded ${themeMode.hover.bg}`}
            >
              {isExpanded ? (
                <ChevronDown size={16} className={themeMode.text.tertiary} />
              ) : (
                <ChevronRight size={16} className={themeMode.text.tertiary} />
              )}
            </button>
          )}
        </div>
      </div>

      {isExpanded && children && (
        <div className={`mt-4 border-t pt-4 ${themeMode.border.primary}`}>
          {children}
        </div>
      )}

      {footer && (
        <div className={`mt-4 border-t pt-4 ${themeMode.border.primary}`}>
          {footer}
        </div>
      )}
    </div>
  );
}
