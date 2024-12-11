import { useState, useEffect } from 'react';

export function useTheme() {
  const [darkMode, setDarkMode] = useState(() => {
    // Verifica se há preferência salva
    const saved = localStorage.getItem('theme');
    if (saved) {
      return saved === 'dark';
    }
    // Se não houver, usa a preferência do sistema
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Atualiza o localStorage e as classes do documento quando o tema muda
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return {
    darkMode,
    toggleDarkMode
  };
} 