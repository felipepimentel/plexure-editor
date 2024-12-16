import React from 'react';
import { useActivityBar } from '@/contexts/ActivityBarContext';
import { Explorer } from '@/components/explorer/Explorer';
import { SearchPanel } from '@/components/search/SearchPanel';
import { HistoryPanel } from '@/components/history/HistoryPanel';
import { SidebarPanel } from '../SidebarPanel';

export function LeftSidebar() {
  const { activeItem } = useActivityBar();

  return (
    <SidebarPanel position="left">
      {activeItem === 'files' && <Explorer />}
      {activeItem === 'search' && <SearchPanel />}
      {activeItem === 'history' && <HistoryPanel />}
    </SidebarPanel>
  );
} 