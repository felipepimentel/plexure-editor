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
  Minimize2,
  Send,
  Play,
  Pause,
  Square,
  RotateCw,
  Download,
  Upload,
  Sliders,
  Crosshair,
  Heading1,
  Heading2,
  ListOrdered,
  ListChecks,
  Fingerprint,
  Cookie,
  Webhook
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APIRequestProps {
  request: any;
  className?: string;
}

interface RequestParameterProps {
  name: string;
  parameter: any;
  location: 'path' | 'query' | 'header' | 'cookie';
}

interface RequestBodyProps {
  body: any;
}

const RequestParameter: React.FC<RequestParameterProps> = ({
  name,
  parameter,
  location
}) => {
  const [copiedParam, setCopiedParam] = React.useState(false);

  const handleCopyParam = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(parameter, null, 2));
      setCopiedParam(true);
      setTimeout(() => setCopiedParam(false), 2000);
    } catch (error) {
      console.error('Failed to copy parameter:', error);
    }
  };

  const getLocationIcon = () => {
    switch (location) {
      case 'path':
        return <Crosshair className="w-3.5 h-3.5 text-blue-500" />;
      case 'query':
        return <Search className="w-3.5 h-3.5 text-green-500" />;
      case 'header':
        return <Heading1 className="w-3.5 h-3.5 text-orange-500" />;
      case 'cookie':
        return <Cookie className="w-3.5 h-3.5 text-purple-500" />;
      default:
        return <Info className="w-3.5 h-3.5 text-muted-foreground" />;
    }
  };

  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2">
        {getLocationIcon()}
        <span className="font-mono text-sm">{name}</span>
        {parameter.required && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive font-medium">
            Required
          </span>
        )}
        {parameter.deprecated && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-warning/10 text-warning font-medium">
            Deprecated
          </span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground">
          {parameter.schema?.type}
          {parameter.schema?.format && ` (${parameter.schema.format})`}
        </span>
        {parameter.description && (
          <Tooltip content={parameter.description}>
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
          </Tooltip>
        )}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
          <Tooltip content={copiedParam ? 'Copied!' : 'Copy parameter'}>
            <button
              onClick={handleCopyParam}
              className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedParam ? (
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

const RequestBody: React.FC<RequestBodyProps> = ({
  body
}) => {
  const [copiedBody, setCopiedBody] = React.useState(false);
  const [showExample, setShowExample] = React.useState(false);
  const [isFullscreen, setIsFullscreen] = React.useState(false);

  const handleCopyBody = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(body, null, 2));
      setCopiedBody(true);
      setTimeout(() => setCopiedBody(false), 2000);
    } catch (error) {
      console.error('Failed to copy body:', error);
    }
  };

  const getContentIcon = () => {
    const mediaType = Object.keys(body.content)[0];
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
    if (mediaType.startsWith('multipart/')) {
      return <Upload className="w-4 h-4 text-green-500" />;
    }
    return <File className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-2">
      {Object.entries(body.content).map(([mediaType, details]: [string, any]) => (
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
              <Tooltip content={copiedBody ? 'Copied!' : 'Copy body'}>
                <button
                  onClick={handleCopyBody}
                  className="p-1.5 rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {copiedBody ? (
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

export const APIRequest: React.FC<APIRequestProps> = ({
  request,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const getMethodIcon = () => {
    switch (request.method.toLowerCase()) {
      case 'get':
        return <Eye className="w-4 h-4 text-blue-500" />;
      case 'post':
        return <Send className="w-4 h-4 text-green-500" />;
      case 'put':
        return <Upload className="w-4 h-4 text-orange-500" />;
      case 'delete':
        return <Trash className="w-4 h-4 text-red-500" />;
      case 'patch':
        return <Tool className="w-4 h-4 text-purple-500" />;
      case 'head':
        return <Heading1 className="w-4 h-4 text-yellow-500" />;
      case 'options':
        return <Sliders className="w-4 h-4 text-cyan-500" />;
      case 'trace':
        return <Activity className="w-4 h-4 text-pink-500" />;
      default:
        return <Terminal className="w-4 h-4 text-muted-foreground" />;
    }
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

        {getMethodIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "px-2 py-1 text-xs font-medium rounded-md uppercase",
              request.method === 'get' && "bg-blue-500/10 text-blue-500",
              request.method === 'post' && "bg-green-500/10 text-green-500",
              request.method === 'put' && "bg-orange-500/10 text-orange-500",
              request.method === 'delete' && "bg-red-500/10 text-red-500",
              request.method === 'patch' && "bg-purple-500/10 text-purple-500",
              request.method === 'head' && "bg-yellow-500/10 text-yellow-500",
              request.method === 'options' && "bg-cyan-500/10 text-cyan-500",
              request.method === 'trace' && "bg-pink-500/10 text-pink-500"
            )}>
              {request.method}
            </span>
            <span className="font-mono text-sm truncate">
              {request.path}
            </span>
          </div>
          {request.summary && (
            <div className="text-sm text-muted-foreground truncate mt-0.5">
              {request.summary}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {request.deprecated && (
            <Tooltip content="Deprecated">
              <AlertCircle className="w-4 h-4 text-warning" />
            </Tooltip>
          )}
          {request.security && request.security.length > 0 && (
            <Tooltip content="Requires authentication">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </Tooltip>
          )}
          {request.webhooks && (
            <Tooltip content="Has webhooks">
              <Webhook className="w-4 h-4 text-primary" />
            </Tooltip>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            {/* Description */}
            {request.description && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {request.description}
                </p>
              </div>
            )}

            {/* Parameters */}
            {request.parameters && request.parameters.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <ListChecks className="w-4 h-4" />
                  Parameters
                </h4>
                <div className="space-y-2">
                  {request.parameters.map((param: any) => (
                    <RequestParameter
                      key={`${param.in}-${param.name}`}
                      name={param.name}
                      parameter={param}
                      location={param.in}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Request Body */}
            {request.requestBody && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Upload className="w-4 h-4" />
                  Request Body
                  {request.requestBody.required && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive font-medium">
                      Required
                    </span>
                  )}
                </h4>
                <RequestBody body={request.requestBody} />
              </div>
            )}

            {/* Security */}
            {request.security && request.security.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Security
                </h4>
                <div className="space-y-2">
                  {request.security.map((scheme: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      {Object.entries(scheme).map(([name, scopes]: [string, any]) => (
                        <div key={name} className="flex items-center gap-2">
                          <span className="font-mono text-sm">{name}</span>
                          {scopes.length > 0 && (
                            <div className="flex items-center gap-1">
                              {scopes.map((scope: string) => (
                                <span key={scope} className="px-1.5 py-0.5 text-[10px] rounded-md bg-muted font-mono">
                                  {scope}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Docs */}
            {request.externalDocs && (
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-muted-foreground" />
                <a
                  href={request.externalDocs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline"
                >
                  {request.externalDocs.description || 'External Documentation'}
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default APIRequest; 