import React from 'react';
import { Search } from 'lucide-react';
import { BaseFormInput } from '../ui/Form';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  darkMode: boolean;
  placeholder?: string;
}

export function SearchBar({ value, onChange, darkMode, placeholder = 'Search...' }: SearchBarProps) {
  return (
    <div className="relative">
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
        darkMode ? 'text-gray-400' : 'text-gray-500'
      }`} />
      <BaseFormInput
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        darkMode={darkMode}
        className={`pl-9 ${darkMode ? 'bg-gray-800' : 'bg-gray-100'}`}
      />
    </div>
  );
}