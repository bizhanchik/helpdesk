import { memo } from 'react';
import type { Ticket } from '../../types';
import TicketCard from './TicketCard';
import SkeletonLoader from '../ui/SkeletonLoader';
import { Inbox } from 'lucide-react';

interface TicketListProps {
  tickets: Ticket[];
  isLoading: boolean;
}

/** Renders a list of TicketCards or skeletons while loading */
const TicketList = memo(({ tickets, isLoading }: TicketListProps) => {
  if (isLoading) {
    return <SkeletonLoader rows={5} />;
  }

  if (tickets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-text-secondary">
        <Inbox size={40} className="mb-3 opacity-40" />
        <p className="text-sm font-medium">No tickets found</p>
        <p className="text-xs mt-1 opacity-60">Try adjusting your filters or create a new ticket</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tickets.map((ticket) => (
        <TicketCard key={ticket._id} ticket={ticket} />
      ))}
    </div>
  );
});

TicketList.displayName = 'TicketList';

export default TicketList;
