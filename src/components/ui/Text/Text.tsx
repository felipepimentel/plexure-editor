import React from 'react';

interface TextProps {
  children: React.ReactNode;
  darkMode: boolean;
  variant?: 'default' | 'small' | 'subtitle';
  className?: string;
}

export function Text({ children, darkMode, variant = 'default', className = '' }: TextProps) {
  const variantClasses = {
    default: darkMode ? 'text-gray-300' : 'text-gray-700',
    small: 'text-xs',
    subtitle: `text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`
  };

  return (
    <span className={`${variantClasses[variant]} ${className}`}>
      {children}
    </span>
  );
} 