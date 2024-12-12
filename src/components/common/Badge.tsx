import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'get' | 'post' | 'put' | 'delete' | 'warning';
  size?: 'sm' | 'md';
}

export function Badge({ children, variant = 'get', size = 'md' }: BadgeProps) {
  const variantStyles = {
    get: 'bg-blue-500/10 text-blue-500',
    post: 'bg-green-500/10 text-green-500',
    put: 'bg-yellow-500/10 text-yellow-500',
    delete: 'bg-red-500/10 text-red-500',
    warning: 'bg-orange-500/10 text-orange-500'
  };

  const sizeStyles = {
    sm: 'px-1.5 py-0.5 text-xs',
    md: 'px-2 py-1 text-sm'
  };

  return (
    <span className={`
      inline-flex items-center font-medium rounded-md
      ${variantStyles[variant]}
      ${sizeStyles[size]}
    `}>
      {children}
    </span>
  );
} 