import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { BaseButton } from '@ui/Button';
import { BaseFormInput } from '@ui/Form';
import { BaseList } from '@ui/List';
import { BaseCard } from '@ui/Card';
import { Specification } from '../../types/specification';

interface SpecificationManagerProps {
  specifications: Specification[];
  selectedSpec: Specification | null;
  darkMode: boolean;
  onSelectSpec: (spec: Specification) => void;
  onCreateSpec: () => void;
  onEditSpec: (spec: Specification) => void;
  onDeleteSpec: (spec: Specification) => void;
}

export function SpecificationManager({
  specifications,
  selectedSpec,
  darkMode,
  onSelectSpec,
  onCreateSpec,
  onEditSpec,
  onDeleteSpec
}: SpecificationManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSpecs = specifications.filter(spec =>
    spec.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    spec.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className={`text-lg font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Specifications
        </h2>
        <BaseButton
          onClick={onCreateSpec}
          darkMode={darkMode}
          icon={<Plus className="w-4 h-4" />}
        >
          New Spec
        </BaseButton>
      </div>

      <div className="relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
          darkMode ? 'text-gray-400' : 'text-gray-500'
        }`} />
        <BaseFormInput
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search ${specifications.length} specification${specifications.length !== 1 ? 's' : ''}...`}
          darkMode={darkMode}
          className="pl-9"
        />
      </div>

      <BaseList
        items={filteredSpecs}
        keyExtractor={(spec) => spec.id}
        darkMode={darkMode}
        layout="grid"
        emptyMessage={
          searchQuery
            ? 'No specifications match your search'
            : 'No specifications available'
        }
        renderItem={(spec) => (
          <BaseCard
            title={spec.name}
            subtitle={spec.description}
            isSelected={selectedSpec?.id === spec.id}
            darkMode={darkMode}
            onSelect={() => onSelectSpec(spec)}
            onEdit={() => onEditSpec(spec)}
            onDelete={() => onDeleteSpec(spec)}
            footer={
              <div className={`mt-3 text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Last updated {new Date(spec.updatedAt).toLocaleDateString()}
              </div>
            }
          />
        )}
      />
    </div>
  );
}