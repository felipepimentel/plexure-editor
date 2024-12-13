import { useCallback } from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { usePreferences } from '@/contexts/PreferencesContext';
import { useNavigation } from '@/contexts/NavigationContext';
import { useKeyboardShortcuts } from '@/contexts/KeyboardShortcutsContext';
import { toast } from 'react-hot-toast';

export function useAppState() {
  const { theme, toggleTheme } = useTheme();
  const { user, signIn, signOut } = useAuth();
  const { preferences, updatePreference } = usePreferences();
  const { items, activeItem, addItem, removeItem } = useNavigation();
  const { registerShortcut } = useKeyboardShortcuts();

  const handleFileCreate = useCallback(async (name: string, content: string = '') => {
    try {
      const id = addItem('root', {
        name,
        type: 'file',
        path: `/${name}`,
      });
      
      // TODO: Implement file content saving
      toast.success(`File ${name} created successfully`);
      return id;
    } catch (error) {
      toast.error(`Failed to create file: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  }, [addItem]);

  const handleFileDelete = useCallback(async (id: string) => {
    try {
      removeItem(id);
      toast.success('File deleted successfully');
    } catch (error) {
      toast.error(`Failed to delete file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [removeItem]);

  const handleLayoutUpdate = useCallback((updates: Partial<typeof preferences>) => {
    Object.entries(updates).forEach(([key, value]) => {
      updatePreference(key as keyof typeof preferences, value);
    });
    toast.success('Layout updated');
  }, [preferences, updatePreference]);

  const handleThemeToggle = useCallback(() => {
    toggleTheme();
    toast.success(`Theme switched to ${theme === 'dark' ? 'light' : 'dark'} mode`);
  }, [theme, toggleTheme]);

  const handleSignIn = useCallback(async (email: string, password: string) => {
    try {
      await signIn(email, password);
      toast.success('Signed in successfully');
    } catch (error) {
      toast.error(`Failed to sign in: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [signIn]);

  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      toast.success('Signed out successfully');
    } catch (error) {
      toast.error(`Failed to sign out: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }, [signOut]);

  return {
    // State
    theme,
    user,
    preferences,
    items,
    activeItem,

    // Actions
    handleFileCreate,
    handleFileDelete,
    handleLayoutUpdate,
    handleThemeToggle,
    handleSignIn,
    handleSignOut,

    // Utils
    registerShortcut,
  };
} 