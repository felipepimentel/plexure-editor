import React from 'react';
import { Settings } from 'lucide-react';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { useSidebarLayout } from '@/contexts/SidebarLayoutContext';

export function SettingsPanel() {
  const {
    rightSidebarExpanded: isExpanded,
    toggleRightSidebar: toggleExpanded
  } = useSidebarLayout();

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Settings"
        icon={Settings}
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
      />
      <div className="flex-1 overflow-auto p-4">
        {/* Settings content will go here */}
        <div className="text-muted-foreground">
          Settings functionality coming soon...
        </div>
      </div>
    </div>
  );
} 