import React from 'react';
import { FileText, Search, Shield, Database } from 'lucide-react';

interface SidebarProps {
  darkMode: boolean;
  onViewChange: (view: string) => void;
  currentView: string;
}

export function Sidebar({ darkMode, onViewChange, currentView }: SidebarProps) {
  const menuItems = [
    { id: 'navigator', icon: FileText, label: 'Navigator' },
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'styleguide', icon: Shield, label: 'Style Guide' },
    { id: 'specifications', icon: Database, label: 'Specifications' }
  ];

  return (
    <div className={`w-12 flex-shrink-0 flex flex-col border-r ${
      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-100 border-gray-200'
    }`}>
      {menuItems.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          onClick={() => onViewChange(id)}
          className={`p-3 relative group ${
            currentView === id
              ? darkMode
                ? 'bg-gray-800'
                : 'bg-white'
              : 'hover:bg-opacity-50'
          }`}
          title={label}
        >
          {currentView === id && (
            <div className={`absolute left-0 top-0 bottom-0 w-0.5 ${
              darkMode ? 'bg-blue-500' : 'bg-blue-600'
            }`} />
          )}
          <Icon className={`w-5 h-5 ${
            currentView === id
              ? darkMode
                ? 'text-blue-500'
                : 'text-blue-600'
              : darkMode
                ? 'text-gray-400'
                : 'text-gray-600'
          }`} />
        </button>
      ))}
    </div>
  );
}