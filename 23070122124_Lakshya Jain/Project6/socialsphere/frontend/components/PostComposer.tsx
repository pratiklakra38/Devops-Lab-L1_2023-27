'use client';

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface PostComposerProps {
  onPostCreated: (content: string) => Promise<void>;
}

export default function PostComposer({ onPostCreated }: PostComposerProps) {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const characterLimit = 280;
  const charactersLeft = characterLimit - content.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || isSubmitting) return;

    if (content.length > characterLimit) {
      setError(`Content exceeds limit of ${characterLimit} characters.`);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onPostCreated(content);
      setContent('');
    } catch (err: any) {
      setError(err.message || 'Failed to submit post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-5 shadow-lg">
      <h3 className="mb-3 text-sm font-semibold tracking-wide text-indigo-400 uppercase">
        What's on your mind?
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Share your technical insights, system designs, or scaling ideas..."
            disabled={isSubmitting}
            rows={3}
            className="w-full rounded-lg border border-slate-850 bg-slate-950 p-3 text-sm text-slate-100 placeholder-slate-500 outline-none ring-offset-slate-900 transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-60 resize-none"
          />
        </div>

        {error && (
          <p className="mt-2 text-xs font-medium text-red-400 bg-red-950/30 border border-red-900/50 rounded p-2">
            {error}
          </p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span
            className={`text-xs font-semibold ${
              charactersLeft < 0
                ? 'text-red-400'
                : charactersLeft <= 20
                ? 'text-yellow-400'
                : 'text-slate-500'
            }`}
          >
            {charactersLeft} characters remaining
          </span>

          <button
            type="submit"
            disabled={!content.trim() || charactersLeft < 0 || isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md transition-all hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 disabled:bg-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Posting...</span>
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                <span>Post</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
