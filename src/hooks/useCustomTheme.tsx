import React from 'react';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  text: string;
  border: string;
  accent: string;
}

interface Theme {
  id: string;
  name: string;
  colors: ThemeColors;
  font: {
    mono: string;
    sans: string;
  };
}

interface ThemeContextValue {
  currentTheme: Theme;
  themes: Theme[];
  setTheme: (themeId: string) => void;
  addTheme: (theme: Omit<Theme, 'id'>) => void;
  updateTheme: (id: string, theme: Partial<Theme>) => void;
  deleteTheme: (id: string) => void;
  applyTheme: (theme: Theme) => void;
}

const defaultTheme: Theme = {
  id: 'default',
  name: 'Default Dark',
  colors: {
    primary: '#3b82f6',
    secondary: '#6b7280',
    background: '#111827',
    surface: '#1f2937',
    text: '#f3f4f6',
    border: '#374151',
    accent: '#60a5fa'
  },
  font: {
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    sans: 'ui-sans-serif, system-ui, -apple-system, sans-serif'
  }
};

const ThemeContext = React.createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themes, setThemes] = React.useState<Theme[]>(() => {
    const savedThemes = localStorage.getItem('editor-themes');
    return savedThemes ? JSON.parse(savedThemes) : [defaultTheme];
  });

  const [currentThemeId, setCurrentThemeId] = React.useState<string>(() => {
    return localStorage.getItem('editor-current-theme') || defaultTheme.id;
  });

  const currentTheme = React.useMemo(() => {
    return themes.find(t => t.id === currentThemeId) || defaultTheme;
  }, [themes, currentThemeId]);

  // Persist themes
  React.useEffect(() => {
    localStorage.setItem('editor-themes', JSON.stringify(themes));
  }, [themes]);

  // Persist current theme
  React.useEffect(() => {
    localStorage.setItem('editor-current-theme', currentThemeId);
  }, [currentThemeId]);

  const setTheme = React.useCallback((themeId: string) => {
    setCurrentThemeId(themeId);
  }, []);

  const addTheme = React.useCallback((theme: Omit<Theme, 'id'>) => {
    const newTheme: Theme = {
      ...theme,
      id: crypto.randomUUID()
    };
    setThemes(prev => [...prev, newTheme]);
  }, []);

  const updateTheme = React.useCallback((id: string, theme: Partial<Theme>) => {
    setThemes(prev => prev.map(t => 
      t.id === id ? { ...t, ...theme } : t
    ));
  }, []);

  const deleteTheme = React.useCallback((id: string) => {
    if (id === defaultTheme.id) return;
    if (id === currentThemeId) {
      setCurrentThemeId(defaultTheme.id);
    }
    setThemes(prev => prev.filter(t => t.id !== id));
  }, [currentThemeId]);

  const applyTheme = React.useCallback((theme: Theme) => {
    // Apply theme to document root
    const root = document.documentElement;
    const colors = theme.colors;

    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });

    root.style.setProperty('--font-mono', theme.font.mono);
    root.style.setProperty('--font-sans', theme.font.sans);
  }, []);

  // Apply theme on change
  React.useEffect(() => {
    applyTheme(currentTheme);
  }, [currentTheme, applyTheme]);

  const value = React.useMemo(() => ({
    currentTheme,
    themes,
    setTheme,
    addTheme,
    updateTheme,
    deleteTheme,
    applyTheme
  }), [
    currentTheme,
    themes,
    setTheme,
    addTheme,
    updateTheme,
    deleteTheme,
    applyTheme
  ]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useCustomTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error('useCustomTheme must be used within a ThemeProvider');
  }
  return context;
} 