import React from 'react';
import { cn } from '@/lib/utils';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/Resizable';
import { Editor } from '../editor/Editor';
import { ValidationPanel } from '../validation/ValidationPanel';
import { Tabs, TabsList, TabsTrigger } from '../ui/Tabs';
import { Button } from '../ui/button';
import { Eye, Code, Play } from 'lucide-react';

interface MainContentProps {
  className?: string;
}

export const MainContent: React.FC<MainContentProps> = ({ className }) => {
  const [mode, setMode] = React.useState<'edit' | 'preview' | 'test'>('edit');

  return (
    <div className={cn('flex-1 flex flex-col min-h-0', className)}>
      {/* Mode Selector */}
      <div className="flex items-center justify-between px-4 py-1 border-b bg-muted/40">
        <div className="flex items-center gap-2">
          <Button
            variant={mode === 'edit' ? 'secondary' : 'ghost'}
            size="sm"
            className="gap-2"
            onClick={() => setMode('edit')}
          >
            <Code className="h-4 w-4" />
            Edit
          </Button>
          <Button
            variant={mode === 'preview' ? 'secondary' : 'ghost'}
            size="sm"
            className="gap-2"
            onClick={() => setMode('preview')}
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            variant={mode === 'test' ? 'secondary' : 'ghost'}
            size="sm"
            className="gap-2"
            onClick={() => setMode('test')}
          >
            <Play className="h-4 w-4" />
            Test
          </Button>
        </div>
      </div>

      {/* Content Area */}
      <ResizablePanelGroup direction="horizontal" className="flex-1 min-h-0">
        {/* Editor Panel */}
        <ResizablePanel defaultSize={70} minSize={30} className="min-h-0">
          <Editor />
        </ResizablePanel>

        {/* Resizer */}
        <ResizableHandle withHandle />

        {/* Validation Panel */}
        <ResizablePanel defaultSize={30} minSize={20} maxSize={50} className="min-h-0">
          <ValidationPanel />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
