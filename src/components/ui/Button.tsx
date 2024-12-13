import React from 'react';
import { BaseButtonProps } from '@types/ui';
import { variants } from '@constants/theme';

export function BaseButton({
  children,
  variant = 'primary',
  size = 'md',
  darkMode,
  icon,
  fullWidth = false,
  loading = false,
  className = '',
  disabled,
  ...props
}: BaseButtonProps) {
  const variantClasses = variants.button[variant][darkMode ? 'dark' : 'light'];
  
  const baseClasses = `
    font-medium flex items-center justify-center transition-all duration-200
    ${fullWidth ? 'w-full' : ''}
    ${loading ? 'opacity-70 cursor-wait' : disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
    ${size === 'sm' ? 'px-3 py-1.5 text-sm' : size === 'lg' ? 'px-6 py-3 text-lg' : 'px-4 py-2'}
    ${variantClasses}
    rounded-lg
    ${className}
  `;

  return (
    <button
      className={baseClasses}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
      ) : (
        <>
          {icon && <span className="mr-2">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
} 