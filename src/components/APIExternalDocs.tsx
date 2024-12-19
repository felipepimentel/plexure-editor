import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  Globe,
  Link2,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APIExternalDocsProps {
  spec: any;
  className?: string;
}

interface ExternalDocProps {
  name: string;
  doc: any;
}

const ExternalDocComponent: React.FC<ExternalDocProps> = ({
  name,
  doc,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(doc.url);
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

        <Link2 className="w-4 h-4" />
        <div className="flex-1">
          <div className="font-medium">{name}</div>
          {doc.description && (
            <div className="text-sm text-muted-foreground">
              {doc.description}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Tooltip content="Copy URL">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopyUrl();
              }}
              className="p-1.5 rounded-md hover:bg-accent"
            >
              <Copy className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Open in new tab">
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-1.5 rounded-md hover:bg-accent"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </Tooltip>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50">
          <div className="space-y-4">
            {/* Description */}
            {doc.description && (
              <p className="text-sm text-muted-foreground">
                {doc.description}
              </p>
            )}

            {/* URL */}
            <div>
              <h4 className="text-sm font-medium mb-2">URL</h4>
              <div className="flex items-center gap-2">
                <code className="px-2 py-1 rounded bg-muted text-sm flex-1 overflow-auto">
                  {doc.url}
                </code>
                <Tooltip content="Copy URL">
                  <button
                    onClick={handleCopyUrl}
                    className="p-1 rounded hover:bg-accent"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Additional Information */}
            {doc.summary && (
              <div>
                <h4 className="text-sm font-medium mb-2">Summary</h4>
                <p className="text-sm text-muted-foreground">
                  {doc.summary}
                </p>
              </div>
            )}

            {/* Tags */}
            {doc.tags && doc.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tag: string) => (
                    <div
                      key={tag}
                      className="px-1.5 py-0.5 text-xs rounded-md bg-muted"
                    >
                      {tag}
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

export const APIExternalDocs: React.FC<APIExternalDocsProps> = ({
  spec,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  // Group external docs by category
  const docsByCategory = React.useMemo(() => {
    const groups: Record<string, Record<string, any>> = {
      api: {},
      components: {},
      operations: {},
      other: {},
    };

    // API-level docs
    if (spec.externalDocs) {
      groups.api['API Documentation'] = {
        ...spec.externalDocs,
        source: 'api',
      };
    }

    // Component-level docs
    if (spec.components) {
      Object.entries(spec.components).forEach(([type, components]: [string, any]) => {
        Object.entries(components).forEach(([name, component]: [string, any]) => {
          if (component.externalDocs) {
            groups.components[`${type}/${name}`] = {
              ...component.externalDocs,
              source: 'component',
              componentType: type,
              componentName: name,
            };
          }
        });
      });
    }

    // Operation-level docs
    if (spec.paths) {
      Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
        Object.entries(methods).forEach(([method, operation]: [string, any]) => {
          if (method !== 'parameters' && method !== 'servers' && operation.externalDocs) {
            groups.operations[`${method.toUpperCase()} ${path}`] = {
              ...operation.externalDocs,
              source: 'operation',
              path,
              method,
            };
          }
        });
      });
    }

    // Tag-level docs
    if (spec.tags) {
      spec.tags.forEach((tag: any) => {
        if (tag.externalDocs) {
          groups.other[`Tag: ${tag.name}`] = {
            ...tag.externalDocs,
            source: 'tag',
            tagName: tag.name,
          };
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
      {Object.entries(docsByCategory).map(([category, docs]) => (
        Object.keys(docs).length > 0 && (
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
                {category === 'api' ? 'API Documentation' :
                 category === 'components' ? 'Component Documentation' :
                 category === 'operations' ? 'Operation Documentation' :
                 'Other Documentation'}
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {Object.keys(docs).length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className="space-y-2 ml-6">
                {Object.entries(docs).map(([name, doc]) => (
                  <ExternalDocComponent
                    key={name}
                    name={name}
                    doc={doc}
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