import React, { useState } from 'react';
import { 
  Users,
  MessageSquare,
  Plus,
  Send,
  UserPlus,
  Trash,
  Edit,
  User,
  Circle,
  Clock,
  AtSign,
  Hash,
  Link,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  MoreVertical,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Flag
} from 'lucide-react';
import { cn } from '@/utils/cn';

interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  role: 'owner' | 'editor' | 'reviewer' | 'viewer';
  status: 'online' | 'offline';
}

interface Comment {
  id: string;
  user: {
    id: string;
    name: string;
    avatar: string;
  };
  content: string;
  createdAt: string;
  path?: string;
  line?: number;
}

interface CommentReaction {
  type: 'like' | 'dislike';
  user: {
    id: string;
    name: string;
  };
}

interface CommentReply extends Omit<Comment, 'replies'> {
  parentId: string;
}

interface EnhancedComment extends Comment {
  reactions: CommentReaction[];
  replies: CommentReply[];
  mentions: string[];
  isResolved?: boolean;
  isPrivate?: boolean;
  editHistory?: {
    content: string;
    editedAt: string;
    editedBy: string;
  }[];
}

interface CollaboratorPresence {
  cursor?: {
    line: number;
    character: number;
  };
  selection?: {
    start: { line: number; character: number };
    end: { line: number; character: number };
  };
  lastActivity: string;
}

interface EnhancedCollaborator extends Collaborator {
  presence?: CollaboratorPresence;
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canApprove: boolean;
    canManageGates: boolean;
  };
  activity: {
    timestamp: string;
    type: 'edit' | 'comment' | 'review' | 'gate';
    details: string;
  }[];
}

interface CollaborationPanelProps {
  collaborators: EnhancedCollaborator[];
  comments: EnhancedComment[];
  currentUser: {
    id: string;
    name: string;
    avatar: string;
    role: Collaborator['role'];
  };
  onAddComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  onAddCollaborator: (collaborator: Omit<Collaborator, 'id'>) => void;
  onRemoveCollaborator: (id: string) => void;
  onUpdateCollaborator: (id: string, updates: Partial<Collaborator>) => void;
  onReplyToComment: (commentId: string, reply: Omit<CommentReply, 'id' | 'createdAt'>) => void;
  onReactToComment: (commentId: string, reaction: Omit<CommentReaction, 'user'>) => void;
  onResolveComment: (commentId: string, resolved: boolean) => void;
  onEditComment: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onMentionUser: (userId: string) => void;
  onFollowThread: (commentId: string) => void;
  onFlagComment: (commentId: string, reason: string) => void;
}

export function CollaborationPanel({
  collaborators,
  comments,
  currentUser,
  onAddComment,
  onAddCollaborator,
  onRemoveCollaborator,
  onUpdateCollaborator,
  onReplyToComment,
  onReactToComment,
  onResolveComment,
  onEditComment,
  onDeleteComment,
  onMentionUser,
  onFollowThread,
  onFlagComment
}: CollaborationPanelProps) {
  const [selectedTab, setSelectedTab] = useState<'collaborators' | 'comments'>('collaborators');
  const [newComment, setNewComment] = useState('');
  const [isAddingCollaborator, setIsAddingCollaborator] = useState(false);
  const [newCollaborator, setNewCollaborator] = useState<Partial<Collaborator>>({
    name: '',
    role: 'viewer'
  });
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [showResolved, setShowResolved] = useState(false);
  const [mentionSearch, setMentionSearch] = useState('');
  const [showMentions, setShowMentions] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<'all' | 'comments' | 'edits' | 'reviews'>('all');

  const handleSubmitComment = () => {
    if (!newComment.trim()) return;

    onAddComment({
      user: {
        id: 'current-user', // Replace with actual user ID
        name: 'Current User', // Replace with actual user name
        avatar: 'https://github.com/shadcn.png' // Replace with actual user avatar
      },
      content: newComment.trim(),
      path: undefined,
      line: undefined
    });

    setNewComment('');
  };

  const handleSubmitCollaborator = () => {
    if (!newCollaborator.name || !newCollaborator.role) return;

    onAddCollaborator({
      name: newCollaborator.name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newCollaborator.name)}`,
      role: newCollaborator.role as Collaborator['role'],
      status: 'offline'
    });

    setNewCollaborator({ name: '', role: 'viewer' });
    setIsAddingCollaborator(false);
  };

  const filteredComments = React.useMemo(() => {
    return comments.filter(comment => {
      const enhanced = comment as EnhancedComment;
      return showResolved ? true : !enhanced.isResolved;
    });
  }, [comments, showResolved]);

  const commentThreads = React.useMemo(() => {
    const threads: Record<string, EnhancedComment[]> = {};
    filteredComments.forEach(comment => {
      const enhanced = comment as EnhancedComment;
      if (enhanced.replies) {
        threads[comment.id] = [enhanced, ...enhanced.replies];
      } else {
        threads[comment.id] = [enhanced];
      }
    });
    return threads;
  }, [filteredComments]);

  const handleMention = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === '@') {
      setShowMentions(true);
    }
  };

  const CommentThread = ({ comment, replies }: { comment: EnhancedComment; replies: CommentReply[] }) => (
    <div className="space-y-2">
      <div className="flex gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700">
        <img
          src={comment.user.avatar}
          alt={comment.user.name}
          className="w-8 h-8 rounded-full flex-none"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-200">
                {comment.user.name}
              </span>
              <span className="text-xs text-gray-500">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {comment.isPrivate && (
                <Lock className="w-3 h-3 text-gray-400" />
              )}
              <button
                onClick={() => onResolveComment(comment.id, !comment.isResolved)}
                className={cn(
                  "p-1 rounded-md",
                  "text-gray-400 hover:text-gray-300",
                  "hover:bg-gray-700",
                  "transition-colors duration-200"
                )}
              >
                {comment.isResolved ? (
                  <Eye className="w-3 h-3" />
                ) : (
                  <EyeOff className="w-3 h-3" />
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => {}}
                  className={cn(
                    "p-1 rounded-md",
                    "text-gray-400 hover:text-gray-300",
                    "hover:bg-gray-700",
                    "transition-colors duration-200"
                  )}
                >
                  <MoreVertical className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {editingComment === comment.id ? (
            <div className="mt-2">
              <textarea
                value={comment.content}
                onChange={(e) => {}}
                className={cn(
                  "w-full px-3 py-2 rounded-md",
                  "bg-gray-900 border border-gray-700",
                  "text-sm text-gray-200",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
                  "resize-none"
                )}
                rows={3}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  onClick={() => setEditingComment(null)}
                  className="text-xs text-gray-400 hover:text-gray-300"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    onEditComment(comment.id, comment.content);
                    setEditingComment(null);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-300 mt-1 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}

          {comment.path && (
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
              <Link className="w-3 h-3" />
              <span>{comment.path}</span>
              {comment.line && (
                <>
                  <span>:</span>
                  <span>Line {comment.line}</span>
                </>
              )}
            </div>
          )}

          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onReactToComment(comment.id, { type: 'like' })}
                className={cn(
                  "p-1 rounded",
                  "text-gray-400 hover:text-gray-300",
                  "hover:bg-gray-700",
                  "transition-colors duration-200",
                  "flex items-center gap-1 text-xs"
                )}
              >
                <ThumbsUp className="w-3 h-3" />
                <span>{comment.reactions.filter(r => r.type === 'like').length}</span>
              </button>
              <button
                onClick={() => onReactToComment(comment.id, { type: 'dislike' })}
                className={cn(
                  "p-1 rounded",
                  "text-gray-400 hover:text-gray-300",
                  "hover:bg-gray-700",
                  "transition-colors duration-200",
                  "flex items-center gap-1 text-xs"
                )}
              >
                <ThumbsDown className="w-3 h-3" />
                <span>{comment.reactions.filter(r => r.type === 'dislike').length}</span>
              </button>
            </div>

            <button
              onClick={() => setReplyingTo(comment.id)}
              className={cn(
                "p-1 rounded",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-700",
                "transition-colors duration-200",
                "flex items-center gap-1 text-xs"
              )}
            >
              <Reply className="w-3 h-3" />
              <span>Reply</span>
            </button>

            {comment.user.id === currentUser.id && (
              <>
                <button
                  onClick={() => setEditingComment(comment.id)}
                  className={cn(
                    "p-1 rounded",
                    "text-gray-400 hover:text-gray-300",
                    "hover:bg-gray-700",
                    "transition-colors duration-200",
                    "flex items-center gap-1 text-xs"
                  )}
                >
                  <Edit className="w-3 h-3" />
                  <span>Edit</span>
                </button>
                <button
                  onClick={() => onDeleteComment(comment.id)}
                  className={cn(
                    "p-1 rounded",
                    "text-gray-400 hover:text-gray-300",
                    "hover:bg-gray-700",
                    "transition-colors duration-200",
                    "flex items-center gap-1 text-xs"
                  )}
                >
                  <Trash className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </>
            )}

            <button
              onClick={() => onFlagComment(comment.id, 'inappropriate')}
              className={cn(
                "p-1 rounded",
                "text-gray-400 hover:text-gray-300",
                "hover:bg-gray-700",
                "transition-colors duration-200",
                "flex items-center gap-1 text-xs"
              )}
            >
              <Flag className="w-3 h-3" />
              <span>Flag</span>
            </button>
          </div>
        </div>
      </div>

      {replies.length > 0 && (
        <div className="ml-8 space-y-2 border-l-2 border-gray-800 pl-4">
          {replies.map(reply => (
            <div
              key={reply.id}
              className="flex gap-3 p-3 bg-gray-800/30 rounded-lg border border-gray-700"
            >
              <img
                src={reply.user.avatar}
                alt={reply.user.name}
                className="w-6 h-6 rounded-full flex-none"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-200">
                      {reply.user.name}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">
                      {new Date(reply.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-300 mt-1">
                  {reply.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {replyingTo === comment.id && (
        <div className="ml-8 pl-4">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Write a reply..."
              className={cn(
                "flex-1 px-3 py-2 rounded-md",
                "bg-gray-900 border border-gray-700",
                "text-sm text-gray-200",
                "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              )}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  setReplyingTo(null);
                }
              }}
            />
            <button
              className={cn(
                "p-2 rounded-md",
                "bg-blue-500 text-white",
                "hover:bg-blue-600",
                "transition-colors duration-200"
              )}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full flex flex-col">
      <div className="flex-none border-b border-gray-800">
        <div className="flex">
          <button
            onClick={() => setSelectedTab('collaborators')}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium",
              "transition-colors duration-200",
              selectedTab === 'collaborators'
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            Collaborators
          </button>
          <button
            onClick={() => setSelectedTab('comments')}
            className={cn(
              "flex-1 px-4 py-2 text-sm font-medium",
              "transition-colors duration-200",
              selectedTab === 'comments'
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            )}
          >
            Comments
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {selectedTab === 'collaborators' ? (
          <div className="p-4">
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-200 mb-3">
                Active Now
              </h3>
              <div className="space-y-2">
                {collaborators
                  .filter(c => c.status === 'online')
                  .map(collaborator => (
                    <div
                      key={collaborator.id}
                      className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                    >
                      <div className="relative">
                        <img
                          src={collaborator.avatar}
                          alt={collaborator.name}
                          className="w-8 h-8 rounded-full"
                        />
                        <div className={cn(
                          "absolute -bottom-0.5 -right-0.5",
                          "w-3 h-3 rounded-full border-2 border-gray-900",
                          "bg-green-400"
                        )} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-200">
                              {collaborator.name}
                            </h4>
                            <p className="text-xs text-gray-400">
                              {collaborator.role}
                            </p>
                          </div>
                          {collaborator.presence?.cursor && (
                            <span className="text-xs text-gray-500">
                              Line {collaborator.presence.cursor.line}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-200">
                  All Members ({collaborators.length})
                </h3>
                <button
                  onClick={() => setIsAddingCollaborator(true)}
                  className={cn(
                    "px-2.5 py-1.5 rounded-md text-sm",
                    "bg-blue-500 text-white",
                    "hover:bg-blue-600",
                    "transition-colors duration-200",
                    "flex items-center gap-1.5"
                  )}
                >
                  <UserPlus className="w-4 h-4" />
                  Add Member
                </button>
              </div>

              <div className="space-y-2">
                {collaborators.map(collaborator => (
                  <div
                    key={collaborator.id}
                    className="flex items-center gap-3 p-3 bg-gray-800/50 rounded-lg border border-gray-700"
                  >
                    <div className="relative">
                      <img
                        src={collaborator.avatar}
                        alt={collaborator.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <div className={cn(
                        "absolute -bottom-0.5 -right-0.5",
                        "w-3 h-3 rounded-full border-2 border-gray-900",
                        collaborator.status === 'online' ? "bg-green-400" : "bg-gray-400"
                      )} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-200">
                            {collaborator.name}
                          </h4>
                          <p className="text-xs text-gray-400">
                            {collaborator.role}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {collaborator.id !== currentUser.id && (
                            <button
                              onClick={() => onRemoveCollaborator(collaborator.id)}
                              className={cn(
                                "p-1 rounded-md",
                                "text-gray-400 hover:text-gray-300",
                                "hover:bg-gray-700",
                                "transition-colors duration-200"
                              )}
                            >
                              <Trash className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-none p-4 border-b border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedActivity('all')}
                    className={cn(
                      "text-sm",
                      selectedActivity === 'all'
                        ? "text-gray-200 font-medium"
                        : "text-gray-400 hover:text-gray-300"
                    )}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSelectedActivity('comments')}
                    className={cn(
                      "text-sm",
                      selectedActivity === 'comments'
                        ? "text-gray-200 font-medium"
                        : "text-gray-400 hover:text-gray-300"
                    )}
                  >
                    Comments
                  </button>
                  <button
                    onClick={() => setSelectedActivity('reviews')}
                    className={cn(
                      "text-sm",
                      selectedActivity === 'reviews'
                        ? "text-gray-200 font-medium"
                        : "text-gray-400 hover:text-gray-300"
                    )}
                  >
                    Reviews
                  </button>
                </div>
                <button
                  onClick={() => setShowResolved(prev => !prev)}
                  className={cn(
                    "text-sm",
                    showResolved
                      ? "text-gray-200"
                      : "text-gray-400 hover:text-gray-300"
                  )}
                >
                  {showResolved ? 'Hide Resolved' : 'Show Resolved'}
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 space-y-6">
              {Object.entries(commentThreads).map(([threadId, thread]) => (
                <CommentThread
                  key={threadId}
                  comment={thread[0]}
                  replies={thread.slice(1)}
                />
              ))}
            </div>

            <div className="flex-none p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={handleMention}
                    placeholder="Add a comment..."
                    className={cn(
                      "w-full px-3 py-2 rounded-md",
                      "bg-gray-900 border border-gray-700",
                      "text-sm text-gray-200",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    )}
                  />
                  {showMentions && (
                    <div className={cn(
                      "absolute bottom-full left-0 mb-2",
                      "w-64 max-h-48 overflow-auto",
                      "bg-gray-900 border border-gray-700 rounded-lg",
                      "shadow-lg"
                    )}>
                      {collaborators
                        .filter(c => c.name.toLowerCase().includes(mentionSearch.toLowerCase()))
                        .map(collaborator => (
                          <button
                            key={collaborator.id}
                            onClick={() => {
                              onMentionUser(collaborator.id);
                              setShowMentions(false);
                            }}
                            className={cn(
                              "w-full px-3 py-2",
                              "flex items-center gap-2",
                              "text-sm text-gray-200",
                              "hover:bg-gray-800",
                              "transition-colors duration-200"
                            )}
                          >
                            <img
                              src={collaborator.avatar}
                              alt={collaborator.name}
                              className="w-6 h-6 rounded-full"
                            />
                            <span>{collaborator.name}</span>
                          </button>
                        ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSubmitComment}
                  disabled={!newComment.trim()}
                  className={cn(
                    "p-2 rounded-md",
                    "bg-blue-500 text-white",
                    "hover:bg-blue-600",
                    "transition-colors duration-200",
                    "disabled:opacity-50 disabled:cursor-not-allowed"
                  )}
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 