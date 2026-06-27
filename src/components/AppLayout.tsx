'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { usePathname } from 'next/navigation';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Helper to determine page title based on routing
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/contacts')) {
      if (pathname.split('/').length > 2) return 'Contact Profile';
      return 'Contacts Directory';
    }
    if (pathname.startsWith('/pipeline')) return 'Sales Pipeline';
    if (pathname.startsWith('/calendar')) return 'Calendar & Tasks';
    if (pathname.startsWith('/analytics')) return 'Analytics Center';
    if (pathname.startsWith('/ai-insights')) return 'AI Insights';
    if (pathname.startsWith('/settings')) return 'Settings';
    return 'Nexus CRM';
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar - Fixed width on Desktop, Off-canvas on Mobile */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Column */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        {/* Top Navbar */}
        <TopNavbar 
          title={getPageTitle()} 
          onMenuToggle={() => setSidebarOpen(true)} 
        />

        {/* Scrollable Main Content Area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 bg-background">
          <div className="mx-auto w-full animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
