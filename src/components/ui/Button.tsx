import React from 'react';
import { LucideIcon } from 'lucide-react';

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
  darkMode?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export function BaseButton({
  variant = 'default',
  darkMode = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}: BaseButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded focus:outline-none transition-colors duration-200';
  
  const variantClasses = {
    default: `${darkMode 
      ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800 disabled:text-blue-100' 
      : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-200 disabled:text-blue-400'
    }`,
    ghost: `${darkMode
      ? 'text-gray-300 disabled:text-gray-700'
      : 'text-gray-700 disabled:text-gray-300'
    }`
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={`${children ? 'mr-1.5' : ''}`}>{icon}</span>}
      {children}
    </button>
  );
} 