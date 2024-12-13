import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  darkMode: boolean;
  variant?: 'default' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export function Button({
  darkMode,
  variant = 'default',
  size = 'md',
  icon,
  children,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center rounded focus:outline-none transition-colors duration-200';
  
  const variantClasses = {
    default: `${darkMode 
      ? 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-800 disabled:text-blue-100' 
      : 'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-200 disabled:text-blue-400'
    }`,
    ghost: `${darkMode
      ? 'text-gray-300 hover:bg-gray-700/50 disabled:text-gray-700'
      : 'text-gray-700 hover:bg-gray-100 disabled:text-gray-300'
    }`
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={`${children ? 'mr-1.5' : ''}`}>{icon}</span>}
      {children}
    </button>
  );
} 