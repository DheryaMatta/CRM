'use client';

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { usePathname } from 'next/navigation';

export const ClientShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Helper to determine page title
  const getPageTitle = () => {
    if (pathname === '/') return 'Dashboard';
    if (pathname.startsWith('/contacts')) {
      if (pathname.split('/').length > 2) {
        return 'Contact Profile';
      }
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
    <div className="min-h-screen bg-background dark:bg-background/95 transition-colors duration-300">
      {/* Responsive Sidebar Drawer */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex flex-col md:pl-64 min-h-screen">
        {/* Main Header */}
        <Header onMenuToggle={() => setSidebarOpen(true)} title={getPageTitle()} />

        {/* Scrollable Content Page Canvas */}
        <main className="flex-1 p-sm md:p-xl flex flex-col gap-lg animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
