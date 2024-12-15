import React from 'react';
import { FileCode, FileText, Image as ImageIcon, File } from 'lucide-react';
import { cn } from '@/utils/cn';

interface QuickPreviewProps {
  filePath: string;
  content: string;
  type: 'code' | 'text' | 'image' | 'unknown';
  className?: string;
}

export function QuickPreview({
  filePath,
  content,
  type,
  className
}: QuickPreviewProps) {
  const getFileIcon = () => {
    switch (type) {
      case 'code':
        return FileCode;
      case 'text':
        return FileText;
      case 'image':
        return ImageIcon;
      default:
        return File;
    }
  };

  const Icon = getFileIcon();

  return (
    <div className={cn(
      "w-[400px]",
      "bg-gray-900/95 backdrop-blur-sm",
      "border border-gray-800 rounded-lg shadow-xl",
      "overflow-hidden",
      className
    )}>
      {/* Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-800">
        <Icon className="w-4 h-4 text-gray-400" />
        <span className="text-sm font-medium text-gray-200">
          {filePath.split('/').pop()}
        </span>
      </div>

      {/* Content */}
      <div className="p-3">
        {type === 'image' ? (
          <div className="relative aspect-video bg-gray-800/50 rounded-md overflow-hidden">
            <img
              src={content}
              alt={filePath}
              className="absolute inset-0 w-full h-full object-contain"
            />
          </div>
        ) : (
          <pre className={cn(
            "text-xs font-mono",
            "max-h-[200px] overflow-auto",
            "rounded-md",
            type === 'code' ? "language-typescript" : "text-gray-300"
          )}>
            {content}
          </pre>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-gray-800">
        <span className="text-xs text-gray-500">
          Press Enter to open file
        </span>
        <span className="text-xs text-gray-500">
          Esc to dismiss
        </span>
      </div>
    </div>
  );
} 