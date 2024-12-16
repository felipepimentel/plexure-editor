import React from 'react';
import { useActivityBar } from '@/contexts/ActivityBarContext';
import { SettingsPanel } from '@/components/settings/SettingsPanel';
import { HelpPanel } from '@/components/help/HelpPanel';
import { SidebarPanel } from '../SidebarPanel';

interface RightSidebarProps {
  parsedSpec?: any;
}

export function RightSidebar({ parsedSpec }: RightSidebarProps) {
  const { activeItem } = useActivityBar();

  return (
    <SidebarPanel position="right">
      {activeItem === 'settings' && <SettingsPanel />}
      {activeItem === 'help' && <HelpPanel parsedSpec={parsedSpec} />}
    </SidebarPanel>
  );
} 