import React, { createContext, useContext, useState } from 'react';
import {
  FileJson,
  Code,
  HelpCircle,
  Book,
  Settings2,
  History,
  Bookmark,
  ExternalLink,
} from 'lucide-react';

export interface SidebarItem {
  icon: React.ComponentType<{ className?: string }>;
  tooltip: string;
  id: string;
  panel: React.ReactNode;
}

interface RightSidebarContextType {
  items: SidebarItem[];
  activeItem: string | null;
  setActiveItem: (id: string | null) => void;
}

const RightSidebarContext = createContext<RightSidebarContextType | undefined>(undefined);

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

export function RightSidebarProvider({ children }: { children: React.ReactNode }) {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const items: SidebarItem[] = [
    { 
      icon: FileJson, 
      tooltip: 'Schema', 
      id: 'schema',
      panel: <ExamplePanel title="Schema" />
    },
    { 
      icon: Code, 
      tooltip: 'Code', 
      id: 'code',
      panel: <ExamplePanel title="Code" />
    },
    { 
      icon: HelpCircle, 
      tooltip: 'Help', 
      id: 'help',
      panel: <ExamplePanel title="Help" />
    },
    { 
      icon: Book, 
      tooltip: 'Documentation', 
      id: 'docs',
      panel: <ExamplePanel title="Documentation" />
    },
    { 
      icon: Settings2, 
      tooltip: 'Settings', 
      id: 'settings',
      panel: <ExamplePanel title="Settings" />
    },
    { 
      icon: History, 
      tooltip: 'History', 
      id: 'history',
      panel: <ExamplePanel title="History" />
    },
    { 
      icon: Bookmark, 
      tooltip: 'Bookmarks', 
      id: 'bookmarks',
      panel: <ExamplePanel title="Bookmarks" />
    },
    { 
      icon: ExternalLink, 
      tooltip: 'External Links', 
      id: 'links',
      panel: <ExamplePanel title="External Links" />
    },
  ];

  return (
    <RightSidebarContext.Provider
      value={{
        items,
        activeItem,
        setActiveItem,
      }}
    >
      {children}
    </RightSidebarContext.Provider>
  );
}

export function useRightSidebar() {
  const context = useContext(RightSidebarContext);
  if (context === undefined) {
    throw new Error('useRightSidebar must be used within a RightSidebarProvider');
  }
  return context;
} 