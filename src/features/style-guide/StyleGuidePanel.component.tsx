import React from 'react';
import { Settings, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { useStyleGuideStore } from '../store/styleGuideStore';
import { ValidationResult } from '../types/styleGuide';

interface StyleGuidePanelProps {
  validationResults: ValidationResult[];
  darkMode: boolean;
}

export function StyleGuidePanel({ validationResults, darkMode }: StyleGuidePanelProps) {
  const { activeGuide } = useStyleGuideStore();

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className={`border-l ${darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'} w-80 p-4`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Settings className={`w-5 h-5 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          <h3 className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Style Guide: {activeGuide.name}
          </h3>
        </div>
      </div>

      <div className="space-y-4">
        {validationResults.length === 0 ? (
          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            No style guide violations found
          </p>
        ) : (
          validationResults.map((result, index) => (
            <div
              key={`${result.rule.id}-${index}`}
              className={`p-3 rounded-lg ${
                darkMode ? 'bg-gray-700' : 'bg-gray-50'
              }`}
            >
              <div className="flex items-start gap-2">
                {getSeverityIcon(result.rule.severity)}
                <div>
                  <h4 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    {result.rule.name}
                  </h4>
                  <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    {result.message}
                  </p>
                  {result.path && (
                    <p className={`text-sm mt-1 font-mono ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      at {result.path}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}