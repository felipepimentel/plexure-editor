import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { BaseForm, BaseFormField, BaseFormInput, BaseFormTextArea } from '../ui/Form';
import { BaseButton } from '../ui/Button';

interface SpecificationEditorProps {
  initialValues?: {
    name: string;
    version: string;
    content: string;
  };
  darkMode: boolean;
  onSave: (values: { name: string; version: string; content: string }) => void;
  onCancel: () => void;
}

export function SpecificationEditor({
  initialValues,
  darkMode,
  onSave,
  onCancel
}: SpecificationEditorProps) {
  const [values, setValues] = useState({
    name: initialValues?.name || '',
    version: initialValues?.version || '1.0.0',
    content: initialValues?.content || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(values);
  };

  return (
    <BaseForm onSubmit={handleSubmit} darkMode={darkMode} spacing="md" padding>
      <BaseFormField label="Name" darkMode={darkMode}>
        <BaseFormInput
          type="text"
          value={values.name}
          onChange={(e) => setValues(prev => ({ ...prev, name: e.target.value }))}
          required
          darkMode={darkMode}
        />
      </BaseFormField>

      <BaseFormField label="Version" darkMode={darkMode}>
        <BaseFormInput
          type="text"
          value={values.version}
          onChange={(e) => setValues(prev => ({ ...prev, version: e.target.value }))}
          required
          darkMode={darkMode}
        />
      </BaseFormField>

      <BaseFormField label="Content" darkMode={darkMode}>
        <BaseFormTextArea
          value={values.content}
          onChange={(e) => setValues(prev => ({ ...prev, content: e.target.value }))}
          rows={10}
          required
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
          icon={<X className="w-4 h-4" />}
        >
          Cancel
        </BaseButton>
        <BaseButton
          type="submit"
          darkMode={darkMode}
          icon={<Save className="w-4 h-4" />}
        >
          Save
        </BaseButton>
      </div>
    </BaseForm>
  );
}