import React from 'react';
import { cn } from '@/utils/cn';
import { 
  ChevronDown, 
  Check, 
  AlertCircle, 
  Clock, 
  GitBranch, 
  Upload,
  Settings,
  History,
  Users,
  MoreVertical,
  ExternalLink,
  Save,
  Share
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tooltip } from '@/components/ui/Tooltip';

interface HeaderProps {
  project: {
    name: string;
    branch: string;
    lastSaved?: string;
    collaborators?: number;
    hasChanges?: boolean;
  };
  contract: {
    name: string;
    version: string;
    isValid: boolean;
    lastValidated?: string;
  };
  styleGuide: {
    name: string;
    rulesCount: number;
    enabled: boolean;
  };
  onPublish: () => void;
  onProjectChange: (project: string) => void;
  onContractChange: (contract: string) => void;
  onStyleGuideChange: (guide: string) => void;
  onSave?: () => void;
  onShare?: () => void;
  onSettings?: () => void;
  onHistory?: () => void;
}

interface HeaderDropdownProps {
  label: string;
  value: string;
  icon?: React.ReactNode;
  badge?: string | number;
  isValid?: boolean;
  options?: Array<{
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    shortcut?: string;
  }>;
  onChange?: (id: string) => void;
  shortcut?: string;
  hasChanges?: boolean;
}

function HeaderDropdown({ 
  label, 
  value, 
  icon, 
  badge, 
  isValid, 
  options = [],
  onChange,
  shortcut,
  hasChanges
}: HeaderDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  // Handle keyboard shortcuts
  React.useEffect(() => {
    if (!shortcut) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const keys = shortcut.toLowerCase().split('+');
      const isCmd = keys.includes('cmd') || keys.includes('⌘');
      const isShift = keys.includes('shift') || keys.includes('⇧');
      const isAlt = keys.includes('alt') || keys.includes('⌥');
      const key = keys.find(k => !['cmd', '⌘', 'shift', '⇧', 'alt', '⌥'].includes(k));

      if (
        ((isCmd && (e.metaKey || e.ctrlKey)) || !isCmd) &&
        ((isShift && e.shiftKey) || !isShift) &&
        ((isAlt && e.altKey) || !isAlt) &&
        (key && e.key.toLowerCase() === key)
      ) {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcut]);

  return (
    <div className="relative">
      <Tooltip 
        content={
          <div className="flex flex-col gap-1">
            <div className="font-medium">{label}</div>
            {shortcut && (
              <div className="text-xs text-gray-400">
                Press {shortcut} to open
              </div>
            )}
          </div>
        }
        side="bottom"
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-md",
            "bg-gray-800/50 hover:bg-gray-800",
            "border border-gray-700/50",
            "transition-all duration-200",
            "group relative"
          )}
        >
          {icon && (
            <span className="text-gray-400 group-hover:text-gray-300">
              {icon}
            </span>
          )}
          <div className="flex flex-col items-start">
            <span className="text-xs text-gray-500">{label}</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-200">{value}</span>
              {hasChanges && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
              )}
              {badge && (
                <span className={cn(
                  "px-1.5 py-0.5 rounded-full text-xs",
                  "bg-gray-700/50",
                  typeof badge === 'number' && badge > 0
                    ? "text-blue-400"
                    : "text-gray-400"
                )}>
                  {badge}
                </span>
              )}
              {isValid !== undefined && (
                isValid ? (
                  <Check className="w-4 h-4 text-green-400" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                )
              )}
            </div>
          </div>
          <ChevronDown 
            className={cn(
              "w-4 h-4 text-gray-400",
              "transition-transform duration-200",
              isOpen && "transform rotate-180"
            )} 
          />
        </button>
      </Tooltip>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "absolute top-full left-0 mt-1 z-50",
                "w-72 py-1",
                "bg-gray-800 border border-gray-700",
                "rounded-md shadow-lg"
              )}
            >
              {options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => {
                    onChange?.(option.id);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-2",
                    "flex items-center gap-3",
                    "text-sm text-gray-200",
                    "hover:bg-gray-700/50",
                    "transition-colors duration-200",
                    "group"
                  )}
                >
                  {option.icon && (
                    <span className="text-gray-400 group-hover:text-gray-300">
                      {option.icon}
                    </span>
                  )}
                  <div className="flex-1 text-left">
                    <div>{option.label}</div>
                    {option.description && (
                      <div className="text-xs text-gray-500">
                        {option.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {option.shortcut && (
                      <kbd className="px-1.5 py-0.5 text-xs bg-gray-900 rounded border border-gray-700">
                        {option.shortcut}
                      </kbd>
                    )}
                    {option.id === value && (
                      <Check className="w-4 h-4 text-blue-400" />
                    )}
                  </div>
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Header({
  project,
  contract,
  styleGuide,
  onPublish,
  onProjectChange,
  onContractChange,
  onStyleGuideChange,
  onSave,
  onShare,
  onSettings,
  onHistory
}: HeaderProps) {
  return (
    <header className={cn(
      "flex items-center justify-between",
      "px-4 py-2",
      "bg-gray-900/50 border-b border-gray-800",
      "backdrop-blur-sm"
    )}>
      <div className="flex items-center gap-3">
        <HeaderDropdown
          label="Project"
          value={project.name}
          icon={<GitBranch className="w-4 h-4" />}
          badge={project.branch}
          hasChanges={project.hasChanges}
          shortcut="⌘+P"
          options={[
            { 
              id: 'project-a',
              label: 'Project A',
              description: 'Main API project',
              icon: <GitBranch className="w-4 h-4" />
            },
            {
              id: 'project-b',
              label: 'Project B',
              description: 'Authentication API',
              icon: <GitBranch className="w-4 h-4" />
            }
          ]}
          onChange={onProjectChange}
        />
        <HeaderDropdown
          label="Contract"
          value={contract.name}
          badge={contract.version}
          isValid={contract.isValid}
          shortcut="⌘+O"
          options={[
            {
              id: 'contract-1',
              label: 'Main API v1',
              description: 'Last validated 2 hours ago',
              icon: <ExternalLink className="w-4 h-4" />
            },
            {
              id: 'contract-2',
              label: 'Auth API v2',
              description: 'Last validated 5 mins ago',
              icon: <ExternalLink className="w-4 h-4" />
            }
          ]}
          onChange={onContractChange}
        />
        <HeaderDropdown
          label="Style Guide"
          value={styleGuide.name}
          badge={styleGuide.rulesCount}
          shortcut="⌘+G"
          options={[
            {
              id: 'default',
              label: 'Default Guide',
              description: '15 active rules',
              icon: <Settings className="w-4 h-4" />
            },
            {
              id: 'custom-1',
              label: 'Custom Guide',
              description: '8 active rules',
              icon: <Settings className="w-4 h-4" />
            }
          ]}
          onChange={onStyleGuideChange}
        />
      </div>

      <div className="flex items-center gap-4">
        {project.collaborators && (
          <Tooltip content="Active collaborators">
            <button className="flex items-center gap-2 text-gray-400 hover:text-gray-300">
              <Users className="w-4 h-4" />
              <span className="text-sm">{project.collaborators}</span>
            </button>
          </Tooltip>
        )}

        {project.lastSaved && (
          <Tooltip content="Last saved time">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{project.lastSaved}</span>
            </div>
          </Tooltip>
        )}

        <div className="flex items-center gap-2">
          <Tooltip content="Save changes (⌘+S)">
            <button
              onClick={onSave}
              className={cn(
                "p-1.5 rounded-md",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-800",
                "transition-colors duration-200"
              )}
            >
              <Save className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Share">
            <button
              onClick={onShare}
              className={cn(
                "p-1.5 rounded-md",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-800",
                "transition-colors duration-200"
              )}
            >
              <Share className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="View history">
            <button
              onClick={onHistory}
              className={cn(
                "p-1.5 rounded-md",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-800",
                "transition-colors duration-200"
              )}
            >
              <History className="w-4 h-4" />
            </button>
          </Tooltip>

          <Tooltip content="Settings">
            <button
              onClick={onSettings}
              className={cn(
                "p-1.5 rounded-md",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-800",
                "transition-colors duration-200"
              )}
            >
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>

          <div className="w-px h-4 bg-gray-700 mx-2" />

          <Tooltip content="Publish changes">
            <button
              onClick={onPublish}
              className={cn(
                "px-4 py-1.5 rounded-md",
                "bg-blue-500 hover:bg-blue-600",
                "text-sm text-white font-medium",
                "transition-colors duration-200",
                "flex items-center gap-2"
              )}
            >
              <Upload className="w-4 h-4" />
              Publish
            </button>
          </Tooltip>
        </div>
      </div>
    </header>
  );
} 