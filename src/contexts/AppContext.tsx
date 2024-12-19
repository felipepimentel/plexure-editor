import React from 'react';
import type { Environment } from '../lib/environment-manager';
import type { NotificationType } from '../components/Notifications';

interface AppState {
  isDarkMode: boolean;
  activeTab: string;
  showPreview: boolean;
  isSidebarCollapsed: boolean;
  showValidation: boolean;
  notifications: Array<{
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  }>;
  breadcrumbs: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
  }>;
  environment: Environment | null;
}

interface AppContextValue extends AppState {
  toggleTheme: () => void;
  setActiveTab: (tab: string) => void;
  togglePreview: () => void;
  toggleSidebar: () => void;
  toggleValidation: () => void;
  addNotification: (notification: Omit<AppState['notifications'][0], 'id'>) => void;
  dismissNotification: (id: string) => void;
  setBreadcrumbs: (breadcrumbs: AppState['breadcrumbs']) => void;
  setEnvironment: (environment: Environment | null) => void;
}

const AppContext = React.createContext<AppContextValue | undefined>(undefined);

export const useApp = () => {
  const context = React.useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, setState] = React.useState<AppState>({
    isDarkMode: window.matchMedia('(prefers-color-scheme: dark)').matches,
    activeTab: 'chat',
    showPreview: true,
    isSidebarCollapsed: false,
    showValidation: true,
    notifications: [],
    breadcrumbs: [],
    environment: null,
  });

  // Update theme class on document
  React.useEffect(() => {
    document.documentElement.classList.toggle('dark', state.isDarkMode);
  }, [state.isDarkMode]);

  // Listen for system theme changes
  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      setState(prev => ({ ...prev, isDarkMode: e.matches }));
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setState(prev => ({ ...prev, isDarkMode: !prev.isDarkMode }));
  };

  const setActiveTab = (tab: string) => {
    setState(prev => ({ ...prev, activeTab: tab }));
  };

  const togglePreview = () => {
    setState(prev => ({ ...prev, showPreview: !prev.showPreview }));
  };

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, isSidebarCollapsed: !prev.isSidebarCollapsed }));
  };

  const toggleValidation = () => {
    setState(prev => ({ ...prev, showValidation: !prev.showValidation }));
  };

  const addNotification = (notification: Omit<AppState['notifications'][0], 'id'>) => {
    const id = Math.random().toString(36).slice(2);
    setState(prev => ({
      ...prev,
      notifications: [...prev.notifications, { ...notification, id }],
    }));

    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        dismissNotification(id);
      }, notification.duration);
    }
  };

  const dismissNotification = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.filter(n => n.id !== id),
    }));
  };

  const setBreadcrumbs = (breadcrumbs: AppState['breadcrumbs']) => {
    setState(prev => ({ ...prev, breadcrumbs }));
  };

  const setEnvironment = (environment: Environment | null) => {
    setState(prev => ({ ...prev, environment }));
  };

  const value: AppContextValue = {
    ...state,
    toggleTheme,
    setActiveTab,
    togglePreview,
    toggleSidebar,
    toggleValidation,
    addNotification,
    dismissNotification,
    setBreadcrumbs,
    setEnvironment,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export default AppContext; 