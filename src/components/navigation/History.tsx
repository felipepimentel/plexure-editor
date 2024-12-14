import React from 'react';
import { Clock, RotateCcw, Trash2 } from 'lucide-react';

interface HistoryEntry {
  id: string;
  timestamp: Date;
  description: string;
  type: 'edit' | 'format' | 'save';
}

export function History() {
  const [history, setHistory] = React.useState<HistoryEntry[]>([
    {
      id: '1',
      timestamp: new Date(),
      description: 'Added new endpoint /users',
      type: 'edit'
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      description: 'Formatted document',
      type: 'format'
    },
    {
      id: '3',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      description: 'Saved changes',
      type: 'save'
    }
  ]);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 1000 / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  return (
    <div className="h-full bg-gray-900 flex flex-col">
      <div className="p-2 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-300">History</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            title="Clear history"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <button
            className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
            title="Undo last action"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-2">
        <div className="space-y-2">
          {history.map((entry) => (
            <div
              key={entry.id}
              className="p-2 rounded bg-gray-800/50 hover:bg-gray-800 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-1.5 py-0.5 rounded ${
                    entry.type === 'edit' ? 'bg-blue-500/20 text-blue-400' :
                    entry.type === 'format' ? 'bg-green-500/20 text-green-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {entry.type}
                  </span>
                  <span className="text-sm text-gray-300 group-hover:text-white">
                    {entry.description}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 