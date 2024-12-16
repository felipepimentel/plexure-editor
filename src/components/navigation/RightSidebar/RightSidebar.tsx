import React from 'react';
import { cn } from '@/lib/utils';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { useRightSidebar, type SidebarItem } from '@/contexts/RightSidebarContext';
import { useSidebarLayout } from '@/contexts/SidebarLayoutContext';

interface RightSidebarProps {
  className?: string;
  parsedSpec?: any;
}

export const RightSidebar = ({ className }: RightSidebarProps) => {
  const { items, activeItem, setActiveItem } = useRightSidebar();
  const { 
    rightSidebarExpanded, 
    setRightSidebarExpanded,
    rightPanelExpanded,
    setRightPanelExpanded,
  } = useSidebarLayout();

  const activeItemData = items.find(item => item.id === activeItem);
  const Icon = activeItemData?.icon;

  return (
    <div className={cn('flex h-full', className)}>
      {/* Content Panel */}
      {rightSidebarExpanded && activeItem && (
        <div className="w-80 border-l bg-background overflow-hidden flex flex-col">
          <PanelHeader
            title={activeItemData?.tooltip || ''}
            icon={Icon}
            isExpanded={rightPanelExpanded}
            onToggle={() => setRightPanelExpanded(!rightPanelExpanded)}
            position="right"
          />

          {/* Content */}
          <div className={cn(
            'transition-all duration-300 ease-in-out',
            rightPanelExpanded ? 'flex-1 overflow-auto' : 'h-0',
          )}>
            <div className="p-4">
              {activeItemData?.panel}
            </div>
          </div>
        </div>
      )}

      {/* Icons Bar */}
      <TooltipProvider>
        <div className={cn(
          'flex h-full w-12 flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          'border-l shrink-0'
        )}>
          {/* Top Actions */}
          <div className="flex flex-col items-center gap-1 py-2">
            {items.map((item) => (
              <SidebarItemButton
                key={item.id}
                {...item}
                isActive={activeItem === item.id}
                onClick={() => {
                  if (activeItem === item.id) {
                    setActiveItem(null);
                    setRightSidebarExpanded(false);
                  } else {
                    setActiveItem(item.id);
                    setRightSidebarExpanded(true);
                    setRightPanelExpanded(true);
                  }
                }}
              />
            ))}
          </div>
        </div>
      </TooltipProvider>
    </div>
  );
};

interface SidebarItemButtonProps extends SidebarItem {
  isActive: boolean;
  onClick: () => void;
}

const SidebarItemButton = ({
  icon: Icon,
  tooltip,
  isActive,
  onClick,
}: SidebarItemButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            'h-10 w-10 rounded-md',
            isActive && 'bg-muted text-primary',
            !isActive && 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
          )}
          onClick={onClick}
        >
          <Icon className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left" className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
}; 