import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  ExternalLink,
  PlayCircle,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APIExampleProps {
  spec: any;
  className?: string;
}

interface ExampleProps {
  name: string;
  example: any;
  path?: string;
  method?: string;
  onTest?: () => void;
}

const Example: React.FC<ExampleProps> = ({
  name,
  example,
  path,
  method,
  onTest,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCopyExample = () => {
    navigator.clipboard.writeText(JSON.stringify(example, null, 2));
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

        <div className="flex-1">
          <div className="font-medium">{name}</div>
          {path && method && (
            <div className="text-sm text-muted-foreground">
              <span className={cn(
                'px-1.5 py-0.5 rounded-md text-xs uppercase mr-2',
                method === 'get' && 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
                method === 'post' && 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
                method === 'put' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300',
                method === 'delete' && 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
                method === 'patch' && 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
              )}>
                {method}
              </span>
              <span className="font-mono">{path}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Tooltip content="Copy example">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyExample();
              }}
              className="p-1.5 rounded-md hover:bg-accent"
            >
              <Copy className="w-4 h-4" />
            </button>
          </Tooltip>
          {onTest && (
            <Tooltip content="Test example">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onTest();
                }}
                className="p-1.5 rounded-md hover:bg-accent"
              >
                <PlayCircle className="w-4 h-4" />
              </button>
            </Tooltip>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50">
          <div className="space-y-4">
            {/* Request */}
            {example.request && (
              <div>
                <h4 className="text-sm font-medium mb-2">Request</h4>
                <div className="space-y-2">
                  {/* Headers */}
                  {example.request.headers && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Headers</div>
                      <pre className="p-3 rounded-md bg-muted overflow-auto">
                        <code>{JSON.stringify(example.request.headers, null, 2)}</code>
                      </pre>
                    </div>
                  )}

                  {/* Query Parameters */}
                  {example.request.query && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Query Parameters</div>
                      <pre className="p-3 rounded-md bg-muted overflow-auto">
                        <code>{JSON.stringify(example.request.query, null, 2)}</code>
                      </pre>
                    </div>
                  )}

                  {/* Body */}
                  {example.request.body && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Body</div>
                      <pre className="p-3 rounded-md bg-muted overflow-auto">
                        <code>{JSON.stringify(example.request.body, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Response */}
            {example.response && (
              <div>
                <h4 className="text-sm font-medium mb-2">Response</h4>
                <div className="space-y-2">
                  {/* Status */}
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'px-1.5 py-0.5 rounded-md text-xs font-mono',
                      example.response.status >= 200 && example.response.status < 300 && 'bg-success/10 text-success',
                      example.response.status >= 400 && example.response.status < 500 && 'bg-destructive/10 text-destructive',
                      example.response.status >= 500 && 'bg-warning/10 text-warning',
                    )}>
                      {example.response.status}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {example.response.statusText}
                    </div>
                  </div>

                  {/* Headers */}
                  {example.response.headers && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Headers</div>
                      <pre className="p-3 rounded-md bg-muted overflow-auto">
                        <code>{JSON.stringify(example.response.headers, null, 2)}</code>
                      </pre>
                    </div>
                  )}

                  {/* Body */}
                  {example.response.body && (
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Body</div>
                      <pre className="p-3 rounded-md bg-muted overflow-auto">
                        <code>{JSON.stringify(example.response.body, null, 2)}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Code Snippets */}
            {example.snippets && (
              <div>
                <h4 className="text-sm font-medium mb-2">Code Snippets</h4>
                <div className="space-y-2">
                  {Object.entries(example.snippets).map(([language, code]) => (
                    <div key={language}>
                      <div className="flex items-center justify-between mb-1">
                        <div className="text-xs text-muted-foreground capitalize">
                          {language}
                        </div>
                        <Tooltip content="Copy code">
                          <button
                            onClick={() => navigator.clipboard.writeText(code as string)}
                            className="p-1 rounded-md hover:bg-accent"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </Tooltip>
                      </div>
                      <pre className="p-3 rounded-md bg-muted overflow-auto">
                        <code>{code}</code>
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* External Docs */}
            {example.externalDocs && (
              <div>
                <h4 className="text-sm font-medium mb-2">External Documentation</h4>
                <a
                  href={example.externalDocs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {example.externalDocs.description || 'Learn more'}
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

export const APIExample: React.FC<APIExampleProps> = ({
  spec,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  // Group examples by category
  const examplesByCategory = React.useMemo(() => {
    const groups: Record<string, Array<{
      name: string;
      example: any;
      path?: string;
      method?: string;
    }>> = {
      endpoints: [],
      schemas: [],
      other: [],
    };

    // Collect examples from paths
    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          if (operation.examples) {
            operation.examples.forEach((example: any) => {
              groups.endpoints.push({
                name: example.name || `${method.toUpperCase()} ${path}`,
                example,
                path,
                method,
              });
            });
          }
        });
      });
    }

    // Collect examples from schemas
    if (spec.components?.schemas) {
      Object.entries(spec.components.schemas).forEach(([name, schema]: [string, any]) => {
        if (schema.example) {
          groups.schemas.push({
            name,
            example: {
              value: schema.example,
            },
          });
        }
      });
    }

    // Collect standalone examples
    if (spec.components?.examples) {
      Object.entries(spec.components.examples).forEach(([name, example]: [string, any]) => {
        groups.other.push({
          name,
          example,
        });
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
      {Object.entries(examplesByCategory).map(([category, examples]) => (
        examples.length > 0 && (
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
                {category}
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {examples.length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2 ml-6">
                {examples.map((example, index) => (
                  <Example
                    key={index}
                    name={example.name}
                    example={example.example}
                    path={example.path}
                    method={example.method}
                    onTest={example.path && example.method ? () => {
                      // Handle example testing
                      console.log('Test example:', example.method, example.path);
                    } : undefined}
                  />
                ))}
              </div>
            )}
          </div>
        )
      ))}
    </div>
  );
};

export default APIExample; 