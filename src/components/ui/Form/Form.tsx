import React from 'react';

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  spacing?: 'sm' | 'md' | 'lg';
  padding?: boolean;
}

export function Form({
  spacing = 'md',
  padding = true,
  className = '',
  children,
  ...props
}: FormProps) {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6'
  };

  return (
    <form
      className={`
        ${padding ? 'p-4' : ''}
        ${spacingClasses[spacing]}
        ${className}
      `}
      {...props}
    >
      {children}
    </form>
  );
} 