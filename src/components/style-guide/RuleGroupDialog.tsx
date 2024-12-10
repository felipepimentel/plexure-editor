import React, { useState } from 'react';
import { X } from 'lucide-react';

interface RuleGroupDialogProps {
  darkMode: boolean;
  onSave: (name: string) => void;
  onCancel: () => void;
}

export function RuleGroupDialog({ darkMode, onSave, onCancel }: RuleGroupDialogProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSave(name.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className={`w-96 rounded-lg shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Add Rule Group
          </h3>
          <button
            onClick={onCancel}
            className={`p-1 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-4 h-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Group Name
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
              placeholder="Enter group name"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              className={`px-4 py-2 rounded-lg ${
                darkMode 
                  ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!name.trim()}
            >
              Add Group
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}