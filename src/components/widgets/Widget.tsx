import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface WidgetProps {
  children: React.ReactNode;
  title: string;
  darkMode: boolean;
  onClose?: () => void;
}

export function Widget({ children, title, darkMode, onClose }: WidgetProps) {
  return (
    <div className="h-full flex flex-col">
      <div className={`flex items-center justify-between px-4 py-2 border-b ${
        darkMode ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
      }`}>
        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {title}
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-opacity-80 ${
              darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
            }`}
          >
            <ChevronLeft className={`w-4 h-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          </button>
        )}
      </div>
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
}