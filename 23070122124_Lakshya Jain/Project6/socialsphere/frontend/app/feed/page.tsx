'use client';

import { useEffect, useState, useCallback } from 'react';
import { getPosts, createPost, Post, Pagination } from '../../lib/api';
import PostComposer from '../../components/PostComposer';
import PostCard from '../../components/PostCard';
import { RefreshCw, ArrowLeft, ArrowRight, Loader2, AlertCircle } from 'lucide-react';

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadFeed = useCallback(async (page: number) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getPosts(page, 10);
      setPosts(data.posts);
      setPagination(data.pagination);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to the SocialSphere backend API. Please make sure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed(currentPage);
  }, [currentPage, loadFeed]);

  const handlePostCreated = async (content: string) => {
    // Call API to create post
    const newPost = await createPost(content);
    // Refresh the current page to retrieve the latest feed with the new post
    // or manually prepend. Prepending is nice, but refreshing ensures everything is aligned
    if (currentPage === 1) {
      loadFeed(1);
    } else {
      setCurrentPage(1);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (!pagination || newPage < 1 || newPage > pagination.totalPages) return;
    setCurrentPage(newPage);
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Header action panel */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">Community Feed</h1>
          <p className="mt-1 text-sm text-slate-400">See what is happening in the SocialSphere cluster.</p>
        </div>
        <button
          onClick={() => loadFeed(currentPage)}
          disabled={isLoading}
          aria-label="Refresh feed"
          className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Post Creator */}
      <div className="mb-8">
        <PostComposer onPostCreated={handlePostCreated} />
      </div>

      {/* Main Feed Container */}
      <div className="space-y-6">
        {isLoading && posts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="mt-4 text-sm text-slate-400">Loading cluster feed...</p>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-900/50 bg-red-950/20 p-5 text-center shadow-lg">
            <div className="flex justify-center mb-3 text-red-500">
              <AlertCircle className="h-8 w-8" />
            </div>
            <h4 className="font-semibold text-red-400">Backend Connection Error</h4>
            <p className="mt-2 text-xs text-red-400/80 leading-relaxed max-w-md mx-auto">{error}</p>
            <button
              onClick={() => loadFeed(currentPage)}
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-red-900/40 px-3.5 py-2 text-xs font-bold text-red-200 border border-red-800 hover:bg-red-800 transition-all cursor-pointer"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {!isLoading && !error && posts.length === 0 && (
          <div className="rounded-xl border border-slate-800 bg-slate-900 p-10 text-center shadow-md">
            <p className="text-slate-400">The sphere is currently empty.</p>
            <p className="mt-1 text-xs text-slate-500">Be the first to publish a post!</p>
          </div>
        )}

        {!error && posts.length > 0 && (
          <>
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-between border-t border-slate-900 pt-6">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1 || isLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  <span>Previous</span>
                </button>
                
                <span className="text-xs font-medium text-slate-400">
                  Page {currentPage} of {pagination.totalPages}
                </span>

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages || isLoading}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <span>Next</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
