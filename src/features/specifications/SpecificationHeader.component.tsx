import React from 'react';
import { Plus, Search } from 'lucide-react';
import { BaseButton } from '../../ui/Button';
import { BaseFormInput } from '../../ui/Form';

interface SpecificationHeaderProps {
  darkMode: boolean;
  onCreateNew: () => void;
  onSearch: (query: string) => void;
  specCount: number;
}

export function SpecificationHeader({ darkMode, onCreateNew, onSearch, specCount }: SpecificationHeaderProps) {
  return (
    <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
      <div className="flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <BaseFormInput
            type="text"
            placeholder={`Search ${specCount} specification${specCount !== 1 ? 's' : ''}...`}
            onChange={(e) => onSearch(e.target.value)}
            darkMode={darkMode}
            className={`pl-9 ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
          />
        </div>
        <BaseButton
          onClick={onCreateNew}
          darkMode={darkMode}
          size="sm"
          icon={<Plus className="w-4 h-4" />}
          className={darkMode 
            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
            : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
          }
        >
          <span className="text-sm font-medium">New Spec</span>
        </BaseButton>
      </div>
    </div>
  );
}