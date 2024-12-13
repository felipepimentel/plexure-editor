import React from 'react';
import { BaseListProps } from '@types/ui';

export function BaseList<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items found',
  loading = false,
  error,
  darkMode,
  layout = 'grid',
  className = '',
  itemClassName = ''
}: BaseListProps<T>) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/20 text-red-200' : 'bg-red-50 text-red-600'}`}>
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={`flex items-center justify-center p-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        {emptyMessage}
      </div>
    );
  }

  const containerClasses = `
    ${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}
    ${className}
  `;

  return (
    <div className={containerClasses}>
      {items.map((item, index) => (
        <div key={keyExtractor(item)} className={itemClassName}>
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
} 