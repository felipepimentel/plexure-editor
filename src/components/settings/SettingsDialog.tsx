import React, { useState } from 'react';
import { X, Monitor, Moon, Sun, Layout, Eye, Keyboard, Save } from 'lucide-react';
import { useAppState } from '@/hooks/useAppState';

interface SettingsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const tabs: SettingsTab[] = [
  { id: 'appearance', label: 'Appearance', icon: <Eye className="w-4 h-4" /> },
  { id: 'layout', label: 'Layout', icon: <Layout className="w-4 h-4" /> },
  { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard className="w-4 h-4" /> },
];

export function SettingsDialog({ isOpen, onClose }: SettingsDialogProps) {
  const { theme, preferences, handleThemeToggle, handleLayoutUpdate } = useAppState();
  const [activeTab, setActiveTab] = useState('appearance');
  const [isDirty, setIsDirty] = useState(false);
  const [localPreferences, setLocalPreferences] = useState(preferences);

  if (!isOpen) return null;

  const handlePreferenceChange = (key: keyof typeof preferences, value: any) => {
    setLocalPreferences(prev => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = () => {
    handleLayoutUpdate(localPreferences);
    setIsDirty(false);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appearance':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Theme</label>
              <div className="flex items-center gap-4">
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    theme === 'light'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={handleThemeToggle}
                >
                  <Sun className="w-4 h-4" />
                  Light
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    theme === 'dark'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={handleThemeToggle}
                >
                  <Moon className="w-4 h-4" />
                  Dark
                </button>
                <button
                  className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors ${
                    theme === 'system'
                      ? 'bg-white/10 text-white'
                      : 'text-gray-400 hover:text-gray-300'
                  }`}
                  onClick={handleThemeToggle}
                >
                  <Monitor className="w-4 h-4" />
                  System
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Font Size</label>
              <input
                type="range"
                min="12"
                max="20"
                value={localPreferences.font_size}
                onChange={(e) => handlePreferenceChange('font_size', Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>12px</span>
                <span>{localPreferences.font_size}px</span>
                <span>20px</span>
              </div>
            </div>
          </div>
        );

      case 'layout':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Panel Layout</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  className={`p-4 rounded-md border ${
                    !localPreferences.left_panel_collapsed
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => handlePreferenceChange('left_panel_collapsed', false)}
                >
                  <div className="flex h-20 gap-2">
                    <div className="w-1/4 bg-white/10 rounded" />
                    <div className="flex-1 bg-white/5 rounded" />
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-400">Show Navigation</p>
                </button>
                <button
                  className={`p-4 rounded-md border ${
                    localPreferences.left_panel_collapsed
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                  onClick={() => handlePreferenceChange('left_panel_collapsed', true)}
                >
                  <div className="flex h-20">
                    <div className="flex-1 bg-white/5 rounded" />
                  </div>
                  <p className="mt-2 text-xs text-center text-gray-400">Hide Navigation</p>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Panel Widths</label>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Navigation Panel</span>
                    <span>{localPreferences.left_panel_width}px</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="500"
                    value={localPreferences.left_panel_width}
                    onChange={(e) => handlePreferenceChange('left_panel_width', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-xs text-gray-400 mb-1">
                    <span>Preview Panel</span>
                    <span>{localPreferences.right_panel_width}px</span>
                  </div>
                  <input
                    type="range"
                    min="200"
                    max="500"
                    value={localPreferences.right_panel_width}
                    onChange={(e) => handlePreferenceChange('right_panel_width', Number(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 'shortcuts':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-medium text-gray-300">Keyboard Shortcuts</label>
                <button className="text-xs text-blue-400 hover:text-blue-300">Reset to Default</button>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Command Palette', shortcut: '⌘ P' },
                  { label: 'Save File', shortcut: '⌘ S' },
                  { label: 'Toggle Navigation', shortcut: '⌘ B' },
                  { label: 'Toggle Preview', shortcut: '⌘ \\' },
                  { label: 'Settings', shortcut: '⌘ ,' },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between py-2 px-3 rounded-md bg-white/5"
                  >
                    <span className="text-sm text-gray-300">{item.label}</span>
                    <kbd className="px-2 py-1 text-xs font-medium rounded bg-white/10 text-gray-400">
                      {item.shortcut}
                    </kbd>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-[800px] max-h-[80vh] overflow-hidden rounded-xl border border-white/10 bg-gray-900/90 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <h2 className="text-lg font-medium text-gray-100">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-300 hover:bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[600px]">
          <div className="w-48 border-r border-white/10">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={`flex items-center gap-2 w-full px-4 py-2 text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'bg-white/10 text-white'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex-1 p-6 overflow-auto">{renderTabContent()}</div>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-white/10">
          <button
            className="px-4 py-2 text-sm text-gray-300 hover:text-gray-200 rounded-md hover:bg-white/5"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md ${
              isDirty
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'bg-white/10 text-gray-400 cursor-not-allowed'
            }`}
            onClick={handleSave}
            disabled={!isDirty}
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 