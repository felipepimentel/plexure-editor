import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

interface ValidationBadgeProps {
  isValid: boolean;
  errorCount: number;
  warningCount: number;
  darkMode: boolean;
}

export function ValidationBadge({ 
  isValid, 
  errorCount, 
  warningCount, 
  darkMode 
}: ValidationBadgeProps) {
  if (isValid) {
    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded ${
        darkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
      }`}>
        <CheckCircle className="w-4 h-4" />
        <span className="text-sm">Valid</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-2 py-1 rounded ${
      darkMode ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'
    }`}>
      <XCircle className="w-4 h-4" />
      <div className="text-sm">
        {errorCount > 0 && <span className="mr-2">{errorCount} errors</span>}
        {warningCount > 0 && <span>{warningCount} warnings</span>}
      </div>
    </div>
  );
}