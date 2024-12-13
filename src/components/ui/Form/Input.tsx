import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  darkMode: boolean;
  error?: boolean;
}

export function Input({ darkMode, error, className = '', ...props }: InputProps) {
  return (
    <input
      className={`
        w-full px-3 py-2 rounded-lg border
        ${error
          ? darkMode
            ? 'bg-gray-800 border-red-500 text-white placeholder-gray-500'
            : 'bg-white border-red-300 text-gray-900 placeholder-gray-400'
          : darkMode
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900 placeholder-gray-400'
        }
        focus:ring-2 focus:ring-offset-0
        ${error
          ? 'focus:border-red-500 focus:ring-red-500/20'
          : 'focus:border-blue-500 focus:ring-blue-500/20'
        }
        ${className}
      `}
      aria-invalid={error}
      {...props}
    />
  );
} 