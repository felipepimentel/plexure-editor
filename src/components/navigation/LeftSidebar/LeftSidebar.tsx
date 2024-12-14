import React from 'react';
import { Search, ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { NavigationTree } from '../NavigationTree';

interface LeftSidebarProps {
  collapsed: boolean;
  width: number;
  onCollapse: (collapsed: boolean) => void;
  onResize: () => void;
}

export function LeftSidebar({ collapsed, width, onCollapse, onResize }: LeftSidebarProps) {
  return (
    <div 
      className={`flex flex-col border-r border-white/[0.05] bg-gray-900/90 transition-all duration-200 ${
        collapsed ? 'w-0' : ''
      }`}
      style={{ width: collapsed ? 0 : width }}
    >
      {!collapsed && (
        <>
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
        </>
      )}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="absolute left-0 top-1/2 -translate-y-1/2 p-1 bg-gray-800 rounded-r border border-white/[0.05] text-gray-400 hover:text-gray-300"
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
      {!collapsed && (
        <div
          className="absolute right-0 top-0 bottom-0 w-1 cursor-col-resize group hover:bg-blue-500/20"
          onMouseDown={onResize}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
} 