import React from 'react';
import { Specification } from '../../services/specificationService';
import { SpecificationCard } from './SpecificationCard.component';
import { BaseList } from '../../components/ui/List';

interface SpecificationListProps {
  specifications: Specification[];
  currentSpec: Specification | null;
  darkMode: boolean;
  onSelect: (spec: Specification) => void;
  onDelete: (id: string) => void;
  onEdit: (spec: Specification) => void;
  loading?: boolean;
  error?: string;
}

export function SpecificationList({
  specifications,
  currentSpec,
  darkMode,
  onSelect,
  onDelete,
  onEdit,
  loading,
  error
}: SpecificationListProps) {
  return (
    <BaseList
      items={specifications}
      renderItem={(spec) => (
        <SpecificationCard
          specification={spec}
          isSelected={currentSpec?.id === spec.id}
          darkMode={darkMode}
          onSelect={onSelect}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
      keyExtractor={(spec) => spec.id}
      loading={loading}
      error={error}
      darkMode={darkMode}
      layout="grid"
      emptyMessage="No specifications found"
      className="gap-4"
    />
  );
}