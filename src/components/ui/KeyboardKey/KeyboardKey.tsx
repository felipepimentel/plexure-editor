import React from 'react';

interface KeyboardKeyProps {
  darkMode: boolean;
  children: React.ReactNode;
}

export function KeyboardKey({ darkMode, children }: KeyboardKeyProps) {
  return (
    <kbd className={`px-2 py-1 text-xs font-medium rounded ${
      darkMode
        ? 'bg-gray-800 text-gray-300 border border-gray-700'
        : 'bg-gray-100 text-gray-700 border border-gray-200'
    }`}>
      {children}
    </kbd>
  );
} 