import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Key,
  Lock,
  Shield,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APISecurityProps {
  spec: any;
  className?: string;
}

interface SecuritySchemeProps {
  name: string;
  scheme: any;
}

const SecurityScheme: React.FC<SecuritySchemeProps> = ({
  name,
  scheme,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCopyScheme = () => {
    navigator.clipboard.writeText(JSON.stringify(scheme, null, 2));
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div
        className="flex items-center gap-2 p-3 bg-card hover:bg-accent/50 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="p-0.5">
          {isExpanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>

        <div className={cn(
          'px-2 py-1 text-xs font-medium rounded-md uppercase',
          scheme.type === 'oauth2' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
          scheme.type === 'apiKey' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
          scheme.type === 'http' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
          scheme.type === 'openIdConnect' && 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
        )}>
          {scheme.type}
        </div>

        <div className="flex-1 font-medium">{name}</div>

        <div className="flex items-center gap-1">
          <Tooltip content="Copy scheme">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyScheme();
              }}
              className="p-1.5 rounded-md hover:bg-accent"
            >
              <Copy className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50">
          <div className="space-y-4">
            {/* Description */}
            {scheme.description && (
              <p className="text-sm text-muted-foreground">
                {scheme.description}
              </p>
            )}

            {/* OAuth2 Flows */}
            {scheme.type === 'oauth2' && scheme.flows && (
              <div>
                <h4 className="text-sm font-medium mb-2">OAuth2 Flows</h4>
                <div className="space-y-4">
                  {Object.entries(scheme.flows).map(([flowType, flow]: [string, any]) => (
                    <div key={flowType} className="border rounded-md p-3">
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-medium capitalize">{flowType}</h5>
                        {flow.refreshUrl && (
                          <a
                            href={flow.refreshUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline"
                          >
                            Refresh URL
                          </a>
                        )}
                      </div>

                      {/* Authorization URL */}
                      {flow.authorizationUrl && (
                        <div className="mb-2">
                          <div className="text-sm text-muted-foreground mb-1">Authorization URL</div>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 rounded bg-muted text-sm flex-1 overflow-auto">
                              {flow.authorizationUrl}
                            </code>
                            <Tooltip content="Copy URL">
                              <button
                                onClick={() => navigator.clipboard.writeText(flow.authorizationUrl)}
                                className="p-1 rounded hover:bg-accent"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      )}

                      {/* Token URL */}
                      {flow.tokenUrl && (
                        <div className="mb-2">
                          <div className="text-sm text-muted-foreground mb-1">Token URL</div>
                          <div className="flex items-center gap-2">
                            <code className="px-2 py-1 rounded bg-muted text-sm flex-1 overflow-auto">
                              {flow.tokenUrl}
                            </code>
                            <Tooltip content="Copy URL">
                              <button
                                onClick={() => navigator.clipboard.writeText(flow.tokenUrl)}
                                className="p-1 rounded hover:bg-accent"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      )}

                      {/* Scopes */}
                      {flow.scopes && Object.keys(flow.scopes).length > 0 && (
                        <div>
                          <div className="text-sm text-muted-foreground mb-1">Scopes</div>
                          <div className="space-y-1">
                            {Object.entries(flow.scopes).map(([scope, description]) => (
                              <div key={scope} className="flex items-start gap-2 text-sm">
                                <code className="px-1.5 py-0.5 rounded bg-muted shrink-0">
                                  {scope}
                                </code>
                                <span className="text-muted-foreground">
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
              </div>
            )}

            {/* API Key */}
            {scheme.type === 'apiKey' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Location:</div>
                  <code className="px-1.5 py-0.5 rounded bg-muted text-sm">
                    {scheme.in}
                  </code>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Parameter Name:</div>
                  <code className="px-1.5 py-0.5 rounded bg-muted text-sm">
                    {scheme.name}
                  </code>
                </div>
              </div>
            )}

            {/* HTTP */}
            {scheme.type === 'http' && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium">Scheme:</div>
                  <code className="px-1.5 py-0.5 rounded bg-muted text-sm">
                    {scheme.scheme}
                  </code>
                </div>
                {scheme.bearerFormat && (
                  <div className="flex items-center gap-2">
                    <div className="text-sm font-medium">Bearer Format:</div>
                    <code className="px-1.5 py-0.5 rounded bg-muted text-sm">
                      {scheme.bearerFormat}
                    </code>
                  </div>
                )}
              </div>
            )}

            {/* OpenID Connect */}
            {scheme.type === 'openIdConnect' && (
              <div>
                <div className="text-sm text-muted-foreground mb-1">OpenID Connect URL</div>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 rounded bg-muted text-sm flex-1 overflow-auto">
                    {scheme.openIdConnectUrl}
                  </code>
                  <Tooltip content="Copy URL">
                    <button
                      onClick={() => navigator.clipboard.writeText(scheme.openIdConnectUrl)}
                      className="p-1 rounded hover:bg-accent"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </Tooltip>
                </div>
              </div>
            )}

            {/* External Docs */}
            {scheme.externalDocs && (
              <div>
                <h4 className="text-sm font-medium mb-2">External Documentation</h4>
                <a
                  href={scheme.externalDocs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {scheme.externalDocs.description || 'Learn more'}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const APISecurity: React.FC<APISecurityProps> = ({
  spec,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  // Group security schemes by type
  const schemesByType = React.useMemo(() => {
    const groups: Record<string, Record<string, any>> = {
      oauth2: {},
      apiKey: {},
      http: {},
      openIdConnect: {},
      other: {},
    };

    if (spec.components?.securitySchemes) {
      Object.entries(spec.components.securitySchemes).forEach(([name, scheme]: [string, any]) => {
        const type = scheme.type || 'other';
        if (groups[type]) {
          groups[type][name] = scheme;
        } else {
          groups.other[name] = scheme;
        }
      });
    }

    return groups;
  }, [spec]);

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Global Security */}
      {spec.security && spec.security.length > 0 && (
        <div className="border rounded-lg p-4 bg-card">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-medium">Global Security Requirements</h3>
          </div>
          <div className="space-y-2">
            {spec.security.map((requirement: any, index: number) => (
              <div key={index} className="border rounded-md p-3">
                <div className="text-sm font-medium mb-2">
                  {Object.keys(requirement).length > 0 ? 'One of:' : 'No security'}
                </div>
                {Object.entries(requirement).map(([scheme, scopes]: [string, any]) => (
                  <div key={scheme} className="flex items-start gap-2 ml-4">
                    <Lock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{scheme}</div>
                      {scopes && scopes.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {scopes.map((scope: string) => (
                            <div
                              key={scope}
                              className="px-1.5 py-0.5 text-xs rounded-md bg-muted"
                            >
                              {scope}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Schemes */}
      {Object.entries(schemesByType).map(([type, schemes]) => (
        Object.keys(schemes).length > 0 && (
          <div key={type} className="space-y-2">
            <button
              onClick={() => toggleCategory(type)}
              className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-accent/50"
            >
              {expandedCategories.has(type) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <h3 className="text-lg font-medium capitalize">
                {type === 'oauth2' ? 'OAuth 2.0' :
                 type === 'apiKey' ? 'API Key' :
                 type === 'http' ? 'HTTP' :
                 type === 'openIdConnect' ? 'OpenID Connect' :
                 'Other'}
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {Object.keys(schemes).length}
              </span>
            </button>

            {expandedCategories.has(type) && (
              <div className="space-y-2 ml-6">
                {Object.entries(schemes).map(([name, scheme]) => (
                  <SecurityScheme key={name} name={name} scheme={scheme} />
                ))}
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default APISecurity; 