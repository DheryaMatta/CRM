'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface TimelineEvent {
  id: string;
  type: 'event' | 'mail' | 'call' | 'note';
  title: string;
  content: string;
  date: string;
  author: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  role: string;
  location: string;
  status: 'Lead' | 'Prospect' | 'Customer';
  score: number;
  avatar: string;
  about: string;
  tags: string[];
  timeline: TimelineEvent[];
}

export interface Deal {
  id: string;
  name: string;
  value: number;
  stage: 'Discovery' | 'Proposal' | 'Negotiation' | 'Closed Won';
  contactName: string;
  priority: 'Low' | 'Medium' | 'High';
  daysActive: number;
}

export interface CRMTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'completed';
  category: 'High Intent' | 'Action Needed' | 'Meeting' | 'Info';
  time: string;
}

interface CRMContextType {
  contacts: Contact[];
  deals: Deal[];
  tasks: CRMTask[];
  mrr: number;
  activeDealsCount: number;
  winRate: number;
  addContact: (contact: Omit<Contact, 'id' | 'timeline'>) => void;
  updateContact: (id: string, updatedContact: Partial<Contact>) => void;
  addTimelineEvent: (contactId: string, event: Omit<TimelineEvent, 'id' | 'date'>) => void;
  addDeal: (deal: Omit<Deal, 'id'>) => void;
  moveDeal: (dealId: string, newStage: Deal['stage']) => void;
  addTask: (task: Omit<CRMTask, 'id' | 'status'>) => void;
  toggleTask: (taskId: string) => void;
}

const initialContacts: Contact[] = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@techflow.io',
    phone: '+1 (555) 019-2834',
    company: 'TechFlow',
    role: 'VP of Engineering',
    location: 'San Francisco, CA',
    status: 'Customer',
    score: 98,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtW_OOkN5ry6WNuvnKxUSelDO-k7zebdfl6zZOPg-sG_9e8R5EMQbJK-6JVp-UoSkHE36Vhl8JR4_SmDcA_vJCPQEZUJVLITOEO-fsNiDV721SEXWIV0CmRhyFvNtOgUE8I66vB_Vl4GM0Ddn6MOjmHIvRaQ5c_ABOPvW_4ecAqouWPjRADw8PL0kgAqnWG43K7DDMrlkMV5qEowCAQkTpoNndCwBFFTpBU6csscjVcaDG3VZH9aLsRnLTMzoN34dBMRJYzc4tQb0R',
    about: "Key decision maker for TechFlow's infrastructure scaling initiative. Focuses heavily on security compliance and API integration capabilities.",
    tags: ['Decision Maker', 'Enterprise', 'Tech'],
    timeline: [
      {
        id: 'ev-1',
        type: 'event',
        title: 'Quarterly Review Meeting',
        content: 'Discussed Q4 roadmap and potential expansion of API limits. Sarah expressed concern over current rate limits during peak hours.',
        date: 'Oct 24, 2:00 PM',
        author: 'John Doe'
      },
      {
        id: 'ev-2',
        type: 'mail',
        title: 'Re: API Rate Limit Proposal',
        content: '"Thanks for sending this over. The proposed tier looks better for our Black Friday expected load. Let\'s discuss on Thursday."',
        date: 'Oct 22, 9:15 AM',
        author: 'Sarah Chen'
      },
      {
        id: 'ev-3',
        type: 'call',
        title: 'Check-in Call (Outbound)',
        content: 'Brief sync to ensure no blockers before their upcoming deployment. Left voicemail.',
        date: 'Oct 18, 4:30 PM',
        author: 'John Doe'
      }
    ]
  },
  {
    id: 'elena-rodriguez',
    name: 'Elena Rodriguez',
    email: 'elena@techflow.io',
    phone: '+1 (555) 304-9842',
    company: 'TechFlow Inc.',
    role: 'Lead Developer',
    location: 'Austin, TX',
    status: 'Lead',
    score: 85,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBoOif-S5FaVqSGulm0bsuVCZnaEPH3JBWGHjrhkqwBzDoiofaYHDfjPTECvzEyqjb7Xebf5Dej10F6SQYWdMT4yZ7pVWqOeVPHOzMOKlghuyoUvUUiR5TLXxfwEpsonqpZs3hPkhftUNbuntZgspWpAX4pfTgDoIG7jFZWRtZfy9tlLpHJvg4LuGbgCkT90XYdFqNXB7U2gZD6cb9g7vt_EMiwq5xRcDNFWWr4U2G2JmXmD9zDn7wMaiuRBKzTRfaUfQdqpZfvFsw0',
    about: 'Inquired about core API specs and pricing for growing startups. Very technical lead, needs direct documentation.',
    tags: ['Developer', 'API Specs'],
    timeline: []
  },
  {
    id: 'marcus-chen',
    name: 'Marcus Chen',
    email: 'm.chen@apexglobal.com',
    phone: '+1 (555) 782-1092',
    company: 'Apex Global',
    role: 'Product Director',
    location: 'Seattle, WA',
    status: 'Prospect',
    score: 62,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAAh67bVzvmdzSwJQodI2sS6Xv8oHF7vVyfBNo-fZJrWyJQ_lp3lP3uqwfCeEzY1WkJgNXfmUWbzd-3iK5ZeLo9Ebujtp3MmdvB2S1bABTfsCtbNC0OLFx9yQ-BZ9RSi5EvS7QbY3DaQfuGSfaEIlmzchefucHN7xkpKZPOv-fQ3wYeN4vxsVs7dVyzsJoYHz0bUTQaD7AdEhFSUh1c3t7Z35wjWzti2gaA9FSa79MLr0AUpP5_gO1TWhAQdOtWhpj320HTZ9FhKk_n',
    about: 'Currently evaluating competitors. Specifically interested in data portability and custom pipeline configurations.',
    tags: ['Product Evaluator', 'Competitors'],
    timeline: []
  },
  {
    id: 'sarah-jenkins',
    name: 'Sarah Jenkins',
    email: 'sarah.j@horizon.net',
    phone: '+1 (555) 890-4321',
    company: 'Horizon Networks',
    role: 'Director of Operations',
    location: 'Chicago, IL',
    status: 'Customer',
    score: 98,
    avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCn27D3AutkmizXM21Yx1CCfzeojRM5A3Z0rTQziQW-qUM3NC2e3dncy7XaEOfIn0utoWM401nLXiHewV-QiaqCWztSzhrDKyokgihljQGcG9Cqm9jIAUuxE7CveMYDuHFlqjo1969j3Xh5HURwba75sYJRsNocMNFdkOezVajXpRbpVgSRq9paUObmD3Pxf-s94K8ZYmfMSQBW3m8c_gmuhUxsVHn2fvYNjIPwIRkvEuLcwgda-1teInucyr_992yHBbyJxrSFIWJf',
    about: 'Long-standing enterprise client. Renewed for an additional 2 years last month. High usage metrics.',
    tags: ['VIP', 'Enterprise'],
    timeline: []
  }
];

const initialDeals: Deal[] = [
  {
    id: 'deal-1',
    name: 'Stark Industries Expansion',
    value: 45000,
    stage: 'Negotiation',
    contactName: 'Tony Stark',
    priority: 'High',
    daysActive: 12
  },
  {
    id: 'deal-2',
    name: 'Wayne Ent. Software License',
    value: 120000,
    stage: 'Proposal',
    contactName: 'Bruce Wayne',
    priority: 'High',
    daysActive: 24
  },
  {
    id: 'deal-3',
    name: 'Cyberdyne Systems Integration',
    value: 85000,
    stage: 'Discovery',
    contactName: 'Miles Dyson',
    priority: 'Medium',
    daysActive: 8
  }
];

const initialTasks: CRMTask[] = [
  {
    id: 'task-1',
    title: 'Follow up with Acme Corp',
    description: 'Decision maker opened proposal 3 times today. Recommend immediate outreach.',
    status: 'pending',
    category: 'High Intent',
    time: '2h ago'
  },
  {
    id: 'task-2',
    title: 'Review proposal for Globex',
    description: 'Draft requires your approval before automatic dispatch scheduled for tomorrow.',
    status: 'pending',
    category: 'Action Needed',
    time: 'Yesterday'
  },
  {
    id: 'task-3',
    title: 'Prep for Initech Sync',
    description: 'Review Q3 goals before the alignment meeting. Key stakeholders will be present.',
    status: 'pending',
    category: 'Meeting',
    time: 'In 45m'
  }
];

const CRMContext = createContext<CRMContextType | undefined>(undefined);

export const CRMProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [tasks, setTasks] = useState<CRMTask[]>([]);

  // Load from localStorage or defaults
  useEffect(() => {
    const savedContacts = localStorage.getItem('crm_contacts');
    const savedDeals = localStorage.getItem('crm_deals');
    const savedTasks = localStorage.getItem('crm_tasks');

    if (savedContacts) {
      setContacts(JSON.parse(savedContacts));
    } else {
      setContacts(initialContacts);
    }

    if (savedDeals) {
      setDeals(JSON.parse(savedDeals));
    } else {
      setDeals(initialDeals);
    }

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      setTasks(initialTasks);
    }
  }, []);

  // Save changes helper
  const save = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const addContact = (contact: Omit<Contact, 'id' | 'timeline'>) => {
    const newContact: Contact = {
      ...contact,
      id: contact.name.toLowerCase().replace(/\s+/g, '-'),
      timeline: []
    };
    const updated = [newContact, ...contacts];
    setContacts(updated);
    save('crm_contacts', updated);
  };

  const updateContact = (id: string, updatedFields: Partial<Contact>) => {
    const updated = contacts.map((c) => (c.id === id ? { ...c, ...updatedFields } : c));
    setContacts(updated);
    save('crm_contacts', updated);
  };

  const addTimelineEvent = (contactId: string, event: Omit<TimelineEvent, 'id' | 'date'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: `ev-${Date.now()}`,
      date: new Date().toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };
    const updated = contacts.map((c) => {
      if (c.id === contactId) {
        return {
          ...c,
          timeline: [newEvent, ...c.timeline]
        };
      }
      return c;
    });
    setContacts(updated);
    save('crm_contacts', updated);
  };

  const addDeal = (deal: Omit<Deal, 'id'>) => {
    const newDeal: Deal = {
      ...deal,
      id: `deal-${Date.now()}`
    };
    const updated = [newDeal, ...deals];
    setDeals(updated);
    save('crm_deals', updated);
  };

  const moveDeal = (dealId: string, newStage: Deal['stage']) => {
    const updated = deals.map((d) => (d.id === dealId ? { ...d, stage: newStage } : d));
    setDeals(updated);
    save('crm_deals', updated);
  };

  const addTask = (task: Omit<CRMTask, 'id' | 'status'>) => {
    const newTask: CRMTask = {
      ...task,
      id: `task-${Date.now()}`,
      status: 'pending'
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    save('crm_tasks', updated);
  };

  const toggleTask = (taskId: string) => {
    const updated = tasks.map((t) => (t.id === taskId ? { ...t, status: (t.status === 'pending' ? 'completed' : 'pending') as 'pending' | 'completed' } : t));
    setTasks(updated);
    save('crm_tasks', updated);
  };

  // Derived Metrics
  const activeDealsCount = deals.filter((d) => d.stage !== 'Closed Won').length;
  const mrr = deals.reduce((acc, curr) => acc + (curr.stage === 'Closed Won' ? curr.value : curr.value * 0.1), 110000); 
  // Let's cap at $124k MRR or sum them up dynamically.
  const winRate = 68; // Win rate from the mockup is 68%

  return (
    <CRMContext.Provider
      value={{
        contacts,
        deals,
        tasks,
        mrr,
        activeDealsCount,
        winRate,
        addContact,
        updateContact,
        addTimelineEvent,
        addDeal,
        moveDeal,
        addTask,
        toggleTask
      }}
    >
      {children}
    </CRMContext.Provider>
  );
};

export const useCRM = () => {
  const context = useContext(CRMContext);
  if (context === undefined) {
    throw new Error('useCRM must be used within a CRMProvider');
  }
  return context;
};
