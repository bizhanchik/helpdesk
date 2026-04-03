import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Ticket, PlusCircle, Users, BarChart3, X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const clientLinks = [
  { to: '/tickets', icon: LayoutDashboard, label: 'My Tickets' },
  { to: '/tickets/new', icon: PlusCircle, label: 'New Ticket' },
];

const agentLinks = [
  { to: '/agent', icon: Ticket, label: 'All Tickets' },
];

const adminLinks = [
  { to: '/admin', icon: BarChart3, label: 'Dashboard' },
  { to: '/agent', icon: Ticket, label: 'All Tickets' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { user } = useAuth();

  const links =
    user?.role === 'admin' ? adminLinks :
    user?.role === 'agent' ? agentLinks :
    clientLinks;

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed top-16 left-0 bottom-0 w-60 bg-white border-r border-border z-20
          flex flex-col py-4
          transition-transform duration-200
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1 rounded-lg text-text-secondary hover:bg-slate-100 lg:hidden"
          aria-label="Close sidebar"
        >
          <X size={16} />
        </button>

        <nav className="flex-1 px-3">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wider px-3 mb-2">
            Navigation
          </p>
          <ul className="space-y-1">
            {links.map(({ to, icon: Icon, label }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-primary-light text-primary'
                        : 'text-text-secondary hover:bg-slate-100 hover:text-text-primary'
                    }`
                  }
                >
                  <Icon size={17} />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Role indicator at bottom */}
        <div className="px-4 py-3 border-t border-border mt-2">
          <p className="text-xs text-text-secondary">Signed in as</p>
          <p className="text-sm font-medium text-text-primary capitalize">{user?.role}</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
