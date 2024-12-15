import React from 'react';
import { cn } from '@/utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Shield,
  Users,
  MessageSquare,
  Settings,
  ChevronDown,
  X
} from 'lucide-react';
import { Tooltip } from '@/components/ui/Tooltip';

interface ValidationResult {
  type: 'error' | 'warning' | 'info';
  message: string;
  path?: string;
  line?: number;
  column?: number;
}

interface Gate {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  type: 'validation' | 'security' | 'custom';
}

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
  };
  message: string;
  timestamp: string;
  path?: string;
  line?: number;
}

interface RightSidebarManagerProps {
  className?: string;
}

interface TabProps {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  panel: React.ReactNode;
}

function ValidationPanel() {
  const validationResults: ValidationResult[] = [
    {
      type: 'error',
      message: 'Required property "description" is missing',
      path: '/paths/users/get',
      line: 42
    },
    {
      type: 'warning',
      message: 'Operation should have at least one response',
      path: '/paths/users/post',
      line: 67
    },
    {
      type: 'info',
      message: 'Consider adding authentication to this endpoint',
      path: '/paths/users/delete',
      line: 89
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none flex items-center justify-between p-2 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-200">Validation</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs text-red-400">2 errors</span>
          <span className="text-xs text-yellow-400">3 warnings</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {validationResults.map((result, index) => (
          <div
            key={index}
            className={cn(
              "px-3 py-2 border-b border-gray-800/50",
              "hover:bg-gray-800/30 cursor-pointer",
              "transition-colors duration-200"
            )}
          >
            <div className="flex items-start gap-2">
              {result.type === 'error' && (
                <AlertCircle className="w-4 h-4 mt-0.5 text-red-400 flex-none" />
              )}
              {result.type === 'warning' && (
                <AlertCircle className="w-4 h-4 mt-0.5 text-yellow-400 flex-none" />
              )}
              {result.type === 'info' && (
                <AlertCircle className="w-4 h-4 mt-0.5 text-blue-400 flex-none" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-300">{result.message}</p>
                {result.path && (
                  <p className="mt-1 text-xs text-gray-500">
                    at {result.path}
                    {result.line && `:${result.line}`}
                    {result.column && `:${result.column}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function GatesPanel() {
  const gates: Gate[] = [
    {
      id: '1',
      name: 'Schema Validation',
      description: 'Validate OpenAPI schema structure',
      enabled: true,
      type: 'validation'
    },
    {
      id: '2',
      name: 'Security Check',
      description: 'Ensure all endpoints are secured',
      enabled: true,
      type: 'security'
    },
    {
      id: '3',
      name: 'Custom Rules',
      description: 'Apply organization-specific rules',
      enabled: false,
      type: 'custom'
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none flex items-center justify-between p-2 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-200">Gates</h3>
        <button className={cn(
          "px-2 py-1 rounded text-xs",
          "text-gray-400 hover:text-gray-300",
          "hover:bg-gray-800",
          "transition-colors duration-200"
        )}>
          Add Gate
        </button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {gates.map((gate) => (
          <div
            key={gate.id}
            className={cn(
              "px-3 py-2 border-b border-gray-800/50",
              "hover:bg-gray-800/30",
              "transition-colors duration-200"
            )}
          >
            <div className="flex items-start gap-3">
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  checked={gate.enabled}
                  onChange={() => {}}
                  className="rounded border-gray-600 text-blue-500 focus:ring-blue-500"
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-medium text-gray-200">
                    {gate.name}
                  </h4>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-xs",
                    gate.type === 'validation' && "bg-blue-500/10 text-blue-400",
                    gate.type === 'security' && "bg-green-500/10 text-green-400",
                    gate.type === 'custom' && "bg-purple-500/10 text-purple-400"
                  )}>
                    {gate.type}
                  </span>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {gate.description}
                </p>
              </div>
              <button className={cn(
                "p-1 rounded",
                "text-gray-500 hover:text-gray-400",
                "hover:bg-gray-800",
                "transition-colors duration-200"
              )}>
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CollaborationPanel() {
  const comments: Comment[] = [
    {
      id: '1',
      user: {
        name: 'John Doe',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
      },
      message: 'We should add rate limiting to this endpoint',
      timestamp: '2 hours ago',
      path: '/paths/users/get',
      line: 42
    },
    {
      id: '2',
      user: {
        name: 'Jane Smith',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
      },
      message: 'Updated the response schema to include pagination',
      timestamp: '5 hours ago',
      path: '/components/schemas/UserResponse',
      line: 15
    }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none flex items-center justify-between p-2 border-b border-gray-800">
        <h3 className="text-sm font-medium text-gray-200">Comments</h3>
        <div className="flex items-center gap-2">
          <button className={cn(
            "p-1 rounded",
            "text-gray-400 hover:text-gray-300",
            "hover:bg-gray-800",
            "transition-colors duration-200"
          )}>
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className={cn(
            "p-1 rounded",
            "text-gray-400 hover:text-gray-300",
            "hover:bg-gray-800",
            "transition-colors duration-200"
          )}>
            <Users className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className={cn(
              "px-3 py-2 border-b border-gray-800/50",
              "hover:bg-gray-800/30",
              "transition-colors duration-200"
            )}
          >
            <div className="flex items-start gap-3">
              <img
                src={comment.user.avatar}
                alt={comment.user.name}
                className="w-8 h-8 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-200">
                    {comment.user.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {comment.timestamp}
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-300">
                  {comment.message}
                </p>
                {comment.path && (
                  <p className="mt-1 text-xs text-gray-500">
                    at {comment.path}
                    {comment.line && `:${comment.line}`}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RightSidebarManager({ className }: RightSidebarManagerProps) {
  const [activeTab, setActiveTab] = React.useState('validation');

  const tabs: TabProps[] = [
    {
      id: 'validation',
      label: 'Validation',
      icon: <CheckCircle2 className="w-4 h-4" />,
      badge: 5,
      panel: <ValidationPanel />
    },
    {
      id: 'gates',
      label: 'Gates',
      icon: <Shield className="w-4 h-4" />,
      panel: <GatesPanel />
    },
    {
      id: 'collaboration',
      label: 'Collaboration',
      icon: <Users className="w-4 h-4" />,
      badge: 2,
      panel: <CollaborationPanel />
    }
  ];

  return (
    <div className={cn("h-full flex flex-col bg-gray-900/50", className)}>
      {/* Tabs */}
      <div className="flex-none flex items-center border-b border-gray-800">
        {tabs.map((tab) => (
          <Tooltip key={tab.id} content={tab.label}>
            <button
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-2",
                "min-w-[120px] h-9 px-3",
                "text-sm",
                activeTab === tab.id
                  ? "text-gray-200 bg-gray-800"
                  : "text-gray-400 hover:text-gray-300 hover:bg-gray-800/50",
                "transition-colors duration-200"
              )}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs",
                  "bg-blue-500/20 text-blue-400"
                )}>
                  {tab.badge}
                </span>
              )}
            </button>
          </Tooltip>
        ))}
      </div>

      {/* Active Panel */}
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {tabs.map((tab) => (
            activeTab === tab.id && (
              <motion.div
                key={tab.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {tab.panel}
              </motion.div>
            )
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
} 