import { useState, useEffect, useCallback } from 'react';
import type { EditorSettings } from './useEditorState';

const STORAGE_KEYS = {
  SETTINGS: 'openapi-editor-settings',
  RECENT_FILES: 'openapi-editor-recent-files',
  CURRENT_FILE: 'openapi-editor-current-file',
} as const;

interface RecentFile {
  path: string;
  lastModified: number;
  preview?: string;
}

interface StoredFile {
  content: string;
  path: string;
  lastModified: number;
}

interface EditorStorage {
  settings: EditorSettings | null;
  saveSettings: (settings: EditorSettings) => void;
  recentFiles: RecentFile[];
  addRecentFile: (file: RecentFile) => void;
  removeRecentFile: (path: string) => void;
  currentFile: StoredFile | null;
  saveCurrentFile: (file: StoredFile) => void;
  clearCurrentFile: () => void;
}

export function useEditorStorage(): EditorStorage {
  const [settings, setSettings] = useState<EditorSettings | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return stored ? JSON.parse(stored) : null;
  });

  const [recentFiles, setRecentFiles] = useState<RecentFile[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.RECENT_FILES);
    return stored ? JSON.parse(stored) : [];
  });

  const [currentFile, setCurrentFile] = useState<StoredFile | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.CURRENT_FILE);
    return stored ? JSON.parse(stored) : null;
  });

  // Save settings to local storage
  const saveSettings = useCallback((newSettings: EditorSettings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    setSettings(newSettings);
  }, []);

  // Add a file to recent files
  const addRecentFile = useCallback((file: RecentFile) => {
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.path !== file.path);
      const updated = [file, ...filtered].slice(0, 10); // Keep only 10 most recent files
      localStorage.setItem(STORAGE_KEYS.RECENT_FILES, JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Remove a file from recent files
  const removeRecentFile = useCallback((path: string) => {
    setRecentFiles(prev => {
      const filtered = prev.filter(f => f.path !== path);
      localStorage.setItem(STORAGE_KEYS.RECENT_FILES, JSON.stringify(filtered));
      return filtered;
    });
  }, []);

  // Save current file
  const saveCurrentFile = useCallback((file: StoredFile) => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_FILE, JSON.stringify(file));
    setCurrentFile(file);
    
    // Also add to recent files
    addRecentFile({
      path: file.path,
      lastModified: file.lastModified,
      preview: file.content.slice(0, 100), // Store a preview of the first 100 characters
    });
  }, [addRecentFile]);

  // Clear current file
  const clearCurrentFile = useCallback(() => {
    localStorage.removeItem(STORAGE_KEYS.CURRENT_FILE);
    setCurrentFile(null);
  }, []);

  // Load settings from local storage on mount
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.SETTINGS) {
        const newSettings = e.newValue ? JSON.parse(e.newValue) : null;
        setSettings(newSettings);
      } else if (e.key === STORAGE_KEYS.RECENT_FILES) {
        const newRecentFiles = e.newValue ? JSON.parse(e.newValue) : [];
        setRecentFiles(newRecentFiles);
      } else if (e.key === STORAGE_KEYS.CURRENT_FILE) {
        const newCurrentFile = e.newValue ? JSON.parse(e.newValue) : null;
        setCurrentFile(newCurrentFile);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return {
    settings,
    saveSettings,
    recentFiles,
    addRecentFile,
    removeRecentFile,
    currentFile,
    saveCurrentFile,
    clearCurrentFile,
  };
} 