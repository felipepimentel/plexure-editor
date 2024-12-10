import React from 'react';
import { Command } from 'lucide-react';

interface ShortcutHintProps {
  keys: string[];
  label: string;
  darkMode: boolean;
}

export function ShortcutHint({ keys, label, darkMode }: ShortcutHintProps) {
  return (
    <div className={`flex items-center gap-1 text-sm ${
      darkMode ? 'text-gray-400' : 'text-gray-600'
    }`}>
      <Command className="w-4 h-4" />
      {keys.map((key, index) => (
        <React.Fragment key={key}>
          <kbd className={`px-1.5 py-0.5 rounded font-mono text-xs ${
            darkMode 
              ? 'bg-gray-700 text-gray-300 border border-gray-600' 
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}>
            {key}
          </kbd>
          {index < keys.length - 1 && <span>+</span>}
        </React.Fragment>
      ))}
      <span className="ml-1">{label}</span>
    </div>
  );
}