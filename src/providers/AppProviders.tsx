import React from 'react';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '../contexts/ThemeContext';
import { AuthProvider } from '../contexts/AuthContext';
import { PreferencesProvider } from '../contexts/PreferencesContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PreferencesProvider>
          {children}
          <Toaster position="bottom-right" />
        </PreferencesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
} 