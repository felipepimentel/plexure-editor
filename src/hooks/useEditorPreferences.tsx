import React from 'react';
import { EditorPreferences } from '@/types/preferences';

const DEFAULT_PREFERENCES: EditorPreferences = {
  theme: 'vs-dark',
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  left_panel_collapsed: false,
  right_panel_collapsed: false,
  left_panel_width: 250,
  right_panel_width: 300
};

export function useEditorPreferences() {
  const [preferences, setPreferences] = React.useState<EditorPreferences>(() => {
    try {
      const saved = localStorage.getItem('editor_preferences');
      return saved ? { ...DEFAULT_PREFERENCES, ...JSON.parse(saved) } : DEFAULT_PREFERENCES;
    } catch {
      return DEFAULT_PREFERENCES;
    }
  });

  const updatePreferences = React.useCallback((updates: Partial<EditorPreferences>) => {
    setPreferences(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem('editor_preferences', JSON.stringify(next));
      return next;
    });
  }, []);

  return {
    preferences,
    updatePreferences
  };
} 