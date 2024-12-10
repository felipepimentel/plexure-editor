import React from 'react';
import { Book, ChevronLeft } from 'lucide-react';
import { StyleRule } from '../../types/styleGuide';

// ... rest of the imports and interfaces ...

export function RuleTemplates({ darkMode, onSelectTemplate, onCancel }: RuleTemplatesProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Book className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Rule Templates
          </h3>
        </div>
        <button
          onClick={onCancel}
          className={`p-1.5 rounded hover:bg-opacity-80 ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
        >
          <ChevronLeft className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
        </button>
      </div>

      {/* ... rest of the component remains the same ... */}
    </div>
  );
}