import { useState, useEffect } from 'react';
import { Ticket, Users, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { StatsData, User } from '../../types';
import * as adminService from '../../services/adminService';
import { deleteTicket } from '../../services/ticketService';
import { useTickets } from '../../hooks/useTickets';
import Badge from '../../components/ui/Badge';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Spinner from '../../components/ui/Spinner';
import Modal from '../../components/ui/Modal';
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [usersLoading, setUsersLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'user' | 'ticket'; id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'tickets'>('overview');

  const { tickets, isLoading: ticketsLoading, refetch: refetchTickets } = useTickets();

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await adminService.getStats();
        setStats(data);
      } catch { toast.error('Failed to load stats'); }
      finally { setStatsLoading(false); }
    };
    const loadUsers = async () => {
      try {
        const data = await adminService.getAllUsers();
        setUsers(data);
      } catch { toast.error('Failed to load users'); }
      finally { setUsersLoading(false); }
    };
    loadStats();
    loadUsers();
  }, []);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      if (deleteTarget.type === 'user') {
        await adminService.deleteUser(deleteTarget.id);
        setUsers((prev) => prev.filter((u) => u._id !== deleteTarget.id));
        toast.success('User deleted');
      } else {
        await deleteTicket(deleteTarget.id);
        refetchTickets();
        toast.success('Ticket deleted');
      }
    } catch (err: unknown) {
      const message = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message || 'Delete failed';
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const StatCard = ({ label, value, icon: Icon, color }: {
    label: string; value: number; icon: React.ElementType; color: string;
  }) => (
    <Card className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-sm text-text-secondary">{label}</p>
      </div>
    </Card>
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text-primary">Admin Dashboard</h1>
        <p className="text-sm text-text-secondary mt-0.5">System overview and management</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-xl w-fit mb-6">
        {(['overview', 'users', 'tickets'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-white text-text-primary shadow-sm' : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {statsLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : stats ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total Tickets" value={stats.totalTickets} icon={Ticket} color="bg-primary-light text-primary" />
                <StatCard label="Total Users" value={stats.totalUsers} icon={Users} color="bg-purple-50 text-purple-600" />
                <StatCard label="Open Tickets" value={stats.openTickets} icon={AlertCircle} color="bg-amber-50 text-amber-600" />
                <StatCard label="Resolved" value={stats.resolvedTickets} icon={CheckCircle} color="bg-green-50 text-green-600" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* By status */}
                <Card>
                  <h3 className="text-sm font-semibold mb-3 text-text-primary">By Status</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.ticketsByStatus).map(([status, count]) => (
                      <div key={status} className="flex items-center justify-between">
                        <Badge value={status} variant="status" />
                        <span className="text-sm font-medium text-text-primary">{count}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* By category */}
                <Card>
                  <h3 className="text-sm font-semibold mb-3 text-text-primary">By Category</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.ticketsByCategory).map(([cat, count]) => (
                      <div key={cat} className="flex items-center justify-between">
                        <Badge value={cat} variant="category" />
                        <span className="text-sm font-medium text-text-primary">{count}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* By priority */}
                <Card>
                  <h3 className="text-sm font-semibold mb-3 text-text-primary">By Priority</h3>
                  <div className="space-y-2">
                    {Object.entries(stats.ticketsByPriority).map(([pri, count]) => (
                      <div key={pri} className="flex items-center justify-between">
                        <Badge value={pri} variant="priority" />
                        <span className="text-sm font-medium text-text-primary">{count}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          ) : null}
        </div>
      )}

      {/* Users tab */}
      {activeTab === 'users' && (
        <Card className="!p-0 overflow-hidden">
          {usersLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Name</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Email</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Joined</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary">{u.name}</td>
                    <td className="px-4 py-3 text-text-secondary">{u.email}</td>
                    <td className="px-4 py-3"><Badge value={u.role} variant="role" /></td>
                    <td className="px-4 py-3 text-text-secondary text-xs">
                      {new Date(u.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteTarget({ type: 'user', id: u._id, name: u.name })}
                        className="p-1.5 text-text-secondary hover:text-rose-500 transition-colors"
                        aria-label="Delete user"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {/* Tickets tab */}
      {activeTab === 'tickets' && (
        <Card className="!p-0 overflow-hidden">
          {ticketsLoading ? (
            <div className="flex justify-center py-12"><Spinner size="lg" /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-slate-50">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Title</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary hidden md:table-cell">Client</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-text-secondary hidden sm:table-cell">Priority</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {tickets.map((t) => (
                  <tr key={t._id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-text-primary max-w-xs truncate">{t.title}</td>
                    <td className="px-4 py-3 text-text-secondary hidden md:table-cell">{t.clientId.name}</td>
                    <td className="px-4 py-3"><Badge value={t.status} variant="status" /></td>
                    <td className="px-4 py-3 hidden sm:table-cell"><Badge value={t.priority} variant="priority" /></td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setDeleteTarget({ type: 'ticket', id: t._id, name: t.title })}
                        className="p-1.5 text-text-secondary hover:text-rose-500 transition-colors"
                        aria-label="Delete ticket"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      )}

      {/* Delete confirmation modal */}
      <Modal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title={`Delete ${deleteTarget?.type === 'user' ? 'User' : 'Ticket'}?`}
      >
        <p className="text-sm text-text-secondary mb-5">
          Are you sure you want to delete <span className="font-medium text-text-primary">"{deleteTarget?.name}"</span>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="danger" isLoading={isDeleting} onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
