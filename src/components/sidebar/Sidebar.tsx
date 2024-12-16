import React from 'react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { Button } from '../ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/Collapsible';
import {
  Search,
  ChevronRight,
  FileJson,
  FolderOpen,
  Plus,
  Settings,
  GitBranch,
  History
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface SidebarProps {
  className?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({ className }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className={cn('h-full flex flex-col bg-background', className)}>
      {/* Search Bar */}
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {/* File Explorer */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {/* Project Files */}
          <Collapsible defaultOpen>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
              <ChevronRight className="h-4 w-4" />
              Project Files
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 ml-4 space-y-2">
                <FileItem
                  name="swagger.json"
                  icon={FileJson}
                  active
                  modified
                />
                <FileItem
                  name="schema.json"
                  icon={FileJson}
                />
                <FileItem
                  name="examples"
                  icon={FolderOpen}
                  isFolder
                />
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Git */}
          <Collapsible>
            <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium">
              <ChevronRight className="h-4 w-4" />
              Git
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 ml-4 space-y-2">
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <GitBranch className="h-4 w-4" />
                  main
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                  <History className="h-4 w-4" />
                  History
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>

      {/* Actions */}
      <div className="p-4 border-t">
        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="w-full gap-2">
            <Plus className="h-4 w-4" />
            New File
          </Button>
        </div>
      </div>
    </div>
  );
};

interface FileItemProps {
  name: string;
  icon: React.FC<{ className?: string }>;
  active?: boolean;
  modified?: boolean;
  isFolder?: boolean;
}

const FileItem: React.FC<FileItemProps> = ({
  name,
  icon: Icon,
  active,
  modified,
  isFolder
}) => {
  return (
    <Button
      variant={active ? 'secondary' : 'ghost'}
      size="sm"
      className={cn(
        'w-full justify-between group',
        active && 'font-medium'
      )}
    >
      <div className="flex items-center gap-2">
        <Icon className={cn('h-4 w-4', isFolder && 'text-blue-400')} />
        <span>{name}</span>
      </div>
      {modified && (
        <Badge variant="outline" className="h-5 px-1.5">
          Modified
        </Badge>
      )}
    </Button>
  );
};
