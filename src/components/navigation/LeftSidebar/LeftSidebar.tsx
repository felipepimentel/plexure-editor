import React from 'react';
import { Search } from 'lucide-react';
import { NavigationTree } from '../NavigationTree';
import { BaseSidebar } from '../Sidebar/BaseSidebar';

export function LeftSidebar() {
  return (
    <BaseSidebar position="left">
      <div className="flex-none p-4 border-b border-white/[0.05]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="text"
            placeholder="Search API..."
            className="w-full pl-9 pr-4 py-2 bg-white/[0.05] border border-white/[0.05] rounded-md text-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <NavigationTree className="p-2" />
      </div>
    </BaseSidebar>
  );
} 