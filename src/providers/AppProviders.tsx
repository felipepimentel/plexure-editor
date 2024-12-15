import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { KeyboardShortcutsProvider } from '@/contexts/KeyboardShortcutsContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { EditorProvider } from '@/contexts/EditorContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <PreferencesProvider>
          <KeyboardShortcutsProvider>
            <NavigationProvider>
              <AuthProvider>
                <EditorProvider>
                  {children}
                </EditorProvider>
              </AuthProvider>
            </NavigationProvider>
          </KeyboardShortcutsProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
} 