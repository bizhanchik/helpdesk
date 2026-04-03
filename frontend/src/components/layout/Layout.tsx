import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

/** Root layout: fixed Navbar + collapsible Sidebar + scrollable main content area */
const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Navbar
        onMenuToggle={() => setSidebarOpen((v) => !v)}
        isSidebarOpen={sidebarOpen}
      />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main content — offset for fixed navbar (h-16) and sidebar (w-60 on lg+) */}
      <main className="pt-16 lg:pl-60 min-h-screen">
        <div className="p-4 sm:p-6 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
