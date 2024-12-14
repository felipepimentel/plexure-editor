import React from 'react';
import { 
  Save, 
  Download, 
  Upload, 
  Copy, 
  Settings, 
  FileJson, 
  File,
  Check,
  AlertCircle
} from 'lucide-react';
import { parse, stringify } from 'yaml';

interface EditorToolbarProps {
  content: string;
  onSave?: (content: string) => void;
  onFormat?: (content: string) => void;
}

export function EditorToolbar({ content, onSave, onFormat }: EditorToolbarProps) {
  const [copied, setCopied] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleFormat = () => {
    try {
      const parsed = parse(content);
      const formatted = stringify(parsed, { indent: 2 });
      onFormat?.(formatted);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid YAML');
    }
  };

  const handleCopyAsJson = async () => {
    try {
      const parsed = parse(content);
      const json = JSON.stringify(parsed, null, 2);
      await navigator.clipboard.writeText(json);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid YAML');
    }
  };

  const handleDownloadYaml = () => {
    try {
      const blob = new Blob([content], { type: 'text/yaml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'swagger.yaml';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error downloading file');
    }
  };

  const handleDownloadJson = () => {
    try {
      const parsed = parse(content);
      const json = JSON.stringify(parsed, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'swagger.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error downloading file');
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      try {
        // Validate if it's valid YAML
        parse(content);
        onSave?.(content);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Invalid YAML file');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="h-12 border-b border-gray-800 bg-gray-900 flex items-center px-4 justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => onSave?.(content)}
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Save"
        >
          <Save className="w-4 h-4" />
        </button>
        
        <div className="h-4 w-px bg-gray-800 mx-2" />
        
        <button
          onClick={handleFormat}
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Format YAML"
        >
          <File className="w-4 h-4" />
        </button>
        
        <button
          onClick={handleCopyAsJson}
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors relative"
          title="Copy as JSON"
        >
          {copied ? (
            <Check className="w-4 h-4 text-green-400" />
          ) : (
            <FileJson className="w-4 h-4" />
          )}
        </button>

        <div className="h-4 w-px bg-gray-800 mx-2" />

        <button
          onClick={handleDownloadYaml}
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Download YAML"
        >
          <Download className="w-4 h-4" />
        </button>

        <label
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer"
          title="Upload YAML"
        >
          <Upload className="w-4 h-4" />
          <input
            type="file"
            accept=".yaml,.yml"
            onChange={handleUpload}
            className="hidden"
          />
        </label>
      </div>

      <div className="flex items-center gap-2">
        {error && (
          <div className="flex items-center gap-1 text-xs text-red-400">
            <AlertCircle className="w-3 h-3" />
            <span>{error}</span>
          </div>
        )}
        
        <div className="h-4 w-px bg-gray-800 mx-2" />

        <button
          className="p-1.5 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
} 