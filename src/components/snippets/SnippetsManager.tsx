import React from 'react';
import { Code, Plus, Search, Tag, Trash2, Edit2, Copy, Save } from 'lucide-react';
import { cn } from '@/utils/cn';

interface Snippet {
  id: string;
  title: string;
  description: string;
  code: string;
  language: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

interface SnippetsManagerProps {
  snippets: Snippet[];
  onCreateSnippet: (snippet: Omit<Snippet, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdateSnippet: (id: string, snippet: Partial<Snippet>) => void;
  onDeleteSnippet: (id: string) => void;
  onInsertSnippet: (snippet: Snippet) => void;
  className?: string;
}

export function SnippetsManager({
  snippets,
  onCreateSnippet,
  onUpdateSnippet,
  onDeleteSnippet,
  onInsertSnippet,
  className
}: SnippetsManagerProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedTags, setSelectedTags] = React.useState<Set<string>>(new Set());
  const [editingSnippet, setEditingSnippet] = React.useState<Snippet | null>(null);
  const [showCreateForm, setShowCreateForm] = React.useState(false);

  // Get all unique tags
  const allTags = React.useMemo(() => {
    const tags = new Set<string>();
    snippets.forEach(snippet => {
      snippet.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [snippets]);

  // Filter snippets based on search and tags
  const filteredSnippets = React.useMemo(() => {
    return snippets.filter(snippet => {
      const matchesSearch = searchQuery === '' ||
        snippet.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        snippet.code.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTags = selectedTags.size === 0 ||
        snippet.tags.some(tag => selectedTags.has(tag));

      return matchesSearch && matchesTags;
    });
  }, [snippets, searchQuery, selectedTags]);

  const handleCreateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    onCreateSnippet({
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      code: formData.get('code') as string,
      language: formData.get('language') as string,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)
    });

    setShowCreateForm(false);
    form.reset();
  };

  const handleUpdateSnippet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSnippet) return;

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    onUpdateSnippet(editingSnippet.id, {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      code: formData.get('code') as string,
      language: formData.get('language') as string,
      tags: (formData.get('tags') as string).split(',').map(t => t.trim()).filter(Boolean)
    });

    setEditingSnippet(null);
  };

  const SnippetForm = ({ snippet }: { snippet?: Snippet }) => (
    <form
      onSubmit={snippet ? handleUpdateSnippet : handleCreateSnippet}
      className="space-y-4 p-4 bg-gray-800/50 rounded-lg"
    >
      <div>
        <label className="block text-sm text-gray-400 mb-1">Title</label>
        <input
          type="text"
          name="title"
          defaultValue={snippet?.title}
          required
          className={cn(
            "w-full px-3 py-2",
            "bg-gray-900/50 border border-gray-700 rounded-md",
            "text-sm text-gray-200",
            "focus:outline-none focus:border-blue-500"
          )}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Description</label>
        <textarea
          name="description"
          defaultValue={snippet?.description}
          rows={2}
          className={cn(
            "w-full px-3 py-2",
            "bg-gray-900/50 border border-gray-700 rounded-md",
            "text-sm text-gray-200",
            "focus:outline-none focus:border-blue-500"
          )}
        />
      </div>

      <div>
        <label className="block text-sm text-gray-400 mb-1">Code</label>
        <textarea
          name="code"
          defaultValue={snippet?.code}
          required
          rows={5}
          className={cn(
            "w-full px-3 py-2",
            "font-mono",
            "bg-gray-900/50 border border-gray-700 rounded-md",
            "text-sm text-gray-200",
            "focus:outline-none focus:border-blue-500"
          )}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-1">Language</label>
          <input
            type="text"
            name="language"
            defaultValue={snippet?.language}
            required
            className={cn(
              "w-full px-3 py-2",
              "bg-gray-900/50 border border-gray-700 rounded-md",
              "text-sm text-gray-200",
              "focus:outline-none focus:border-blue-500"
            )}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm text-gray-400 mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            name="tags"
            defaultValue={snippet?.tags.join(', ')}
            className={cn(
              "w-full px-3 py-2",
              "bg-gray-900/50 border border-gray-700 rounded-md",
              "text-sm text-gray-200",
              "focus:outline-none focus:border-blue-500"
            )}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={() => {
            setShowCreateForm(false);
            setEditingSnippet(null);
          }}
          className={cn(
            "px-3 py-1.5 rounded-md",
            "text-sm text-gray-400",
            "hover:text-gray-300 hover:bg-gray-800",
            "transition-colors duration-200"
          )}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={cn(
            "px-3 py-1.5 rounded-md",
            "text-sm text-blue-400",
            "bg-blue-500/10 hover:bg-blue-500/20",
            "transition-colors duration-200"
          )}
        >
          {snippet ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header */}
      <div className="flex-none p-4 border-b border-gray-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-200">Code Snippets</h2>
          <button
            onClick={() => setShowCreateForm(true)}
            className={cn(
              "px-3 py-1.5 rounded-md",
              "flex items-center gap-2",
              "text-sm text-blue-400",
              "bg-blue-500/10 hover:bg-blue-500/20",
              "transition-colors duration-200"
            )}
          >
            <Plus className="w-4 h-4" />
            New Snippet
          </button>
        </div>

        {/* Search and Filters */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search snippets..."
              className={cn(
                "w-full pl-9 pr-3 py-2",
                "bg-gray-900/50 border border-gray-700 rounded-md",
                "text-sm text-gray-200",
                "focus:outline-none focus:border-blue-500"
              )}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => {
                  const newTags = new Set(selectedTags);
                  if (newTags.has(tag)) {
                    newTags.delete(tag);
                  } else {
                    newTags.add(tag);
                  }
                  setSelectedTags(newTags);
                }}
                className={cn(
                  "px-2 py-1 rounded-md",
                  "flex items-center gap-1",
                  "text-xs",
                  "transition-colors duration-200",
                  selectedTags.has(tag)
                    ? "bg-blue-500/20 text-blue-400"
                    : "bg-gray-800/50 text-gray-400 hover:text-gray-300"
                )}
              >
                <Tag className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {showCreateForm && <SnippetForm />}

        {editingSnippet && (
          <SnippetForm snippet={editingSnippet} />
        )}

        {filteredSnippets.map(snippet => (
          <div
            key={snippet.id}
            className={cn(
              "p-4 rounded-lg",
              "bg-gray-800/30 hover:bg-gray-800/50",
              "border border-gray-800",
              "transition-colors duration-200"
            )}
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-sm font-medium text-gray-200 mb-1">
                  {snippet.title}
                </h3>
                <p className="text-xs text-gray-500">
                  {snippet.description}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => onInsertSnippet(snippet)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setEditingSnippet(snippet)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => onDeleteSnippet(snippet.id)}
                  className="p-1.5 rounded-md text-gray-400 hover:text-gray-300 hover:bg-gray-800"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <pre className={cn(
              "p-3 rounded-md",
              "bg-gray-900/50",
              "text-xs font-mono text-gray-300",
              "overflow-x-auto"
            )}>
              <code>{snippet.code}</code>
            </pre>

            <div className="mt-3 flex items-center gap-2">
              <Code className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">{snippet.language}</span>
              <div className="w-px h-3 bg-gray-800" />
              <div className="flex items-center gap-1">
                {snippet.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-xs bg-gray-800 text-gray-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}

        {filteredSnippets.length === 0 && (
          <div className="text-center py-8">
            <Code className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-sm font-medium text-gray-300 mb-1">
              No snippets found
            </h3>
            <p className="text-xs text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 