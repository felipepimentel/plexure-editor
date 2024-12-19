import React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Copy,
  ExternalLink,
  FileJson,
  Lock,
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
  LayoutGrid
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
  const [copiedSchema, setCopiedSchema] = React.useState(false);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showExample, setShowExample] = React.useState(false);

  const handleCopySchema = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
      setCopiedSchema(true);
      setTimeout(() => setCopiedSchema(false), 2000);
    } catch (error) {
      console.error('Failed to copy schema:', error);
    }
  };

  const renderProperties = (properties: any, required: string[] = [], depth = 0) => {
    return Object.entries(properties).map(([propName, propSchema]: [string, any]) => (
      <div
        key={propName}
        className={cn(
          "ml-4 border-l pl-4 py-2",
          depth === 0 ? "border-border" : "border-border/50"
        )}
      >
        <div className="flex items-start gap-2 group">
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium">{propName}</span>
              {required.includes(propName) && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-destructive/10 text-destructive font-medium">
                  Required
                </span>
              )}
              {propSchema.deprecated && (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-warning/10 text-warning font-medium">
                  Deprecated
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-0.5">
              {propSchema.type && (
                <span className="text-xs font-mono text-muted-foreground">
                  {propSchema.type}
                </span>
              )}
              {propSchema.format && (
                <span className="text-xs font-mono text-muted-foreground">
                  ({propSchema.format})
                </span>
              )}
              {propSchema.pattern && (
                <Tooltip content="Pattern">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Code2 className="h-3 w-3" />
                    <span className="font-mono">{propSchema.pattern}</span>
                  </div>
                </Tooltip>
              )}
            </div>
            {propSchema.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {propSchema.description}
              </p>
            )}
            {propSchema.enum && (
              <div className="mt-2">
                <div className="text-xs font-medium text-muted-foreground mb-1">Allowed values:</div>
                <div className="flex flex-wrap gap-1">
                  {propSchema.enum.map((value: any) => (
                    <div
                      key={value}
                      className="px-1.5 py-0.5 text-[10px] rounded-md bg-muted font-mono"
                    >
                      {value}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {propSchema.default !== undefined && (
              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-medium">Default:</span>
                <code className="px-1 py-0.5 rounded bg-muted font-mono">
                  {JSON.stringify(propSchema.default)}
                </code>
              </div>
            )}
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip content="Copy property">
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(propSchema, null, 2))}
                className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Copy className="h-3.5 w-3.5" />
              </button>
            </Tooltip>
          </div>
        </div>

        {propSchema.properties && (
          <div className="mt-2">
            {renderProperties(propSchema.properties, propSchema.required, depth + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <div className="border rounded-lg overflow-hidden transition-all duration-200 hover:shadow-sm">
      <div
        className={cn(
          "flex items-center gap-2 p-3 bg-card hover:bg-accent/50 cursor-pointer transition-colors",
          isExpanded && "bg-accent/50"
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <button className="p-0.5 transition-transform duration-200">
          <ChevronRight className={cn(
            "w-4 h-4 transition-transform duration-200",
            isExpanded && "rotate-90"
          )} />
        </button>

        <Box className="w-4 h-4 text-primary" />
        <div className="flex-1 font-medium">{name}</div>

        <div className="flex items-center gap-1">
          {schema.readOnly && (
            <Tooltip content="Read only">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </Tooltip>
          )}
          {schema.deprecated && (
            <Tooltip content="Deprecated">
              <AlertCircle className="w-4 h-4 text-warning" />
            </Tooltip>
          )}
          <div className="relative">
            <Tooltip content={copiedSchema ? 'Copied!' : 'Copy schema'}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopySchema();
                }}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                {copiedSchema ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </Tooltip>
          </div>
          <div className="relative">
            <Tooltip content="More actions">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowMenu(!showMenu);
                }}
                className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </Tooltip>
            {showMenu && (
              <div className="absolute right-0 mt-1 w-48 rounded-md border bg-popover/95 backdrop-blur-sm p-1 shadow-lg ring-1 ring-black/5 z-50">
                <button
                  onClick={() => setShowMenu(false)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  <Share2 className="h-3.5 w-3.5" />
                  Share
                </button>
                <button
                  onClick={() => {
                    setShowExample(!showExample);
                    setShowMenu(false);
                  }}
                  className="flex items-center gap-2 w-full px-2 py-1.5 text-sm rounded-sm hover:bg-muted/80 transition-colors"
                >
                  {showExample ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Hide Example
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Show Example
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t bg-card/50 animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-4">
            {/* Description */}
            {schema.description && (
              <div className="flex items-start gap-2 p-3 rounded-md bg-muted/50">
                <Info className="w-4 h-4 text-muted-foreground mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  {schema.description}
                </p>
              </div>
            )}

            {/* Properties */}
            {schema.properties && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <Boxes className="w-4 h-4" />
                    Properties
                  </h4>
                  <div className="flex items-center gap-1">
                    <Tooltip content="Expand all">
                      <button className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Collapse all">
                      <button className="p-1 rounded-sm hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors">
                        <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </Tooltip>
                  </div>
                </div>
                {renderProperties(schema.properties, schema.required)}
              </div>
            )}

            {/* Example */}
            {(schema.example || showExample) && (
              <div className="animate-in slide-in-from-top-2 duration-200">
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Code2 className="w-4 h-4" />
                  Example
                </h4>
                <pre className="p-3 rounded-md bg-muted overflow-auto">
                  <code className="text-xs">
                    {JSON.stringify(schema.example || schema, null, 2)}
                  </code>
                </pre>
              </div>
            )}

            {/* External Docs */}
            {schema.externalDocs && (
              <div>
                <h4 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  External Documentation
                </h4>
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
  const [searchTerm, setSearchTerm] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'list' | 'grid'>('list');

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

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      Object.keys(groups).forEach(category => {
        groups[category] = Object.fromEntries(
          Object.entries(groups[category]).filter(([name, schema]) =>
            name.toLowerCase().includes(term) ||
            schema.description?.toLowerCase().includes(term)
          )
        );
      });

      // Remove empty categories
      Object.keys(groups).forEach(category => {
        if (Object.keys(groups[category]).length === 0) {
          delete groups[category];
        }
      });
    }

    return groups;
  }, [spec, searchTerm]);

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

  const totalSchemas = React.useMemo(() => {
    return Object.values(schemasByCategory).reduce(
      (total, schemas) => total + Object.keys(schemas).length,
      0
    );
  }, [schemasByCategory]);

  return (
    <div className={className}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center">
            <Boxes className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Data Models</h2>
            <p className="text-sm text-muted-foreground">
              {totalSchemas} schema{totalSchemas !== 1 ? 's' : ''} defined
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search schemas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-[200px] h-9 pl-8 pr-3 rounded-md border bg-background/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div className="flex items-center rounded-md border bg-background/50 p-1">
            <Tooltip content="List view">
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  "p-1 rounded-sm transition-colors",
                  viewMode === 'list'
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </Tooltip>
            <Tooltip content="Grid view">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  "p-1 rounded-sm transition-colors",
                  viewMode === 'grid'
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-4">
        {Object.entries(schemasByCategory).map(([category, schemas]) => (
          <div key={category} className="space-y-2">
            <button
              onClick={() => toggleCategory(category)}
              className={cn(
                "flex items-center gap-2 w-full text-left p-2 rounded-md transition-all duration-200",
                "hover:shadow-sm",
                expandedCategories.has(category)
                  ? "bg-muted"
                  : "hover:bg-muted/50"
              )}
            >
              <ChevronRight className={cn(
                "w-4 h-4 transition-transform duration-200",
                expandedCategories.has(category) && "rotate-90"
              )} />
              <h3 className="text-sm font-medium capitalize">
                {category === 'other' ? 'Other' : category}
              </h3>
              <span className="px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground text-xs">
                {Object.keys(schemas).length}
              </span>
            </button>

            {expandedCategories.has(category) && (
              <div className={cn(
                "animate-in slide-in-from-top-2 duration-200",
                viewMode === 'grid'
                  ? "grid grid-cols-2 gap-4 ml-6"
                  : "space-y-2 ml-6"
              )}>
                {Object.entries(schemas).map(([name, schema]) => (
                  <Schema key={name} name={name} schema={schema} />
                ))}
              </div>
            )}
          </div>
        ))}

        {Object.keys(schemasByCategory).length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <Info className="w-6 h-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No schemas found</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              {searchTerm
                ? `No schemas match the search term "${searchTerm}"`
                : "This API doesn't have any schemas defined in its specification."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default APISchemas; 