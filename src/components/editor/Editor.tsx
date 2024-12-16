import React from 'react';
import { useMonaco } from '@monaco-editor/react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/Tooltip';
import { MonacoEditor } from './MonacoEditor';
import {
  Copy,
  Download,
  Upload,
  Settings,
  FileCode,
  Save,
  Undo,
  Redo,
  Eye
} from 'lucide-react';

interface EditorProps {
  className?: string;
}

export const Editor: React.FC<EditorProps> = ({ className }) => {
  const monaco = useMonaco();
  const [viewMode, setViewMode] = React.useState<'yaml' | 'preview'>('yaml');
  const [content, setContent] = React.useState(`openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
paths:
  /users:
    get:
      summary: Get all users
      responses:
        '200':
          description: Successful response
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: integer
                    name:
                      type: string`);

  // Configure Monaco editor for OpenAPI
  React.useEffect(() => {
    if (monaco) {
      monaco.languages.yaml?.yamlDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [{
          uri: 'https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/schemas/v3.0/schema.json',
          fileMatch: ['*.yaml', '*.yml'],
          schema: {
            type: 'object',
            required: ['openapi', 'info', 'paths'],
            properties: {
              openapi: { type: 'string', pattern: '^3\\.0\\.\\d+$' },
              info: { type: 'object' },
              paths: { type: 'object' }
            }
          }
        }]
      });
    }
  }, [monaco]);

  return (
    <div className={cn('flex h-full w-full flex-col overflow-hidden', className)}>
      {/* Editor Header */}
      <div className="flex h-10 items-center justify-between border-b bg-background/95 px-2 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* File Info */}
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 gap-2 px-2"
          >
            <FileCode className="h-4 w-4" />
            <span className="text-sm">swagger.yaml</span>
          </Button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-0.5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode(viewMode === 'yaml' ? 'preview' : 'yaml')}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Toggle Preview</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Undo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Undo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Redo className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Redo</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Save className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Save</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Copy</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Download className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Download</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Upload className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Upload</p>
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Editor Content */}
      <div className="relative flex-1">
        <MonacoEditor
          value={content}
          onChange={setContent}
          language="yaml"
        />
      </div>
    </div>
  );
};
