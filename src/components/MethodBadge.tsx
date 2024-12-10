import React from 'react';

interface MethodBadgeProps {
  method: string;
}

export function MethodBadge({ method }: MethodBadgeProps) {
  const getMethodStyles = (method: string) => {
    switch (method.toLowerCase()) {
      case 'get':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300';
      case 'post':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'put':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'delete':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      case 'patch':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  return (
    <span className={`uppercase font-mono px-2 py-1 rounded text-sm ${getMethodStyles(method)}`}>
      {method}
    </span>
  );
}