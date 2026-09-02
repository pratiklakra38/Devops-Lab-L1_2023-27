'use client';

import { useState, useEffect, useCallback } from 'react';
import { getComments, createComment, Comment } from '../lib/api';
import { MessageSquare, Send, Loader2 } from 'lucide-react';

interface CommentSectionProps {
  postId: string;
  onCommentAdded: () => void;
}

// Simple relative time formatter
function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

export default function CommentSection({ postId, onCommentAdded }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch (err: any) {
      setError(err.message || 'Could not load comments.');
    } finally {
      setIsLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentContent.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const created = await createComment(postId, newCommentContent);
      setComments((prev) => [...prev, created]);
      setNewCommentContent('');
      onCommentAdded();
    } catch (err: any) {
      setError(err.message || 'Could not post comment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-4 border-t border-slate-800 bg-slate-950/40 p-4 rounded-b-xl">
      <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
        <MessageSquare className="h-3.5 w-3.5" />
        Comments
      </h4>

      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-indigo-500" />
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-2 rounded mb-3">
          {error}
        </p>
      )}

      {!isLoading && comments.length === 0 && (
        <p className="text-xs text-slate-500 text-center py-2">
          No comments yet. Be the first to start the conversation!
        </p>
      )}

      {comments.length > 0 && (
        <div className="space-y-3 max-h-60 overflow-y-auto mb-4 pr-1">
          {comments.map((comment) => (
            <div key={comment.id} className="text-xs border-b border-slate-900/60 pb-2.5 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={comment.author.avatarUrl}
                  alt={comment.author.name}
                  className="h-5 w-5 rounded-full border border-slate-700 bg-slate-800"
                />
                <span className="font-semibold text-slate-200">{comment.author.name}</span>
                <span className="text-[10px] text-slate-500">{formatRelativeTime(comment.createdAt)}</span>
              </div>
              <p className="text-slate-300 pl-7 leading-relaxed">{comment.content}</p>
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmitComment} className="flex gap-2 items-end mt-2">
        <textarea
          rows={1}
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 rounded-lg border border-slate-800 bg-slate-900/60 p-2 text-xs text-slate-200 placeholder-slate-500 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500/20 resize-none"
        />
        <button
          type="submit"
          disabled={!newCommentContent.trim() || isSubmitting}
          className="rounded-lg bg-indigo-600 p-2 text-white hover:bg-indigo-500 transition-colors disabled:bg-slate-800 disabled:text-slate-500 cursor-pointer"
        >
          {isSubmitting ? (
            <Loader2 className="h-4.5 w-4.5 animate-spin" />
          ) : (
            <Send className="h-4.5 w-4.5" />
          )}
        </button>
      </form>
    </div>
  );
}
