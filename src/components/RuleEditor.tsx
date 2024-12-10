import React, { useState } from 'react';
import { Plus, Save, X } from 'lucide-react';
import { StyleRule } from '../types/styleGuide';
import { createCustomRule } from '../utils/ruleValidators';

interface RuleEditorProps {
  onSave: (rule: StyleRule) => void;
  onCancel: () => void;
  darkMode: boolean;
}

export function RuleEditor({ onSave, onCancel, darkMode }: RuleEditorProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<StyleRule['type']>('custom');
  const [severity, setSeverity] = useState<StyleRule['severity']>('warning');
  const [validatorCode, setValidatorCode] = useState(
    'return {\n  valid: true,\n  message: undefined\n};'
  );

  const handleSave = () => {
    try {
      // eslint-disable-next-line no-new-func
      const validatorFn = new Function('value', validatorCode);
      const rule = createCustomRule(name, description, type, severity, validatorFn);
      onSave(rule);
    } catch (error) {
      console.error('Invalid validator function:', error);
    }
  };

  return (
    <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
      <div className="space-y-4">
        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Rule Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`mt-1 block w-full rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
          />
        </div>

        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`mt-1 block w-full rounded-md ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as StyleRule['type'])}
              className={`mt-1 block w-full rounded-md ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="naming">Naming</option>
              <option value="structure">Structure</option>
              <option value="content">Content</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Severity
            </label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as StyleRule['severity'])}
              className={`mt-1 block w-full rounded-md ${
                darkMode 
                  ? 'bg-gray-700 border-gray-600 text-gray-300' 
                  : 'bg-white border-gray-300 text-gray-900'
              } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            >
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </select>
          </div>
        </div>

        <div>
          <label className={`block text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
            Validator Function
          </label>
          <textarea
            value={validatorCode}
            onChange={(e) => setValidatorCode(e.target.value)}
            className={`mt-1 block w-full rounded-md font-mono text-sm ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-300' 
                : 'bg-white border-gray-300 text-gray-900'
            } shadow-sm focus:ring-blue-500 focus:border-blue-500`}
            rows={6}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onCancel}
            className={`px-3 py-2 rounded-md flex items-center gap-1 ${
              darkMode 
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1"
          >
            <Save className="w-4 h-4" />
            Save Rule
          </button>
        </div>
      </div>
    </div>
  );
}