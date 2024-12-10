import React, { useState } from 'react';
import { Settings, Plus } from 'lucide-react';
import { useStyleGuideStore } from '../store/styleGuideStore';
import { RuleEditor } from './RuleEditor';
import { RuleTemplateSelector } from './RuleTemplateSelector';
import { StyleRule } from '../types/styleGuide';

interface StyleGuideManagerProps {
  darkMode: boolean;
}

export function StyleGuideManager({ darkMode }: StyleGuideManagerProps) {
  const [showRuleEditor, setShowRuleEditor] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const { activeGuide, addCustomRule, removeCustomRule } = useStyleGuideStore();

  const handleAddRule = (rule: StyleRule) => {
    addCustomRule(rule);
    setShowRuleEditor(false);
    setShowTemplates(false);
  };

  return (
    <div className={`border-l ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} w-80 p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Style Guide Manager
          </h3>
        </div>
        <button
          onClick={() => {
            setShowRuleEditor(true);
            setShowTemplates(false);
          }}
          className={`p-2 rounded-lg ${
            darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
          }`}
          title="Add custom rule"
        >
          <Plus className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        </button>
      </div>

      {showRuleEditor ? (
        <RuleEditor
          onSave={handleAddRule}
          onCancel={() => setShowRuleEditor(false)}
          darkMode={darkMode}
        />
      ) : showTemplates ? (
        <RuleTemplateSelector
          onSelect={handleAddRule}
          darkMode={darkMode}
        />
      ) : (
        <div className="space-y-4">
          <button
            onClick={() => setShowTemplates(true)}
            className={`w-full p-3 rounded-lg text-left ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600'
                : 'bg-blue-50 hover:bg-blue-100'
            }`}
          >
            <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-blue-700'}`}>
              Use Rule Template
            </h4>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-blue-600'}`}>
              Start with pre-configured rule templates
            </p>
          </button>

          <div className="space-y-2">
            <h4 className={`font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Active Rules
            </h4>
            {activeGuide.rules.map(rule => (
              <div
                key={rule.id}
                className={`p-3 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h5 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                      {rule.name}
                    </h5>
                    <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {rule.description}
                    </p>
                  </div>
                  {rule.id.startsWith('custom-') && (
                    <button
                      onClick={() => removeCustomRule(rule.id)}
                      className={`text-sm ${
                        darkMode ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-700'
                      }`}
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}