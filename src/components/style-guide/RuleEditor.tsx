import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { StyleRule } from '../../types/styleGuide';
import { CodeEditor } from '../editor/CodeEditor';

interface RuleEditorProps {
  rule?: StyleRule;
  darkMode: boolean;
  onSave: (updates: Partial<StyleRule>) => void;
  onCancel: () => void;
}

export function RuleEditor({ rule, darkMode, onSave, onCancel }: RuleEditorProps) {
  const [name, setName] = useState(rule?.name || '');
  const [description, setDescription] = useState(rule?.description || '');
  const [type, setType] = useState<StyleRule['type']>(rule?.type || 'custom');
  const [severity, setSeverity] = useState<StyleRule['severity']>(rule?.severity || 'warning');
  const [validatorCode, setValidatorCode] = useState(
    rule?.validator.toString() || 
    `function validator(value) {
  // Your validation logic here
  return {
    valid: true,
    message: undefined
  };
}`
  );

  const handleSave = () => {
    try {
      // eslint-disable-next-line no-new-func
      const validatorFn = new Function('return ' + validatorCode)();
      
      onSave({
        name,
        description,
        type,
        severity,
        validator: validatorFn
      });
    } catch (error) {
      console.error('Invalid validator function:', error);
      alert('Invalid validator function. Please check the code.');
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Rule Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={`w-full rounded-lg px-3 py-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Description
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className={`w-full rounded-lg px-3 py-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as StyleRule['type'])}
            className={`w-full rounded-lg px-3 py-2 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="naming">Naming</option>
            <option value="structure">Structure</option>
            <option value="content">Content</option>
            <option value="custom">Custom</option>
          </select>
        </div>

        <div>
          <label className={`block text-sm font-medium mb-1 ${
            darkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>
            Severity
          </label>
          <select
            value={severity}
            onChange={(e) => setSeverity(e.target.value as StyleRule['severity'])}
            className={`w-full rounded-lg px-3 py-2 ${
              darkMode 
                ? 'bg-gray-700 border-gray-600 text-gray-200' 
                : 'bg-white border-gray-300 text-gray-900'
            }`}
          >
            <option value="error">Error</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Validator Function
        </label>
        <div className="h-64 rounded-lg overflow-hidden">
          <CodeEditor
            value={validatorCode}
            onChange={setValidatorCode}
            language="javascript"
            darkMode={darkMode}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={onCancel}
          className={`px-4 py-2 rounded-lg flex items-center gap-1.5 ${
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
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          Save Rule
        </button>
      </div>
    </div>
  );
}