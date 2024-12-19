import React from 'react';
import { cn } from '../lib/utils';
import type { ServerConfig } from '../lib/environment-manager';

interface ServerSelectorProps {
  servers: ServerConfig[];
  value: string;
  onChange: (url: string) => void;
  className?: string;
}

export const ServerSelector: React.FC<ServerSelectorProps> = ({
  servers,
  value,
  onChange,
  className,
}) => {
  return (
    <div className={cn('space-y-2', className)}>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className={cn(
          'w-full px-3 py-1 rounded-md bg-background border text-sm',
          'focus:outline-none focus:ring-2 focus:ring-primary',
          !value && 'text-muted-foreground'
        )}
      >
        <option value="" disabled>
          Select a server
        </option>
        {servers.map((server, index) => (
          <option key={index} value={server.url}>
            {server.description ? `${server.description} (${server.url})` : server.url}
          </option>
        ))}
      </select>

      {value && (
        <p className="text-xs text-muted-foreground">
          Selected server: <code className="px-1 py-0.5 rounded bg-muted">{value}</code>
        </p>
      )}
    </div>
  );
};

export default ServerSelector; 