import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  FileJson,
  Lock,
} from 'lucide-react';
import { cn } from '../lib/utils';
import { Tooltip } from './ui/TooltipComponent';

interface APISchemasProps {
  spec: any;
  className?: string;
}

interface SchemaProps {
  name: string;
  schema: any;
}

const Schema: React.FC<SchemaProps> = ({
  name,
  schema,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const handleCopySchema = () => {
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
  };

  const renderProperties = (properties: any, required: string[] = []) => {
    return Object.entries(properties).map(([propName, propSchema]: [string, any]) => (
      <div key={propName} className="ml-4 border-l pl-4">
        <div className="flex items-start gap-2">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{propName}</span>
              {required.includes(propName) && (
                <span className="text-destructive text-xs">Required</span>
              )}
            </div>
            <div className="text-sm text-muted-foreground">
              {propSchema.type && (
                <span className="font-mono">{propSchema.type}</span>
              )}
              {propSchema.format && (
                <span className="font-mono ml-1">({propSchema.format})</span>
              )}
            </div>
            {propSchema.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {propSchema.description}
              </p>
            )}
            {propSchema.enum && (
              <div className="mt-1">
                <div className="text-sm font-medium">Allowed values:</div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {propSchema.enum.map((value: any) => (
                    <div
                      key={value}
                      className="px-1.5 py-0.5 text-xs rounded-md bg-muted"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {propSchema.properties && (
          <div className="mt-2">
            {renderProperties(propSchema.properties, propSchema.required)}
          </div>
        )}
      </div>
    ));
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

        <FileJson className="w-4 h-4" />
        <div className="flex-1 font-medium">{name}</div>

        <div className="flex items-center gap-1">
          {schema.readOnly && (
            <Tooltip content="Read only">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </Tooltip>
          )}
          <Tooltip content="Copy schema">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleCopySchema();
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
            {schema.description && (
              <p className="text-sm text-muted-foreground">
                {schema.description}
              </p>
            )}

            {/* Properties */}
            {schema.properties && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Properties</h4>
                {renderProperties(schema.properties, schema.required)}
              </div>
            )}

            {/* Example */}
            {schema.example && (
              <div>
                <h4 className="text-sm font-medium mb-2">Example</h4>
                <pre className="p-3 rounded-md bg-muted overflow-auto">
                  <code>{JSON.stringify(schema.example, null, 2)}</code>
                </pre>
              </div>
            )}

            {/* External Docs */}
            {schema.externalDocs && (
              <div>
                <h4 className="text-sm font-medium mb-2">External Documentation</h4>
                <a
                  href={schema.externalDocs.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                >
                  {schema.externalDocs.description || 'Learn more'}
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

export const APISchemas: React.FC<APISchemasProps> = ({
  spec,
  className,
}) => {
  const [expandedCategories, setExpandedCategories] = React.useState<Set<string>>(new Set());

  // Group schemas by category (using first tag or 'Other')
  const schemasByCategory = React.useMemo(() => {
    const groups: Record<string, Record<string, any>> = {
      other: {},
    };

    if (spec.components?.schemas) {
      Object.entries(spec.components.schemas).forEach(([name, schema]: [string, any]) => {
        const category = schema['x-category'] || 'other';
        if (!groups[category]) {
          groups[category] = {};
        }
        groups[category][name] = schema;
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
      {Object.entries(schemasByCategory).map(([category, schemas]) => (
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
              {Object.keys(schemas).length}
            </span>
          </button>

          {expandedCategories.has(category) && (
            <div className="space-y-2 ml-6">
              {Object.entries(schemas).map(([name, schema]) => (
                <Schema key={name} name={name} schema={schema} />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}; 