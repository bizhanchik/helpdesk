import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink } from 'lucide-react';
import { useTickets } from '../../hooks/useTickets';
import { claimTicket, updateTicket } from '../../services/ticketService';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import SkeletonLoader from '../../components/ui/SkeletonLoader';
import { toast } from 'react-toastify';
import type { Ticket } from '../../types';

const AgentDashboard = () => {
  const { user } = useAuth();
  const { tickets, isLoading, filters, setFilters, refetch } = useTickets();
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleClaim = async (ticket: Ticket) => {
    setActionLoading(ticket._id);
    try {
      await claimTicket(ticket._id);
      toast.success('Ticket assigned to you');
      refetch();
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Failed to claim ticket';
      toast.error(message);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatus = async (ticket: Ticket, status: string) => {
    setActionLoading(ticket._id + status);
    try {
      await updateTicket(ticket._id, status);
      toast.success(`Status updated to "${status}"`);
      refetch();
    } catch {
      toast.error('Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  const categoryFilters = ['', 'Hardware', 'Software', 'Network'];
  const statusFilters = ['', 'New', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">All Tickets</h1>
        <p className="text-sm text-text-secondary mt-0.5">
          Manage and respond to support requests
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-border p-4 mb-5 flex flex-wrap gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">Status</label>
          <select
            value={filters.status || ''}
            onChange={(e) => setFilters({ ...filters, status: e.target.value || undefined })}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-white outline-none focus:border-primary"
          >
            {statusFilters.map((s) => (
              <option key={s} value={s}>{s || 'All statuses'}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">Category</label>
          <select
            value={filters.category || ''}
            onChange={(e) => setFilters({ ...filters, category: e.target.value || undefined })}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-white outline-none focus:border-primary"
          >
            {categoryFilters.map((c) => (
              <option key={c} value={c}>{c || 'All categories'}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium text-text-secondary">Priority</label>
          <select
            value={filters.priority || ''}
            onChange={(e) => setFilters({ ...filters, priority: e.target.value || undefined })}
            className="px-3 py-2 rounded-lg border border-border text-sm bg-white outline-none focus:border-primary"
          >
            {['', 'Low', 'Medium', 'High'].map((p) => (
              <option key={p} value={p}>{p || 'All priorities'}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Tickets table */}
      {isLoading ? (
        <SkeletonLoader rows={6} />
      ) : tickets.length === 0 ? (
        <div className="text-center py-16 text-text-secondary text-sm">No tickets match your filters</div>
      ) : (
        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Ticket</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary hidden md:table-cell">Client</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Priority</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {tickets.map((ticket) => {
                const isMyTicket = ticket.agentId?._id === user?._id;
                return (
                  <tr key={ticket._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 max-w-xs">
                      <Link
                        to={`/tickets/${ticket._id}`}
                        className="font-medium text-text-primary hover:text-primary truncate block"
                      >
                        {ticket.title}
                      </Link>
                      {ticket.agentId && (
                        <span className="text-xs text-text-secondary">
                          {isMyTicket ? 'Assigned to you' : `Agent: ${ticket.agentId.name}`}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell">
                      {ticket.clientId.name}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge value={ticket.category} variant="category" />
                    </td>
                    <td className="px-4 py-3">
                      <Badge value={ticket.priority} variant="priority" />
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={ticket.status}
                        onChange={(e) => handleStatus(ticket, e.target.value)}
                        disabled={!!actionLoading}
                        className="text-xs px-2 py-1 rounded-lg border border-border bg-white outline-none focus:border-primary"
                      >
                        {['New', 'In Progress', 'Resolved', 'Closed'].map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {!ticket.agentId && (
                          <Button
                            variant="secondary"
                            onClick={() => handleClaim(ticket)}
                            isLoading={actionLoading === ticket._id}
                            className="text-xs py-1 px-2"
                          >
                            Claim
                          </Button>
                        )}
                        <Link
                          to={`/tickets/${ticket._id}`}
                          className="p-1.5 text-text-secondary hover:text-primary transition-colors"
                          aria-label="View ticket"
                        >
                          <ExternalLink size={14} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentDashboard;
