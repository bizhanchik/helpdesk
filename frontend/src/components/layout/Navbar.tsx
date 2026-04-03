import { useState } from 'react';
import { Menu, X, Headphones, LogOut, User } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Badge from '../ui/Badge';

interface NavbarProps {
  onMenuToggle: () => void;
  isSidebarOpen: boolean;
}

const Navbar = ({ onMenuToggle, isSidebarOpen }: NavbarProps) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white border-b border-border h-16 flex items-center px-4 gap-4">
      {/* Mobile hamburger */}
      <button
        onClick={onMenuToggle}
        className="p-2 rounded-lg text-text-secondary hover:bg-slate-100 transition-colors lg:hidden"
        aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Headphones size={16} className="text-white" />
        </div>
        <span className="font-serif font-semibold text-text-primary text-lg hidden sm:block">
          HelpDesk Flow
        </span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* User menu */}
      <div className="relative">
        <button
          onClick={() => setUserMenuOpen((v) => !v)}
          className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-100 transition-colors"
          aria-label="User menu"
        >
          <div className="w-8 h-8 bg-primary-light rounded-full flex items-center justify-center">
            <User size={15} className="text-primary" />
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-text-primary leading-tight">{user?.name}</p>
            <p className="text-xs text-text-secondary">{user?.email}</p>
          </div>
        </button>

        {/* Dropdown */}
        {userMenuOpen && (
          <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-border shadow-md py-2 z-50">
            <div className="px-3 py-2 border-b border-border mb-1">
              <p className="text-sm font-medium text-text-primary">{user?.name}</p>
              <div className="mt-1">
                <Badge value={user?.role ?? ''} variant="role" />
              </div>
            </div>
            <button
              onClick={() => { setUserMenuOpen(false); logout(); }}
              className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
