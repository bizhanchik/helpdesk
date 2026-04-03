import { Link } from 'react-router-dom';
import { PlusCircle, Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useTickets } from '../../hooks/useTickets';
import { useAuth } from '../../hooks/useAuth';
import TicketList from '../../components/tickets/TicketList';
import Button from '../../components/ui/Button';

const ClientDashboard = () => {
  const { user } = useAuth();
  const { tickets, isLoading, filters, setFilters } = useTickets();

  // Quick stats derived from the ticket list
  const stats = {
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'New' || t.status === 'In Progress').length,
    resolved: tickets.filter((t) => t.status === 'Resolved' || t.status === 'Closed').length,
    high: tickets.filter((t) => t.priority === 'High').length,
  };

  const statusFilters = ['', 'New', 'In Progress', 'Resolved', 'Closed'];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">My Tickets</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Welcome back, {user?.name}
          </p>
        </div>
        <Link to="/tickets/new">
          <Button>
            <PlusCircle size={16} />
            New Ticket
          </Button>
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Total', value: stats.total, icon: Ticket, color: 'text-primary bg-primary-light' },
          { label: 'Open', value: stats.open, icon: Clock, color: 'text-amber-600 bg-amber-50' },
          { label: 'Resolved', value: stats.resolved, icon: CheckCircle, color: 'text-green-600 bg-green-50' },
          { label: 'High Priority', value: stats.high, icon: AlertCircle, color: 'text-rose-600 bg-rose-50' },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-border p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
              <Icon size={18} />
            </div>
            <div>
              <p className="text-xl font-bold text-text-primary">{value}</p>
              <p className="text-xs text-text-secondary">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {statusFilters.map((s) => (
          <button
            key={s}
            onClick={() => setFilters({ ...filters, status: s || undefined })}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              filters.status === s || (!s && !filters.status)
                ? 'bg-primary text-white'
                : 'bg-white text-text-secondary border border-border hover:bg-slate-50'
            }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {/* Ticket list */}
      <TicketList tickets={tickets} isLoading={isLoading} />
    </div>
  );
};

export default ClientDashboard;
