import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface NavigationSearchProps {
  onSearch: (query: string) => void;
  darkMode: boolean;
}

export function NavigationSearch({ onSearch, darkMode }: NavigationSearchProps) {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className={`p-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
        darkMode ? 'bg-gray-700' : 'bg-gray-100'
      }`}>
        <Search className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder="Search endpoints & schemas..."
          className={`w-full bg-transparent border-none focus:ring-0 text-sm ${
            darkMode ? 'text-gray-200' : 'text-gray-800'
          } placeholder-gray-400`}
        />
      </div>
    </div>
  );
}