import { useState, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';
import type { Comment } from '../../types';
import * as commentService from '../../services/commentService';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';
import Spinner from '../ui/Spinner';

interface CommentThreadProps {
  ticketId: string;
}

const formatTime = (iso: string) =>
  new Date(iso).toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  });

/** Scrollable comment list + reply form for the ticket detail page */
const CommentThread = ({ ticketId }: CommentThreadProps) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [text, setText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch comments on mount
  useEffect(() => {
    const load = async () => {
      try {
        const data = await commentService.getComments(ticketId);
        setComments(data);
      } catch {
        toast.error('Failed to load comments');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [ticketId]);

  // Scroll to bottom when new comments arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [comments]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSending(true);
    try {
      const comment = await commentService.createComment(ticketId, text.trim());
      setComments((prev) => [...prev, comment]);
      setText('');
      toast.success('Reply sent');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to send reply';
      toast.error(message);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col">
      <h3 className="text-base font-semibold text-text-primary mb-4">
        Comments ({comments.length})
      </h3>

      {/* Comment list */}
      <div className="space-y-4 max-h-96 overflow-y-auto pr-1 mb-4">
        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner /></div>
        ) : comments.length === 0 ? (
          <p className="text-sm text-text-secondary text-center py-8">
            No comments yet. Be the first to reply.
          </p>
        ) : (
          comments.map((c) => {
            const isOwn = c.senderId._id === user?._id;
            return (
              <div key={c._id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-sm ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  <div className="flex items-center gap-2 text-xs text-text-secondary">
                    {!isOwn && (
                      <span className="font-medium text-text-primary capitalize">
                        {c.senderId.name}
                      </span>
                    )}
                    <span className="capitalize text-xs opacity-60">{c.senderId.role}</span>
                    <span>·</span>
                    <span>{formatTime(c.createdAt)}</span>
                  </div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl text-sm ${
                      isOwn
                        ? 'bg-primary text-white rounded-br-sm'
                        : 'bg-slate-100 text-text-primary rounded-bl-sm'
                    }`}
                  >
                    {c.text}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Reply form */}
      <form onSubmit={handleSubmit} className="flex gap-2 border-t border-border pt-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a reply..."
          maxLength={2000}
          className="flex-1 px-3 py-2.5 rounded-lg border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light transition-colors"
        />
        <button
          type="submit"
          disabled={isSending || !text.trim()}
          className="p-2.5 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Send reply"
        >
          {isSending ? <Spinner size="sm" color="text-white" /> : <Send size={16} />}
        </button>
      </form>
    </div>
  );
};

export default CommentThread;
