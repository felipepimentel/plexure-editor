import React from 'react';
import { Search, X, ChevronDown, ChevronRight, File, Folder, RefreshCw, Settings2 } from 'lucide-react';
import { cn } from '@/utils/cn';

interface SearchResult {
  filePath: string;
  matches: {
    line: number;
    content: string;
    matchRanges: [number, number][];
  }[];
}

interface SearchResultsPanelProps {
  query: string;
  results: SearchResult[];
  onResultClick?: (filePath: string, line: number) => void;
  onClose?: () => void;
  className?: string;
}

export function SearchResultsPanel({
  query,
  results,
  onResultClick,
  onClose,
  className
}: SearchResultsPanelProps) {
  const [expandedFiles, setExpandedFiles] = React.useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = React.useState<'path' | 'matches'>('path');

  const toggleFile = (filePath: string) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded.has(filePath)) {
      newExpanded.delete(filePath);
    } else {
      newExpanded.add(filePath);
    }
    setExpandedFiles(newExpanded);
  };

  const expandAll = () => {
    setExpandedFiles(new Set(results.map(r => r.filePath)));
  };

  const collapseAll = () => {
    setExpandedFiles(new Set());
  };

  const sortedResults = React.useMemo(() => {
    return [...results].sort((a, b) => {
      if (sortBy === 'path') {
        return a.filePath.localeCompare(b.filePath);
      } else {
        return b.matches.length - a.matches.length;
      }
    });
  }, [results, sortBy]);

  const totalMatches = React.useMemo(() => {
    return results.reduce((sum, result) => sum + result.matches.length, 0);
  }, [results]);

  const highlightMatch = (content: string, ranges: [number, number][]) => {
    let lastIndex = 0;
    const parts: React.ReactNode[] = [];

    ranges.forEach(([start, end], i) => {
      // Add text before match
      if (start > lastIndex) {
        parts.push(
          <span key={`text-${i}`} className="text-gray-300">
            {content.slice(lastIndex, start)}
          </span>
        );
      }

      // Add highlighted match
      parts.push(
        <span key={`match-${i}`} className="bg-yellow-500/30 text-yellow-200">
          {content.slice(start, end)}
        </span>
      );

      lastIndex = end;
    });

    // Add remaining text
    if (lastIndex < content.length) {
      parts.push(
        <span key="text-end" className="text-gray-300">
          {content.slice(lastIndex)}
        </span>
      );
    }

    return parts;
  };

  return (
    <div className={cn(
      "flex flex-col h-full",
      "bg-gray-900/95 backdrop-blur-sm",
      className
    )}>
      {/* Header */}
      <div className="flex-none h-10 flex items-center justify-between px-3 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-200">
            Search Results
          </span>
          <span className="text-xs text-gray-500">
            {totalMatches} {totalMatches === 1 ? 'match' : 'matches'} in {results.length} {results.length === 1 ? 'file' : 'files'}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSortBy(sortBy === 'path' ? 'matches' : 'path')}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
          >
            <X className="w-4 h-4" />
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

      {/* Search Query */}
      <div className="flex-none px-3 py-2 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Query:</span>
          <span className="text-gray-200 font-medium">{query}</span>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto">
        {sortedResults.map((result) => (
          <div
            key={result.filePath}
            className="border-b border-gray-800 last:border-b-0"
          >
            {/* File Header */}
            <button
              onClick={() => toggleFile(result.filePath)}
              className={cn(
                "w-full px-3 py-2",
                "flex items-center justify-between",
                "hover:bg-gray-800/50",
                "transition-colors duration-200",
                "group"
              )}
            >
              <div className="flex items-center gap-2">
                {expandedFiles.has(result.filePath) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
                <File className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-200">
                  {result.filePath.split('/').pop()}
                </span>
                <span className="text-xs text-gray-500">
                  {result.matches.length} {result.matches.length === 1 ? 'match' : 'matches'}
                </span>
              </div>
              <div className="text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {result.filePath}
              </div>
            </button>

            {/* File Matches */}
            {expandedFiles.has(result.filePath) && (
              <div className="px-3 py-2 space-y-2 bg-gray-900/50">
                {result.matches.map((match, index) => (
                  <button
                    key={`${match.line}-${index}`}
                    onClick={() => onResultClick?.(result.filePath, match.line)}
                    className={cn(
                      "w-full px-2 py-1.5 rounded",
                      "text-left",
                      "hover:bg-gray-800/50",
                      "transition-colors duration-200"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-gray-500">
                        Line {match.line}
                      </span>
                    </div>
                    <pre className="text-xs font-mono overflow-x-auto">
                      {highlightMatch(match.content, match.matchRanges)}
                    </pre>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Empty State */}
        {results.length === 0 && (
          <div className="p-8 text-center">
            <Search className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-300 mb-1">
              No results found
            </h3>
            <p className="text-xs text-gray-500">
              Try adjusting your search query
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 