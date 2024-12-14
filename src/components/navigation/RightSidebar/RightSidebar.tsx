import React from 'react';
import { ChevronLeft, ChevronRight, GripVertical } from 'lucide-react';
import { APIPreview } from '@/components/preview/APIPreview';

interface RightSidebarProps {
  collapsed: boolean;
  width: number;
  onCollapse: (collapsed: boolean) => void;
  onResize: () => void;
  parsedSpec: {
    info: {
      title: string;
      version: string;
      description?: string;
    };
    endpoints: {
      path: string;
      method: string;
      summary: string;
      description?: string;
    }[];
    schemas: {
      name: string;
      type: string;
      required: string[];
      properties: Record<string, {
        type: string;
        format?: string;
        description?: string;
      }>;
    }[];
  } | null;
}

export function RightSidebar({ collapsed, width, onCollapse, onResize, parsedSpec }: RightSidebarProps) {
  return (
    <div 
      className={`flex flex-col border-l border-white/[0.05] bg-gray-900/90 transition-all duration-200 ${
        collapsed ? 'w-0' : ''
      }`}
      style={{ width: collapsed ? 0 : width }}
    >
      {!collapsed && (
        <>
          {parsedSpec ? (
            <APIPreview
              info={parsedSpec.info}
              endpoints={parsedSpec.endpoints}
              schemas={parsedSpec.schemas}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500 text-sm">
              No valid OpenAPI specification
            </div>
          )}
        </>
      )}
      <button
        onClick={() => onCollapse(!collapsed)}
        className="absolute right-0 top-1/2 -translate-y-1/2 p-1 bg-gray-800 rounded-l border border-white/[0.05] text-gray-400 hover:text-gray-300"
      >
        {collapsed ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      {!collapsed && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize group hover:bg-blue-500/20"
          onMouseDown={onResize}
        >
          <div className="absolute left-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
            <GripVertical className="w-4 h-4 text-blue-500" />
          </div>
        </div>
      )}
    </div>
  );
} 