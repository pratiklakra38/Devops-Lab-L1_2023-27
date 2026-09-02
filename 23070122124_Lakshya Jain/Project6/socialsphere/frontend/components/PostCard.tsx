'use client';

import { useState } from 'react';
import { Post, likePost, unlikePost } from '../lib/api';
import { Heart, MessageSquare, Loader2 } from 'lucide-react';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
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

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.likedByCurrentUser);
  const [likesCount, setLikesCount] = useState(post.likesCount);
  const [commentsCount, setCommentsCount] = useState(post.commentsCount);
  const [isLiking, setIsLiking] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLikeToggle = async () => {
    if (isLiking) return;
    setIsLiking(true);
    setError(null);

    const originallyLiked = liked;
    // Optimistic UI updates
    setLiked(!originallyLiked);
    setLikesCount((prev) => (originallyLiked ? prev - 1 : prev + 1));

    try {
      if (originallyLiked) {
        await unlikePost(post.id);
      } else {
        await likePost(post.id);
      }
    } catch (err: any) {
      // Revert optimistic updates on error
      setLiked(originallyLiked);
      setLikesCount(originallyLiked ? likesCount : likesCount);
      setError(err.message || 'Failed to complete like request');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentAdded = () => {
    setCommentsCount((prev) => prev + 1);
  };

  return (
    <article className="rounded-xl border border-slate-800 bg-slate-900 shadow transition-all duration-300 hover:border-slate-700/80">
      <div className="p-5">
        {/* Author details */}
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatarUrl}
            alt={post.author.name}
            className="h-10 w-10 rounded-full border border-slate-700 bg-slate-800"
          />
          <div>
            <h4 className="font-semibold text-slate-200">{post.author.name}</h4>
            <span className="text-xs text-slate-500">{formatRelativeTime(post.createdAt)}</span>
          </div>
        </div>

        {/* Post content */}
        <div className="mt-4 text-sm text-slate-350 leading-relaxed whitespace-pre-wrap">
          {post.content}
        </div>

        {error && (
          <p className="mt-2 text-[11px] text-red-400 bg-red-950/20 border border-red-900/40 p-2 rounded">
            {error}
          </p>
        )}

        {/* Action Row */}
        <div className="mt-5 flex items-center justify-between border-t border-slate-800/60 pt-4">
          <div className="flex gap-4">
            {/* Like button */}
            <button
              onClick={handleLikeToggle}
              disabled={isLiking}
              aria-label={liked ? 'Unlike post' : 'Like post'}
              className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                liked
                  ? 'text-pink-500 hover:text-pink-400'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isLiking ? (
                <Loader2 className="h-4 w-4 animate-spin text-slate-400" />
              ) : (
                <Heart className={`h-4.5 w-4.5 ${liked ? 'fill-current' : ''}`} />
              )}
              <span>{likesCount} {likesCount === 1 ? 'like' : 'likes'}</span>
            </button>

            {/* Comment toggler */}
            <button
              onClick={() => setShowComments(!showComments)}
              aria-label="View comments"
              className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-colors ${
                showComments
                  ? 'text-indigo-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="h-4.5 w-4.5" />
              <span>{commentsCount} {commentsCount === 1 ? 'comment' : 'comments'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Expanded comments drawer */}
      {showComments && (
        <CommentSection postId={post.id} onCommentAdded={handleCommentAdded} />
      )}
    </article>
  );
}
