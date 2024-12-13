import React, { useState } from 'react';
import { Globe, Lock } from 'lucide-react';
import { BaseModal, BaseModalActions } from '../ui/Modal';
import { BaseForm, BaseFormField, BaseFormInput, BaseFormTextArea } from '../ui/Form';
import { BaseButton } from '../ui/Button';

interface NewProjectModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; isPublic: boolean }) => void;
}

export function NewProjectModal({ darkMode, isOpen, onClose, onSubmit }: NewProjectModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isPublic: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      darkMode={darkMode}
      title="Create New Project"
      size="md"
    >
      <BaseForm onSubmit={handleSubmit} darkMode={darkMode} spacing="md">
        <BaseFormField label="Project Name" darkMode={darkMode}>
          <BaseFormInput
            type="text"
            value={formData.name}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Enter project name"
            required
            darkMode={darkMode}
          />
        </BaseFormField>

        <BaseFormField label="Description" darkMode={darkMode}>
          <BaseFormTextArea
            value={formData.description}
            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Enter project description"
            rows={3}
            darkMode={darkMode}
          />
        </BaseFormField>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isPublic: false }))}
            className={`flex-1 p-3 rounded-lg border transition-colors ${
              !formData.isPublic
                ? darkMode
                  ? 'bg-gray-700 border-blue-500'
                  : 'bg-blue-50 border-blue-500'
                : darkMode
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Lock className={`w-5 h-5 ${
                !formData.isPublic
                  ? 'text-blue-500'
                  : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`} />
              <span className={`text-sm font-medium ${
                !formData.isPublic
                  ? 'text-blue-500'
                  : darkMode
                    ? 'text-gray-300'
                    : 'text-gray-700'
              }`}>
                Private
              </span>
              <p className={`text-xs text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Only team members can access
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isPublic: true }))}
            className={`flex-1 p-3 rounded-lg border transition-colors ${
              formData.isPublic
                ? darkMode
                  ? 'bg-gray-700 border-blue-500'
                  : 'bg-blue-50 border-blue-500'
                : darkMode
                  ? 'border-gray-600 hover:border-gray-500'
                  : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <Globe className={`w-5 h-5 ${
                formData.isPublic
                  ? 'text-blue-500'
                  : darkMode
                    ? 'text-gray-400'
                    : 'text-gray-500'
              }`} />
              <span className={`text-sm font-medium ${
                formData.isPublic
                  ? 'text-blue-500'
                  : darkMode
                    ? 'text-gray-300'
                    : 'text-gray-700'
              }`}>
                Public
              </span>
              <p className={`text-xs text-center ${
                darkMode ? 'text-gray-400' : 'text-gray-500'
              }`}>
                Anyone can view the API docs
              </p>
            </div>
          </button>
        </div>

        <BaseModalActions darkMode={darkMode} align="right">
          <BaseButton
            variant="ghost"
            onClick={onClose}
            darkMode={darkMode}
          >
            Cancel
          </BaseButton>
          <BaseButton
            type="submit"
            disabled={!formData.name.trim()}
            darkMode={darkMode}
          >
            Create Project
          </BaseButton>
        </BaseModalActions>
      </BaseForm>
    </BaseModal>
  );
} 