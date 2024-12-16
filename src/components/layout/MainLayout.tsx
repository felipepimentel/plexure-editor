import React from 'react';
import { ResizableHandle } from '@/components/ui/Resizable';
import { ActivityBar } from '../navigation/ActivityBar';
import { LeftSidebar } from '../navigation/LeftSidebar/LeftSidebar';
import { RightSidebar } from '../navigation/RightSidebar/RightSidebar';
import { Editor } from '../editor/Editor';
import { AppLayout } from './AppLayout';
import {
  Files,
  Search,
  GitBranch,
  Settings,
  Play,
  Users,
  Blocks,
  MessageSquare,
  Bell,
  Bug,
  Network,
  Activity,
  LayoutDashboard,
} from 'lucide-react';

const primaryNavItems = {
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

const secondaryNavItems = {
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

export const MainLayout = () => {
  const [parsedSpec, setParsedSpec] = React.useState(null);

  const leftNav = (
    <ActivityBar 
      className="z-10 shrink-0" 
      position="left"
      topItems={primaryNavItems.top}
      bottomItems={primaryNavItems.bottom}
    />
  );

  const rightNav = (
    <ActivityBar 
      className="z-10 shrink-0" 
      position="right"
      topItems={secondaryNavItems.top}
      bottomItems={secondaryNavItems.bottom}
    />
  );

  return (
    <AppLayout leftNav={leftNav} rightNav={rightNav}>
      <LeftSidebar />
      <ResizableHandle />
      <Editor className="flex-1" onSpecChange={setParsedSpec} />
      <ResizableHandle />
      <RightSidebar parsedSpec={parsedSpec} />
    </AppLayout>
  );
};
