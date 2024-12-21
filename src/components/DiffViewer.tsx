import { DiffEditor } from '@monaco-editor/react';
import { Button } from './ui/Button';

interface DiffViewerProps {
  originalContent: string;
  suggestedContent: string;
  onAccept: () => void;
  onReject: () => void;
}

export function DiffViewer({ originalContent, suggestedContent, onAccept, onReject }: DiffViewerProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end gap-2">
        <Button 
          variant="outline" 
          onClick={onReject}
          className="text-red-500 hover:text-red-600"
        >
          Reject
        </Button>
        <Button 
          onClick={onAccept}
          className="bg-green-500 hover:bg-green-600 text-white"
        >
          Accept Changes
        </Button>
      </div>
      
      <div className="h-[400px] border rounded-md overflow-hidden">
        <DiffEditor
          original={originalContent}
          modified={suggestedContent}
          language="yaml"
          theme="vs-light"
          options={{
            renderSideBySide: true,
            readOnly: true,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            diffWordWrap: 'on',
            lineNumbers: 'on',
            renderOverviewRuler: false,
            diffDecorations: 'all'
          }}
        />
      </div>
    </div>
  );
} 