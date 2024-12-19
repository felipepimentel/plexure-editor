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
  Trash
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APIInfoProps {
  spec: any;
  className?: string;
}

interface SecuritySchemeProps {
  name: string;
  scheme: any;
}

const SecurityScheme: React.FC<SecuritySchemeProps> = ({
  name,
  scheme
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [copiedScheme, setCopiedScheme] = React.useState(false);

  const handleCopyScheme = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(scheme, null, 2));
      setCopiedScheme(true);
      setTimeout(() => setCopiedScheme(false), 2000);
    } catch (error) {
      console.error('Failed to copy scheme:', error);
    }
  };

  const getSchemeIcon = () => {
    switch (scheme.type) {
      case 'oauth2':
        return <ShieldCheck className="w-4 h-4 text-success" />;
      case 'apiKey':
        return <Key className="w-4 h-4 text-warning" />;
      case 'http':
        switch (scheme.scheme) {
          case 'bearer':
            return <Shield className="w-4 h-4 text-primary" />;
          case 'basic':
            return <Lock className="w-4 h-4 text-muted-foreground" />;
          default:
            return <ShieldQuestion className="w-4 h-4 text-muted-foreground" />;
        }
      default:
        return <ShieldAlert className="w-4 h-4 text-destructive" />;
    }
  };

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden transition-all duration-200",
      isExpanded && "bg-muted/30",
      "hover:shadow-sm"
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

        {getSchemeIcon()}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium truncate">{name}</span>
            <span className={cn(
              "px-1.5 py-0.5 rounded-md text-[10px] font-medium uppercase",
              scheme.type === 'oauth2' && "bg-success/10 text-success",
              scheme.type === 'apiKey' && "bg-warning/10 text-warning",
              scheme.type === 'http' && "bg-primary/10 text-primary"
            )}>
              {scheme.type}
            </span>
            {scheme.scheme && (
              <span className="px-1.5 py-0.5 rounded-md bg-muted text-[10px] font-medium text-muted-foreground">
                {scheme.scheme}
              </span>
            )}
          </div>
          {scheme.description && (
            <div className="text-sm text-muted-foreground truncate mt-0.5">
              {scheme.description}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Tooltip content={copiedScheme ? 'Copied!' : 'Copy scheme'}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyScheme();
              }}
              className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              {copiedScheme ? (
                <Check className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </Tooltip>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            {/* Description */}
            {scheme.description && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {scheme.description}
                </p>
              </div>
            )}

            {/* OAuth2 Flows */}
            {scheme.type === 'oauth2' && scheme.flows && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  OAuth2 Flows
                </h4>
                {Object.entries(scheme.flows).map(([flowName, flow]: [string, any]) => (
                  <div key={flowName} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Workflow className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium capitalize">{flowName}</span>
                    </div>
                    {flow.authorizationUrl && (
                      <div className="flex items-center gap-2 text-sm">
                        <Globe className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Authorization URL:</span>
                        <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs">
                          {flow.authorizationUrl}
                        </code>
                      </div>
                    )}
                    {flow.tokenUrl && (
                      <div className="flex items-center gap-2 text-sm">
                        <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Token URL:</span>
                        <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs">
                          {flow.tokenUrl}
                        </code>
                      </div>
                    )}
                    {flow.refreshUrl && (
                      <div className="flex items-center gap-2 text-sm">
                        <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-muted-foreground">Refresh URL:</span>
                        <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs">
                          {flow.refreshUrl}
                        </code>
                      </div>
                    )}
                    {flow.scopes && Object.keys(flow.scopes).length > 0 && (
                      <div className="space-y-1">
                        <div className="text-sm text-muted-foreground">Available Scopes:</div>
                        <div className="space-y-1">
                          {Object.entries(flow.scopes).map(([scope, description]) => (
                            <div key={scope} className="flex items-start gap-2 text-sm">
                              <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs shrink-0">
                                {scope}
                              </code>
                              <span className="text-muted-foreground text-xs">
                                {description}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* API Key Details */}
            {scheme.type === 'apiKey' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Terminal className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs">
                    {scheme.in}
                  </code>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Parameter Name:</span>
                  <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs">
                    {scheme.name}
                  </code>
                </div>
              </div>
            )}

            {/* HTTP Details */}
            {scheme.type === 'http' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Shield className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="text-muted-foreground">Authentication Scheme:</span>
                  <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs">
                    {scheme.scheme}
                  </code>
                </div>
                {scheme.bearerFormat && (
                  <div className="flex items-center gap-2 text-sm">
                    <FileCode className="w-3.5 h-3.5 text-muted-foreground" />
                    <span className="text-muted-foreground">Bearer Format:</span>
                    <code className="px-1.5 py-0.5 rounded-md bg-muted font-mono text-xs">
                      {scheme.bearerFormat}
                    </code>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const APIInfo: React.FC<APIInfoProps> = ({
  spec,
  className,
}) => {
  const [expandedSections, setExpandedSections] = React.useState<Set<string>>(new Set(['info']));

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">API Information</h2>
            <p className="text-sm text-muted-foreground">
              OpenAPI {spec.openapi} Specification
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="space-y-2">
          <button
            onClick={() => toggleSection('info')}
            className={cn(
              "flex items-center gap-2 w-full text-left p-2 rounded-md transition-all duration-200",
              "hover:shadow-sm",
              expandedSections.has('info')
                ? "bg-muted"
                : "hover:bg-muted/50"
            )}
          >
            <ChevronRight className={cn(
              "w-4 h-4 transition-transform duration-200",
              expandedSections.has('info') && "rotate-90"
            )} />
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              <h3 className="text-sm font-medium">Basic Information</h3>
            </div>
          </button>

          {expandedSections.has('info') && (
            <div className="space-y-4 p-4 animate-in slide-in-from-top-2 duration-200">
              {/* Title & Version */}
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{spec.info.title}</h1>
                <div className="px-2 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">
                  v{spec.info.version}
                </div>
              </div>

              {/* Description */}
              {spec.info.description && (
                <div className="prose prose-sm max-w-none">
                  {spec.info.description}
                </div>
              )}

              {/* Contact & License */}
              <div className="flex flex-wrap gap-4">
                {spec.info.contact && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {spec.info.contact.email ? (
                      <a
                        href={`mailto:${spec.info.contact.email}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {spec.info.contact.name || spec.info.contact.email}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {spec.info.contact.name}
                      </span>
                    )}
                  </div>
                )}
                {spec.info.license && (
                  <div className="flex items-center gap-2">
                    <License className="w-4 h-4 text-muted-foreground" />
                    {spec.info.license.url ? (
                      <a
                        href={spec.info.license.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {spec.info.license.name}
                      </a>
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {spec.info.license.name}
                      </span>
                    )}
                  </div>
                )}
                {spec.info.termsOfService && (
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <a
                      href={spec.info.termsOfService}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      Terms of Service
                    </a>
                  </div>
                )}
              </div>

              {/* External Docs */}
              {spec.externalDocs && (
                <div className="flex items-center gap-2">
                  <Link2 className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={spec.externalDocs.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {spec.externalDocs.description || 'External Documentation'}
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Security */}
        {spec.components?.securitySchemes && Object.keys(spec.components.securitySchemes).length > 0 && (
          <div className="space-y-2">
            <button
              onClick={() => toggleSection('security')}
              className={cn(
                "flex items-center gap-2 w-full text-left p-2 rounded-md transition-all duration-200",
                "hover:shadow-sm",
                expandedSections.has('security')
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              )}
            >
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform duration-200",
                expandedSections.has('security') && "rotate-90"
              )} />
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <h3 className="text-sm font-medium">Security</h3>
              </div>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {Object.keys(spec.components.securitySchemes).length}
              </span>
            </button>

            {expandedSections.has('security') && (
              <div className="space-y-2 ml-6 animate-in slide-in-from-top-2 duration-200">
                {Object.entries(spec.components.securitySchemes).map(([name, scheme]) => (
                  <SecurityScheme key={name} name={name} scheme={scheme} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default APIInfo; 