import React from 'react';
import { ArrowLeft, ArrowRight, History, ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';

interface HistoryEntry {
  id: string;
  filePath: string;
  line?: number;
  column?: number;
  timestamp: number;
}

interface NavigationHistoryProps {
  history: HistoryEntry[];
  currentIndex: number;
  onNavigate: (entry: HistoryEntry) => void;
  onBack: () => void;
  onForward: () => void;
  className?: string;
}

export function NavigationHistory({
  history,
  currentIndex,
  onNavigate,
  onBack,
  onForward,
  className
}: NavigationHistoryProps) {
  const [showDropdown, setShowDropdown] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const canGoBack = currentIndex > 0;
  const canGoForward = currentIndex < history.length - 1;

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (minutes < 1440) return `${Math.floor(minutes / 60)}h ago`;
    return `${Math.floor(minutes / 1440)}d ago`;
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {/* Back Button */}
      <button
        onClick={onBack}
        disabled={!canGoBack}
        className={cn(
          "p-1.5 rounded-md",
          "text-gray-400",
          "transition-colors duration-200",
          canGoBack
            ? "hover:text-gray-300 hover:bg-gray-800"
            : "opacity-50 cursor-not-allowed"
        )}
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      {/* Forward Button */}
      <button
        onClick={onForward}
        disabled={!canGoForward}
        className={cn(
          "p-1.5 rounded-md",
          "text-gray-400",
          "transition-colors duration-200",
          canGoForward
            ? "hover:text-gray-300 hover:bg-gray-800"
            : "opacity-50 cursor-not-allowed"
        )}
      >
        <ArrowRight className="w-4 h-4" />
      </button>

      {/* History Dropdown */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={cn(
            "p-1.5 rounded-md",
            "text-gray-400 hover:text-gray-300 hover:bg-gray-800",
            "transition-colors duration-200",
            "flex items-center gap-1"
          )}
        >
          <History className="w-4 h-4" />
          <ChevronDown className="w-3 h-3" />
        </button>

        {showDropdown && (
          <div
            ref={dropdownRef}
            className={cn(
              "absolute top-full left-0 mt-1",
              "w-80 max-h-[400px]",
              "bg-gray-900/95 backdrop-blur-sm",
              "border border-gray-800 rounded-lg shadow-xl",
              "overflow-y-auto",
              "z-50"
            )}
          >
            {history.length === 0 ? (
              <div className="p-4 text-center">
                <History className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                <p className="text-sm text-gray-400">No navigation history</p>
              </div>
            ) : (
              <div className="py-1">
                {history.map((entry, index) => (
                  <button
                    key={entry.id}
                    onClick={() => {
                      onNavigate(entry);
                      setShowDropdown(false);
                    }}
                    className={cn(
                      "w-full px-3 py-2",
                      "flex items-center justify-between",
                      "text-left",
                      "hover:bg-gray-800/50",
                      "transition-colors duration-200",
                      index === currentIndex && "bg-blue-500/10 text-blue-400"
                    )}
                  >
                    <div className="flex flex-col">
                      <span className="text-sm">
                        {entry.filePath.split('/').pop()}
                      </span>
                      <span className="text-xs text-gray-500">
                        {entry.filePath}
                        {entry.line && `:${entry.line}`}
                        {entry.column && `:${entry.column}`}
                      </span>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatTimestamp(entry.timestamp)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 