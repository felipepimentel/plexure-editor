import React from 'react';
import { cn } from '@/utils/cn';
import { File, Clock, X, ExternalLink } from 'lucide-react';

interface RecentFile {
  path: string;
  lastModified: number;
  preview?: string;
}

interface RecentFilesProps {
  files: RecentFile[];
  onFileSelect: (file: RecentFile) => void;
  onFileRemove: (path: string) => void;
  onFileOpen?: (path: string) => void;
  className?: string;
}

export const RecentFiles: React.FC<RecentFilesProps> = ({
  files,
  onFileSelect,
  onFileRemove,
  onFileOpen,
  className
}) => {
  if (files.length === 0) {
    return (
      <div className={cn(
        'flex flex-col items-center justify-center p-8 text-gray-500',
        'border rounded-lg bg-gray-50 dark:bg-gray-800',
        className
      )}>
        <File className="w-12 h-12 mb-4 opacity-50" />
        <p className="text-sm">No recent files</p>
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {files.map((file) => (
        <div
          key={file.path}
          className={cn(
            'group flex items-start gap-3 p-3 rounded-lg',
            'bg-white dark:bg-gray-800 border',
            'hover:border-blue-500 transition-colors duration-200'
          )}
        >
          <File className="w-5 h-5 mt-0.5 text-gray-400 flex-shrink-0" />
          
          <div className="flex-1 min-w-0" onClick={() => onFileSelect(file)}>
            <div className="flex items-center gap-2">
              <h3 className="font-medium truncate">
                {file.path.split('/').pop()}
              </h3>
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Clock className="w-3 h-3" />
                {new Date(file.lastModified).toLocaleDateString()}
              </span>
            </div>
            
            {file.preview && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {file.preview}
              </p>
            )}
            
            <p className="mt-1 text-xs text-gray-500 truncate">
              {file.path}
            </p>
          </div>

          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {onFileOpen && (
              <button
                onClick={() => onFileOpen(file.path)}
                className={cn(
                  'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700',
                  'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300',
                  'transition-colors duration-200'
                )}
                title="Open in system"
              >
                <ExternalLink className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={() => onFileRemove(file.path)}
              className={cn(
                'p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700',
                'text-gray-500 hover:text-red-600',
                'transition-colors duration-200'
              )}
              title="Remove from recent files"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}; 