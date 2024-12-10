import React, { useState } from 'react';
import { Shield, Plus, Settings, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { StyleRule } from '../../types/styleGuide';
import { useStyleGuideStore } from '../../store/styleGuideStore';
import { RuleList } from './RuleList';
import { RuleEditor } from './RuleEditor';
import { RuleTemplates } from './RuleTemplates';
import { StyleGuideSettings } from './StyleGuideSettings';

interface StyleGuidePanelProps {
  validationResults: any[];
  darkMode: boolean;
  onClose: () => void;
}

export function StyleGuidePanel({ validationResults = [], darkMode, onClose }: StyleGuidePanelProps) {
  const [mode, setMode] = useState<'view' | 'edit' | 'templates' | 'settings'>('view');
  const [selectedRule, setSelectedRule] = useState<StyleRule | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { 
    activeGuide, 
    addCustomRule, 
    updateCustomRule, 
    removeCustomRule, 
    duplicateRule,
    ruleGroups,
    moveRuleToGroup
  } = useStyleGuideStore();

  const handleEditRule = (rule: StyleRule) => {
    setSelectedRule(rule);
    setMode('edit');
  };

  const handleUpdateRule = (updates: Partial<StyleRule>) => {
    if (selectedRule) {
      updateCustomRule(selectedRule.id, updates);
      setMode('view');
      setSelectedRule(null);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    if (confirm('Are you sure you want to delete this rule?')) {
      removeCustomRule(ruleId);
    }
  };

  const handleAddRule = (rule: StyleRule) => {
    addCustomRule(rule);
    setMode('view');
  };

  const renderContent = () => {
    switch (mode) {
      case 'edit':
        return selectedRule ? (
          <RuleEditor
            rule={selectedRule}
            darkMode={darkMode}
            onSave={handleUpdateRule}
            onCancel={() => {
              setMode('view');
              setSelectedRule(null);
            }}
          />
        ) : null;
      case 'templates':
        return (
          <RuleTemplates
            darkMode={darkMode}
            onSelectTemplate={handleAddRule}
            onCancel={() => setMode('view')}
          />
        );
      case 'settings':
        return (
          <StyleGuideSettings
            guide={activeGuide}
            darkMode={darkMode}
            onClose={() => setMode('view')}
          />
        );
      default:
        return (
          <div className="flex flex-col h-full">
            <div className="flex-none p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-3 py-1.5 rounded-lg text-sm ${
                    !selectedCategory
                      ? darkMode
                        ? 'bg-gray-700 text-gray-200'
                        : 'bg-gray-200 text-gray-800'
                      : darkMode
                      ? 'text-gray-400 hover:text-gray-200'
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  All Rules ({activeGuide.rules.length})
                </button>
                {['error', 'warning', 'info'].map((severity) => {
                  const count = validationResults.filter(r => r.rule.severity === severity).length;
                  if (count === 0) return null;
                  
                  const Icon = severity === 'error' 
                    ? AlertCircle 
                    : severity === 'warning' 
                    ? AlertTriangle 
                    : Info;

                  return (
                    <button
                      key={severity}
                      onClick={() => setSelectedCategory(severity)}
                      className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 ${
                        selectedCategory === severity
                          ? darkMode
                            ? 'bg-gray-700 text-gray-200'
                            : 'bg-gray-200 text-gray-800'
                          : darkMode
                          ? 'text-gray-400 hover:text-gray-200'
                          : 'text-gray-600 hover:text-gray-800'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {count} {severity}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <RuleList
                rules={activeGuide.rules.filter(rule => 
                  !selectedCategory || rule.severity === selectedCategory
                )}
                validationResults={validationResults}
                darkMode={darkMode}
                onEditRule={handleEditRule}
                onDeleteRule={handleDeleteRule}
                onDuplicateRule={duplicateRule}
                onMoveToGroup={moveRuleToGroup}
                groups={ruleGroups}
              />
            </div>
          </div>
        );
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`p-3 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
            <div>
              <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {activeGuide.name}
              </h3>
              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {validationResults.length} {validationResults.length === 1 ? 'issue' : 'issues'} found
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMode('templates')}
              className={`p-1.5 rounded-lg hover:bg-opacity-80 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Add Rule"
            >
              <Plus className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
            <button
              onClick={() => setMode('settings')}
              className={`p-1.5 rounded-lg hover:bg-opacity-80 ${
                darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
              }`}
              title="Settings"
            >
              <Settings className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}