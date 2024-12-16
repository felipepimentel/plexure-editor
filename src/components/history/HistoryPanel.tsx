import React from 'react';
import { History } from 'lucide-react';
import { PanelHeader } from '@/components/ui/PanelHeader';

export function HistoryPanel() {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="History"
        icon={History}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="flex-1 overflow-auto p-4">
          {/* History content will go here */}
          <div className="text-muted-foreground">
            History functionality coming soon...
          </div>
        </div>
      )}
    </div>
  );
} 