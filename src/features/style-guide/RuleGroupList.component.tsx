import React from 'react';
import { Folder, FolderPlus } from 'lucide-react';
import { useStyleGuideStore } from '../../store/styleGuideStore';
import { BaseList } from '../../components/ui/List';
import { BaseCard } from '../../components/ui/Card';

interface RuleGroupListProps {
  darkMode: boolean;
  selectedGroup: string;
  onSelectGroup: (group: string) => void;
  onAddGroup: () => void;
}

export function RuleGroupList({ darkMode, selectedGroup, onSelectGroup, onAddGroup }: RuleGroupListProps) {
  const { ruleGroups, activeGuide } = useStyleGuideStore();

  const getRuleCount = (group: string) => {
    return activeGuide.rules.filter(rule => rule.group === group).length;
  };

  return (
    <div className="space-y-1">
      <BaseList
        items={ruleGroups}
        keyExtractor={(group) => group}
        darkMode={darkMode}
        layout="list"
        emptyMessage="No groups available"
        renderItem={(group) => (
          <BaseCard
            title={group}
            darkMode={darkMode}
            isSelected={selectedGroup === group}
            onSelect={() => onSelectGroup(group)}
            icon={<Folder className="w-4 h-4" />}
            actions={
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                darkMode ? 'bg-gray-600' : 'bg-gray-300'
              }`}>
                {getRuleCount(group)}
              </span>
            }
          />
        )}
      />
      
      <button
        onClick={onAddGroup}
        className={`w-full px-3 py-2 rounded-lg flex items-center gap-2 ${
          darkMode
            ? 'hover:bg-gray-700/50 text-gray-400'
            : 'hover:bg-gray-100 text-gray-600'
        }`}
      >
        <FolderPlus className="w-4 h-4" />
        <span>Add Group</span>
      </button>
    </div>
  );
}