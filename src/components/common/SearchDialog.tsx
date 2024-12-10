import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (query: string) => void;
  darkMode: boolean;
}

export function SearchDialog({ isOpen, onClose, onSearch, darkMode }: SearchDialogProps) {
  const [query, setQuery] = useState('');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-20 z-50">
      <div className={`w-[600px] rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-4">
          <div className="flex items-center gap-2">
            <Search className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search in specification..."
              className={`w-full bg-transparent border-none focus:ring-0 ${
                darkMode ? 'text-gray-200' : 'text-gray-800'
              }`}
              autoFocus
            />
            <button
              onClick={onClose}
              className={`p-1 rounded-lg hover:bg-opacity-80 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
              }`}
            >
              <X className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
        
        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="p-2">
            {/* Search results will be displayed here */}
          </div>
        </div>
      </div>
    </div>
  );
}