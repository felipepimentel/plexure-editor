import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { ScrollArea } from '../ui/ScrollArea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/Select';
import {
  AlertCircle,
  AlertTriangle,
  Check,
  ChevronDown,
  ChevronUp,
  Filter,
  X
} from 'lucide-react';

interface ValidationPanelProps {
  className?: string;
}

interface ValidationItem {
  type: 'error' | 'warning' | 'info';
  message: string;
  file: string;
  line: number;
}

const demoValidations: ValidationItem[] = [
  {
    type: 'error',
    message: 'Missing required field "description" in API endpoint',
    file: 'src/api/endpoints.ts',
    line: 42
  },
  {
    type: 'warning',
    message: 'Response schema should include a status code',
    file: 'src/api/responses.ts',
    line: 15
  },
  {
    type: 'info',
    message: 'Consider adding more detailed documentation',
    file: 'src/api/types.ts',
    line: 23
  },
];

export const ValidationPanel: React.FC<ValidationPanelProps> = ({ className }) => {
  const [filter, setFilter] = React.useState<'all' | 'errors' | 'warnings' | 'info'>('all');
  const [expanded, setExpanded] = React.useState(true);

  const filteredValidations = demoValidations.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'errors') return item.type === 'error';
    if (filter === 'warnings') return item.type === 'warning';
    if (filter === 'info') return item.type === 'info';
    return true;
  });

  const stats = {
    errors: demoValidations.filter(i => i.type === 'error').length,
    warnings: demoValidations.filter(i => i.type === 'warning').length,
    info: demoValidations.filter(i => i.type === 'info').length,
  };

  return (
    <div className={cn('flex h-full w-full flex-col', className)}>
      {/* Header */}
      <div className="flex items-center justify-between border-b px-2 py-2">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-medium">Problems</h2>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-red-500" />
              {stats.errors}
            </span>
            <span className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3 text-yellow-500" />
              {stats.warnings}
            </span>
            <span className="flex items-center gap-1">
              <Check className="h-3 w-3 text-blue-500" />
              {stats.info}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronUp className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <Filter className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter */}
      <div className="border-b px-2 py-2">
        <Select value={filter} onValueChange={(value: any) => setFilter(value)}>
          <SelectTrigger className="h-8">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="errors">Errors</SelectItem>
            <SelectItem value="warnings">Warnings</SelectItem>
            <SelectItem value="info">Info</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Validation List */}
      {expanded && (
        <ScrollArea className="flex-1 px-2 py-2">
          <div className="space-y-2">
            {filteredValidations.map((item, index) => (
              <div
                key={index}
                className="group flex cursor-pointer flex-col gap-1 rounded-md p-2 hover:bg-muted/50"
              >
                <div className="flex items-center gap-2">
                  {item.type === 'error' && (
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
                  )}
                  {item.type === 'warning' && (
                    <AlertTriangle className="h-4 w-4 shrink-0 text-yellow-500" />
                  )}
                  {item.type === 'info' && (
                    <Check className="h-4 w-4 shrink-0 text-blue-500" />
                  )}
                  <span className="flex-1 text-sm">{item.message}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{item.file}</span>
                  <span>Line {item.line}</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      )}
    </div>
  );
};