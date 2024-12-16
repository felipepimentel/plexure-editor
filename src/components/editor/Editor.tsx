import React from 'react';
import { cn } from '@/lib/utils';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { Code } from 'lucide-react';

interface EditorProps {
  className?: string;
  onSpecChange?: (spec: any) => void;
}

export const Editor = ({ className, onSpecChange }: EditorProps) => {
  const [isExpanded, setIsExpanded] = React.useState(true);

  return (
    <div className={cn('flex flex-col h-full', className)}>
      <PanelHeader
        title="Editor"
        icon={Code}
        isExpanded={isExpanded}
        onToggle={() => setIsExpanded(!isExpanded)}
      />
      <div className={cn(
        'flex-1 transition-all duration-300',
        !isExpanded && 'h-0 overflow-hidden'
      )}>
        {/* Editor content goes here */}
        <div className="p-4">
          Editor Content
        </div>
      </div>
    </div>
  );
};
