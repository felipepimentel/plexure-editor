import React from 'react';
import { ChevronRight, ChevronDown, Type, List, Hash, Calendar, Key } from 'lucide-react';
import { cn } from '../lib/utils';

interface SchemaViewerProps {
  schema: any;
  name?: string;
  required?: boolean;
  isNested?: boolean;
  className?: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  string: <Type className="w-4 h-4" />,
  array: <List className="w-4 h-4" />,
  number: <Hash className="w-4 h-4" />,
  integer: <Hash className="w-4 h-4" />,
  boolean: <Key className="w-4 h-4" />,
  date: <Calendar className="w-4 h-4" />,
};

export const SchemaViewer: React.FC<SchemaViewerProps> = ({
  schema,
  name,
  required,
  isNested = false,
  className,
}) => {
  const [isExpanded, setIsExpanded] = React.useState(!isNested);

  if (!schema) return null;

  const hasProperties = schema.type === 'object' && schema.properties;
  const isArray = schema.type === 'array';
  const hasItems = isArray && schema.items;
  const isExpandable = hasProperties || hasItems;

  const renderType = () => {
    if (isArray) {
      return (
        <span className="text-blue-500 dark:text-blue-400">
          array{schema.items?.type ? `<${schema.items.type}>` : ''}
        </span>
      );
    }
    return <span className="text-blue-500 dark:text-blue-400">{schema.type}</span>;
  };

  const renderProperties = () => {
    if (!isExpanded) return null;

    if (hasProperties) {
      return Object.entries(schema.properties).map(([propName, propSchema]: [string, any]) => (
        <div key={propName} className="ml-4 mt-1">
          <SchemaViewer
            schema={propSchema}
            name={propName}
            required={schema.required?.includes(propName)}
            isNested
          />
        </div>
      ));
    }

    if (hasItems) {
      return (
        <div className="ml-4 mt-1">
          <SchemaViewer schema={schema.items} isNested />
        </div>
      );
    }

    return null;
  };

  return (
    <div className={cn('font-mono text-sm', className)}>
      <div className="flex items-center gap-1">
        {isExpandable ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-0.5 rounded hover:bg-accent"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <span className="w-5" />
        )}
        {typeIcons[schema.type] && (
          <span className="text-muted-foreground">{typeIcons[schema.type]}</span>
        )}
        {name && (
          <>
            <span className="text-foreground">{name}</span>
            <span className="text-muted-foreground">:</span>
          </>
        )}
        <span className="flex items-center gap-2">
          {renderType()}
          {required && <span className="text-red-500 text-xs">*required</span>}
          {schema.format && (
            <span className="text-muted-foreground text-xs">({schema.format})</span>
          )}
        </span>
      </div>
      {schema.description && (
        <div className="ml-5 text-xs text-muted-foreground">{schema.description}</div>
      )}
      {schema.enum && (
        <div className="ml-5 text-xs">
          <span className="text-muted-foreground">enum: </span>
          <span className="text-green-500 dark:text-green-400">
            {schema.enum.map((value: any) => `"${value}"`).join(' | ')}
          </span>
        </div>
      )}
      {renderProperties()}
    </div>
  );
};

export default SchemaViewer; 