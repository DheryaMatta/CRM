'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, UserPlus, ChevronRight, X } from 'lucide-react';
import { contactsAPI } from '@/lib/api';

export default function ContactsDirectory() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // Form states for new contact
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<'Lead' | 'Prospect' | 'Customer'>('Lead');
  const [score, setScore] = useState(70);
  const [about, setAbout] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  const fetchContacts = async () => {
    setLoading(true);
    const result = await contactsAPI.list({ search });
    if (result.data) {
      setContacts(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    // Standard profile picture fallback
    const avatar = 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKO1uumHm550LeYv-jv9HCJW12b821kQyvwKL1yeBUIYpGlkNlZXLW2WczP4b_LeJfOykcgCQ-cWBYDvtw4LtCymvjU8YoG3oupOIVERh5-_XAdVrn3SWoeL3_ospW8nzb4GzkaCxd6Vlf-beKqUGrLKzauOcoep7Fa3d5-DUQ11bXA2o9M3JQsRaG0qi5LV_JhXgSRgasZwalQo7IbLG005qr2o7jzbkKCHl-gewTB38BODPw0UWISJiXi35rHxIj0rGtup44K-rv';

    await contactsAPI.create({
      name,
      email,
      phone: phone || '+1 (555) 000-0000',
      company: company || 'Independent',
      position: role || 'Professional',
      status: status.toLowerCase(),
      avatar_url: avatar,
      notes: about || 'New lead added to system.',
      tags: tags.length > 0 ? tags : ['New Lead'],
    });

    // Reset form & close modal
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setRole('');
    setLocation('');
    setStatus('Lead');
    setScore(70);
    setAbout('');
    setTagsInput('');
    setModalOpen(false);
    fetchContacts();
  };

  return (
    <div className="space-y-lg">
      {/* Top Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-lg">
        <div>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Manage and organize your client relationships.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-sm w-full md:w-auto">
          {/* Search box */}
          <div className="relative w-full sm:w-80">
            <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-xl pr-sm py-sm bg-surface-container-lowest dark:bg-surface-container-low border border-outline-variant rounded-xl focus:border-primary focus:ring-2 focus:ring-primary-container/20 font-body-md text-body-md text-on-surface dark:text-inverse-on-surface placeholder:text-on-surface-variant transition-all outline-none"
            />
          </div>
          {/* Add Contact Button */}
          <button
            onClick={() => setModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-sm bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-xl transition-colors shrink-0 h-[48px] cursor-pointer"
          >
            <UserPlus size={20} />
            Add Contact
          </button>
        </div>
      </div>

      {/* Contacts Table Card */}
      <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-outline-variant dark:border-outline bg-surface-container-low dark:bg-surface-dim">
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-semibold">Name</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-semibold">Company</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-semibold">Status</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-semibold">Lead Score</th>
                <th className="py-sm px-md font-label-md text-label-md text-on-surface-variant font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface">
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-xl text-on-surface-variant">
                    Loading contacts...
                  </td>
                </tr>
              ) : contacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-xl text-on-surface-variant">
                    No contacts found matching search terms.
                  </td>
                </tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c.id} className="border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low/20 transition-colors group">
                    <td className="py-sm px-md">
                      <Link href={`/contacts/${c.id}`} className="flex items-center gap-sm group-hover:text-primary transition-all">
                        <img
                          src={c.avatar_url || c.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKO1uumHm550LeYv-jv9HCJW12b821kQyvwKL1yeBUIYpGlkNlZXLW2WczP4b_LeJfOykcgCQ-cWBYDvtw4LtCymvjU8YoG3oupOIVERh5-_XAdVrn3SWoeL3_ospW8nzb4GzkaCxd6Vlf-beKqUGrLKzauOcoep7Fa3d5-DUQ11bXA2o9M3JQsRaG0qi5LV_JhXgSRgasZwalQo7IbLG005qr2o7jzbkKCHl-gewTB38BODPw0UWISJiXi35rHxIj0rGtup44K-rv'}
                          alt={c.name || 'Contact'}
                          className="w-10 h-10 rounded-full object-cover border border-outline-variant"
                        />
                        <div>
                          <div className="font-semibold">{c.name}</div>
                          <div className="font-label-sm text-label-sm text-on-surface-variant">{c.email}</div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-sm px-md">{c.company}</td>
                    <td className="py-sm px-md">
                      <span
                        className={`inline-flex items-center px-sm py-base rounded-full font-label-sm text-label-sm ${
                          c.status?.toLowerCase() === 'lead'
                            ? 'bg-surface-container-high dark:bg-surface-dim text-primary border border-primary-fixed-dim/20'
                            : c.status?.toLowerCase() === 'prospect'
                            ? 'bg-secondary-container/40 dark:bg-secondary-container/10 text-on-secondary-container border border-secondary-fixed/20'
                            : 'bg-tertiary-container/30 dark:bg-tertiary-container/10 text-on-tertiary-container border border-tertiary-fixed/20'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                    <td className="py-sm px-md">
                      <div className="flex items-center gap-sm">
                        <div className="font-semibold w-6">{c.score || 50}</div>
                        <div className="w-24 h-2 bg-surface-container-high dark:bg-surface-dim rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              (c.score || 50) >= 80 ? 'bg-primary' : (c.score || 50) >= 60 ? 'bg-secondary' : 'bg-tertiary'
                            }`}
                            style={{ width: `${c.score || 50}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-sm px-md text-right">
                      <Link href={`/contacts/${c.id}`} className="text-on-surface-variant hover:text-primary transition-colors p-xs rounded-lg hover:bg-surface-container-low dark:hover:bg-surface-dim inline-block">
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-md py-sm border-t border-outline-variant dark:border-outline flex items-center justify-between text-on-surface-variant bg-surface-container-low/20">
          <span className="font-body-sm text-body-sm">
            Showing {contacts.length} contacts
          </span>
        </div>
      </div>

      {/* Add Contact Modal Dialog */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-sm">
          {/* Overlay backdrop */}
          <div
            className="fixed inset-0 bg-on-background/50 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />

          {/* Form Content */}
          <div className="relative w-full max-w-[512px] bg-surface dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md md:p-lg shadow-xl z-10 animate-scale-up">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-3">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface">
                Add New Contact
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Elena Rodriguez"
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. elena@techflow.io"
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Company</label>
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. TechFlow Inc."
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Job Role</label>
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Lead Developer"
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Phone Number</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. +1 (555) 123-4567"
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Austin, TX"
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                  >
                    <option value="Lead">Lead</option>
                    <option value="Prospect">Prospect</option>
                    <option value="Customer">Customer</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Lead Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. VIP, Enterprise, Technical"
                  className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface">About / Notes</label>
                <textarea
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="Additional context about this relationship..."
                  rows={3}
                  className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-body-sm text-on-surface dark:text-inverse-on-surface"
                />
              </div>

              <div className="flex justify-end gap-sm pt-md">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-md py-2 border border-outline-variant text-on-surface-variant hover:bg-surface-container-low rounded-lg transition-colors font-label-md cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-md py-2 bg-primary hover:bg-primary-container text-on-primary rounded-lg transition-colors font-label-md cursor-pointer"
                >
                  Create Contact
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
