import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';

interface ErrorPanelProps {
  message: string;
  details?: string;
  onClose: () => void;
  onRetry?: () => void;
  darkMode: boolean;
}

export function ErrorPanel({
  message,
  details,
  onClose,
  onRetry,
  darkMode
}: ErrorPanelProps) {
  return (
    <div className={`
      fixed bottom-4 right-4 w-96 rounded-lg shadow-lg
      ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      border
    `}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-full ${
            darkMode ? 'bg-red-900/20' : 'bg-red-50'
          }`}>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          
          <div className="flex-1">
            <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
              {message}
            </h3>
            {details && (
              <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {details}
              </p>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            darkMode={darkMode}
            icon={<X className="w-4 h-4" />}
            aria-label="Close error"
          />
        </div>

        {onRetry && (
          <div className="mt-4 flex justify-end">
            <Button
              onClick={onRetry}
              darkMode={darkMode}
              size="sm"
            >
              Try Again
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}