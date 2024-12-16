import React from 'react';
import { Button } from '../ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import { Separator } from '../ui/Separator';
import { Badge } from '../ui/Badge';
import { Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ToolbarProps {
  className?: string;
}

export const Toolbar: React.FC<ToolbarProps> = ({ className }) => {
  return (
    <div className={cn('h-14 px-4 flex items-center justify-between gap-4', className)}>
      {/* Left Section */}
      <div className="flex items-center gap-4">
        {/* Project Selector */}
        <Select defaultValue="main">
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select branch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="main">API Project (main)</SelectItem>
            <SelectItem value="dev">API Project (dev)</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-6" />

        {/* Contract Version */}
        <Select defaultValue="openapi3">
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="API Version" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="openapi3">OpenAPI v3</SelectItem>
            <SelectItem value="openapi2">OpenAPI v2</SelectItem>
          </SelectContent>
        </Select>

        <Badge variant="secondary" className="px-2 py-1">
          1.0.0
        </Badge>
      </div>

      {/* Center Section */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">Edit</Button>
        <Button variant="ghost" size="sm">Preview</Button>
        <Button variant="ghost" size="sm">Test</Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          <span className="text-sm text-muted-foreground">3 online</span>
        </div>

        <Separator orientation="vertical" className="h-6" />

        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          Publish
        </Button>
      </div>
    </div>
  );
};
