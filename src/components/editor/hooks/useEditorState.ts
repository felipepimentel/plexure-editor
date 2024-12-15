import { useState, useCallback } from 'react';
import * as monaco from 'monaco-editor';

interface EditorSettings {
  theme: 'vs-dark' | 'vs-light';
  fontSize: number;
  minimap: boolean;
  wordWrap: 'on' | 'off';
  tabSize: number;
  rulers: boolean;
  renderWhitespace: 'none' | 'boundary' | 'selection' | 'trailing' | 'all';
}

interface EditorState {
  settings: EditorSettings;
  updateSettings: (newSettings: Partial<EditorSettings>) => void;
  applySettings: (editor: monaco.editor.IStandaloneCodeEditor) => void;
  isDirty: boolean;
  setIsDirty: (dirty: boolean) => void;
  history: string[];
  addToHistory: (content: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  currentHistoryIndex: number;
  undo: () => string | undefined;
  redo: () => string | undefined;
}

const MAX_HISTORY_SIZE = 50;

export function useEditorState(initialSettings?: Partial<EditorSettings>): EditorState {
  // Editor settings
  const [settings, setSettings] = useState<EditorSettings>({
    theme: 'vs-dark',
    fontSize: 14,
    minimap: true,
    wordWrap: 'on',
    tabSize: 2,
    rulers: true,
    renderWhitespace: 'selection',
    ...initialSettings
  });

  // File state
  const [isDirty, setIsDirty] = useState(false);

  // History state
  const [history, setHistory] = useState<string[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(-1);

  const updateSettings = useCallback((newSettings: Partial<EditorSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const applySettings = useCallback((editor: monaco.editor.IStandaloneCodeEditor) => {
    editor.updateOptions({
      theme: settings.theme,
      fontSize: settings.fontSize,
      minimap: { enabled: settings.minimap },
      wordWrap: settings.wordWrap,
      tabSize: settings.tabSize,
      rulers: settings.rulers ? [80] : [],
      renderWhitespace: settings.renderWhitespace,
    });
  }, [settings]);

  const addToHistory = useCallback((content: string) => {
    setHistory(prev => {
      // Remove future history if we're not at the latest point
      const newHistory = prev.slice(0, currentHistoryIndex + 1);
      
      // Add new content if it's different from the last entry
      if (newHistory[newHistory.length - 1] !== content) {
        newHistory.push(content);
        
        // Trim history if it exceeds max size
        if (newHistory.length > MAX_HISTORY_SIZE) {
          newHistory.shift();
        }
      }
      
      setCurrentHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [currentHistoryIndex]);

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(prev => prev - 1);
      return history[currentHistoryIndex - 1];
    }
    return undefined;
  }, [currentHistoryIndex, history]);

  const redo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(prev => prev + 1);
      return history[currentHistoryIndex + 1];
    }
    return undefined;
  }, [currentHistoryIndex, history]);

  return {
    settings,
    updateSettings,
    applySettings,
    isDirty,
    setIsDirty,
    history,
    addToHistory,
    canUndo: currentHistoryIndex > 0,
    canRedo: currentHistoryIndex < history.length - 1,
    currentHistoryIndex,
    undo,
    redo,
  };
} 