import React, { createContext, useContext, useState } from 'react';
import { EditorPreferences } from '../types/preferences';

interface PreferencesContextType {
  preferences: EditorPreferences | null;
  loading: boolean;
  updatePreference: <K extends keyof EditorPreferences>(key: K, value: EditorPreferences[K]) => void;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

const defaultPreferences: EditorPreferences = {
  theme: 'dark',
  font_size: 13,
  tab_size: 2,
  word_wrap: true,
  left_panel_collapsed: false,
  right_panel_collapsed: false,
  left_panel_width: 356,
  right_panel_width: 320
};

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const [preferences, setPreferences] = useState<EditorPreferences>(defaultPreferences);
  const [loading, setLoading] = useState(false);

  const updatePreference = <K extends keyof EditorPreferences>(
    key: K,
    value: EditorPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  return (
    <PreferencesContext.Provider value={{ preferences, loading, updatePreference }}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (context === undefined) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
} 