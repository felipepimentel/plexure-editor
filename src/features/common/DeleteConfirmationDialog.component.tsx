import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { BaseModal, BaseModalActions } from '../../ui/Modal';
import { BaseButton } from '../../ui/Button';

interface DeleteConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  itemName?: string;
  darkMode: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function DeleteConfirmationDialog({
  isOpen,
  title,
  message,
  itemName,
  darkMode,
  onConfirm,
  onCancel
}: DeleteConfirmationDialogProps) {
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onCancel}
      darkMode={darkMode}
      title={title}
      size="sm"
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            darkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              {message}
            </p>
            {itemName && (
              <p className={`mt-1 text-sm font-medium ${
                darkMode ? 'text-gray-200' : 'text-gray-900'
              }`}>
                {itemName}
              </p>
            )}
          </div>
        </div>

        <BaseModalActions darkMode={darkMode} align="right">
          <BaseButton
            variant="ghost"
            onClick={onCancel}
            darkMode={darkMode}
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="danger"
            onClick={onConfirm}
            darkMode={darkMode}
          >
            Delete
          </BaseButton>
        </BaseModalActions>
      </div>
    </BaseModal>
  );
} 