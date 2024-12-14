import React from 'react';
import { Settings as SettingsIcon, Monitor, Palette, Type, Layout, Code } from 'lucide-react';

export function Settings() {
  const [activeSection, setActiveSection] = React.useState('editor');

  const sections = [
    { id: 'editor', icon: Code, label: 'Editor' },
    { id: 'appearance', icon: Palette, label: 'Appearance' },
    { id: 'layout', icon: Layout, label: 'Layout' },
    { id: 'display', icon: Monitor, label: 'Display' }
  ] as const;

  const renderContent = () => {
    switch (activeSection) {
      case 'editor':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Tab Size
              </label>
              <select className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300">
                <option value="2">2 spaces</option>
                <option value="4">4 spaces</option>
                <option value="8">8 spaces</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Font Size
              </label>
              <select className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300">
                <option value="12">12px</option>
                <option value="14">14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Word Wrap</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        );
      case 'appearance':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Theme
              </label>
              <select className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300">
                <option value="dark">Dark</option>
                <option value="light">Light</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Icon Theme
              </label>
              <select className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300">
                <option value="default">Default</option>
                <option value="minimal">Minimal</option>
                <option value="colorful">Colorful</option>
              </select>
            </div>
          </div>
        );
      case 'layout':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Show Minimap</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Show Breadcrumbs</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        );
      case 'display':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-2">
                Zoom Level
              </label>
              <select className="w-full bg-gray-800/50 border border-gray-700 rounded-md px-3 py-1.5 text-sm text-gray-300">
                <option value="0.8">80%</option>
                <option value="1">100%</option>
                <option value="1.2">120%</option>
                <option value="1.5">150%</option>
              </select>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-300">Smooth Scrolling</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500"></div>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="p-2 border-b border-gray-800 flex items-center gap-2">
        <SettingsIcon className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-300">Settings</span>
      </div>

      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className="w-40 border-r border-gray-800 p-2">
          {sections.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-2 px-3 py-1.5 rounded-md text-sm ${
                activeSection === id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:text-gray-300'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
} 