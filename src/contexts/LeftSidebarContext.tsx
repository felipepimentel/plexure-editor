import React, { createContext, useContext, useState } from 'react';
import {
  Files,
  Search,
  GitBranch,
  Play,
  Blocks,
  Users,
  Settings,
  Terminal,
} from 'lucide-react';

export interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  id: string;
  panel: React.ReactNode;
}

interface LeftSidebarContextType {
  items: SidebarItem[];
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}

const LeftSidebarContext = createContext<LeftSidebarContextType | undefined>(undefined);

const ExamplePanel = ({ title }: { title: string }) => (
  <div className="space-y-4">
    <h3 className="font-medium">{title}</h3>
    <div className="space-y-2">
      <div className="rounded-md border p-3">
        Example content for {title}
      </div>
      <div className="rounded-md border p-3">
        More content for {title}
      </div>
      <div className="rounded-md border p-3">
        Additional content for {title}
      </div>
    </div>
  </div>
);

export function LeftSidebarProvider({ children }: { children: React.ReactNode }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const items: SidebarItem[] = [
    { 
      icon: Files, 
      tooltip: 'Explorer', 
      id: 'explorer',
      panel: <ExamplePanel title="Explorer" />
    },
    { 
      icon: Search, 
      tooltip: 'Search', 
      id: 'search',
      panel: <ExamplePanel title="Search" />
    },
    { 
      icon: GitBranch, 
      tooltip: 'Source Control', 
      id: 'git',
      panel: <ExamplePanel title="Source Control" />
    },
    { 
      icon: Play, 
      tooltip: 'Run and Debug', 
      id: 'debug',
      panel: <ExamplePanel title="Run and Debug" />
    },
    { 
      icon: Blocks, 
      tooltip: 'Extensions', 
      id: 'extensions',
      panel: <ExamplePanel title="Extensions" />
    },
    { 
      icon: Users, 
      tooltip: 'Accounts', 
      id: 'accounts',
      panel: <ExamplePanel title="Accounts" />
    },
    { 
      icon: Settings, 
      tooltip: 'Settings', 
      id: 'settings',
      panel: <ExamplePanel title="Settings" />
    },
    { 
      icon: Terminal, 
      tooltip: 'Terminal', 
      id: 'terminal',
      panel: <ExamplePanel title="Terminal" />
    },
  ];

  return (
    <LeftSidebarContext.Provider
      value={{
        items,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </LeftSidebarContext.Provider>
  );
}

export function useLeftSidebar() {
  const context = useContext(LeftSidebarContext);
  if (context === undefined) {
    throw new Error('useLeftSidebar must be used within a LeftSidebarProvider');
  }
  return context;
} 