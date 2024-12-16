import React, { createContext, useContext, useState } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Play,
  Blocks,
  Users,
  Settings,
  MessageSquare,
  Bell,
  Bug,
  Network,
  Activity,
  LayoutDashboard,
} from 'lucide-react';

export interface ActivityBarItem {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  id: string;
  onClick?: () => void;
}

interface ActivityBarContextType {
  primaryItems: {
    top: ActivityBarItem[];
    bottom: ActivityBarItem[];
  };
  secondaryItems: {
    top: ActivityBarItem[];
    bottom: ActivityBarItem[];
  };
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}

const ActivityBarContext = createContext<ActivityBarContextType | undefined>(undefined);

export function ActivityBarProvider({ children }: { children: React.ReactNode }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const primaryItems = {
    top: [
      { icon: Files, tooltip: 'Explorer', id: 'files' },
      { icon: Search, tooltip: 'Search', id: 'search' },
      { icon: GitBranch, tooltip: 'Source Control', id: 'git' },
      { icon: Play, tooltip: 'Run & Debug', id: 'debug' },
      { icon: Blocks, tooltip: 'Extensions', id: 'extensions' },
    ],
    bottom: [
      { icon: Users, tooltip: 'Accounts', id: 'accounts' },
      { icon: Settings, tooltip: 'Settings', id: 'settings' },
    ],
  };

  const secondaryItems = {
    top: [
      { icon: MessageSquare, tooltip: 'Comments', id: 'comments' },
      { icon: Bell, tooltip: 'Notifications', id: 'notifications' },
      { icon: Bug, tooltip: 'Issues', id: 'issues' },
      { icon: Network, tooltip: 'API Status', id: 'api' },
    ],
    bottom: [
      { icon: Activity, tooltip: 'Performance', id: 'performance' },
      { icon: LayoutDashboard, tooltip: 'Layout', id: 'layout' },
      { icon: Settings, tooltip: 'Settings', id: 'settings' },
    ],
  };

  return (
    <ActivityBarContext.Provider
      value={{
        primaryItems,
        secondaryItems,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </ActivityBarContext.Provider>
  );
}

export function useActivityBar() {
  const context = useContext(ActivityBarContext);
  if (context === undefined) {
    throw new Error('useActivityBar must be used within an ActivityBarProvider');
  }
  return context;
} 