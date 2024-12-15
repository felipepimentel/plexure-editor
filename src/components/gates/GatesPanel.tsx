import React, { useState } from 'react';
import { 
  Shield, 
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle,
  Trash,
  RefreshCw,
  Settings,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/utils/cn';

// Add new gate types
const GATE_TYPES = {
  VALIDATION: {
    id: 'validation',
    label: 'Validation',
    description: 'Automated checks for API contract quality',
    icon: Shield
  },
  APPROVAL: {
    id: 'approval',
    label: 'Approval',
    description: 'Requires manual approval from team members',
    icon: CheckCircle
  },
  SECURITY: {
    id: 'security',
    label: 'Security',
    description: 'Security and compliance checks',
    icon: Shield
  },
  CUSTOM: {
    id: 'custom',
    label: 'Custom',
    description: 'Custom validation logic',
    icon: Settings
  }
} as const;

// Add gate templates
const GATE_TEMPLATES = [
  {
    id: 'security-check',
    name: 'Security Check',
    description: 'Verify security requirements and best practices',
    type: 'security',
    checks: [
      'Authentication methods',
      'CORS configuration',
      'Rate limiting',
      'Input validation'
    ]
  },
  {
    id: 'schema-validation',
    name: 'Schema Validation',
    description: 'Validate OpenAPI schema correctness',
    type: 'validation',
    checks: [
      'Schema syntax',
      'Required fields',
      'Data types',
      'References'
    ]
  },
  {
    id: 'tech-lead-approval',
    name: 'Tech Lead Approval',
    description: 'Requires approval from technical lead',
    type: 'approval',
    approvers: ['tech-lead']
  },
  {
    id: 'style-guide',
    name: 'Style Guide Check',
    description: 'Verify compliance with API style guide',
    type: 'validation',
    checks: [
      'Naming conventions',
      'Response formats',
      'Error handling',
      'Documentation'
    ]
  }
];

// Enhance Gate interface
interface GateCheck {
  id: string;
  name: string;
  status: 'pending' | 'passed' | 'failed';
  message?: string;
}

interface GateApprover {
  id: string;
  name: string;
  role: string;
  status: 'pending' | 'approved' | 'rejected';
  comment?: string;
  timestamp?: string;
}

interface EnhancedGate extends Gate {
  checks?: GateCheck[];
  approvers?: GateApprover[];
  dependencies?: string[];
  order?: number;
  isBlocking?: boolean;
  autoValidate?: boolean;
  validationInterval?: number;
  lastValidated?: string;
  history?: {
    timestamp: string;
    status: Gate['status'];
    message?: string;
    user?: string;
  }[];
}

interface Gate {
  id: string;
  name: string;
  description: string;
  type: 'validation' | 'approval' | 'custom';
  status: 'pending' | 'passed' | 'failed';
  validate: () => Promise<boolean>;
}

interface GatesPanelProps {
  gates: Gate[];
  onAddGate: (gate: Gate) => void;
  onRemoveGate: (gateId: string) => void;
  onUpdateGate: (gateId: string, updates: Partial<Gate>) => void;
  onValidateGate: (gateId: string) => Promise<void>;
}

export function GatesPanel({
  gates,
  onAddGate,
  onRemoveGate,
  onUpdateGate,
  onValidateGate
}: GatesPanelProps) {
  const [isAddingGate, setIsAddingGate] = useState(false);
  const [newGate, setNewGate] = useState<Partial<Gate>>({
    name: '',
    description: '',
    type: 'validation'
  });
  const [expandedGates, setExpandedGates] = useState<Set<string>>(new Set());

  // Add new state for advanced features
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState<string | null>(null);
  const [isReordering, setIsReordering] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  // Add gate dependency graph
  const dependencyGraph = React.useMemo(() => {
    const graph: Record<string, string[]> = {};
    gates.forEach(gate => {
      const enhancedGate = gate as EnhancedGate;
      if (enhancedGate.dependencies) {
        graph[gate.id] = enhancedGate.dependencies;
      }
    });
    return graph;
  }, [gates]);

  // Check if a gate can be validated based on dependencies
  const canValidateGate = (gateId: string) => {
    const dependencies = dependencyGraph[gateId] || [];
    return dependencies.every(depId => {
      const depGate = gates.find(g => g.id === depId);
      return depGate?.status === 'passed';
    });
  };

  // Handle template selection
  const handleTemplateSelect = (templateId: string) => {
    const template = GATE_TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    setSelectedTemplate(templateId);
    setNewGate({
      name: template.name,
      description: template.description,
      type: template.type as Gate['type']
    });
  };

  // Enhanced gate submission with template data
  const handleSubmitNewGate = () => {
    if (!newGate.name || !newGate.type) return;

    const template = selectedTemplate 
      ? GATE_TEMPLATES.find(t => t.id === selectedTemplate)
      : null;

    const enhancedGate: EnhancedGate = {
      id: crypto.randomUUID(),
      name: newGate.name,
      description: newGate.description || '',
      type: newGate.type as Gate['type'],
      status: 'pending',
      validate: async () => true,
      order: gates.length,
      isBlocking: true,
      autoValidate: newGate.type === 'validation',
      checks: template?.checks?.map(check => ({
        id: crypto.randomUUID(),
        name: check,
        status: 'pending'
      })),
      approvers: template?.approvers?.map(role => ({
        id: crypto.randomUUID(),
        name: 'Pending',
        role,
        status: 'pending'
      })),
      history: []
    };

    onAddGate(enhancedGate);
    setNewGate({ name: '', description: '', type: 'validation' });
    setSelectedTemplate(null);
    setIsAddingGate(false);
  };

  const toggleGateExpanded = (gateId: string) => {
    const newExpanded = new Set(expandedGates);
    if (newExpanded.has(gateId)) {
      newExpanded.delete(gateId);
    } else {
      newExpanded.add(gateId);
    }
    setExpandedGates(newExpanded);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-medium text-gray-200">Custom Gates</h3>
            <p className="text-xs text-gray-400 mt-1">
              {gates.length} gate{gates.length === 1 ? '' : 's'} configured
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReordering(prev => !prev)}
              className={cn(
                "px-2.5 py-1.5 rounded-md text-sm",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-800",
                "transition-colors duration-200",
                isReordering && "bg-gray-800"
              )}
            >
              Reorder
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className={cn(
                "px-2.5 py-1.5 rounded-md text-sm",
                "bg-blue-500 text-white",
                "hover:bg-blue-600",
                "transition-colors duration-200",
                "flex items-center gap-1.5"
              )}
            >
              <Plus className="w-4 h-4" />
              Add Gate
            </button>
          </div>
        </div>
      </div>

      {/* Gates List */}
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {/* Templates Dialog */}
        {showTemplates && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="w-full max-w-lg bg-gray-900 rounded-lg shadow-xl">
              <div className="p-4 border-b border-gray-800">
                <h3 className="text-lg font-medium text-gray-200">Add Gate</h3>
                <p className="text-sm text-gray-400 mt-1">
                  Choose a template or create a custom gate
                </p>
              </div>
              <div className="p-4 space-y-4">
                {/* Template Categories */}
                <div className="grid grid-cols-2 gap-4">
                  {Object.values(GATE_TYPES).map(type => (
                    <button
                      key={type.id}
                      onClick={() => {
                        setNewGate(prev => ({ ...prev, type: type.id }));
                        setIsAddingGate(true);
                        setShowTemplates(false);
                      }}
                      className={cn(
                        "p-4 rounded-lg",
                        "border border-gray-800",
                        "hover:bg-gray-800/50",
                        "transition-colors duration-200",
                        "text-left"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <type.icon className="w-5 h-5 text-gray-400" />
                        <div>
                          <h4 className="text-sm font-medium text-gray-200">
                            {type.label}
                          </h4>
                          <p className="text-xs text-gray-400 mt-1">
                            {type.description}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Template List */}
                <div className="border-t border-gray-800 pt-4">
                  <h4 className="text-sm font-medium text-gray-200 mb-3">
                    Popular Templates
                  </h4>
                  <div className="space-y-2">
                    {GATE_TEMPLATES.map(template => (
                      <button
                        key={template.id}
                        onClick={() => {
                          handleTemplateSelect(template.id);
                          setIsAddingGate(true);
                          setShowTemplates(false);
                        }}
                        className={cn(
                          "w-full p-3 rounded-lg",
                          "border border-gray-800",
                          "hover:bg-gray-800/50",
                          "transition-colors duration-200",
                          "text-left"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-sm font-medium text-gray-200">
                              {template.name}
                            </h5>
                            <p className="text-xs text-gray-400 mt-1">
                              {template.description}
                            </p>
                          </div>
                          {(() => {
                            const IconComponent = GATE_TYPES[template.type.toUpperCase() as keyof typeof GATE_TYPES]?.icon;
                            return IconComponent ? (
                              <IconComponent className="w-4 h-4 text-gray-400" />
                            ) : null;
                          })()}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-gray-800 flex justify-end">
                <button
                  onClick={() => setShowTemplates(false)}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm",
                    "text-gray-400 hover:text-gray-300",
                    "hover:bg-gray-800",
                    "transition-colors duration-200"
                  )}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Gate Form */}
        {isAddingGate && (
          <div className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 mb-4">
            <h4 className="text-sm font-medium text-gray-200 mb-4">Add New Gate</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={newGate.name}
                  onChange={(e) => setNewGate(prev => ({ ...prev, name: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 rounded-md",
                    "bg-gray-900 border border-gray-700",
                    "text-sm text-gray-200",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  )}
                  placeholder="Gate name"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <textarea
                  value={newGate.description}
                  onChange={(e) => setNewGate(prev => ({ ...prev, description: e.target.value }))}
                  className={cn(
                    "w-full px-3 py-2 rounded-md",
                    "bg-gray-900 border border-gray-700",
                    "text-sm text-gray-200",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                    "resize-none"
                  )}
                  rows={3}
                  placeholder="Gate description"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Type</label>
                <select
                  value={newGate.type}
                  onChange={(e) => setNewGate(prev => ({ ...prev, type: e.target.value as Gate['type'] }))}
                  className={cn(
                    "w-full px-3 py-2 rounded-md",
                    "bg-gray-900 border border-gray-700",
                    "text-sm text-gray-200",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  )}
                >
                  <option value="validation">Validation</option>
                  <option value="approval">Approval</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  onClick={() => setIsAddingGate(false)}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm",
                    "text-gray-400 hover:text-gray-300",
                    "hover:bg-gray-800",
                    "transition-colors duration-200"
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitNewGate}
                  disabled={!newGate.name || !newGate.type}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-sm",
                    "bg-blue-500 text-white",
                    "hover:bg-blue-600",
                    "transition-colors duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  Add Gate
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Gates List */}
        {gates.map((gate, index) => {
          const enhancedGate = gate as EnhancedGate;
          return (
            <div
              key={gate.id}
              className={cn(
                "border rounded-lg overflow-hidden",
                "transition-colors duration-200",
                gate.status === 'passed'
                  ? "border-green-500/20 bg-green-500/5"
                  : gate.status === 'failed'
                  ? "border-red-500/20 bg-red-500/5"
                  : "border-gray-700 bg-gray-800/50"
              )}
            >
              {/* Gate Header */}
              <div
                className="flex items-center gap-3 p-3 cursor-pointer"
                onClick={() => toggleGateExpanded(gate.id)}
              >
                <button
                  className={cn(
                    "p-0.5 rounded transition-colors duration-200",
                    "hover:bg-gray-700"
                  )}
                >
                  {expandedGates.has(gate.id) ? (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                
                {gate.status === 'passed' ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : gate.status === 'failed' ? (
                  <XCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-400" />
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-200">
                      {gate.name}
                    </h4>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onValidateGate(gate.id);
                        }}
                        className={cn(
                          "p-1 rounded-md",
                          "text-gray-400 hover:text-gray-300",
                          "hover:bg-gray-700",
                          "transition-colors duration-200"
                        )}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onRemoveGate(gate.id);
                        }}
                        className={cn(
                          "p-1 rounded-md",
                          "text-gray-400 hover:text-gray-300",
                          "hover:bg-gray-700",
                          "transition-colors duration-200"
                        )}
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">
                    {gate.type.charAt(0).toUpperCase() + gate.type.slice(1)} Gate
                  </p>
                </div>
              </div>

              {/* Gate Details */}
              {expandedGates.has(gate.id) && (
                <div className="px-4 pb-4 pt-1">
                  <div className="text-sm text-gray-400">
                    {gate.description}
                  </div>

                  {/* Checks Section */}
                  {enhancedGate.checks && enhancedGate.checks.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-200">Checks</h4>
                      {enhancedGate.checks.map(check => (
                        <div
                          key={check.id}
                          className={cn(
                            "flex items-center justify-between",
                            "p-2 rounded",
                            "bg-gray-800/50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {check.status === 'passed' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : check.status === 'failed' ? (
                              <XCircle className="w-4 h-4 text-red-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-400" />
                            )}
                            <span className="text-sm text-gray-300">
                              {check.name}
                            </span>
                          </div>
                          {check.message && (
                            <span className="text-xs text-gray-500">
                              {check.message}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Approvers Section */}
                  {enhancedGate.approvers && enhancedGate.approvers.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-200">Approvers</h4>
                      {enhancedGate.approvers.map(approver => (
                        <div
                          key={approver.id}
                          className={cn(
                            "flex items-center justify-between",
                            "p-2 rounded",
                            "bg-gray-800/50"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {approver.status === 'approved' ? (
                              <CheckCircle className="w-4 h-4 text-green-400" />
                            ) : approver.status === 'rejected' ? (
                              <XCircle className="w-4 h-4 text-red-400" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-yellow-400" />
                            )}
                            <div>
                              <span className="text-sm text-gray-300">
                                {approver.name}
                              </span>
                              <span className="text-xs text-gray-500 ml-2">
                                {approver.role}
                              </span>
                            </div>
                          </div>
                          {approver.comment && (
                            <span className="text-xs text-gray-500">
                              {approver.comment}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Dependencies Section */}
                  {enhancedGate.dependencies && enhancedGate.dependencies.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium text-gray-200">Dependencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {enhancedGate.dependencies.map(depId => {
                          const depGate = gates.find(g => g.id === depId);
                          return (
                            <div
                              key={depId}
                              className={cn(
                                "px-2 py-1 rounded text-xs",
                                "bg-gray-800",
                                "flex items-center gap-1"
                              )}
                            >
                              {depGate?.status === 'passed' ? (
                                <CheckCircle className="w-3 h-3 text-green-400" />
                              ) : depGate?.status === 'failed' ? (
                                <XCircle className="w-3 h-3 text-red-400" />
                              ) : (
                                <AlertCircle className="w-3 h-3 text-yellow-400" />
                              )}
                              <span className="text-gray-300">
                                {depGate?.name || 'Unknown Gate'}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* History Section */}
                  {enhancedGate.history && enhancedGate.history.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-200">History</h4>
                        <button
                          onClick={() => setShowHistory(showHistory === gate.id ? null : gate.id)}
                          className="text-xs text-gray-400 hover:text-gray-300"
                        >
                          {showHistory === gate.id ? 'Hide' : 'Show'}
                        </button>
                      </div>
                      {showHistory === gate.id && (
                        <div className="space-y-2 mt-2">
                          {enhancedGate.history.map((event, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-xs"
                            >
                              <div className="flex-none pt-1">
                                {event.status === 'passed' ? (
                                  <CheckCircle className="w-3 h-3 text-green-400" />
                                ) : event.status === 'failed' ? (
                                  <XCircle className="w-3 h-3 text-red-400" />
                                ) : (
                                  <AlertCircle className="w-3 h-3 text-yellow-400" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <span className="text-gray-300">
                                    {event.user || 'System'}
                                  </span>
                                  <span className="text-gray-500">
                                    {new Date(event.timestamp).toLocaleString()}
                                  </span>
                                </div>
                                {event.message && (
                                  <p className="text-gray-400 mt-1">
                                    {event.message}
                                  </p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 pt-4 border-t border-gray-700">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-400">
                        Status: <span className="text-gray-200">{gate.status}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {enhancedGate.lastValidated && (
                          <span className="text-xs text-gray-500">
                            Last validated: {new Date(enhancedGate.lastValidated).toLocaleString()}
                          </span>
                        )}
                        <button
                          onClick={() => {
                            // Open gate settings
                          }}
                          className={cn(
                            "px-2 py-1 rounded-md text-xs",
                            "text-gray-400 hover:text-gray-300",
                            "hover:bg-gray-700",
                            "transition-colors duration-200",
                            "flex items-center gap-1"
                          )}
                        >
                          <Settings className="w-3 h-3" />
                          Settings
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
} 