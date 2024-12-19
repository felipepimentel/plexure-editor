import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Radio,
  Webhook,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APIWebhooksProps {
  spec: any;
  className?: string;
}

interface WebhookProps {
  name: string;
  webhook: any;
}

const WebhookComponent: React.FC<WebhookProps> = ({
  name,
  webhook,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCopyWebhook = () => {
    navigator.clipboard.writeText(JSON.stringify(webhook, null, 2));
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

        <Webhook className="w-4 h-4" />
        <div className="flex-1">
          <div className="font-medium">{name}</div>
          {webhook.summary && (
            <div className="text-sm text-muted-foreground">
              {webhook.summary}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Tooltip content="Copy webhook">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyWebhook();
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
            {webhook.description && (
              <p className="text-sm text-muted-foreground">
                {webhook.description}
              </p>
            )}

            {/* Operations */}
            {Object.entries(webhook).map(([method, operation]: [string, any]) => {
              if (!['get', 'post', 'put', 'delete', 'patch'].includes(method)) {
                return null;
              }

              return (
                <div key={method} className="border rounded-md p-3">
                  <div className="flex items-center gap-2 mb-3">
                    <div className={cn(
                      'px-2 py-1 text-xs font-medium rounded-md uppercase',
                      method === 'get' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                      method === 'post' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                      method === 'put' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                      method === 'delete' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                      method === 'patch' && 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
                    )}>
                      {method}
                    </div>
                    <div className="font-medium">
                      {operation.summary || 'Webhook Operation'}
                    </div>
                  </div>

                  {/* Operation Description */}
                  {operation.description && (
                    <p className="text-sm text-muted-foreground mb-3">
                      {operation.description}
                    </p>
                  )}

                  {/* Request Body */}
                  {operation.requestBody && (
                    <div className="mb-3">
                      <h4 className="text-sm font-medium mb-2">Request Body</h4>
                      <div className="space-y-2">
                        {Object.entries(operation.requestBody.content).map(([contentType, schema]: [string, any]) => (
                          <div key={contentType} className="text-sm">
                            <div className="font-mono text-xs text-muted-foreground mb-1">{contentType}</div>
                            <pre className="p-3 rounded-md bg-muted overflow-auto">
                              <code>{JSON.stringify(schema.schema, null, 2)}</code>
                            </pre>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Responses */}
                  {operation.responses && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Responses</h4>
                      <div className="space-y-2">
                        {Object.entries(operation.responses).map(([code, response]: [string, any]) => (
                          <div key={code} className="text-sm">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={cn(
                                'px-1.5 py-0.5 rounded-md font-mono text-xs',
                                code.startsWith('2') && 'bg-success/10 text-success',
                                code.startsWith('4') && 'bg-destructive/10 text-destructive',
                                code.startsWith('5') && 'bg-warning/10 text-warning',
                              )}>
                                {code}
                              </div>
                              <div className="text-muted-foreground">{response.description}</div>
                            </div>
                            {response.content && Object.entries(response.content).map(([contentType, schema]: [string, any]) => (
                              <div key={contentType} className="mt-2">
                                <div className="font-mono text-xs text-muted-foreground mb-1">{contentType}</div>
                                <pre className="p-3 rounded-md bg-muted overflow-auto">
                                  <code>{JSON.stringify(schema.schema, null, 2)}</code>
                                </pre>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {/* External Docs */}
            {webhook.externalDocs && (
              <div>
                <h4 className="text-sm font-medium mb-2">External Documentation</h4>
                <a
                  href={webhook.externalDocs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {webhook.externalDocs.description || 'Learn more'}
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

export const APIWebhooks: React.FC<APIWebhooksProps> = ({
  spec,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  // Group webhooks by category (using first tag or 'Other')
  const webhooksByCategory = React.useMemo(() => {
    const groups: Record<string, Record<string, any>> = {
      other: {},
    };

    if (spec.webhooks) {
      Object.entries(spec.webhooks).forEach(([name, webhook]: [string, any]) => {
        const category = webhook['x-category'] || 'other';
        if (!groups[category]) {
          groups[category] = {};
        }
        groups[category][name] = webhook;
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
      {Object.entries(webhooksByCategory).map(([category, webhooks]) => (
        Object.keys(webhooks).length > 0 && (
          <div key={category} className="space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className="flex items-center gap-2 w-full text-left p-2 rounded-md hover:bg-accent/50"
            >
              {expandedCategories.has(category) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
              <h3 className="text-lg font-medium capitalize">
                {category === 'other' ? 'Other' : category}
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {Object.keys(webhooks).length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2 ml-6">
                {Object.entries(webhooks).map(([name, webhook]) => (
                  <WebhookComponent key={name} name={name} webhook={webhook} />
                ))}
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
}; 