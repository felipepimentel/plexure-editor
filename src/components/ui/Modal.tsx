import React from 'react';
import { X } from 'lucide-react';
import { BaseModalProps, BaseModalActionsProps } from '@types/ui';
import { theme } from '@constants/theme';

export function BaseModal({
  children,
  title,
  isOpen,
  onClose,
  darkMode,
  size = 'md'
}: BaseModalProps) {
  if (!isOpen) return null;

  const mode = darkMode ? 'dark' : 'light';
  const themeMode = theme[mode];

  const modalSizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl'
  }[size];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`w-full ${modalSizeClasses} mx-4 rounded-lg shadow-lg ${themeMode.bg.primary}`}>
        {title && (
          <div className={`flex items-center justify-between p-4 border-b ${themeMode.border.primary}`}>
            <h3 className={`font-semibold ${themeMode.text.primary}`}>
              {title}
            </h3>
            <button
              onClick={onClose}
              className={`p-1 rounded ${themeMode.hover.bg}`}
            >
              <X className={`w-4 h-4 ${themeMode.text.tertiary}`} />
            </button>
          </div>
        )}
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function BaseModalActions({
  children,
  darkMode,
  align = 'right'
}: BaseModalActionsProps) {
  const alignmentClasses = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  }[align];

  return (
    <div className={`mt-6 flex items-center gap-2 ${alignmentClasses}`}>
      {children}
    </div>
  );
} 