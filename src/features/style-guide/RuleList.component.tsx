import React from 'react';
import { AlertCircle, AlertTriangle, Info, Plus } from 'lucide-react';
import { BaseList } from '@ui/List';
import { BaseCard } from '@ui/Card';
import { BaseButton } from '@ui/Button';
import { StyleRule } from '../../types/styleGuide';

interface RuleListProps {
  rules: StyleRule[];
  selectedRule: StyleRule | null;
  darkMode: boolean;
  onSelectRule: (rule: StyleRule) => void;
  onAddRule: () => void;
  onEditRule: (rule: StyleRule) => void;
  onDeleteRule: (rule: StyleRule) => void;
}

export function RuleList({
  rules,
  selectedRule,
  darkMode,
  onSelectRule,
  onAddRule,
  onEditRule,
  onDeleteRule
}: RuleListProps) {
  const getSeverityIcon = (severity: StyleRule['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Rules ({rules.length})
        </h3>
        <BaseButton
          onClick={onAddRule}
          darkMode={darkMode}
          size="sm"
          icon={<Plus className="w-4 h-4" />}
        >
          Add Rule
        </BaseButton>
      </div>

      <BaseList
        items={rules}
        keyExtractor={(rule) => rule.id}
        darkMode={darkMode}
        layout="list"
        emptyMessage="No rules defined"
        renderItem={(rule) => (
          <BaseCard
            title={rule.name}
            subtitle={rule.description}
            icon={getSeverityIcon(rule.severity)}
            isSelected={selectedRule?.id === rule.id}
            darkMode={darkMode}
            onSelect={() => onSelectRule(rule)}
            onEdit={() => onEditRule(rule)}
            onDelete={() => onDeleteRule(rule)}
            actions={
              <div className={`px-2 py-0.5 rounded text-xs ${
                rule.severity === 'error'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : rule.severity === 'warning'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {rule.severity}
              </div>
            }
          />
        )}
      />
    </div>
  );
}