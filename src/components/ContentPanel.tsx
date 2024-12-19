import React from 'react';
import { ChatPanel } from './ChatPanel';
import { RequestHistory } from './RequestHistory';
import { EnvironmentManager } from './EnvironmentManager';
import { cn } from '../lib/utils';
import {
  Layers,
  FileJson,
  Globe,
  Lock,
  Code2,
  Zap,
  X,
} from 'lucide-react';
import type { Environment } from '../lib/environment-manager';

interface ContentPanelProps {
  activeTab: string;
  messages: Array<{
    id: string;
    content: string;
    role: 'user' | 'assistant';
    timestamp: Date;
  }>;
  onSendMessage: (content: string) => void;
  environments: Environment[];
  activeEnvironment: Environment | null;
  onEnvironmentChange: (env: Environment) => void;
  onEnvironmentAdd: (env: Environment) => void;
  onEnvironmentEdit: (env: Environment) => void;
  onEnvironmentDelete: (env: Environment) => void;
  className?: string;
  onClose?: () => void;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({
  activeTab,
  messages,
  onSendMessage,
  environments,
  activeEnvironment,
  onEnvironmentChange,
  onEnvironmentAdd,
  onEnvironmentEdit,
  onEnvironmentDelete,
  className,
  onClose,
}) => {
  const getTabInfo = () => {
    switch (activeTab) {
      case 'chat':
        return {
          title: 'Chat Assistant',
          icon: <Layers className="w-4 h-4" />,
          description: 'Get help with your API specification',
        };
      case 'history':
        return {
          title: 'History',
          icon: <FileJson className="w-4 h-4" />,
          description: 'View your recent changes',
        };
      case 'environments':
        return {
          title: 'Environments',
          icon: <Globe className="w-4 h-4" />,
          description: 'Manage your environments',
        };
      case 'endpoints':
        return {
          title: 'API Endpoints',
          icon: <Zap className="w-4 h-4" />,
          description: 'Browse and manage API endpoints',
        };
      case 'schemas':
        return {
          title: 'API Schemas',
          icon: <Code2 className="w-4 h-4" />,
          description: 'View and edit data schemas',
        };
      case 'security':
        return {
          title: 'API Security',
          icon: <Lock className="w-4 h-4" />,
          description: 'Configure API security settings',
        };
      default:
        return {
          title: 'Unknown',
          icon: null,
          description: '',
        };
    }
  };

  const { title, icon, description } = getTabInfo();

  return (
    <div className={cn('flex flex-col h-full bg-background', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/30">
        <div>
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="font-semibold">{title}</h2>
            {onClose && (
              <button
                onClick={onClose}
                className="p-1 rounded-md hover:bg-accent ml-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'chat' && (
          <ChatPanel
            messages={messages}
            onSendMessage={onSendMessage}
          />
        )}
        {activeTab === 'history' && (
          <RequestHistory />
        )}
        {activeTab === 'environments' && (
          <EnvironmentManager
            environments={environments}
            activeEnvironment={activeEnvironment}
            onEnvironmentChange={onEnvironmentChange}
            onEnvironmentAdd={onEnvironmentAdd}
            onEnvironmentEdit={onEnvironmentEdit}
            onEnvironmentDelete={onEnvironmentDelete}
          />
        )}
        {activeTab === 'endpoints' && (
          <div className="p-4">
            <p className="text-muted-foreground">Endpoints content coming soon...</p>
          </div>
        )}
        {activeTab === 'schemas' && (
          <div className="p-4">
            <p className="text-muted-foreground">Schemas content coming soon...</p>
          </div>
        )}
        {activeTab === 'security' && (
          <div className="p-4">
            <p className="text-muted-foreground">Security content coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentPanel; 