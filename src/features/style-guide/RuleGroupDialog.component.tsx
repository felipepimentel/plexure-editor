import React, { useState } from 'react';
import { BaseModal, BaseModalActions } from '../ui/Modal';
import { BaseForm, BaseFormField, BaseFormInput } from '../ui/Form';
import { BaseButton } from '../ui/Button';

interface RuleGroupDialogProps {
  darkMode: boolean;
  isOpen: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function RuleGroupDialog({ darkMode, isOpen, onSave, onCancel }: RuleGroupDialogProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      darkMode={darkMode}
      title="Add Rule Group"
      size="sm"
    >
      <BaseForm onSubmit={handleSubmit} darkMode={darkMode} spacing="md">
        <BaseFormField label="Group Name" darkMode={darkMode}>
          <BaseFormInput
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter group name"
            autoFocus
            darkMode={darkMode}
          />
        </BaseFormField>

        <BaseModalActions darkMode={darkMode} align="right">
          <BaseButton
            variant="ghost"
            onClick={onCancel}
            darkMode={darkMode}
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            disabled={!name.trim()}
            darkMode={darkMode}
          >
            Add Group
          </BaseButton>
        </BaseModalActions>
      </BaseForm>
    </BaseModal>
  );
}