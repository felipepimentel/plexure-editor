import React from 'react';
import { FolderOpen, Plus, Trash2, Edit2, Save, X, ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';

interface SavedRequest {
  id: string;
  name: string;
  method: string;
  path: string;
  url: string;
  headers: Record<string, string>;
  body?: string;
  description?: string;
}

interface Collection {
  id: string;
  name: string;
  description?: string;
  requests: SavedRequest[];
}

interface RequestCollectionProps {
  onSelect: (request: SavedRequest) => void;
  className?: string;
}

const STORAGE_KEY = 'api-request-collections';

export const RequestCollection: React.FC<RequestCollectionProps> = ({
  onSelect,
  className,
}) => {
  const [collections, setCollections] = React.useState<Collection[]>([]);
  const [expandedCollections, setExpandedCollections] = React.useState<Set<string>>(new Set());
  const [editingCollection, setEditingCollection] = React.useState<string | null>(null);
  const [editingRequest, setEditingRequest] = React.useState<string | null>(null);
  const [showNewCollection, setShowNewCollection] = React.useState(false);
  const [newCollectionName, setNewCollectionName] = React.useState('');
  const [newCollectionDescription, setNewCollectionDescription] = React.useState('');

  // Load collections from localStorage
  React.useEffect(() => {
    const savedCollections = localStorage.getItem(STORAGE_KEY);
    if (savedCollections) {
      try {
        setCollections(JSON.parse(savedCollections));
      } catch (error) {
        console.error('Failed to load collections:', error);
      }
    }
  }, []);

  // Save collections to localStorage
  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(collections));
  }, [collections]);

  const toggleCollection = (id: string) => {
    setExpandedCollections(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleAddCollection = () => {
    if (newCollectionName.trim()) {
      setCollections(prev => [...prev, {
        id: Date.now().toString(),
        name: newCollectionName,
        description: newCollectionDescription,
        requests: [],
      }]);
      setNewCollectionName('');
      setNewCollectionDescription('');
      setShowNewCollection(false);
    }
  };

  const handleRemoveCollection = (id: string) => {
    if (window.confirm('Are you sure you want to delete this collection?')) {
      setCollections(prev => prev.filter(c => c.id !== id));
      setExpandedCollections(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const handleUpdateCollection = (id: string, updates: Partial<Collection>) => {
    setCollections(prev => prev.map(c => 
      c.id === id ? { ...c, ...updates } : c
    ));
    setEditingCollection(null);
  };

  const handleAddRequest = (collectionId: string, request: Omit<SavedRequest, 'id'>) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? {
        ...c,
        requests: [...c.requests, {
          ...request,
          id: Date.now().toString(),
        }],
      } : c
    ));
  };

  const handleUpdateRequest = (
    collectionId: string,
    requestId: string,
    updates: Partial<SavedRequest>
  ) => {
    setCollections(prev => prev.map(c => 
      c.id === collectionId ? {
        ...c,
        requests: c.requests.map(r => 
          r.id === requestId ? { ...r, ...updates } : r
        ),
      } : c
    ));
    setEditingRequest(null);
  };

  const handleRemoveRequest = (collectionId: string, requestId: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      setCollections(prev => prev.map(c => 
        c.id === collectionId ? {
          ...c,
          requests: c.requests.filter(r => r.id !== requestId),
        } : c
      ));
    }
  };

  const renderRequest = (collection: Collection, request: SavedRequest) => {
    const isEditing = editingRequest === request.id;

    if (isEditing) {
      return (
        <div key={request.id} className="pl-6 py-2">
          <div className="space-y-2">
            <input
              type="text"
              value={request.name}
              onChange={(e) => handleUpdateRequest(collection.id, request.id, {
                name: e.target.value,
              })}
              className="w-full px-2 py-1 text-sm rounded-md bg-background border"
              placeholder="Request name"
            />
            <textarea
              value={request.description || ''}
              onChange={(e) => handleUpdateRequest(collection.id, request.id, {
                description: e.target.value,
              })}
              className="w-full px-2 py-1 text-sm rounded-md bg-background border"
              placeholder="Description (optional)"
              rows={2}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setEditingRequest(null)}
                className="px-2 py-1 rounded text-sm hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditingRequest(null)}
                className="px-2 py-1 rounded bg-primary text-primary-foreground text-sm hover:bg-primary/90"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        key={request.id}
        className="pl-6 py-2 hover:bg-accent/50 rounded-md group"
      >
        <div className="flex items-start justify-between gap-2">
          <button
            onClick={() => onSelect(request)}
            className="flex-1 flex items-start gap-2 text-left"
          >
            <span className={cn(
              'uppercase font-mono text-xs px-2 py-0.5 rounded',
              request.method === 'GET' && 'bg-green-500/10 text-green-500',
              request.method === 'POST' && 'bg-blue-500/10 text-blue-500',
              request.method === 'PUT' && 'bg-yellow-500/10 text-yellow-500',
              request.method === 'PATCH' && 'bg-orange-500/10 text-orange-500',
              request.method === 'DELETE' && 'bg-red-500/10 text-red-500'
            )}>
              {request.method}
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{request.name}</p>
              {request.description && (
                <p className="text-xs text-muted-foreground truncate">
                  {request.description}
                </p>
              )}
            </div>
          </button>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
            <button
              onClick={() => setEditingRequest(request.id)}
              className="p-1 rounded hover:bg-accent"
              title="Edit request"
            >
              <Edit2 className="w-3 h-3" />
            </button>
            <button
              onClick={() => handleRemoveRequest(collection.id, request.id)}
              className="p-1 rounded hover:bg-accent"
              title="Delete request"
            >
              <Trash2 className="w-3 h-3 text-destructive" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium flex items-center gap-2">
          <FolderOpen className="w-4 h-4" />
          Collections
        </h3>
        <button
          onClick={() => setShowNewCollection(!showNewCollection)}
          className="text-xs text-primary hover:underline flex items-center gap-1"
        >
          <Plus className="w-3 h-3" />
          New Collection
        </button>
      </div>

      {showNewCollection && (
        <div className="p-3 rounded-lg bg-muted space-y-2">
          <input
            type="text"
            value={newCollectionName}
            onChange={(e) => setNewCollectionName(e.target.value)}
            placeholder="Collection name"
            className="w-full px-3 py-1 rounded-md bg-background border text-sm"
          />
          <input
            type="text"
            value={newCollectionDescription}
            onChange={(e) => setNewCollectionDescription(e.target.value)}
            placeholder="Description (optional)"
            className="w-full px-3 py-1 rounded-md bg-background border text-sm"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowNewCollection(false)}
              className="px-3 py-1 rounded-md text-sm hover:bg-accent"
            >
              Cancel
            </button>
            <button
              onClick={handleAddCollection}
              disabled={!newCollectionName.trim()}
              className="px-3 py-1 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
            >
              Create
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {collections.map(collection => (
          <div
            key={collection.id}
            className="border rounded-lg"
          >
            {editingCollection === collection.id ? (
              <div className="p-3 space-y-2">
                <input
                  type="text"
                  value={collection.name}
                  onChange={(e) => handleUpdateCollection(collection.id, {
                    name: e.target.value,
                  })}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background border"
                  placeholder="Collection name"
                />
                <textarea
                  value={collection.description || ''}
                  onChange={(e) => handleUpdateCollection(collection.id, {
                    description: e.target.value,
                  })}
                  className="w-full px-2 py-1 text-sm rounded-md bg-background border"
                  placeholder="Description (optional)"
                  rows={2}
                />
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setEditingCollection(null)}
                    className="px-2 py-1 rounded text-sm hover:bg-accent"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleUpdateCollection(collection.id, {
                      name: collection.name,
                      description: collection.description,
                    })}
                    className="px-2 py-1 rounded bg-primary text-primary-foreground text-sm hover:bg-primary/90"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-3">
                  <button
                    onClick={() => toggleCollection(collection.id)}
                    className="flex items-center gap-2"
                  >
                    <span className="w-4">
                      {expandedCollections.has(collection.id) ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </span>
                    <div className="text-left">
                      <span className="font-medium">{collection.name}</span>
                      {collection.description && (
                        <p className="text-xs text-muted-foreground">
                          {collection.description}
                        </p>
                      )}
                    </div>
                  </button>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingCollection(collection.id)}
                      className="p-1 rounded hover:bg-accent"
                      title="Edit collection"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveCollection(collection.id)}
                      className="p-1 rounded hover:bg-accent"
                      title="Delete collection"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </button>
                  </div>
                </div>

                {expandedCollections.has(collection.id) && (
                  <div className="pb-2">
                    {collection.requests.map(request => renderRequest(collection, request))}
                    {collection.requests.length === 0 && (
                      <p className="px-6 py-2 text-sm text-muted-foreground">
                        No saved requests
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        ))}

        {collections.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No collections yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestCollection; 