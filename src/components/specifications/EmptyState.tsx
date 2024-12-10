import React from 'react';
import { FileJson, Plus } from 'lucide-react';

interface EmptyStateProps {
  darkMode: boolean;
  onCreateNew: () => void;
}

export function EmptyState({ darkMode, onCreateNew }: EmptyStateProps) {
  return (
    <div className="h-full flex flex-col items-center justify-center p-8">
      <div className={`p-4 rounded-full mb-4 ${
        darkMode ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <FileJson className={`w-8 h-8 ${
          darkMode ? 'text-gray-400' : 'text-gray-600'
        }`} />
      </div>
      
      <h3 className={`text-lg font-medium mb-2 ${
        darkMode ? 'text-gray-200' : 'text-gray-800'
      }`}>
        No specifications yet
      </h3>
      
      <p className={`text-sm text-center mb-6 max-w-sm ${
        darkMode ? 'text-gray-400' : 'text-gray-600'
      }`}>
        Create your first API specification to get started with documentation and testing
      </p>

      <button
        onClick={onCreateNew}
        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
          darkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
        }`}
      >
        <Plus className="w-4 h-4" />
        <span className="font-medium">New Specification</span>
      </button>
    </div>
  );
}