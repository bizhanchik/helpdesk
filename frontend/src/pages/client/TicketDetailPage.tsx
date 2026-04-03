import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Paperclip, User, Calendar } from 'lucide-react';
import { Ticket } from '../../types';
import { useAuth } from '../../hooks/useAuth';
import * as ticketService from '../../services/ticketService';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import CommentThread from '../../components/tickets/CommentThread';
import Spinner from '../../components/ui/Spinner';
import { toast } from 'react-toastify';

const STATUSES = ['New', 'In Progress', 'Resolved', 'Closed'];

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [ticket, setTicket] = useState<Ticket | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const data = await ticketService.getTicketById(id!);
        setTicket(data);
      } catch (err: unknown) {
        const message = (err as { response?: { data?: { message?: string } } })
          ?.response?.data?.message || 'Ticket not found';
        toast.error(message);
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, [id, navigate]);

  const handleStatusChange = async (status: string) => {
    if (!ticket) return;
    setIsUpdating(true);
    try {
      const updated = await ticketService.updateTicket(ticket._id, status);
      setTicket(updated);
      toast.success(`Status changed to "${status}"`);
    } catch {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleClaim = async () => {
    if (!ticket) return;
    setIsClaiming(true);
    try {
      const updated = await ticketService.claimTicket(ticket._id);
      setTicket(updated);
      toast.success('Ticket assigned to you');
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to claim ticket';
      toast.error(message);
    } finally {
      setIsClaiming(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (!ticket) return null;

  const canManage = user?.role === 'agent' || user?.role === 'admin';
  const canClaim = canManage && !ticket.agentId;

  return (
    <div className="max-w-4xl">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-5"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          <Card>
            <div className="flex items-start justify-between gap-3 mb-4">
              <h1 className="text-xl font-bold text-text-primary">{ticket.title}</h1>
              <Badge value={ticket.status} variant="status" />
            </div>

            <p className="text-sm text-text-secondary leading-relaxed">{ticket.description}</p>

            {ticket.attachmentUrl && (
              <a
                href={`/uploads/${ticket.attachmentUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
              >
                <Paperclip size={14} />
                View Attachment
              </a>
            )}
          </Card>

          {/* Comments */}
          <Card>
            <CommentThread ticketId={ticket._id} />
          </Card>
        </div>

        {/* Sidebar info */}
        <div className="space-y-4">
          <Card className="space-y-4">
            <h2 className="text-sm font-semibold text-text-primary">Ticket Info</h2>

            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Priority</span>
                <Badge value={ticket.priority} variant="priority" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Category</span>
                <Badge value={ticket.category} variant="category" />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-text-secondary">Status</span>
                <Badge value={ticket.status} variant="status" />
              </div>
            </div>

            <div className="border-t border-border pt-3 space-y-2.5 text-sm">
              <div className="flex items-center gap-2 text-text-secondary">
                <User size={13} />
                <span>Client: <span className="text-text-primary font-medium">{ticket.clientId.name}</span></span>
              </div>
              {ticket.agentId && (
                <div className="flex items-center gap-2 text-text-secondary">
                  <User size={13} />
                  <span>Agent: <span className="text-text-primary font-medium">{ticket.agentId.name}</span></span>
                </div>
              )}
              <div className="flex items-center gap-2 text-text-secondary">
                <Calendar size={13} />
                <span>{new Date(ticket.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
              </div>
            </div>
          </Card>

          {/* Agent actions */}
          {canManage && (
            <Card className="space-y-3">
              <h2 className="text-sm font-semibold text-text-primary">Actions</h2>

              {canClaim && (
                <Button
                  onClick={handleClaim}
                  isLoading={isClaiming}
                  className="w-full"
                >
                  Assign to me
                </Button>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-xs text-text-secondary font-medium">Change Status</label>
                <select
                  value={ticket.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  disabled={isUpdating}
                  className="w-full px-3 py-2 rounded-lg border border-border text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light bg-white disabled:opacity-60"
                >
                  {STATUSES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetailPage;
