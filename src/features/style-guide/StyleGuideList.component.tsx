import React from 'react';
import { Book, CheckCircle2 } from 'lucide-react';
import { BaseList } from '../../ui/List';
import { BaseCard } from '../../ui/Card';

interface StyleGuideListProps {
  guides: any[];
  loading?: boolean;
  error?: string;
  darkMode: boolean;
  onSelectGuide: (guide: any) => void;
}

export function StyleGuideList({
  guides,
  loading,
  error,
  darkMode,
  onSelectGuide
}: StyleGuideListProps) {
  return (
    <BaseList
      items={guides}
      loading={loading}
      error={error}
      darkMode={darkMode}
      layout="list"
      emptyMessage={
        <div className={`text-center py-12 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <Book className="w-12 h-12 mx-auto mb-4 opacity-40" />
          <p>No style guides found</p>
          <p className="text-sm mt-1">Create a new style guide to enforce API standards</p>
        </div>
      }
      renderItem={(guide) => (
        <BaseCard
          title={guide.name}
          subtitle={guide.description}
          darkMode={darkMode}
          onSelect={() => onSelectGuide(guide)}
          actions={
            guide.is_active && (
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded text-xs ${
                darkMode
                  ? 'bg-green-900/20 text-green-400'
                  : 'bg-green-50 text-green-700'
              }`}>
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Active</span>
              </div>
            )
          }
          footer={
            <div className={`mt-3 text-xs ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`}>
              {guide.rules.length} rules
            </div>
          }
        />
      )}
      keyExtractor={(guide) => guide.id}
    />
  );
} 