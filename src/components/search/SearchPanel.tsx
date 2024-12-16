import React from 'react';
import { Search } from 'lucide-react';
import { PanelHeader } from '@/components/ui/PanelHeader';

export function SearchPanel() {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className="h-full flex flex-col">
      <PanelHeader
        title="Search"
        icon={Search}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      {isExpanded && (
        <div className="flex-1 overflow-auto p-4">
          {/* Search content will go here */}
          <div className="text-muted-foreground">
            Search functionality coming soon...
          </div>
        </div>
      )}
    </div>
  );
} 