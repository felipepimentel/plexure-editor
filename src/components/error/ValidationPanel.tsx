import React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button/Button';

interface ValidationPanelProps {
  title: string;
  onClose: () => void;
  darkMode: boolean;
  children: React.ReactNode;
}

export function ValidationPanel({
  title,
  onClose,
  darkMode,
  children
}: ValidationPanelProps) {
  return (
    <div className={`
      fixed bottom-0 right-0 w-96 max-h-[50vh] overflow-auto
      ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}
      border-l border-t rounded-tl-lg shadow-lg
    `}>
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className={`font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          {title}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          darkMode={darkMode}
          icon={<X className="w-4 h-4" />}
          aria-label="Close panel"
        />
      </div>
      <div className="p-4">
        {children}
      </div>
    </div>
  );
} 