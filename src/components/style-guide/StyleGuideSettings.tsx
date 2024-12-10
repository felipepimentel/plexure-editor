import React from 'react';
import { StyleGuide } from '../../types/styleGuide';
import { useStyleGuideStore } from '../../store/styleGuideStore';
import { Download, Upload, Trash2 } from 'lucide-react';

interface StyleGuideSettingsProps {
  guide: StyleGuide;
  darkMode: boolean;
  onClose: () => void;
}

export function StyleGuideSettings({ guide, darkMode, onClose }: StyleGuideSettingsProps) {
  const { importStyleGuide, exportStyleGuide } = useStyleGuideStore();

  const handleImport = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      try {
        const text = await file.text();
        const imported = JSON.parse(text);
        importStyleGuide(imported);
        onClose();
      } catch (error) {
        console.error('Failed to import style guide:', error);
        alert('Failed to import style guide. Please check the file format.');
      }
    };

    input.click();
  };

  const handleExport = () => {
    const exported = exportStyleGuide();
    const blob = new Blob([JSON.stringify(exported, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${guide.name.toLowerCase().replace(/\s+/g, '-')}-v${guide.version}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Style Guide Information
        </h4>
        <div className="space-y-3">
          <div>
            <label className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Name
            </label>
            <div className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {guide.name}
            </div>
          </div>
          <div>
            <label className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Version
            </label>
            <div className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {guide.version}
            </div>
          </div>
          <div>
            <label className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Rules
            </label>
            <div className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {guide.rules.length} total ({guide.rules.filter(r => r.id.startsWith('custom-')).length} custom)
            </div>
          </div>
          {guide.metadata?.lastModified && (
            <div>
              <label className={`block text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Last Modified
              </label>
              <div className={`mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                {new Date(guide.metadata.lastModified).toLocaleDateString()}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Actions
        </h4>
        <div className="space-y-2">
          <button
            onClick={handleImport}
            className={`w-full p-2 rounded-lg flex items-center gap-2 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Import Style Guide
          </button>
          <button
            onClick={handleExport}
            className={`w-full p-2 rounded-lg flex items-center gap-2 ${
              darkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            <Download className="w-4 h-4" />
            Export Style Guide
          </button>
        </div>
      </div>
    </div>
  );
}