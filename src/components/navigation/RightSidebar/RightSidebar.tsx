import React from 'react';
import { APIPreview } from '@/components/preview/APIPreview';
import { BaseSidebar } from '../Sidebar/BaseSidebar';

interface RightSidebarProps {
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

export function RightSidebar({ parsedSpec }: RightSidebarProps) {
  return (
    <BaseSidebar position="right">
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
    </BaseSidebar>
  );
} 