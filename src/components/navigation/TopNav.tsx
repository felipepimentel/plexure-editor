import React from 'react';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import {
  GitBranch,
  Users,
  Clock,
  Save,
  Share,
  History,
  Settings,
  Upload,
  Check,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const TopNav = () => {
  return (
    <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left Section - Project Info */}
      <div className="flex items-center space-x-4">
        {/* Project Selector */}
        <Button variant="ghost" size="sm" className="h-9 gap-2 px-2 hover:bg-muted/50">
          <GitBranch className="h-4 w-4 text-muted-foreground" />
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-medium text-muted-foreground">Project</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">API Project</span>
              <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">main</span>
            </div>
          </div>
          <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
        </Button>

        {/* Contract Info */}
        <Button variant="ghost" size="sm" className="h-9 gap-2 px-2 hover:bg-muted/50">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-medium text-muted-foreground">Contract</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">OpenAPI v3</span>
              <span className="rounded-full bg-muted px-1.5 py-0.5 text-xs font-medium text-muted-foreground">1.0.0</span>
              <Check className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
        </Button>

        {/* Style Guide */}
        <Button variant="ghost" size="sm" className="h-9 gap-2 px-2 hover:bg-muted/50">
          <div className="flex flex-col items-start">
            <span className="text-[10px] font-medium text-muted-foreground">Style Guide</span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Default Guide</span>
              <span className="rounded-full bg-blue-500/15 px-1.5 py-0.5 text-xs font-medium text-blue-500">15</span>
            </div>
          </div>
          <ChevronDown className="ml-1 h-4 w-4 text-muted-foreground" />
        </Button>
      </div>

      {/* Right Section - Actions */}
      <div className="flex items-center space-x-4">
        {/* Collaboration Info */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 gap-2 px-2 hover:bg-muted/50">
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">3</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Active Users</p>
          </TooltipContent>
        </Tooltip>

        {/* Time Info */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>2 mins ago</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Save Changes</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                <Share className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Share Project</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                <History className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">View History</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/50">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Settings</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="primary" size="sm" className="ml-2 gap-2">
            <Upload className="h-4 w-4" />
            <span>Publish</span>
          </Button>
        </div>
      </div>
    </header>
  );
};
