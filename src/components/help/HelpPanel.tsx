import React from 'react';
import { HelpCircle } from 'lucide-react';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { useSidebarLayout } from '@/contexts/SidebarLayoutContext';

interface HelpPanelProps {
  parsedSpec?: any;
}

export function HelpPanel({ parsedSpec }: HelpPanelProps) {
  const {
    rightSidebarExpanded: isExpanded,
    toggleRightSidebar: toggleExpanded
  } = useSidebarLayout();

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Help"
        icon={HelpCircle}
        isExpanded={isExpanded}
        onToggle={toggleExpanded}
      />
      <div className="flex-1 overflow-auto p-4">
        {/* Help content will go here */}
        <div className="text-muted-foreground">
          Help functionality coming soon...
        </div>
        {parsedSpec && (
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(parsedSpec, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
} 