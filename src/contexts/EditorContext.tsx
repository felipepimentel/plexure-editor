import React from 'react';
import { EditorPreferences, EditorState } from '@/types/preferences';
import { useEditorPreferences } from '@/hooks/useEditorPreferences';

interface EditorContextType {
  content: string;
  setContent: (content: string) => void;
  preferences: EditorPreferences;
  updatePreferences: (updates: Partial<EditorPreferences>) => void;
  state: EditorState;
  updateState: (updates: Partial<EditorState>) => void;
}

const EditorContext = React.createContext<EditorContextType | undefined>(undefined);

const DEFAULT_STATE: EditorState = {
  content: '',
  cursorPosition: {
    line: 1,
    column: 1
  },
  selection: null,
  scrollPosition: {
    scrollTop: 0,
    scrollLeft: 0
  }
};

export function EditorProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = React.useState('');
  const { preferences, updatePreferences } = useEditorPreferences();
  const [state, setState] = React.useState<EditorState>(DEFAULT_STATE);

  const updateState = React.useCallback((updates: Partial<EditorState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const value = React.useMemo(() => ({
    content,
    setContent,
    preferences,
    updatePreferences,
    state,
    updateState
  }), [content, preferences, state, updatePreferences, updateState]);

  return (
    <EditorContext.Provider value={value}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  const context = React.useContext(EditorContext);
  if (context === undefined) {
    throw new Error('useEditor must be used within an EditorProvider');
  }
  return context;
} 