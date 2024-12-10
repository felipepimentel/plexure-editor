import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
  placeholder?: string;
}

export function SearchBar({ value, onChange, darkMode, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
      darkMode ? 'bg-gray-800' : 'bg-gray-100'
    }`}>
      <Search className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full bg-transparent border-none focus:ring-0 ${
          darkMode ? 'text-gray-200' : 'text-gray-800'
        } placeholder-gray-400`}
      />
    </div>
  );
}