import React from 'react';
import { Lightning, Plus, Copy, FileJson } from 'lucide-react';

interface QuickActionsProps {
  onAddEndpoint: () => void;
  onAddSchema: () => void;
  onDuplicate: () => void;
  onConvert: () => void;
  darkMode: boolean;
}

export function QuickActions({
  onAddEndpoint,
  onAddSchema,
  onDuplicate,
  onConvert,
  darkMode
}: QuickActionsProps) {
  const actions = [
    {
      icon: <Plus />,
      label: 'Add Endpoint',
      onClick: onAddEndpoint,
      description: 'Create a new API endpoint'
    },
    {
      icon: <FileJson />,
      label: 'Add Schema',
      onClick: onAddSchema,
      description: 'Define a new data schema'
    },
    {
      icon: <Copy />,
      label: 'Duplicate',
      onClick: onDuplicate,
      description: 'Duplicate selected item'
    },
    {
      icon: <FileJson />,
      label: 'Convert Format',
      onClick: onConvert,
      description: 'Convert between YAML and JSON'
    }
  ];

  return (
    <div className={`fixed bottom-4 left-4 z-50`}>
      <button
        className={`p-3 rounded-full shadow-lg ${
          darkMode 
            ? 'bg-purple-600 hover:bg-purple-700' 
            : 'bg-purple-500 hover:bg-purple-600'
        } text-white`}
      >
        <Lightning className="w-6 h-6" />
      </button>

      <div className={`absolute bottom-16 left-0 w-64 rounded-lg shadow-xl ${
        darkMode ? 'bg-gray-800' : 'bg-white'
      }`}>
        <div className="p-2 space-y-1">
          {actions.map((action) => (
            <button
              key={action.label}
              onClick={action.onClick}
              className={`w-full p-2 rounded-lg flex items-center gap-2 ${
                darkMode
                  ? 'hover:bg-gray-700 text-gray-200'
                  : 'hover:bg-gray-100 text-gray-800'
              }`}
            >
              {action.icon}
              <div className="text-left">
                <div className="font-medium">{action.label}</div>
                <div className={`text-xs ${
                  darkMode ? 'text-gray-400' : 'text-gray-600'
                }`}>
                  {action.description}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}