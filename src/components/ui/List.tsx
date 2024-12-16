import React from 'react';

interface ListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  keyExtractor: (item: T) => string | number;
  emptyMessage?: string;
  loading?: boolean;
  error?: string;
  layout?: 'grid' | 'list';
  className?: string;
  itemClassName?: string;
}

export function List<T>({
  items,
  renderItem,
  keyExtractor,
  emptyMessage = 'No items found',
  loading = false,
  error,
  layout = 'grid',
  className = '',
  itemClassName = ''
}: ListProps<T>) {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-destructive/20 text-destructive">
        {error}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        {emptyMessage}
      </div>
    );
  }

  const containerClasses = `
    ${layout === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'space-y-4'}
    ${className}
  `.trim();

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