import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Tag,
  Check,
  Search,
  Filter,
  MoreVertical,
  Share2,
  Code2,
  Braces,
  FileText,
  Settings2,
  Sparkles,
  Lightbulb,
  Bug,
  Boxes,
  Box,
  ArrowRight,
  AlertCircle,
  Info,
  Link2,
  Eye,
  EyeOff,
  List,
  LayoutGrid,
  Network,
  Cloud,
  CloudOff,
  Laptop,
  Workflow,
  Layers,
  Tags,
  Hash,
  Lock,
  Unlock,
  FileJson,
  Database,
  Folder,
  FolderOpen,
  Activity,
  Zap,
  Globe,
  Mail,
  License,
  GitBranch,
  FileCode,
  BookOpen,
  HelpCircle,
  Terminal,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  Key,
  Tool,
  Trash,
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Clock,
  Loader2,
  FileType,
  Brackets,
  Regex,
  Binary,
  Table,
  Image,
  File,
  Paperclip,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APIResponseProps {
  response: any;
  className?: string;
}

interface ResponseHeaderProps {
  name: string;
  header: any;
}

interface ResponseContentProps {
  content: any;
}

const ResponseHeader: React.FC<ResponseHeaderProps> = ({
  name,
  header
}) => {
  const [copiedHeader, setCopiedHeader] = React.useState(false);

  const handleCopyHeader = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(header, null, 2));
      setCopiedHeader(true);
      setTimeout(() => setCopiedHeader(false), 2000);
    } catch (error) {
      console.error('Failed to copy header:', error);
    }
  };

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2">
        <span className="font-mono text-sm">{name}</span>
        {header.required && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive font-medium">
            Required
          </span>
        )}
        {header.deprecated && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-warning/10 text-warning font-medium">
            Deprecated
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {header.schema?.type}
          {header.schema?.format && ` (${header.schema.format})`}
        </span>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content={copiedHeader ? 'Copied!' : 'Copy header'}>
            <button
              onClick={handleCopyHeader}
              className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedHeader ? (
                <Check className="h-3.5 w-3.5" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

const ResponseContent: React.FC<ResponseContentProps> = ({
  content
}) => {
  const [copiedContent, setCopiedContent] = React.useState(false);
  const [showExample, setShowExample] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(content, null, 2));
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch (error) {
      console.error('Failed to copy content:', error);
    }
  };

  const getContentIcon = () => {
    const mediaType = Object.keys(content)[0];
    if (mediaType.startsWith('application/json')) {
      return <Braces className="w-4 h-4 text-primary" />;
    }
    if (mediaType.startsWith('text/')) {
      return <FileText className="w-4 h-4 text-blue-500" />;
    }
    if (mediaType.startsWith('image/')) {
      return <Image className="w-4 h-4 text-purple-500" />;
    }
    if (mediaType.startsWith('application/xml')) {
      return <Brackets className="w-4 h-4 text-orange-500" />;
    }
    if (mediaType.startsWith('application/octet-stream')) {
      return <Binary className="w-4 h-4 text-red-500" />;
    }
    return <File className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-2">
      {Object.entries(content).map(([mediaType, details]: [string, any]) => (
        <div key={mediaType} className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getContentIcon()}
              <span className="font-mono text-sm">{mediaType}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tooltip content={showExample ? 'Hide example' : 'Show example'}>
                <button
                  onClick={() => setShowExample(!showExample)}
                  className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showExample ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </Tooltip>
              <Tooltip content={copiedContent ? 'Copied!' : 'Copy content'}>
                <button
                  onClick={handleCopyContent}
                  className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedContent ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </Tooltip>
              <Tooltip content={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </Tooltip>
            </div>
          </div>

          {showExample && details.example && (
            <div className={cn(
              "relative",
              isFullscreen && "fixed inset-4 z-50 bg-background border rounded-lg shadow-lg"
            )}>
              {isFullscreen && (
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm -z-10" />
              )}
              <pre className={cn(
                "p-4 rounded-md bg-muted font-mono text-sm overflow-auto",
                isFullscreen && "h-full"
              )}>
                <code>
                  {JSON.stringify(details.example, null, 2)}
                </code>
              </pre>
            </div>
          )}

          {details.schema && (
            <div className="space-y-2">
              {details.schema.properties && (
                <div className="space-y-1">
                  {Object.entries(details.schema.properties).map(([propName, propSchema]: [string, any]) => (
                    <div key={propName} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{propName}</span>
                        {details.schema.required?.includes(propName) && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive font-medium">
                            Required
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {propSchema.type}
                          {propSchema.format && ` (${propSchema.format})`}
                        </span>
                        {propSchema.description && (
                          <Tooltip content={propSchema.description}>
                            <Info className="w-3.5 h-3.5 text-muted-foreground" />
                          </Tooltip>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export const APIResponse: React.FC<APIResponseProps> = ({
  response,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getStatusIcon = () => {
    const status = parseInt(response.status);
    if (status >= 200 && status < 300) {
      return <CheckCircle className="w-4 h-4 text-success" />;
    }
    if (status >= 300 && status < 400) {
      return <RefreshCw className="w-4 h-4 text-info" />;
    }
    if (status >= 400 && status < 500) {
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    }
    if (status >= 500) {
      return <XCircle className="w-4 h-4 text-destructive" />;
    }
    return <Clock className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden transition-all duration-200",
      isExpanded && "bg-muted/30",
      "hover:shadow-sm",
      className
    )}>
      <div
        className={cn(
          'flex items-center gap-2 p-3 bg-card hover:bg-accent/50 cursor-pointer transition-colors',
          isExpanded && 'bg-accent/50'
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="p-0.5 transition-transform duration-200">
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform duration-200",
            isExpanded && "rotate-90"
          )} />
        </button>

        {getStatusIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-mono font-medium">{response.status}</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-medium",
              response.status >= 200 && response.status < 300 && "bg-success/10 text-success",
              response.status >= 300 && response.status < 400 && "bg-info/10 text-info",
              response.status >= 400 && response.status < 500 && "bg-warning/10 text-warning",
              response.status >= 500 && "bg-destructive/10 text-destructive"
            )}>
              {response.description || 'No description'}
            </span>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            {/* Description */}
            {response.description && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {response.description}
                </p>
              </div>
            )}

            {/* Headers */}
            {response.headers && Object.keys(response.headers).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Paperclip className="w-4 h-4" />
                  Headers
                </h4>
                <div className="space-y-2">
                  {Object.entries(response.headers).map(([name, header]) => (
                    <ResponseHeader key={name} name={name} header={header} />
                  ))}
                </div>
              </div>
            )}

            {/* Content */}
            {response.content && Object.keys(response.content).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <FileType className="w-4 h-4" />
                  Content
                </h4>
                <ResponseContent content={response.content} />
              </div>
            )}

            {/* Links */}
            {response.links && Object.keys(response.links).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  Links
                </h4>
                <div className="space-y-2">
                  {Object.entries(response.links).map(([name, link]: [string, any]) => (
                    <div key={name} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{name}</span>
                        {link.description && (
                          <Tooltip content={link.description}>
                            <Info className="w-3.5 h-3.5 text-muted-foreground" />
                          </Tooltip>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {link.operationId || link.operationRef}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIResponse; 