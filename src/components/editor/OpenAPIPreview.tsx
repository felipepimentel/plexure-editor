import React from 'react';
import { parse } from 'yaml';
import { cn } from '@/lib/utils';

interface OpenAPIPreviewProps {
  content: string;
  className?: string;
}

interface OpenAPISpec {
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: Record<string, {
    [method: string]: {
      summary?: string;
      description?: string;
      parameters?: Array<{
        name: string;
        in: string;
        description?: string;
        required?: boolean;
        schema?: any;
      }>;
      responses?: Record<string, {
        description?: string;
        content?: Record<string, {
          schema?: any;
        }>;
      }>;
    };
  }>;
}

export const OpenAPIPreview = React.memo(({ content, className }: OpenAPIPreviewProps) => {
  const [spec, setSpec] = React.useState<OpenAPISpec | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const parsed = parse(content) as OpenAPISpec;
      setSpec(parsed);
      setError(null);
    } catch (err) {
      setSpec(null);
      setError('Failed to parse OpenAPI specification');
    }
  }, [content]);

  if (error) {
    return (
      <div className="p-4 text-red-500">
        {error}
      </div>
    );
  }

  if (!spec) {
    return (
      <div className="p-4 text-muted-foreground">
        Loading preview...
      </div>
    );
  }

  return (
    <div className={cn('h-full overflow-auto p-4 space-y-6', className)}>
      {/* API Info */}
      <section className="space-y-2">
        <h1 className="text-2xl font-bold">{spec.info.title}</h1>
        <div className="text-sm text-muted-foreground">Version: {spec.info.version}</div>
        {spec.info.description && (
          <p className="text-sm mt-2">{spec.info.description}</p>
        )}
      </section>

      {/* Endpoints */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Endpoints</h2>
        {Object.entries(spec.paths).map(([path, methods]) => (
          <div key={path} className="border rounded-lg p-4 space-y-4">
            <h3 className="text-lg font-medium">{path}</h3>
            {Object.entries(methods).map(([method, details]) => (
              <div key={method} className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'px-2 py-1 rounded-md text-xs font-medium uppercase',
                    method === 'get' && 'bg-blue-100 text-blue-700',
                    method === 'post' && 'bg-green-100 text-green-700',
                    method === 'put' && 'bg-yellow-100 text-yellow-700',
                    method === 'delete' && 'bg-red-100 text-red-700',
                    method === 'patch' && 'bg-purple-100 text-purple-700'
                  )}>
                    {method}
                  </span>
                  <span className="text-sm font-medium">{details.summary}</span>
                </div>

                {details.description && (
                  <p className="text-sm text-muted-foreground">{details.description}</p>
                )}

                {/* Parameters */}
                {details.parameters && details.parameters.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Parameters</h4>
                    <div className="space-y-1">
                      {details.parameters.map((param, index) => (
                        <div key={index} className="text-sm">
                          <span className="font-medium">{param.name}</span>
                          <span className="text-muted-foreground"> ({param.in})</span>
                          {param.required && <span className="text-red-500 ml-1">*</span>}
                          {param.description && (
                            <p className="text-muted-foreground text-xs mt-0.5">{param.description}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responses */}
                {details.responses && Object.keys(details.responses).length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-medium mb-2">Responses</h4>
                    <div className="space-y-1">
                      {Object.entries(details.responses).map(([code, response]) => (
                        <div key={code} className="text-sm">
                          <span className={cn(
                            'font-medium',
                            code.startsWith('2') && 'text-green-600',
                            code.startsWith('4') && 'text-yellow-600',
                            code.startsWith('5') && 'text-red-600'
                          )}>
                            {code}
                          </span>
                          {response.description && (
                            <span className="text-muted-foreground ml-2">{response.description}</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}); 