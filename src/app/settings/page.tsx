'use client';

import React, { useState } from 'react';
import { User, Puzzle, Shield, CreditCard, Camera } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'integrations' | 'security' | 'billing'>('profile');

  // Profile Form state
  const [firstName, setFirstName] = useState('Jane');
  const [lastName, setLastName] = useState('Doe');
  const [email, setEmail] = useState('jane.doe@nexus.crm');
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  // Integrations state
  const [slackConnected, setSlackConnected] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile & Account', icon: <User size={20} /> },
    { id: 'integrations', label: 'Integrations', icon: <Puzzle size={20} /> },
    { id: 'security', label: 'Security', icon: <Shield size={20} /> },
    { id: 'billing', label: 'Billing', icon: <CreditCard size={20} /> },
  ];

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    setTimeout(() => {
      setSaveStatus('Changes saved successfully!');
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg animate-fade-in">
      {/* Left Column: Navigation Quick Actions */}
      <div className="lg:col-span-1 space-y-sm">
        <div className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-2 flex flex-col gap-1 shadow-sm">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left transition-colors cursor-pointer ${activeTab === tab.id
                ? 'bg-surface-container-low dark:bg-surface-dim text-primary font-semibold'
                : 'hover:bg-surface-container-low/50 dark:hover:bg-surface-dim/30 text-on-surface-variant'
                }`}
            >
              {tab.icon}
              <span className="font-body-md text-body-md">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Settings Content */}
      <div className="lg:col-span-2 space-y-lg">
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <section className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md shadow-sm space-y-md">
            <h3 className="font-headline-md text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md border-b border-outline-variant dark:border-outline pb-3 font-bold">
              Profile Information
            </h3>

            {/* Avatar block */}
            <div className="flex items-start gap-md mb-md flex-wrap">
              <div className="relative group cursor-pointer">
                <div className="w-24 h-24 rounded-full bg-surface-container-high dark:bg-surface-dim overflow-hidden border border-outline-variant flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCAExnj9wgXkCkLsf7P3pTq_wXGW8Cqf2vaZK_JzG6_zNRMT-4DTarYr3QyFkAVewBzPqGEg2dZrnvcdryqQrkPoW9hFm4VevHnvohJMPq1i1xu-YS8LwOMhPJPHpuB_KIKY1dMMBL_tMoF492qIxOFKIjwkoWjyebhHBiXCCJJ49sIEYSsAlAMjH3-sKrQlUyQzeuUJLhS7E4U61kB3Fvm0arD_W4ZAzKLtSgsz90u4YW29l57jjHIBR2u-Qs-ycAIFiCGQ7Wc677m"
                    alt="Current profile"
                  />
                </div>
                <div className="absolute inset-0 bg-on-surface/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="text-white" size={24} />
                </div>
              </div>
              <div className="flex flex-col justify-center h-24 min-w-[200px]">
                <h4 className="font-body-md font-semibold text-on-surface dark:text-inverse-on-surface">Profile Picture</h4>
                <p className="text-label-sm text-on-surface-variant mt-1">JPG, GIF or PNG. Max size of 800K</p>
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => alert('Simulating local image upload trigger...')}
                    className="px-4 py-2 bg-surface-container-low dark:bg-surface-dim text-primary font-label-md rounded-lg hover:bg-surface-variant transition-colors border border-primary-fixed-dim/20 cursor-pointer"
                  >
                    Upload New
                  </button>
                  <button
                    onClick={() => alert('Profile image reset to default.')}
                    className="px-4 py-2 text-on-surface-variant font-label-md rounded-lg hover:bg-surface-container-low transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>

            {/* Profile inputs */}
            <form onSubmit={handleProfileSave} className="grid grid-cols-1 md:grid-cols-2 gap-md pt-sm">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface dark:text-inverse-on-surface">First Name</label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="px-sm py-3 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface dark:text-inverse-on-surface"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface dark:text-inverse-on-surface">Last Name</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="px-sm py-3 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface dark:text-inverse-on-surface"
                />
              </div>
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="font-label-md text-on-surface dark:text-inverse-on-surface">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-sm py-3 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-md text-on-surface dark:text-inverse-on-surface"
                />
              </div>

              {/* Status / feedback toast */}
              <div className="md:col-span-2 flex justify-between items-center mt-md">
                <span className="text-body-sm font-semibold text-primary">{saveStatus}</span>
                <button
                  type="submit"
                  className="px-6 py-3 bg-primary text-on-primary font-label-md rounded-lg hover:bg-primary/95 transition-colors shadow-xs cursor-pointer font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Integrations Tab */}
        {activeTab === 'integrations' && (
          <section className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md shadow-sm space-y-md">
            <div className="mb-md border-b border-outline-variant dark:border-outline pb-3">
              <h3 className="font-headline-md text-headline-sm text-on-surface dark:text-inverse-on-surface font-bold">Connected Apps</h3>
              <p className="text-body-sm text-on-surface-variant mt-1">Manage external services connected to your CRM workspace.</p>
            </div>

            <div className="space-y-4">
              {/* Slack Integration Card */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-outline-variant dark:border-outline bg-surface dark:bg-surface-dim/20 shadow-xs">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white border border-outline-variant flex items-center justify-center shadow-xs p-2 shrink-0">
                    <img
                      alt="Slack"
                      className="w-full h-full object-contain"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCycFm5l3pVkVo9vBPLtPnDlGeyfahbTCrdU6uQjhDxJ-djYExJM6iI_0v7pYyrUar2UBWIPMdL6yuKKd25XNFmoTl645QlKlCVAXLaJ0mzfKTTd7uXcK5LuGIEXWElnkhOPJ7WCoAk53Bzkjw5g2pAU5GVtfcvCXAcgW8xiMLtsPdyFAdM8kZom8wDoCkfIZerIKEUKpou5_DyGF_WJ5-HrHhNOVaCeq04ymCq43kqQ5HHEyX2L9_6Y6HEYWMhTTRpynZg8E1hK2hD"
                    />
                  </div>
                  <div>
                    <h4 className="font-body-md font-semibold text-on-surface dark:text-inverse-on-surface">Slack</h4>
                    <p className="text-label-sm text-on-surface-variant">Send notification feeds to channels</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-label-sm px-2 py-1 rounded-full font-medium ${slackConnected
                      ? 'text-secondary bg-secondary-container/40 dark:bg-secondary-container/10'
                      : 'text-on-surface-variant bg-surface-container'
                      }`}
                  >
                    {slackConnected ? 'Connected' : 'Disconnected'}
                  </span>
                  {/* Toggle switch */}
                  <button
                    onClick={() => setSlackConnected(!slackConnected)}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out outline-none ${slackConnected ? 'bg-primary' : 'bg-outline-variant'
                      }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${slackConnected ? 'translate-x-5' : 'translate-x-0'
                        }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Security Tab (Placeholder) */}
        {activeTab === 'security' && (
          <section className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md shadow-sm space-y-md">
            <h3 className="font-headline-md text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md border-b border-outline-variant dark:border-outline pb-3 font-bold">
              Security Preferences
            </h3>
            <div className="space-y-sm">
              <div className="flex flex-col gap-2">
                <label className="font-label-md text-on-surface dark:text-inverse-on-surface font-semibold">Change Password</label>
                <input
                  type="password"
                  placeholder="Current Password"
                  className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low text-body-sm outline-none w-full max-w-md"
                />
                <input
                  type="password"
                  placeholder="New Password"
                  className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low text-body-sm outline-none w-full max-w-md"
                />
              </div>
              <div className="flex flex-col gap-2 pt-sm">
                <label className="font-label-md text-on-surface dark:text-inverse-on-surface font-semibold">Two-Factor Authentication</label>
                <p className="text-body-sm text-on-surface-variant leading-relaxed">
                  Protect your CRM workspace with an additional layer of security code validation.
                </p>
                <button
                  type="button"
                  onClick={() => alert('Initiating Two-Factor authentication wizard...')}
                  className="px-4 py-2 bg-primary text-on-primary rounded-lg font-label-sm w-44 hover:bg-primary-container transition-colors cursor-pointer font-bold"
                >
                  Enable 2FA Verification
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Billing Tab (Placeholder) */}
        {activeTab === 'billing' && (
          <section className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md shadow-sm space-y-md">
            <h3 className="font-headline-md text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md border-b border-outline-variant dark:border-outline pb-3 font-bold">
              Billing &amp; Subscription
            </h3>
            <div className="flex justify-between items-center bg-primary-container/20 dark:bg-primary/10 border border-primary/20 p-md rounded-xl">
              <div>
                <h4 className="font-body-md font-bold text-on-surface dark:text-inverse-on-surface">Nexus Enterprise CRM Plan</h4>
                <p className="text-body-sm text-on-surface-variant mt-1">Unlimited pipelines, up to 10 users, premium metrics.</p>
              </div>
              <div className="text-right">
                <span className="font-display text-headline-lg font-bold text-primary">$99/mo</span>
                <span className="text-label-sm text-on-surface-variant block mt-1">Renews Jun 30, 2026</span>
              </div>
            </div>
            <div className="space-y-sm pt-sm">
              <h4 className="font-label-md text-on-surface dark:text-inverse-on-surface font-bold">Payment Method</h4>
              <div className="flex justify-between items-center border border-outline-variant/60 bg-surface dark:bg-surface-dim/20 p-sm rounded-lg w-full max-w-md">
                <div className="flex items-center gap-sm">
                  <CreditCard className="text-secondary" size={24} />
                  <span className="font-body-sm">Visa ending in 4242</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert('Modifying billing details...')}
                  className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                >
                  Update
                </button>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
