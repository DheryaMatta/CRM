'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Link from 'next/link';
import { Search, Bell, Menu, Sun, Moon } from 'lucide-react';

interface TopNavbarProps {
  onMenuToggle: () => void;
  title: string;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({ onMenuToggle, title }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Elena Rodriguez scored a lead win probability of 85%', time: '2h ago' },
    { id: 2, text: 'Acme Corp proposal reviewed by Sarah Chen', time: 'Yesterday' },
  ];

  return (
    <header className="flex h-[72px] shrink-0 items-center justify-between border-b border-outline-variant bg-surface dark:bg-surface-dim px-4 md:px-8">
      {/* Left side: Hamburger (Mobile) & Title */}
      <div className="flex items-center gap-4 min-w-0">
        <button
          className="md:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container"
          onClick={onMenuToggle}
          aria-label="Toggle Navigation"
        >
          <Menu size={20} />
        </button>
        <h2 className="font-headline-sm text-headline-sm font-semibold text-on-surface truncate">
          {title}
        </h2>
      </div>

      {/* Right side: Search, Theme, Notifications, Avatar */}
      <div className="flex shrink-0 items-center gap-3 md:gap-4 pl-4">
        {/* Search Bar - Hidden on small mobile */}
        <div className="relative hidden sm:block w-full max-w-[350px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="text"
            placeholder="Search contacts, deals..."
            className="w-full lg:w-[350px] rounded-lg border border-outline-variant bg-surface-container-lowest py-2 pl-10 pr-4 font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
          aria-label="Toggle color mode"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        {/* Notifications */}
        <div className="relative shrink-0">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-outline-variant text-on-surface-variant hover:bg-surface-container transition-colors"
            aria-label="Notifications"
          >
            <Bell size={18} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-error ring-2 ring-surface"></span>
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 z-50 w-80 rounded-lg border border-outline-variant bg-surface p-4 shadow-md">
                <div className="flex items-center justify-between border-b border-outline-variant pb-2 mb-3">
                  <h4 className="font-label-md text-label-md font-medium text-on-surface">Notifications</h4>
                  <button className="text-primary font-label-sm text-label-sm hover:underline">Mark read</button>
                </div>
                <ul className="flex flex-col gap-3">
                  {notifications.map((n) => (
                    <li key={n.id} className="border-b border-outline-variant/50 pb-2 last:border-0 last:pb-0">
                      <p className="font-body-sm text-body-sm text-on-surface leading-tight mb-1">
                        {n.text}
                      </p>
                      <span className="font-label-sm text-label-sm text-on-surface-variant block">
                        {n.time}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Profile Avatar */}
        <Link
          href="/settings"
          className="shrink-0 h-10 w-10 overflow-hidden rounded-full border border-outline-variant hover:border-primary transition-colors"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWpN61yLz6897Gco2CkVIZEkHOH54bjcqOw1ZLsPJWx4FP_xtnX7dyM0yzu-Bx5-yPNt5gP_4tfZPyJS6KRQOpQx0lnwlJr6F6gvTiz1uinYc1ldsOXL7b2a5dNMLn_YWhozDrwdypKUThrBf_FD2J159FSlL7O5M5FW2IlcTxc_xMIpyc964ZqE8R426ReRMpFN3H8QzkmcOQD6i0VQgSbEdmRwX_0l9EnozeRoXzXUG-XAH-xRqK4pNka9DG0vnvZU5keeq5Fnqc"
            alt="User avatar"
            className="h-full w-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
};
