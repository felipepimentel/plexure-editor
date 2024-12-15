import React from 'react';
import { RefreshCw, Settings2, X, Plus, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/utils/cn';

interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  content: string[];
  type: 'addition' | 'deletion' | 'modification';
}

interface QuickDiffViewerProps {
  filePath: string;
  hunks: DiffHunk[];
  onRefresh?: () => void;
  onSettings?: () => void;
  className?: string;
}

export function QuickDiffViewer({
  filePath,
  hunks,
  onRefresh,
  onSettings,
  className
}: QuickDiffViewerProps) {
  const [expandedHunks, setExpandedHunks] = React.useState<Set<number>>(new Set());

  const toggleHunk = (index: number) => {
    const newExpanded = new Set(expandedHunks);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedHunks(newExpanded);
  };

  const expandAll = () => {
    setExpandedHunks(new Set(hunks.map((_, i) => i)));
  };

  const collapseAll = () => {
    setExpandedHunks(new Set());
  };

  return (
    <div className={cn(
      "flex flex-col h-full",
      "bg-gray-900/95 backdrop-blur-sm",
      "border-l border-gray-800",
      className
    )}>
      {/* Header */}
      <div className="flex-none h-10 flex items-center justify-between px-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-200">
            Changes
          </span>
          <span className="text-xs text-gray-500">
            {hunks.length} {hunks.length === 1 ? 'change' : 'changes'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onSettings}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
          >
            <Settings2 className="w-4 h-4" />
          </button>
          <div className="w-px h-4 bg-gray-800 mx-1" />
          <button
            onClick={expandAll}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <button
            onClick={collapseAll}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {hunks.map((hunk, index) => (
          <div
            key={`${hunk.oldStart}-${hunk.newStart}`}
            className="border-b border-gray-800 last:border-b-0"
          >
            {/* Hunk Header */}
            <button
              onClick={() => toggleHunk(index)}
              className={cn(
                "w-full px-3 py-2",
                "flex items-center justify-between",
                "text-sm",
                "hover:bg-gray-800/50",
                "transition-colors duration-200"
              )}
            >
              <div className="flex items-center gap-2">
                {expandedHunks.has(index) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <span className={cn(
                  hunk.type === 'addition' && "text-green-400",
                  hunk.type === 'deletion' && "text-red-400",
                  hunk.type === 'modification' && "text-blue-400"
                )}>
                  {hunk.type === 'addition' && 'Added'}
                  {hunk.type === 'deletion' && 'Removed'}
                  {hunk.type === 'modification' && 'Modified'}
                </span>
                <span className="text-gray-500">
                  {`@@ -${hunk.oldStart},${hunk.oldLines} +${hunk.newStart},${hunk.newLines} @@`}
                </span>
              </div>
            </button>

            {/* Hunk Content */}
            {expandedHunks.has(index) && (
              <div className="px-3 py-2 space-y-1 bg-gray-900/50">
                {hunk.content.map((line, lineIndex) => {
                  const prefix = line[0];
                  const content = line.slice(1);

                  return (
                    <div
                      key={lineIndex}
                      className={cn(
                        "flex items-start font-mono text-xs",
                        "rounded px-2 py-0.5",
                        prefix === '+' && "bg-green-500/10 text-green-300",
                        prefix === '-' && "bg-red-500/10 text-red-300",
                        prefix === ' ' && "text-gray-400"
                      )}
                    >
                      <span className="w-4 flex-none">
                        {prefix === '+' && <Plus className="w-3 h-3" />}
                        {prefix === '-' && <Minus className="w-3 h-3" />}
                      </span>
                      <pre className="flex-1 overflow-x-auto">
                        {content}
                      </pre>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 