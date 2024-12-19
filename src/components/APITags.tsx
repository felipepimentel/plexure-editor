import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Tag,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APITagsProps {
  spec: any;
  className?: string;
}

interface TagProps {
  name: string;
  tag: any;
  operations: Array<{
    path: string;
    method: string;
    operation: any;
  }>;
}

const TagComponent: React.FC<TagProps> = ({
  name,
  tag,
  operations,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCopyTag = () => {
    navigator.clipboard.writeText(JSON.stringify(tag, null, 2));
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

        <Tag className="w-4 h-4" />
        <div className="flex-1">
          <div className="font-medium">{name}</div>
          {tag.description && (
            <div className="text-sm text-muted-foreground">
              {tag.description}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
            {operations.length}
          </span>
          <Tooltip content="Copy tag">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyTag();
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
            {tag.description && (
              <p className="text-sm text-muted-foreground">
                {tag.description}
              </p>
            )}

            {/* Operations */}
            <div className="space-y-2">
              {operations.map(({ path, method, operation }) => (
                <div key={`${path}-${method}`} className="border rounded-md p-3">
                  <div className="flex items-center gap-2 mb-2">
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
                    <div className="font-mono text-sm">{path}</div>
                  </div>

                  {operation.summary && (
                    <div className="text-sm font-medium mb-1">
                      {operation.summary}
                    </div>
                  )}

                  {operation.description && (
                    <div className="text-sm text-muted-foreground">
                      {operation.description}
                    </div>
                  )}

                  {/* Operation Metadata */}
                  <div className="flex flex-wrap gap-2 mt-2">
                    {operation.deprecated && (
                      <div className="px-1.5 py-0.5 text-xs rounded-md bg-destructive/10 text-destructive">
                        Deprecated
                      </div>
                    )}
                    {operation.security && operation.security.length > 0 && (
                      <div className="px-1.5 py-0.5 text-xs rounded-md bg-warning/10 text-warning">
                        Requires Auth
                      </div>
                    )}
                    {operation.parameters && operation.parameters.length > 0 && (
                      <div className="px-1.5 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                        {operation.parameters.length} Parameters
                      </div>
                    )}
                    {operation.requestBody && (
                      <div className="px-1.5 py-0.5 text-xs rounded-md bg-muted text-muted-foreground">
                        Request Body
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* External Docs */}
            {tag.externalDocs && (
              <div>
                <h4 className="text-sm font-medium mb-2">External Documentation</h4>
                <a
                  href={tag.externalDocs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {tag.externalDocs.description || 'Learn more'}
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

export const APITags: React.FC<APITagsProps> = ({
  spec,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  // Group tags by category
  const tagsByCategory = React.useMemo(() => {
    const groups: Record<string, Record<string, {
      tag: any;
      operations: Array<{
        path: string;
        method: string;
        operation: any;
      }>;
    }>> = {
      other: {},
    };

    // First, collect all operations by tag
    const operationsByTag: Record<string, Array<{
      path: string;
      method: string;
      operation: any;
    }>> = {};

    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          if (method !== 'parameters' && method !== 'servers') {
            const tags = operation.tags || ['other'];
            tags.forEach((tag: string) => {
              if (!operationsByTag[tag]) {
                operationsByTag[tag] = [];
              }
              operationsByTag[tag].push({ path, method, operation });
            });
          }
        });
      });
    }

    // Then, organize tags into categories
    if (spec.tags) {
      spec.tags.forEach((tag: any) => {
        const category = tag['x-category'] || 'other';
        if (!groups[category]) {
          groups[category] = {};
        }
        groups[category][tag.name] = {
          tag,
          operations: operationsByTag[tag.name] || [],
        };
      });
    }

    // Add any remaining tags from operations
    Object.entries(operationsByTag).forEach(([tagName, operations]) => {
      let found = false;
      Object.values(groups).forEach(categoryTags => {
        if (categoryTags[tagName]) {
          found = true;
        }
      });
      if (!found) {
        groups.other[tagName] = {
          tag: { name: tagName },
          operations,
        };
      }
    });

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
      {Object.entries(tagsByCategory).map(([category, tags]) => (
        Object.keys(tags).length > 0 && (
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
                {Object.keys(tags).length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2 ml-6">
                {Object.entries(tags).map(([name, { tag, operations }]) => (
                  <TagComponent
                    key={name}
                    name={name}
                    tag={tag}
                    operations={operations}
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