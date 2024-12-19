import React from 'react';
import {
  Settings,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { cn } from '../lib/utils';
import type { Environment } from '../lib/environment-manager';

interface EnvironmentManagerProps {
  environments: Environment[];
  activeEnvironment: Environment | null;
  onEnvironmentChange: (env: Environment) => void;
  onEnvironmentAdd: (env: Environment) => void;
  onEnvironmentEdit: (env: Environment) => void;
  onEnvironmentDelete: (env: Environment) => void;
}

export const EnvironmentManager: React.FC<EnvironmentManagerProps> = ({
  environments,
  activeEnvironment,
  onEnvironmentChange,
  onEnvironmentAdd,
  onEnvironmentEdit,
  onEnvironmentDelete,
}) => {
  const [editingEnv, setEditingEnv] = React.useState<Environment | null>(null);
  const [newEnv, setNewEnv] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    baseUrl: '',
    variables: {} as Record<string, string>,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEnv) {
      onEnvironmentEdit({ ...editingEnv, ...formData });
      setEditingEnv(null);
    } else if (newEnv) {
      onEnvironmentAdd({
        id: Date.now().toString(),
        ...formData,
      });
      setNewEnv(false);
    }
    setFormData({ name: '', baseUrl: '', variables: {} });
  };

  const handleCancel = () => {
    setEditingEnv(null);
    setNewEnv(false);
    setFormData({ name: '', baseUrl: '', variables: {} });
  };

  const handleAddVariable = () => {
    setFormData(prev => ({
      ...prev,
      variables: {
        ...prev.variables,
        '': '',
      },
    }));
  };

  const handleRemoveVariable = (key: string) => {
    const { [key]: _, ...rest } = formData.variables;
    setFormData(prev => ({
      ...prev,
      variables: rest,
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4" />
          <h2 className="font-medium">Environments</h2>
        </div>
        <button
          onClick={() => {
            setNewEnv(true);
            setEditingEnv(null);
          }}
          className="p-1.5 rounded-md hover:bg-accent"
          title="Add Environment"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        {(editingEnv || newEnv) ? (
          <form onSubmit={handleSubmit} className="p-4 space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm rounded-md border bg-background"
                placeholder="Production"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Base URL</label>
              <input
                type="url"
                value={formData.baseUrl}
                onChange={e => setFormData(prev => ({ ...prev, baseUrl: e.target.value }))}
                className="w-full px-3 py-1.5 text-sm rounded-md border bg-background"
                placeholder="https://api.example.com"
                required
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Variables</label>
                <button
                  type="button"
                  onClick={handleAddVariable}
                  className="text-xs text-primary hover:underline"
                >
                  Add Variable
                </button>
              </div>

              <div className="space-y-2">
                {Object.entries(formData.variables).map(([key, value], index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={key}
                      onChange={e => {
                        const newKey = e.target.value;
                        const { [key]: value, ...rest } = formData.variables;
                        setFormData(prev => ({
                          ...prev,
                          variables: {
                            ...rest,
                            [newKey]: value,
                          },
                        }));
                      }}
                      className="flex-1 px-3 py-1.5 text-sm rounded-md border bg-background"
                      placeholder="API_KEY"
                    />
                    <input
                      type="text"
                      value={value}
                      onChange={e => {
                        setFormData(prev => ({
                          ...prev,
                          variables: {
                            ...prev.variables,
                            [key]: e.target.value,
                          },
                        }));
                      }}
                      className="flex-1 px-3 py-1.5 text-sm rounded-md border bg-background"
                      placeholder="Value"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveVariable(key)}
                      className="p-1.5 rounded-md hover:bg-accent"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="px-3 py-1.5 text-sm rounded-md hover:bg-accent"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 text-sm rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {editingEnv ? 'Save Changes' : 'Create Environment'}
              </button>
            </div>
          </form>
        ) : (
          <div className="divide-y">
            {environments.map((env) => (
              <div
                key={env.id}
                className={cn(
                  'flex items-center gap-3 p-4 hover:bg-accent/50 cursor-pointer',
                  activeEnvironment?.id === env.id && 'bg-accent'
                )}
                onClick={() => onEnvironmentChange(env)}
              >
                <Globe className="w-4 h-4 text-muted-foreground" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{env.name}</span>
                    {activeEnvironment?.id === env.id && (
                      <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {env.baseUrl}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingEnv(env);
                      setFormData({
                        name: env.name,
                        baseUrl: env.baseUrl,
                        variables: { ...env.variables },
                      });
                    }}
                    className="p-1.5 rounded-md hover:bg-background"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEnvironmentDelete(env);
                    }}
                    className="p-1.5 rounded-md hover:bg-background"
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </button>
                </div>
              </div>
            ))}

            {environments.length === 0 && !newEnv && (
              <div className="h-32 flex flex-col items-center justify-center text-center p-4">
                <Globe className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium">No environments</p>
                <p className="text-sm text-muted-foreground">
                  Add an environment to get started
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnvironmentManager; 