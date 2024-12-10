import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Name
        </label>
        <input
          type="text"
          value={values.name}
          onChange={(e) => setValues(prev => ({ ...prev, name: e.target.value }))}
          className={`w-full rounded-lg px-3 py-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Version
        </label>
        <input
          type="text"
          value={values.version}
          onChange={(e) => setValues(prev => ({ ...prev, version: e.target.value }))}
          className={`w-full rounded-lg px-3 py-2 ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-1 ${
          darkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Content
        </label>
        <textarea
          value={values.content}
          onChange={(e) => setValues(prev => ({ ...prev, content: e.target.value }))}
          rows={10}
          className={`w-full rounded-lg px-3 py-2 font-mono text-sm ${
            darkMode 
              ? 'bg-gray-700 border-gray-600 text-gray-200' 
              : 'bg-white border-gray-300 text-gray-900'
          }`}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
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
          type="submit"
          className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          Save
        </button>
      </div>
    </form>
  );
}