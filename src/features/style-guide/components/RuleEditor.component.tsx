import React, { useState } from 'react';
import { BaseForm, BaseFormField, BaseFormInput, BaseFormTextArea, BaseFormSelect } from '../../ui/Form';
import { BaseButton } from '../../ui/Button';
import { StyleRule } from '../../../types/styleGuide';
import { createCustomRule } from '../../../utils/styleGuide';

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
      <BaseForm darkMode={darkMode} spacing="md">
        <BaseFormField label="Rule Name" darkMode={darkMode}>
          <BaseFormInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            darkMode={darkMode}
          />
        </BaseFormField>

        <BaseFormField label="Description" darkMode={darkMode}>
          <BaseFormTextArea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            darkMode={darkMode}
          />
        </BaseFormField>

        <div className="grid grid-cols-2 gap-4">
          <BaseFormField label="Type" darkMode={darkMode}>
            <BaseFormSelect
              value={type}
              onChange={(e) => setType(e.target.value as StyleRule['type'])}
              darkMode={darkMode}
            >
              <option value="naming">Naming</option>
              <option value="structure">Structure</option>
              <option value="content">Content</option>
              <option value="custom">Custom</option>
            </BaseFormSelect>
          </BaseFormField>

          <BaseFormField label="Severity" darkMode={darkMode}>
            <BaseFormSelect
              value={severity}
              onChange={(e) => setSeverity(e.target.value as StyleRule['severity'])}
              darkMode={darkMode}
            >
              <option value="error">Error</option>
              <option value="warning">Warning</option>
              <option value="info">Info</option>
            </BaseFormSelect>
          </BaseFormField>
        </div>

        <BaseFormField label="Validator Function" darkMode={darkMode}>
          <BaseFormTextArea
            value={validatorCode}
            onChange={(e) => setValidatorCode(e.target.value)}
            rows={6}
            darkMode={darkMode}
            className="font-mono text-sm"
          />
        </BaseFormField>

        <div className="flex justify-end gap-2">
          <BaseButton
            type="button"
            variant="ghost"
            onClick={onCancel}
            darkMode={darkMode}
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="button"
            onClick={handleSave}
            darkMode={darkMode}
          >
            Save Rule
          </BaseButton>
        </div>
      </BaseForm>
    </div>
  );
}