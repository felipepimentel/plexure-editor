import React from 'react';
import { cn } from '@/lib/utils';
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from '@/components/ui';
import { CollapseIcon } from '@/components/ui/CollapseIcon';
import { useActivityBar, type ActivityBarItem } from '@/contexts/ActivityBarContext';
import { useSidebarLayout } from '@/contexts/SidebarLayoutContext';

interface ActivityBarProps {
  className?: string;
  position?: 'left' | 'right';
}

export const ActivityBar = ({ 
  className,
  position = 'left',
}: ActivityBarProps) => {
  const { primaryItems, secondaryItems, activeItem, setActiveItem } = useActivityBar();
  const {
    leftSidebarExpanded,
    rightSidebarExpanded,
    setLeftSidebarExpanded,
    setRightSidebarExpanded,
    leftActivityBarExpanded,
    rightActivityBarExpanded,
    setLeftActivityBarExpanded,
    setRightActivityBarExpanded,
  } = useSidebarLayout();
  
  const items = position === 'left' ? primaryItems : secondaryItems;
  const isExpanded = position === 'left' ? leftSidebarExpanded : rightSidebarExpanded;
  const setExpanded = position === 'left' ? setLeftSidebarExpanded : setRightSidebarExpanded;
  const isActivityBarExpanded = position === 'left' ? leftActivityBarExpanded : rightActivityBarExpanded;
  const setActivityBarExpanded = position === 'left' ? setLeftActivityBarExpanded : setRightActivityBarExpanded;

  return (
    <TooltipProvider>
      <div className={cn(
        'flex h-full w-12 flex-col bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
        position === 'left' ? 'border-r' : 'border-l',
        'shrink-0',
        className
      )}>
        {/* Top Actions */}
        <div className="flex flex-col items-center gap-1 py-2">
          {items.top.map((item) => (
            <ActivityBarItem
              key={item.id}
              {...item}
              isActive={activeItem === item.id}
              onClick={() => {
                if (activeItem === item.id) {
                  setActiveItem(null);
                  setExpanded(false);
                } else {
                  setActiveItem(item.id);
                  setExpanded(true);
                }
              }}
              tooltipSide={position === 'left' ? 'right' : 'left'}
            />
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="mt-auto flex flex-col items-center gap-1 border-t py-2">
          {items.bottom.map((item) => (
            <ActivityBarItem
              key={item.id}
              {...item}
              isActive={activeItem === item.id}
              onClick={() => {
                if (activeItem === item.id) {
                  setActiveItem(null);
                  setExpanded(false);
                } else {
                  setActiveItem(item.id);
                  setExpanded(true);
                }
              }}
              tooltipSide={position === 'left' ? 'right' : 'left'}
            />
          ))}

          {/* Collapse/Expand Button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <CollapseIcon
                  expanded={isActivityBarExpanded}
                  position={position}
                  onClick={() => setActivityBarExpanded(!isActivityBarExpanded)}
                  className="h-10 w-10"
                />
              </div>
            </TooltipTrigger>
            <TooltipContent side={position === 'left' ? 'right' : 'left'} className="text-xs">
              {isActivityBarExpanded ? 'Collapse Activity Bar' : 'Expand Activity Bar'}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  );
};

interface ActivityBarItemProps extends ActivityBarItem {
  isActive: boolean;
  tooltipSide: 'left' | 'right';
}

const ActivityBarItem = ({
  icon: Icon,
  tooltip,
  isActive,
  onClick,
  tooltipSide
}: ActivityBarItemProps) => {
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
      <TooltipContent side={tooltipSide} className="text-xs">
        {tooltip}
      </TooltipContent>
    </Tooltip>
  );
};