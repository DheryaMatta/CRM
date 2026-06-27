'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  KanbanSquare, 
  Calendar, 
  LineChart, 
  Lightbulb, 
  Settings, 
  HelpCircle,
  Hexagon,
  X
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, setIsOpen }) => {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Contacts', path: '/contacts', icon: Users },
    { name: 'Pipeline', path: '/pipeline', icon: KanbanSquare },
    { name: 'Calendar', path: '/calendar', icon: Calendar },
    { name: 'Analytics', path: '/analytics', icon: LineChart },
    { name: 'AI Insights', path: '/ai-insights', icon: Lightbulb },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-outline-variant bg-surface dark:bg-surface-dim transition-transform duration-300 md:static md:translate-x-0 shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-[72px] items-center justify-between px-6 border-b border-outline-variant shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-on-primary">
              <Hexagon size={20} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface">Nexus CRM</h1>
            </div>
          </div>
          {/* Close button on mobile */}
          <button
            className="md:hidden rounded-full p-1 text-on-surface-variant hover:bg-surface-container"
            onClick={() => setIsOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 overflow-x-hidden">
          <ul className="flex flex-col gap-1">
            {navItems.map((item) => {
              const active = isActive(item.path);
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    href={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`group flex items-center px-3 py-2.5 rounded-md transition-all duration-200 font-body-md text-body-md ${
                      active
                        ? 'bg-primary text-on-primary font-medium shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                    }`}
                  >
                    <Icon 
                      size={18} 
                      className={`mr-3 shrink-0 ${active ? 'opacity-100' : 'opacity-70 group-hover:opacity-100 transition-opacity'}`} 
                    />
                    <span className="truncate">{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer Support */}
        <div className="p-4 border-t border-outline-variant shrink-0">
          <a
            href="#"
            className="group flex items-center px-3 py-2.5 rounded-md transition-all duration-200 text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
          >
            <HelpCircle size={18} className="mr-3 opacity-70 group-hover:opacity-100 transition-opacity shrink-0" />
            <span className="font-body-md text-body-md truncate">Help Center</span>
          </a>
        </div>
      </aside>
    </>
  );
};
