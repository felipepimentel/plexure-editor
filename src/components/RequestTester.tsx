import React from 'react';
import { Play, Copy, ChevronDown, ChevronRight, AlertCircle, Save } from 'lucide-react';
import { cn } from '../lib/utils';
import { SchemaViewer } from './SchemaViewer';
import { ServerSelector } from './ServerSelector';
import { RequestHistory } from './RequestHistory';
import { RequestCollection } from './RequestCollection';
import type { Environment } from '../lib/environment-manager';

interface RequestTesterProps {
  method: string;
  path: string;
  operation: any;
  environment?: Environment | null;
  className?: string;
}

interface Response {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  data: any;
  duration: number;
}

interface RequestError {
  type: 'network' | 'parse' | 'validation';
  message: string;
  details?: string;
}

interface SaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collectionId: string, request: any) => void;
  request: {
    method: string;
    path: string;
    url: string;
    headers: Record<string, string>;
    body?: string;
  };
}

export const RequestTester: React.FC<RequestTesterProps> = ({
  method,
  path,
  operation,
  environment,
  className,
}) => {
  const [selectedServer, setSelectedServer] = React.useState('');
  const [headers, setHeaders] = React.useState<Array<{ key: string; value: string; enabled: boolean }>>([]);
  const [queryParams, setQueryParams] = React.useState<Array<{ key: string; value: string; enabled: boolean }>>([]);
  const [requestBody, setRequestBody] = React.useState('');
  const [response, setResponse] = React.useState<Response | null>(null);
  const [error, setError] = React.useState<RequestError | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showSaveModal, setShowSaveModal] = React.useState(false);

  // Initialize headers and query params from operation parameters
  React.useEffect(() => {
    if (operation.parameters) {
      const headerParams = operation.parameters
        .filter((param: any) => param.in === 'header')
        .map((param: any) => ({
          key: param.name,
          value: '',
          enabled: param.required || false,
        }));

      const queryParameters = operation.parameters
        .filter((param: any) => param.in === 'query')
        .map((param: any) => ({
          key: param.name,
          value: '',
          enabled: param.required || false,
        }));

      setHeaders(headerParams);
      setQueryParams(queryParameters);
    }
  }, [operation]);

  // Initialize request body from operation requestBody
  React.useEffect(() => {
    if (operation.requestBody?.content?.['application/json']?.example) {
      setRequestBody(JSON.stringify(
        operation.requestBody.content['application/json'].example,
        null,
        2
      ));
    }
  }, [operation]);

  const handleHeaderChange = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setHeaders(prev => prev.map((header, i) => 
      i === index ? { ...header, [field]: value } : header
    ));
  };

  const handleQueryParamChange = (index: number, field: 'key' | 'value' | 'enabled', value: string | boolean) => {
    setQueryParams(prev => prev.map((param, i) => 
      i === index ? { ...param, [field]: value } : param
    ));
  };

  const buildUrl = () => {
    let url = selectedServer;
    
    // Replace path parameters with values from environment
    if (environment) {
      url = environment.resolveUrl(url);
      path = environment.resolveUrl(path);
    }

    // Add path
    url += path;

    // Add query parameters
    const enabledParams = queryParams
      .filter(param => param.enabled && param.key && param.value)
      .map(param => {
        let value = param.value;
        if (environment) {
          value = environment.resolveUrl(value);
        }
        return `${encodeURIComponent(param.key)}=${encodeURIComponent(value)}`;
      });

    if (enabledParams.length > 0) {
      url += `?${enabledParams.join('&')}`;
    }

    return url;
  };

  const buildHeaders = () => {
    const headerObj: Record<string, string> = {};
    
    headers
      .filter(header => header.enabled && header.key && header.value)
      .forEach(header => {
        let value = header.value;
        if (environment) {
          value = environment.resolveHeaders({ [header.key]: value })[header.key];
        }
        headerObj[header.key] = value;
      });

    return headerObj;
  };

  const handleSend = async () => {
    setIsLoading(true);
    setResponse(null);
    setError(null);

    try {
      const url = buildUrl();
      const headerObj = buildHeaders();
      let body = requestBody;

      if (environment && body) {
        body = environment.resolveBody(body);
      }

      const startTime = performance.now();

      const response = await fetch(url, {
        method: method.toUpperCase(),
        headers: {
          ...headerObj,
          'Content-Type': 'application/json',
        },
        body: ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) ? body : undefined,
      });

      const endTime = performance.now();
      const duration = endTime - startTime;

      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      let data;
      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      setResponse({
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        data,
        duration,
      });
    } catch (err) {
      setError({
        type: 'network',
        message: 'Network request failed',
        details: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyResponse = () => {
    if (response) {
      navigator.clipboard.writeText(JSON.stringify(response.data, null, 2));
    }
  };

  const handleSaveRequest = () => {
    setShowSaveModal(true);
  };

  return (
    <div className={cn('space-y-4', className)}>
      {/* Server Selection */}
      <div>
        <label className="text-sm font-medium">Server</label>
        <ServerSelector
          servers={environment?.servers || []}
          value={selectedServer}
          onChange={setSelectedServer}
        />
      </div>

      {/* Headers */}
      <div>
        <h4 className="text-sm font-medium mb-2">Headers</h4>
        <div className="space-y-2">
          {headers.map((header, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={header.enabled}
                onChange={e => handleHeaderChange(index, 'enabled', e.target.checked)}
                className="rounded border-input"
              />
              <input
                type="text"
                value={header.key}
                onChange={e => handleHeaderChange(index, 'key', e.target.value)}
                className="flex-1 px-3 py-1 rounded-md bg-background border text-sm"
                placeholder="Header name"
              />
              <input
                type="text"
                value={header.value}
                onChange={e => handleHeaderChange(index, 'value', e.target.value)}
                className="flex-1 px-3 py-1 rounded-md bg-background border text-sm"
                placeholder="Value"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Query Parameters */}
      <div>
        <h4 className="text-sm font-medium mb-2">Query Parameters</h4>
        <div className="space-y-2">
          {queryParams.map((param, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={param.enabled}
                onChange={e => handleQueryParamChange(index, 'enabled', e.target.checked)}
                className="rounded border-input"
              />
              <input
                type="text"
                value={param.key}
                onChange={e => handleQueryParamChange(index, 'key', e.target.value)}
                className="flex-1 px-3 py-1 rounded-md bg-background border text-sm"
                placeholder="Parameter name"
              />
              <input
                type="text"
                value={param.value}
                onChange={e => handleQueryParamChange(index, 'value', e.target.value)}
                className="flex-1 px-3 py-1 rounded-md bg-background border text-sm"
                placeholder="Value"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Request Body */}
      {['POST', 'PUT', 'PATCH'].includes(method.toUpperCase()) && operation.requestBody && (
        <div>
          <h4 className="text-sm font-medium mb-2">Request Body</h4>
          {operation.requestBody.content?.['application/json']?.schema && (
            <div className="mb-2 p-2 rounded-md bg-muted">
              <SchemaViewer schema={operation.requestBody.content['application/json'].schema} />
            </div>
          )}
          <textarea
            value={requestBody}
            onChange={e => setRequestBody(e.target.value)}
            className="w-full h-40 px-3 py-2 rounded-md bg-background border text-sm font-mono"
            placeholder="Enter request body"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={handleSend}
          disabled={isLoading}
          className={cn(
            'px-4 py-2 rounded-md text-sm font-medium',
            'bg-primary text-primary-foreground hover:bg-primary/90',
            'flex items-center gap-2',
            isLoading && 'opacity-50 cursor-not-allowed'
          )}
        >
          <Play className="w-4 h-4" />
          Send
        </button>
        <button
          onClick={handleSaveRequest}
          className="px-4 py-2 rounded-md text-sm font-medium hover:bg-accent"
        >
          <Save className="w-4 h-4" />
        </button>
      </div>

      {/* Response */}
      {(response || error) && (
        <div className="space-y-2">
          {error ? (
            <div className="p-4 rounded-md bg-destructive/10 text-destructive">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <p className="font-medium">{error.message}</p>
              </div>
              {error.details && (
                <pre className="mt-2 text-sm">{error.details}</pre>
              )}
            </div>
          ) : response && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn(
                    'text-sm font-medium',
                    response.status >= 200 && response.status < 300
                      ? 'text-green-500'
                      : response.status >= 400
                      ? 'text-red-500'
                      : 'text-yellow-500'
                  )}>
                    {response.status} {response.statusText}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(response.duration)}ms
                  </span>
                </div>
                <button
                  onClick={handleCopyResponse}
                  className="p-1 rounded hover:bg-accent"
                  title="Copy response"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2">
                <div>
                  <h5 className="text-sm font-medium mb-1">Response Headers</h5>
                  <div className="p-2 rounded-md bg-muted font-mono text-sm">
                    {Object.entries(response.headers).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-muted-foreground">{key}:</span>{' '}
                        {value}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-medium mb-1">Response Body</h5>
                  <pre className="p-2 rounded-md bg-muted font-mono text-sm overflow-auto max-h-80">
                    {typeof response.data === 'string'
                      ? response.data
                      : JSON.stringify(response.data, null, 2)
                    }
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RequestTester; 