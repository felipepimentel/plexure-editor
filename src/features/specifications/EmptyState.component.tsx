import React from 'react';
import { FileCode, Plus } from 'lucide-react';
import { BaseButton } from '../../ui/Button';

interface EmptyStateProps {
  darkMode: boolean;
  onCreateNew: () => void;
}

export function EmptyState({ darkMode, onCreateNew }: EmptyStateProps) {
  return (
    <div className="h-full flex items-center justify-center">
      <div className="text-center">
        <div className={`p-4 rounded-2xl backdrop-blur-sm ${
          darkMode ? 'bg-blue-500/10' : 'bg-blue-500/10'
        } ring-1 ring-white/10 inline-block mb-6`}>
          <FileCode className={`w-12 h-12 ${
            darkMode ? 'text-blue-400' : 'text-blue-600'
          }`} />
        </div>

        <h2 className={`text-2xl font-bold mb-3 ${
          darkMode ? 'text-white' : 'text-gray-900'
        }`}>
          No Specifications Yet
        </h2>
        
        <p className={`text-lg mb-8 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`}>
          Create your first API specification to get started
        </p>

        <BaseButton
          onClick={onCreateNew}
          darkMode={darkMode}
          size="lg"
          icon={<Plus className="w-5 h-5" />}
          className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40`}
        >
          Create New Specification
        </BaseButton>
      </div>
    </div>
  );
}