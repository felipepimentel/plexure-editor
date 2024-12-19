import React from 'react';
import { History, Clock, Check, X, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface RequestHistoryEntry {
  id: string;
  timestamp: string;
  method: string;
  path: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  response?: {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    duration: number;
  };
}

interface RequestHistoryProps {
  onSelect: (entry: RequestHistoryEntry) => void;
  className?: string;
}

const STORAGE_KEY = 'api-request-history';
const MAX_HISTORY_SIZE = 50;

const getStatusColor = (status: number) => {
  if (status >= 200 && status < 300) return 'text-green-500';
  if (status >= 300 && status < 400) return 'text-blue-500';
  if (status >= 400 && status < 500) return 'text-yellow-500';
  return 'text-red-500';
};

export const RequestHistory: React.FC<RequestHistoryProps> = ({
  onSelect,
  className,
}) => {
  const [entries, setEntries] = React.useState<RequestHistoryEntry[]>([]);
  const [expandedEntries, setExpandedEntries] = React.useState<Set<string>>(new Set());
  const [selectedEntry, setSelectedEntry] = React.useState<string | null>(null);

  // Load history from localStorage
  React.useEffect(() => {
    const savedHistory = localStorage.getItem(STORAGE_KEY);
    if (savedHistory) {
      try {
        setEntries(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load request history:', error);
      }
    }
  }, []);

  // Save history to localStorage
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<RequestHistoryEntry, 'id' | 'timestamp'>) => {
    const newEntry: RequestHistoryEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    setEntries(prev => {
      const newEntries = [newEntry, ...prev];
      if (newEntries.length > MAX_HISTORY_SIZE) {
        newEntries.pop();
      }
      return newEntries;
    });
  };

  const clearHistory = () => {
    if (window.confirm('Are you sure you want to clear the request history?')) {
      setEntries([]);
      setExpandedEntries(new Set());
      setSelectedEntry(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedEntries(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleSelect = (entry: RequestHistoryEntry) => {
    setSelectedEntry(entry.id);
    onSelect(entry);
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <History className="w-4 h-4" />
          Request History
        </h3>
        <button
          onClick={clearHistory}
          className="text-xs text-destructive hover:underline"
        >
          Clear History
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No requests yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {entries.map(entry => (
            <div
              key={entry.id}
              className={cn(
                'border rounded-lg transition-colors',
                selectedEntry === entry.id ? 'bg-accent' : 'hover:bg-accent/50'
              )}
            >
              <button
                onClick={() => toggleExpand(entry.id)}
                className="w-full flex items-start gap-2 p-3 text-left"
              >
                <span className="mt-1">
                  {expandedEntries.has(entry.id) ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      'uppercase font-mono text-xs px-2 py-0.5 rounded',
                      entry.method === 'GET' && 'bg-green-500/10 text-green-500',
                      entry.method === 'POST' && 'bg-blue-500/10 text-blue-500',
                      entry.method === 'PUT' && 'bg-yellow-500/10 text-yellow-500',
                      entry.method === 'PATCH' && 'bg-orange-500/10 text-orange-500',
                      entry.method === 'DELETE' && 'bg-red-500/10 text-red-500'
                    )}>
                      {entry.method}
                    </span>
                    <span className="font-mono text-sm truncate">{entry.path}</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {formatDate(entry.timestamp)}
                    </span>
                    {entry.response && (
                      <>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className={cn(
                          'text-xs',
                          getStatusColor(entry.response.status)
                        )}>
                          {entry.response.status} {entry.response.statusText}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          ({entry.response.duration}ms)
                        </span>
                      </>
                    )}
                  </div>
                </div>
                {entry.response && (
                  <span className={cn(
                    'flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center',
                    entry.response.status >= 200 && entry.response.status < 300
                      ? 'bg-green-500/10 text-green-500'
                      : 'bg-red-500/10 text-red-500'
                  )}>
                    {entry.response.status >= 200 && entry.response.status < 300 ? (
                      <Check className="w-3 h-3" />
                    ) : (
                      <X className="w-3 h-3" />
                    )}
                  </span>
                )}
              </button>

              {expandedEntries.has(entry.id) && (
                <div className="px-9 pb-3 space-y-3">
                  <div>
                    <h4 className="text-xs font-medium mb-1">URL</h4>
                    <p className="text-sm font-mono break-all">{entry.url}</p>
                  </div>

                  {Object.keys(entry.headers).length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium mb-1">Headers</h4>
                      <div className="space-y-1">
                        {Object.entries(entry.headers).map(([key, value]) => (
                          <div key={key} className="text-sm">
                            <span className="font-mono text-muted-foreground">{key}:</span>{' '}
                            <span className="font-mono">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {entry.body && (
                    <div>
                      <h4 className="text-xs font-medium mb-1">Request Body</h4>
                      <pre className="text-sm font-mono bg-muted p-2 rounded-md overflow-x-auto">
                        {entry.body}
                      </pre>
                    </div>
                  )}

                  {entry.response && (
                    <div>
                      <h4 className="text-xs font-medium mb-1">Response</h4>
                      <pre className="text-sm font-mono bg-muted p-2 rounded-md overflow-x-auto">
                        {JSON.stringify(entry.response.data, null, 2)}
                      </pre>
                    </div>
                  )}

                  <div className="flex justify-end">
                    <button
                      onClick={() => handleSelect(entry)}
                      className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90"
                    >
                      Use This Request
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RequestHistory; 