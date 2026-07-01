'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, ArrowLeft, MapPin, Mail, Phone, Radio, X, Calendar, StickyNote } from 'lucide-react';
import { contactsAPI, eventsAPI } from '@/lib/api';

export default function ContactProfile() {
  const { id } = useParams();
  const router = useRouter();

  const [contact, setContact] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const contactId = typeof id === 'string' ? id : '';

  useEffect(() => {
    if (contactId) {
      contactsAPI.get(contactId).then(res => {
        setContact(res.data);
        setLoading(false);
      });
    }
  }, [contactId]);

  // Active filter for timeline
  const [timelineFilter, setTimelineFilter] = useState<'all' | 'mail' | 'call'>('all');

  // Input states for logging new timeline event
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventContent, setNewEventContent] = useState('');
  const [newEventType, setNewEventType] = useState<'event' | 'mail' | 'call' | 'note'>('note');
  const [showLogForm, setShowLogForm] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant">
        <p>Loading contact details...</p>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant bg-surface rounded-xl border border-outline-variant">
        <AlertTriangle size={64} className="mb-4 text-error" />
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Contact Not Found</h3>
        <p className="font-body-md mt-2 mb-md">This contact doesn&apos;t exist or has been deleted.</p>
        <Link href="/contacts" className="px-md py-2 bg-primary text-on-primary rounded-lg font-label-md">
          Back to Contacts
        </Link>
      </div>
    );
  }

  // Filtered timeline events (using backend events)
  const timeline = contact.events || [];
  const filteredTimeline = timeline.filter((evt: any) => {
    if (timelineFilter === 'all') return true;
    return evt.type === timelineFilter;
  });

  const handleLogEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle || !newEventContent) return;

    await eventsAPI.create({
      title: newEventTitle,
      description: newEventContent,
      type: newEventType,
      contact_id: contact.id,
      start_time: new Date().toISOString()
    });

    setNewEventTitle('');
    setNewEventContent('');
    setNewEventType('note');
    setShowLogForm(false);
    
    // Refresh contact data to get the new event
    const res = await contactsAPI.get(contactId);
    if (res.data) setContact(res.data);
  };

  return (
    <div className="space-y-lg">
      {/* Desktop breadcrumb-like header */}
      <div className="flex items-center justify-between w-full pb-sm border-b border-outline-variant/50">
        <button
          onClick={() => router.push('/contacts')}
          className="flex items-center gap-xs hover:text-primary transition-colors text-on-surface-variant font-body-sm text-body-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back to Contacts</span>
        </button>
      </div>

      {/* Hero Card */}
      <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-lg border border-outline-variant dark:border-outline flex flex-col md:flex-row gap-lg items-start md:items-center justify-between shadow-xs">
        <div className="flex items-center gap-lg">
          <img
            src={contact.avatar_url || contact.avatar || 'https://lh3.googleusercontent.com/aida-public/AB6AXuCKO1uumHm550LeYv-jv9HCJW12b821kQyvwKL1yeBUIYpGlkNlZXLW2WczP4b_LeJfOykcgCQ-cWBYDvtw4LtCymvjU8YoG3oupOIVERh5-_XAdVrn3SWoeL3_ospW8nzb4GzkaCxd6Vlf-beKqUGrLKzauOcoep7Fa3d5-DUQ11bXA2o9M3JQsRaG0qi5LV_JhXgSRgasZwalQo7IbLG005qr2o7jzbkKCHl-gewTB38BODPw0UWISJiXi35rHxIj0rGtup44K-rv'}
            alt={contact.name || 'Contact'}
            className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-surface dark:border-surface-dim shadow-sm"
          />
          <div>
            <div className="flex items-center gap-sm mb-xs">
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">
                {contact.name}
              </h2>
              <span
                className={`px-3 py-1 rounded-full font-label-sm text-label-sm border ${
                  contact.status?.toLowerCase() === 'customer'
                    ? 'bg-[#d5e3fd] text-[#001f26] border-[#acedff]'
                    : contact.status?.toLowerCase() === 'prospect'
                    ? 'bg-[#ffe4cc] text-[#6b3100] border-[#ffb783]'
                    : 'bg-surface-container text-on-surface border-outline-variant'
                }`}
              >
                {contact.status}
              </span>
            </div>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-sm">
              {contact.position || contact.role} at <span className="font-semibold text-primary">{contact.company}</span>
            </p>
            <div className="flex flex-wrap gap-md text-on-surface-variant font-body-sm text-body-sm">
              <div className="flex items-center gap-xs">
                <MapPin size={16} />
                {contact.location || 'Remote'}
              </div>
              <div className="flex items-center gap-xs">
                <Mail size={16} />
                {contact.email || 'No email'}
              </div>
              <div className="flex items-center gap-xs">
                <Phone size={16} />
                {contact.phone || 'No phone'}
              </div>
            </div>
          </div>
        </div>

        {/* Call/Email Action Buttons */}
        <div className="flex gap-sm w-full md:w-auto">
          <a
            href={`mailto:${contact.email}`}
            className="flex-1 md:flex-none flex items-center justify-center gap-xs px-md py-3 rounded-[20px] border border-outline-variant dark:border-outline text-on-surface dark:text-inverse-on-surface hover:bg-surface-container-low transition-colors font-label-md text-label-md"
          >
            <Mail size={16} /> Email
          </a>
          <button
            onClick={async () => {
              await eventsAPI.create({
                type: 'call',
                title: 'Outbound Phone Call',
                description: 'Initiated outbound call to client.',
                contact_id: contact.id,
                start_time: new Date().toISOString()
              });
              alert(`Simulating phone call connection to ${contact.phone}... Call has been logged.`);
              const res = await contactsAPI.get(contactId);
              if (res.data) setContact(res.data);
            }}
            className="flex-1 md:flex-none flex items-center justify-center gap-xs px-md py-3 rounded-[20px] bg-primary text-on-primary hover:bg-primary-container transition-colors font-label-md text-label-md shadow-xs cursor-pointer"
          >
            <Phone size={16} /> Call
          </button>
        </div>
      </div>

      {/* Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">
        {/* Left Column - Details */}
        <div className="lg:col-span-1 space-y-lg">
          {/* Behavioral Signals */}
          <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md shadow-xs">
            <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md flex items-center gap-sm font-bold">
              <Radio className="text-primary mr-2" size={24} /> Recent Signals
            </h3>
            <ul className="space-y-md">
              <li className="flex gap-sm items-start">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-secondary ring-4 ring-secondary-container/20 shrink-0"></div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface font-semibold">
                    Visited <span className="text-primary font-bold">Enterprise Pricing</span> page
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">2 hours ago</p>
                </div>
              </li>
              <li className="flex gap-sm items-start">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-outline ring-4 ring-outline-variant/30 shrink-0"></div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface font-medium">
                    Downloaded <span className="font-semibold">Q3 Case Study</span>
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">Yesterday</p>
                </div>
              </li>
              <li className="flex gap-sm items-start">
                <div className="mt-1.5 w-2.5 h-2.5 rounded-full bg-outline ring-4 ring-outline-variant/30 shrink-0"></div>
                <div>
                  <p className="font-body-md text-body-md text-on-surface dark:text-inverse-on-surface font-medium">
                    Opened email <span className="font-semibold">&quot;New feature rollout&quot;</span>
                  </p>
                  <p className="font-label-sm text-label-sm text-on-surface-variant mt-xs">3 days ago</p>
                </div>
              </li>
            </ul>
          </div>

          {/* About & Tags */}
          <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md shadow-xs space-y-md">
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface font-bold mb-sm">About</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {contact.notes || contact.about || 'No additional notes.'}
              </p>
            </div>
            <div>
              <div className="flex flex-wrap gap-2">
                {(contact.tags || []).map((tag: string) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-surface-container-low dark:bg-surface-dim text-on-surface dark:text-inverse-on-surface font-label-sm text-label-sm border border-outline-variant dark:border-outline"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - History timeline & Logging */}
        <div className="lg:col-span-2 space-y-lg">
          <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md shadow-xs">
            {/* Timeline header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-sm mb-lg pb-sm border-b border-outline-variant dark:border-outline">
              <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface font-bold">
                Interaction History
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setTimelineFilter('all')}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${
                    timelineFilter === 'all'
                      ? 'text-primary bg-primary-container/20 font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setTimelineFilter('mail')}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${
                    timelineFilter === 'mail'
                      ? 'text-primary bg-primary-container/20 font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  Emails
                </button>
                <button
                  onClick={() => setTimelineFilter('call')}
                  className={`px-3 py-1.5 rounded-lg font-label-sm text-label-sm transition-all ${
                    timelineFilter === 'call'
                      ? 'text-primary bg-primary-container/20 font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  Calls
                </button>
                <button
                  onClick={() => setShowLogForm(!showLogForm)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-label-sm hover:bg-primary-container hover:text-on-primary-container transition-all"
                >
                  Log Action
                </button>
              </div>
            </div>

            {/* Quick Log Form */}
            {showLogForm && (
              <form
                onSubmit={handleLogEvent}
                className="mb-lg p-md border border-primary/20 bg-surface-container-low dark:bg-surface-dim rounded-xl space-y-sm animate-scale-up"
              >
                <div className="flex justify-between items-center">
                  <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold">Log New Action</h4>
                  <button
                    type="button"
                    onClick={() => setShowLogForm(false)}
                    className="text-on-surface-variant p-0.5 rounded-full hover:bg-surface-container-high"
                  >
                    <X size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-sm">
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm">Action Type</label>
                    <select
                      value={newEventType}
                      onChange={(e) => setNewEventType(e.target.value as any)}
                      className="px-sm py-1.5 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-lowest outline-none font-body-sm"
                    >
                      <option value="note">Internal Note</option>
                      <option value="call">Phone Call</option>
                      <option value="mail">Email Conversation</option>
                      <option value="event">Client Meeting</option>
                    </select>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-label-sm text-label-sm">Title</label>
                    <input
                      type="text"
                      required
                      value={newEventTitle}
                      onChange={(e) => setNewEventTitle(e.target.value)}
                      placeholder="e.g. Pricing negotiation sync"
                      className="px-sm py-1.5 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-lowest outline-none font-body-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-sm text-label-sm">Interaction Summary</label>
                  <textarea
                    required
                    value={newEventContent}
                    onChange={(e) => setNewEventContent(e.target.value)}
                    placeholder="Enter key items discussed, action items, or feedback..."
                    rows={3}
                    className="px-sm py-1.5 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-lowest outline-none font-body-sm"
                  />
                </div>
                <div className="flex justify-end gap-sm pt-xs">
                  <button
                    type="button"
                    onClick={() => setShowLogForm(false)}
                    className="px-sm py-1.5 border border-outline-variant text-on-surface-variant hover:bg-surface-container rounded-lg text-label-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-sm py-1.5 bg-primary text-on-primary rounded-lg hover:bg-primary-container transition-colors text-label-sm font-semibold"
                  >
                    Log Event
                  </button>
                </div>
              </form>
            )}

            {/* Timeline Tree */}
            <div className="relative pl-6 space-y-lg before:absolute before:inset-y-0 before:left-2.5 before:w-px before:bg-outline-variant dark:before:bg-outline">
              {filteredTimeline.length === 0 ? (
                <div className="py-md text-center text-on-surface-variant font-body-sm">
                  No timeline records found for this filter.
                </div>
              ) : (
                filteredTimeline.map((evt) => (
                  <div key={evt.id} className="relative">
                    {/* Circle icon marker */}
                    <div
                      className={`absolute -left-9 w-6 h-6 rounded-full flex items-center justify-center border-4 border-surface-container-lowest dark:border-inverse-surface ${
                        evt.type === 'event'
                          ? 'bg-tertiary-container text-on-tertiary-container'
                          : evt.type === 'mail'
                          ? 'bg-secondary text-on-secondary'
                          : evt.type === 'call'
                          ? 'bg-primary text-on-primary'
                          : 'bg-outline-variant text-on-surface-variant'
                      }`}
                    >
                      {evt.type === 'event'
                        ? <Calendar size={12} />
                        : evt.type === 'mail'
                        ? <Mail size={12} />
                        : evt.type === 'call'
                        ? <Phone size={12} />
                        : <StickyNote size={12} />}
                    </div>

                    {/* Timeline card content */}
                    <div className="bg-surface-container-low dark:bg-surface-dim/40 rounded-lg p-md border border-outline-variant/30">
                      <div className="flex justify-between items-start mb-sm gap-xs flex-wrap">
                        <h4 className="font-body-md text-body-md font-semibold text-on-surface dark:text-inverse-on-surface">
                          {evt.title}
                        </h4>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">{new Date(evt.start_time).toLocaleString()}</span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed mb-sm whitespace-pre-line">
                        {evt.description || evt.content}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-label-sm text-[10px] font-bold">
                          {((evt.author || 'Me').split(' ').map((n: string) => n[0]).join(''))}
                        </span>
                        <span className="font-label-sm text-label-sm text-on-surface-variant">
                          Logged by {evt.author || 'System'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
