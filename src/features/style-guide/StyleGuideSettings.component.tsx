import React from 'react';
import { Upload, Download } from 'lucide-react';
import { BaseButton } from '../../ui/Button';

interface StyleGuideSettingsProps {
  guide: {
    id: string;
    name: string;
    rules: any[];
  };
  darkMode: boolean;
  onClose: () => void;
}

export function StyleGuideSettings({ guide, darkMode, onClose }: StyleGuideSettingsProps) {
  const handleImport = () => {
    // Implement import logic
  };

  const handleExport = () => {
    // Implement export logic
  };

  return (
    <div className="space-y-4">
      <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <h4 className={`font-medium mb-4 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          Actions
        </h4>
        <div className="space-y-2">
          <BaseButton
            onClick={handleImport}
            variant="secondary"
            darkMode={darkMode}
            fullWidth
            icon={<Upload className="w-4 h-4" />}
          >
            Import Style Guide
          </BaseButton>
          <BaseButton
            onClick={handleExport}
            variant="secondary"
            darkMode={darkMode}
            fullWidth
            icon={<Download className="w-4 h-4" />}
          >
            Export Style Guide
          </BaseButton>
        </div>
      </div>
    </div>
  );
}