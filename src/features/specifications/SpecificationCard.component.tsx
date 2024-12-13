import React from 'react';
import { FileJson } from 'lucide-react';
import { Specification } from '../../services/specificationService';
import { SpecificationStats } from './SpecificationStats';
import { BaseCard } from '../../components/ui/Card';

interface SpecificationCardProps {
  specification: Specification;
  isSelected: boolean;
  darkMode: boolean;
  onSelect: (spec: Specification) => void;
  onEdit: (spec: Specification) => void;
  onDelete: (id: string) => void;
}

export function SpecificationCard({
  specification,
  isSelected,
  darkMode,
  onSelect,
  onEdit,
  onDelete
}: SpecificationCardProps) {
  return (
    <BaseCard
      title={specification.name}
      subtitle={specification.description}
      icon={<FileJson size={20} />}
      isSelected={isSelected}
      darkMode={darkMode}
      onSelect={() => onSelect(specification)}
      onEdit={() => onEdit(specification)}
      onDelete={() => onDelete(specification.id)}
      isExpandable
    >
      <SpecificationStats specification={specification} darkMode={darkMode} />
    </BaseCard>
  );
}