import React, { useState } from 'react';
import { X, Globe, Lock } from 'lucide-react';

interface NewProjectModalProps {
  darkMode: boolean;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string; isPublic: boolean }) => void;
}

export function NewProjectModal({ darkMode, onClose, onSubmit }: NewProjectModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className={`w-full max-w-md rounded-xl shadow-lg ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className={`text-lg font-semibold ${
            darkMode ? 'text-white' : 'text-gray-900'
          }`}>
            Create New Project
          </h2>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <X className={`w-5 h-5 ${
              darkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Project Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
              placeholder="Enter project name"
              required
            />
          </div>

          <div>
            <label className={`block text-sm font-medium mb-1 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className={`w-full px-3 py-2 rounded-lg border outline-none transition-colors ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-blue-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-blue-500'
              }`}
              placeholder="Enter project description"
              rows={3}
            />
          </div>

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
        </form>

        <div className={`p-4 border-t flex justify-end gap-3 ${
          darkMode ? 'border-gray-700' : 'border-gray-200'
        }`}>
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'text-gray-300 hover:bg-gray-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!formData.name.trim()}
            className={`px-4 py-2 rounded-lg ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-50'
                : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
            }`}
          >
            Create Project
          </button>
        </div>
      </div>
    </div>
  );
} 