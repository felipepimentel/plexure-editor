import React from 'react';
import { Book } from 'lucide-react';
import { StyleRule } from '../types/styleGuide';

interface RuleTemplateSelectorProps {
  onSelect: (template: StyleRule) => void;
  darkMode: boolean;
}

const RULE_TEMPLATES: StyleRule[] = [
  {
    id: 'template-camelcase-properties',
    name: 'Camel Case Properties',
    description: 'Ensures all schema properties use camelCase naming',
    type: 'naming',
    severity: 'warning',
    validator: (schema: any) => {
      const isCamelCase = (str: string) => /^[a-z][a-zA-Z0-9]*$/.test(str);
      const properties = schema?.properties || {};
      const invalidProps = Object.keys(properties).filter(prop => !isCamelCase(prop));
      
      return {
        valid: invalidProps.length === 0,
        message: invalidProps.length > 0 
          ? `Properties must use camelCase: ${invalidProps.join(', ')}` 
          : undefined
      };
    }
  },
  {
    id: 'template-required-examples',
    name: 'Required Examples',
    description: 'Ensures all schema properties have examples',
    type: 'content',
    severity: 'info',
    validator: (schema: any) => {
      const properties = schema?.properties || {};
      const propsWithoutExample = Object.entries(properties)
        .filter(([_, prop]: [string, any]) => !prop.example && !prop.examples)
        .map(([name]) => name);
      
      return {
        valid: propsWithoutExample.length === 0,
        message: propsWithoutExample.length > 0
          ? `Properties missing examples: ${propsWithoutExample.join(', ')}`
          : undefined
      };
    }
  },
  {
    id: 'template-semantic-versioning',
    name: 'Semantic Versioning',
    description: 'Ensures API version follows semantic versioning',
    type: 'structure',
    severity: 'error',
    validator: (info: any) => {
      const semverRegex = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
      const version = info?.version;
      
      return {
        valid: semverRegex.test(version),
        message: !semverRegex.test(version)
          ? 'Version must follow semantic versioning (x.y.z)'
          : undefined
      };
    }
  }
];

export function RuleTemplateSelector({ onSelect, darkMode }: RuleTemplateSelectorProps) {
  return (
    <div className={`rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} p-4`}>
      <div className="flex items-center gap-2 mb-4">
        <Book className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
        <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Rule Templates
        </h3>
      </div>
      
      <div className="space-y-3">
        {RULE_TEMPLATES.map(template => (
          <button
            key={template.id}
            onClick={() => onSelect(template)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              darkMode
                ? 'hover:bg-gray-700 bg-gray-800'
                : 'hover:bg-gray-100 bg-gray-50'
            }`}
          >
            <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {template.name}
            </h4>
            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              {template.description}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className={`text-xs px-2 py-1 rounded ${
                darkMode ? 'bg-gray-700' : 'bg-gray-200'
              }`}>
                {template.type}
              </span>
              <span className={`text-xs px-2 py-1 rounded ${
                template.severity === 'error'
                  ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300'
                  : template.severity === 'warning'
                  ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300'
              }`}>
                {template.severity}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}