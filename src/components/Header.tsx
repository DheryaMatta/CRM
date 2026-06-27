'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Link from 'next/link';

interface HeaderProps {
  onMenuToggle: () => void;
  title: string;
}

export const Header: React.FC<HeaderProps> = ({ onMenuToggle, title }) => {
  const { theme, toggleTheme } = useTheme();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, text: 'Elena Rodriguez scored a lead win probability of 85%', time: '2h ago' },
    { id: 2, text: 'Acme Corp proposal reviewed by Sarah Chen', time: 'Yesterday' },
    { id: 3, text: 'Scheduled meeting: Prep for Initech Sync', time: 'In 45m' },
  ];

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-outline-variant dark:border-outline bg-surface dark:bg-inverse-surface px-md md:px-xl shadow-xs">
      {/* Left side: Hamburger menu & Title */}
      <div className="flex items-center gap-md">
        <button
          className="block md:hidden p-2 rounded-full hover:bg-surface-container-low text-on-surface-variant cursor-pointer"
          onClick={onMenuToggle}
          aria-label="Toggle Navigation Sidebar"
        >
          <span className="material-symbols-outlined">menu</span>
        </button>
        <h2 className="font-headline-md text-headline-sm md:text-headline-md text-on-surface dark:text-inverse-on-surface font-bold">
          {title}
        </h2>
      </div>

      {/* Right side: Search, Theme, Notifications, Avatar */}
      <div className="flex items-center gap-sm md:gap-md">
        {/* Search Bar - hidden on small mobile */}
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            type="text"
            placeholder="Search contacts, deals..."
            className="pl-10 pr-4 py-2 bg-surface-container-lowest dark:bg-surface-container-low rounded-xl border border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-body-sm w-48 lg:w-64"
          />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low dark:hover:bg-surface-dim transition-colors text-on-surface-variant cursor-pointer"
          aria-label="Toggle color mode"
        >
          <span className="material-symbols-outlined">
            {theme === 'light' ? 'dark_mode' : 'light_mode'}
          </span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container-low dark:hover:bg-surface-dim transition-colors text-on-surface-variant relative cursor-pointer"
            aria-label="Toggle notifications list"
          >
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full"></span>
          </button>

          {showNotifications && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowNotifications(false)}
              />
              <div className="absolute right-0 mt-2 z-50 w-80 rounded-xl border border-outline-variant bg-surface dark:bg-inverse-surface p-md shadow-lg">
                <div className="flex justify-between items-center border-b border-outline-variant pb-xs mb-sm">
                  <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Notifications</h4>
                  <button className="text-primary font-label-sm text-label-sm hover:underline">Mark read</button>
                </div>
                <ul className="space-y-sm">
                  {notifications.map((n) => (
                    <li key={n.id} className="border-b border-outline-variant/30 pb-xs last:border-0 last:pb-0">
                      <p className="font-body-sm text-body-sm text-on-surface dark:text-inverse-on-surface leading-tight">
                        {n.text}
                      </p>
                      <span className="font-label-sm text-label-sm text-on-surface-variant mt-xs block">
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
          className="w-10 h-10 rounded-full bg-surface-container-high overflow-hidden border border-outline-variant cursor-pointer hover:border-primary/50 transition-colors"
        >
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDWpN61yLz6897Gco2CkVIZEkHOH54bjcqOw1ZLsPJWx4FP_xtnX7dyM0yzu-Bx5-yPNt5gP_4tfZPyJS6KRQOpQx0lnwlJr6F6gvTiz1uinYc1ldsOXL7b2a5dNMLn_YWhozDrwdypKUThrBf_FD2J159FSlL7O5M5FW2IlcTxc_xMIpyc964ZqE8R426ReRMpFN3H8QzkmcOQD6i0VQgSbEdmRwX_0l9EnozeRoXzXUG-XAH-xRqK4pNka9DG0vnvZU5keeq5Fnqc"
            alt="User profile photo"
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
    </header>
  );
};
