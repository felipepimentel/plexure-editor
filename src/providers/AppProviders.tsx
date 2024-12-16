import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { PreferencesProvider } from '@/contexts/PreferencesContext';
import { KeyboardShortcutsProvider } from '@/contexts/KeyboardShortcutsContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { AuthProvider } from '@/contexts/AuthContext';
import { EditorProvider } from '@/contexts/EditorContext';
import { TooltipProvider } from '@/components/ui';
import { ActivityBarProvider } from '@/contexts/ActivityBarContext';
import { RightSidebarProvider } from '@/contexts/RightSidebarContext';
import { LeftSidebarProvider } from '@/contexts/LeftSidebarContext';
import { SidebarLayoutProvider } from '@/contexts/SidebarLayoutContext';

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <BrowserRouter future={{
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }}>
      <ThemeProvider>
        <PreferencesProvider>
          <KeyboardShortcutsProvider>
            <NavigationProvider>
              <AuthProvider>
                <EditorProvider>
                  <SidebarLayoutProvider>
                    <ActivityBarProvider>
                      <LeftSidebarProvider>
                        <RightSidebarProvider>
                          <TooltipProvider>
                            {children}
                          </TooltipProvider>
                        </RightSidebarProvider>
                      </LeftSidebarProvider>
                    </ActivityBarProvider>
                  </SidebarLayoutProvider>
                </EditorProvider>
              </AuthProvider>
            </NavigationProvider>
          </KeyboardShortcutsProvider>
        </PreferencesProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
};