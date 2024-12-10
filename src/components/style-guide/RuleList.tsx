import React, { useState } from 'react';
import { AlertCircle, AlertTriangle, Info, Edit2, Trash2, Copy, FolderOpen } from 'lucide-react';
import { StyleRule, ValidationResult, RuleGroup } from '../../types/styleGuide';

interface RuleListProps {
  rules: StyleRule[];
  validationResults: ValidationResult[];
  darkMode: boolean;
  onEditRule: (rule: StyleRule) => void;
  onDeleteRule: (ruleId: string) => void;
  onDuplicateRule: (ruleId: string) => void;
  onMoveToGroup: (ruleId: string, groupId: string | null) => void;
  groups: RuleGroup[];
}

export function RuleList({ 
  rules, 
  validationResults = [], 
  darkMode, 
  onEditRule, 
  onDeleteRule,
  onDuplicateRule,
  onMoveToGroup,
  groups
}: RuleListProps) {
  const [showGroupMenu, setShowGroupMenu] = useState<string | null>(null);

  const getSeverityIcon = (severity: StyleRule['severity']) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'info':
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  const getRuleViolations = (ruleId: string) => {
    return validationResults.filter(result => result.rule.id === ruleId);
  };

  if (!rules || rules.length === 0) {
    return (
      <div className={`p-4 text-center ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        No rules available
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4">
      {rules.map(rule => {
        const violations = getRuleViolations(rule.id);
        const isCustomRule = rule.id.startsWith('custom-');

        return (
          <div
            key={rule.id}
            className={`p-4 rounded-lg ${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } ${violations.length > 0 ? 'ring-1 ring-red-500/20' : ''}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                {getSeverityIcon(rule.severity)}
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {rule.name}
                  </h4>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {rule.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {rule.type}
                    </span>
                    {rule.group && (
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-100'
                      }`}>
                        {groups.find(g => g.id === rule.group)?.name}
                      </span>
                    )}
                    {violations.length > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded flex items-center gap-1 ${
                        rule.severity === 'error'
                          ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                          : rule.severity === 'warning'
                          ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
                      }`}>
                        {violations.length} violation{violations.length !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="relative">
                  <button
                    onClick={() => setShowGroupMenu(showGroupMenu === rule.id ? null : rule.id)}
                    className={`p-1.5 rounded hover:bg-opacity-80 ${
                      darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                    }`}
                    title="Move to group"
                  >
                    <FolderOpen className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                  </button>
                  {showGroupMenu === rule.id && (
                    <div className={`absolute right-0 mt-1 w-48 rounded-lg shadow-lg z-10 ${
                      darkMode ? 'bg-gray-700' : 'bg-white'
                    }`}>
                      <div className="py-1">
                        <button
                          onClick={() => {
                            onMoveToGroup(rule.id, null);
                            setShowGroupMenu(null);
                          }}
                          className={`w-full px-4 py-2 text-left text-sm ${
                            darkMode
                              ? 'hover:bg-gray-600 text-gray-200'
                              : 'hover:bg-gray-100 text-gray-700'
                          }`}
                        >
                          No Group
                        </button>
                        {groups.map(group => (
                          <button
                            key={group.id}
                            onClick={() => {
                              onMoveToGroup(rule.id, group.id);
                              setShowGroupMenu(null);
                            }}
                            className={`w-full px-4 py-2 text-left text-sm ${
                              darkMode
                                ? 'hover:bg-gray-600 text-gray-200'
                                : 'hover:bg-gray-100 text-gray-700'
                            }`}
                          >
                            {group.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => onDuplicateRule(rule.id)}
                  className={`p-1.5 rounded hover:bg-opacity-80 ${
                    darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                  }`}
                  title="Duplicate rule"
                >
                  <Copy className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                </button>
                {isCustomRule && (
                  <>
                    <button
                      onClick={() => onEditRule(rule)}
                      className={`p-1.5 rounded hover:bg-opacity-80 ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      title="Edit rule"
                    >
                      <Edit2 className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </button>
                    <button
                      onClick={() => onDeleteRule(rule.id)}
                      className={`p-1.5 rounded hover:bg-opacity-80 ${
                        darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-200'
                      }`}
                      title="Delete rule"
                    >
                      <Trash2 className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
                    </button>
                  </>
                )}
              </div>
            </div>

            {violations.length > 0 && (
              <div className="mt-3 space-y-2">
                {violations.map((violation, index) => (
                  <div
                    key={index}
                    className={`text-sm p-2 rounded ${
                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}
                  >
                    <p className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {violation.message}
                    </p>
                    {violation.path && (
                      <p className={`text-xs mt-1 font-mono ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        at {violation.path}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}