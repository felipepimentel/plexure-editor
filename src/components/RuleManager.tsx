import React from 'react';
import { cn } from '../lib/utils';
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  Plus,
  Settings,
  Edit,
  Trash,
  Copy,
  Download,
  Upload,
  Code,
  FileJson,
  Eye,
  EyeOff,
  ChevronRight,
  ChevronDown,
  Search,
  Filter,
  Save
} from 'lucide-react';
import { Tooltip } from './ui/TooltipComponent';
import { CustomRule, RuleGroup, RuleEngine } from '../lib/custom-rules';

interface RuleManagerProps {
  ruleEngine: RuleEngine;
  onRulesChange: () => void;
  className?: string;
}

export const RuleManager: React.FC<RuleManagerProps> = ({
  ruleEngine,
  onRulesChange,
  className
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);
  const [selectedRule, setSelectedRule] = React.useState<CustomRule | null>(null);
  const [isEditing, setIsEditing] = React.useState(false);
  const [expandedGroups, setExpandedGroups] = React.useState<Set<string>>(new Set());

  const handleImportRules = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          ruleEngine.importRules(content);
          onRulesChange();
        } catch (error) {
          console.error('Failed to import rules:', error);
          // TODO: Show error notification
        }
      };
      reader.readAsText(file);
    }
  };

  const handleExportRules = () => {
    const content = ruleEngine.exportRules();
    const blob = new Blob([content], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'openapi-rules.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCreateRule = () => {
    setSelectedRule({
      id: '',
      name: '',
      description: '',
      category: 'custom',
      severity: 'warning',
      enabled: true,
      validate: () => [],
      examples: {
        valid: [],
        invalid: []
      }
    });
    setIsEditing(true);
  };

  const handleEditRule = (rule: CustomRule) => {
    setSelectedRule(rule);
    setIsEditing(true);
  };

  const handleSaveRule = (rule: CustomRule) => {
    if (rule.id) {
      ruleEngine.addRule(rule);
      onRulesChange();
      setIsEditing(false);
      setSelectedRule(null);
    }
  };

  const handleDeleteRule = (ruleId: string) => {
    ruleEngine.removeRule(ruleId);
    onRulesChange();
    if (selectedRule?.id === ruleId) {
      setSelectedRule(null);
      setIsEditing(false);
    }
  };

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  return (
    <div className={cn('flex h-full', className)}>
      {/* Rules list */}
      <div className="w-80 border-r flex flex-col">
        {/* Search and filters */}
        <div className="p-4 border-b space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search rules..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-md border bg-transparent"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={selectedCategory || ''}
              onChange={(e) => setSelectedCategory(e.target.value || null)}
              className="flex-1 bg-transparent text-sm"
            >
              <option value="">All categories</option>
              <option value="security">Security</option>
              <option value="naming">Naming</option>
              <option value="structure">Structure</option>
              <option value="documentation">Documentation</option>
              <option value="governance">Governance</option>
              <option value="custom">Custom</option>
            </select>
          </div>
        </div>

        {/* Rules list */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {Array.from(ruleEngine.groups.values()).map(group => (
            <div key={group.id} className="space-y-1">
              <button
                onClick={() => toggleGroup(group.id)}
                className="flex items-center gap-2 w-full p-2 hover:bg-muted rounded-md"
              >
                {expandedGroups.has(group.id) ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
                <span className="text-sm font-medium">{group.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">
                  {group.rules.length}
                </span>
              </button>
              {expandedGroups.has(group.id) && (
                <div className="pl-6 space-y-1">
                  {group.rules.map(rule => (
                    <button
                      key={rule.id}
                      onClick={() => setSelectedRule(rule)}
                      className={cn(
                        'flex items-center gap-2 w-full p-2 text-sm rounded-md',
                        selectedRule?.id === rule.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted'
                      )}
                    >
                      {rule.severity === 'error' && <AlertCircle className="h-4 w-4 text-destructive" />}
                      {rule.severity === 'warning' && <AlertTriangle className="h-4 w-4 text-warning" />}
                      {rule.severity === 'info' && <Info className="h-4 w-4 text-info" />}
                      <span className="flex-1 truncate">{rule.name}</span>
                      {!rule.enabled && (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-4 border-t space-x-2">
          <Tooltip content="Create Rule">
            <button
              onClick={handleCreateRule}
              className="p-2 hover:bg-muted rounded-md"
            >
              <Plus className="h-4 w-4" />
            </button>
          </Tooltip>
          <Tooltip content="Import Rules">
            <label className="p-2 hover:bg-muted rounded-md cursor-pointer">
              <Upload className="h-4 w-4" />
              <input
                type="file"
                accept=".json"
                onChange={handleImportRules}
                className="hidden"
              />
            </label>
          </Tooltip>
          <Tooltip content="Export Rules">
            <button
              onClick={handleExportRules}
              className="p-2 hover:bg-muted rounded-md"
            >
              <Download className="h-4 w-4" />
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Rule editor */}
      {selectedRule && (
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">
                {isEditing ? (
                  selectedRule.id ? 'Edit Rule' : 'Create Rule'
                ) : (
                  'Rule Details'
                )}
              </h2>
              <div className="space-x-2">
                {!isEditing && (
                  <>
                    <Tooltip content="Edit">
                      <button
                        onClick={() => handleEditRule(selectedRule)}
                        className="p-2 hover:bg-muted rounded-md"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Duplicate">
                      <button
                        onClick={() => {
                          const newRule = {
                            ...selectedRule,
                            id: `${selectedRule.id}-copy`,
                            name: `${selectedRule.name} (Copy)`
                          };
                          handleEditRule(newRule);
                        }}
                        className="p-2 hover:bg-muted rounded-md"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </Tooltip>
                    <Tooltip content="Delete">
                      <button
                        onClick={() => handleDeleteRule(selectedRule.id)}
                        className="p-2 hover:bg-muted rounded-md text-destructive"
                      >
                        <Trash className="h-4 w-4" />
                      </button>
                    </Tooltip>
                  </>
                )}
                {isEditing && (
                  <>
                    <button
                      onClick={() => handleSaveRule(selectedRule)}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setSelectedRule(null);
                      }}
                      className="px-4 py-2 hover:bg-muted rounded-md text-sm"
                    >
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>

            {isEditing ? (
              <form className="space-y-6">
                <div className="space-y-4">
                  <label className="block">
                    <span className="text-sm font-medium">ID</span>
                    <input
                      type="text"
                      value={selectedRule.id}
                      onChange={(e) => setSelectedRule({
                        ...selectedRule,
                        id: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2"
                      placeholder="unique-rule-id"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Name</span>
                    <input
                      type="text"
                      value={selectedRule.name}
                      onChange={(e) => setSelectedRule({
                        ...selectedRule,
                        name: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2"
                      placeholder="Rule name"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium">Description</span>
                    <textarea
                      value={selectedRule.description}
                      onChange={(e) => setSelectedRule({
                        ...selectedRule,
                        description: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2"
                      rows={3}
                      placeholder="Rule description"
                    />
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="block">
                      <span className="text-sm font-medium">Category</span>
                      <select
                        value={selectedRule.category}
                        onChange={(e) => setSelectedRule({
                          ...selectedRule,
                          category: e.target.value as CustomRule['category']
                        })}
                        className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2"
                      >
                        <option value="security">Security</option>
                        <option value="naming">Naming</option>
                        <option value="structure">Structure</option>
                        <option value="documentation">Documentation</option>
                        <option value="governance">Governance</option>
                        <option value="custom">Custom</option>
                      </select>
                    </label>
                    <label className="block">
                      <span className="text-sm font-medium">Severity</span>
                      <select
                        value={selectedRule.severity}
                        onChange={(e) => setSelectedRule({
                          ...selectedRule,
                          severity: e.target.value as CustomRule['severity']
                        })}
                        className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2"
                      >
                        <option value="error">Error</option>
                        <option value="warning">Warning</option>
                        <option value="info">Info</option>
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="text-sm font-medium">AI Prompt</span>
                    <textarea
                      value={selectedRule.aiPrompt || ''}
                      onChange={(e) => setSelectedRule({
                        ...selectedRule,
                        aiPrompt: e.target.value
                      })}
                      className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2"
                      rows={3}
                      placeholder="Guidance for the LLM when generating/modifying specs"
                    />
                  </label>
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Examples</span>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <span className="text-xs text-muted-foreground">Valid</span>
                        <textarea
                          value={selectedRule.examples?.valid.join('\n') || ''}
                          onChange={(e) => setSelectedRule({
                            ...selectedRule,
                            examples: {
                              ...selectedRule.examples,
                              valid: e.target.value.split('\n').filter(Boolean)
                            }
                          })}
                          className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2"
                          rows={3}
                          placeholder="One example per line"
                        />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Invalid</span>
                        <textarea
                          value={selectedRule.examples?.invalid.join('\n') || ''}
                          onChange={(e) => setSelectedRule({
                            ...selectedRule,
                            examples: {
                              ...selectedRule.examples,
                              invalid: e.target.value.split('\n').filter(Boolean)
                            }
                          })}
                          className="mt-1 block w-full rounded-md border bg-transparent px-3 py-2"
                          rows={3}
                          placeholder="One example per line"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <span className="text-sm text-muted-foreground">ID</span>
                    <p className="mt-1 font-mono text-sm">{selectedRule.id}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Description</span>
                    <p className="mt-1">{selectedRule.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Category</span>
                      <p className="mt-1 capitalize">{selectedRule.category}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Severity</span>
                      <p className="mt-1 capitalize">{selectedRule.severity}</p>
                    </div>
                  </div>
                  {selectedRule.aiPrompt && (
                    <div>
                      <span className="text-sm text-muted-foreground">AI Prompt</span>
                      <p className="mt-1">{selectedRule.aiPrompt}</p>
                    </div>
                  )}
                  {selectedRule.examples && (
                    <div className="space-y-2">
                      <span className="text-sm text-muted-foreground">Examples</span>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="text-xs text-success">Valid</span>
                          <div className="mt-1 space-y-1">
                            {selectedRule.examples.valid.map((example, index) => (
                              <div
                                key={index}
                                className="p-2 rounded-md bg-muted font-mono text-sm"
                              >
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-destructive">Invalid</span>
                          <div className="mt-1 space-y-1">
                            {selectedRule.examples.invalid.map((example, index) => (
                              <div
                                key={index}
                                className="p-2 rounded-md bg-muted font-mono text-sm"
                              >
                                {example}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}; 