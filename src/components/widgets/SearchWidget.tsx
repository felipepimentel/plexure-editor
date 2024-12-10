import React, { useState, useMemo } from 'react';
import { Widget } from './Widget';
import { SearchBar } from '../search/SearchBar';
import { SearchResult } from '../search/SearchResult';
import { searchSpecification } from '../../utils/search';

interface SearchWidgetProps {
  darkMode: boolean;
  spec: any;
}

export function SearchWidget({ darkMode, spec }: SearchWidgetProps) {
  const [query, setQuery] = useState('');

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchSpecification(spec, query);
  }, [spec, query]);

  return (
    <Widget title="Search" darkMode={darkMode}>
      <div className="p-4 flex flex-col h-full">
        <SearchBar
          value={query}
          onChange={setQuery}
          darkMode={darkMode}
          placeholder="Search in specification..."
        />
        <div className="mt-4 flex-1 overflow-auto">
          {query.trim() && searchResults.length === 0 ? (
            <div className={`text-center py-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              No results found
            </div>
          ) : (
            <div className="space-y-2">
              {searchResults.map((result, index) => (
                <SearchResult
                  key={`${result.type}-${index}`}
                  {...result}
                  darkMode={darkMode}
                  onClick={() => {
                    // Handle navigation to the result
                    console.log('Navigate to:', result.path);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Widget>
  );
}