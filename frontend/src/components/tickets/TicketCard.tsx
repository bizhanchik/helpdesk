import { memo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Clock, User } from 'lucide-react';
import type { Ticket } from '../../types';
import Badge from '../ui/Badge';

interface TicketCardProps {
  ticket: Ticket;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** Summary card for a single ticket — links to the detail page */
const TicketCard = memo(({ ticket }: TicketCardProps) => {
  return (
    <Link
      to={`/tickets/${ticket._id}`}
      className="block bg-white rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-sm transition-all duration-150 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-text-primary truncate group-hover:text-primary transition-colors">
            {ticket.title}
          </h3>
          <p className="text-xs text-text-secondary mt-1 line-clamp-1">{ticket.description}</p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Badge value={ticket.status} variant="status" />
          <Badge value={ticket.priority} variant="priority" />
          <ChevronRight size={16} className="text-text-secondary group-hover:text-primary transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-4 mt-3 text-xs text-text-secondary">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {formatDate(ticket.createdAt)}
        </span>
        <Badge value={ticket.category} variant="category" />
        {ticket.agentId && (
          <span className="flex items-center gap-1">
            <User size={12} />
            {ticket.agentId.name}
          </span>
        )}
      </div>
    </Link>
  );
});

TicketCard.displayName = 'TicketCard';

export default TicketCard;
