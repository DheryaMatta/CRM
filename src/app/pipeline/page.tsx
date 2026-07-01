'use client';

import React, { useState, useEffect } from 'react';
import { Deal } from '@/context/CRMContext';
import { Plus, ArrowLeft, ArrowRight, X, Compass, FileText, Handshake, CheckCircle } from 'lucide-react';
import { dealsAPI } from '@/lib/api';

export default function SalesPipeline() {
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDeals = async () => {
    setLoading(true);
    const result = await dealsAPI.list();
    if (result.data) {
      setDeals(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const moveDeal = async (dealId: string, targetStage: Deal['stage']) => {
    await dealsAPI.updateStage(dealId, targetStage);
    fetchDeals();
  };
  const [modalOpen, setModalOpen] = useState(false);

  // Form states for new deal
  const [name, setName] = useState('');
  const [value, setValue] = useState('');
  const [stage, setStage] = useState<Deal['stage']>('Discovery');
  const [contactName, setContactName] = useState('');
  const [priority, setPriority] = useState<Deal['priority']>('Medium');

  const columns: { title: Deal['stage']; icon: React.ReactNode; color: string }[] = [
    { title: 'Discovery', icon: <Compass size={20} className="text-primary font-bold" />, color: 'border-secondary' },
    { title: 'Proposal', icon: <FileText size={20} className="text-primary font-bold" />, color: 'border-error' },
    { title: 'Negotiation', icon: <Handshake size={20} className="text-primary font-bold" />, color: 'border-primary' },
    { title: 'Closed Won', icon: <CheckCircle size={20} className="text-primary font-bold" />, color: 'border-[#10b981]' },
  ];

  // Drag and Drop implementation
  const handleDragStart = (e: React.DragEvent, dealId: string) => {
    e.dataTransfer.setData('text/plain', dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, targetStage: Deal['stage']) => {
    e.preventDefault();
    const dealId = e.dataTransfer.getData('text/plain');
    if (dealId) {
      await moveDeal(dealId, targetStage);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !value || !contactName) return;

    await dealsAPI.create({
      name,
      value: Number(value),
      stage,
      contactName,
      priority,
      daysActive: 1,
    });

    // Reset
    setName('');
    setValue('');
    setStage('Discovery');
    setContactName('');
    setPriority('Medium');
    setModalOpen(false);
    fetchDeals();
  };

  // Get total value for a column stage
  const getColTotal = (colStage: Deal['stage']) => {
    return deals
      .filter((d) => d.stage === colStage)
      .reduce((sum, d) => sum + d.value, 0);
  };

  return (
    <div className="space-y-lg">
      {/* Header action */}
      <div className="flex justify-between items-center pb-sm border-b border-outline-variant/50">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Track deals and drag cards across stages.
        </p>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-sm bg-primary hover:bg-primary-container text-on-primary font-label-md text-label-md py-sm px-md rounded-xl transition-colors h-[48px] cursor-pointer"
        >
          <Plus size={20} />
          New Deal
        </button>
      </div>

      {/* Kanban Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md items-start">
        {columns.map((col) => {
          const colDeals = deals.filter((d) => d.stage === col.title);
          return (
            <div
              key={col.title}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.title)}
              className="bg-surface-container-lowest dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-sm flex flex-col gap-sm min-h-[500px] shadow-xs"
            >
              {/* Column Header */}
              <div className="flex justify-between items-center pb-xs border-b border-outline-variant/30">
                <div className="flex items-center gap-xs">
                  {col.icon}
                  <h4 className="font-headline-sm text-body-md font-bold text-on-surface dark:text-inverse-on-surface">
                    {col.title}
                  </h4>
                  <span className="font-label-sm text-label-sm bg-surface-container dark:bg-surface-dim px-2 py-0.5 rounded-full text-on-surface-variant">
                    {colDeals.length}
                  </span>
                </div>
                <div className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
                  ${getColTotal(col.title).toLocaleString()}
                </div>
              </div>

              {/* Deal Cards list */}
              <div className="flex flex-col gap-sm flex-1">
                {colDeals.map((deal) => (
                  <div
                    key={deal.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, deal.id)}
                    className="p-md bg-surface dark:bg-surface-dim/40 rounded-xl border border-outline-variant/60 hover:border-primary/50 cursor-grab active:cursor-grabbing transition-all shadow-xs relative group"
                  >
                    {/* Priority Indicator */}
                    <div className="flex justify-between items-center mb-xs">
                      <span
                        className={`px-2 py-0.5 rounded-full font-label-sm text-[10px] uppercase font-bold tracking-wider ${
                          deal.priority === 'High'
                            ? 'text-error bg-error-container/50 dark:bg-error-container/10'
                            : deal.priority === 'Medium'
                            ? 'text-tertiary bg-tertiary-container/30 dark:bg-tertiary-container/10'
                            : 'text-secondary bg-secondary-container/40 dark:bg-secondary-container/10'
                        }`}
                      >
                        {deal.priority}
                      </span>
                      <span className="font-label-sm text-[11px] text-on-surface-variant">
                        {deal.daysActive}d active
                      </span>
                    </div>

                    <h5 className="font-headline-sm text-body-md font-bold text-on-surface dark:text-inverse-on-surface mb-xs">
                      {deal.name}
                    </h5>

                    <div className="flex justify-between items-center mt-md pt-sm border-t border-outline-variant/20">
                      <div className="font-label-sm text-label-sm text-on-surface-variant">
                        {deal.contactName}
                      </div>
                      <div className="font-body-md text-body-md font-bold text-primary">
                        ${deal.value.toLocaleString()}
                      </div>
                    </div>

                    {/* Accessible shifting buttons */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {col.title !== 'Discovery' && (
                        <button
                          onClick={() => {
                            const stagesList: Deal['stage'][] = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];
                            const idx = stagesList.indexOf(col.title);
                            moveDeal(deal.id, stagesList[idx - 1]);
                          }}
                          title="Move Left"
                          className="p-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-full shadow-sm cursor-pointer"
                        >
                          <ArrowLeft size={16} />
                        </button>
                      )}
                      {col.title !== 'Closed Won' && (
                        <button
                          onClick={() => {
                            const stagesList: Deal['stage'][] = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];
                            const idx = stagesList.indexOf(col.title);
                            moveDeal(deal.id, stagesList[idx + 1]);
                          }}
                          title="Move Right"
                          className="p-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-full shadow-sm cursor-pointer"
                        >
                          <ArrowRight size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}

                {colDeals.length === 0 && (
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-outline-variant/30 rounded-xl p-md flex-1 text-on-surface-variant text-label-sm min-h-[100px]">
                    Drag deals here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Deal Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-sm">
          <div
            className="fixed inset-0 bg-on-background/50 backdrop-blur-xs"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative w-full max-w-[448px] bg-surface dark:bg-inverse-surface border border-outline-variant dark:border-outline rounded-xl p-md shadow-xl z-10 animate-scale-up">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-3">
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface dark:text-inverse-on-surface">
                Create New Deal
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1 rounded-full hover:bg-surface-container-low text-on-surface-variant cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-sm">
              <div className="flex flex-col gap-1">
                <label className="font-label-md text-label-md">Deal Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corp Software Suite"
                  className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface dark:text-inverse-on-surface"
                />
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md">Value ($)</label>
                  <input
                    type="number"
                    required
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder="e.g. 50000"
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md">Stage</label>
                  <select
                    value={stage}
                    onChange={(e) => setStage(e.target.value as any)}
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface dark:text-inverse-on-surface"
                  >
                    <option value="Discovery">Discovery</option>
                    <option value="Proposal">Proposal</option>
                    <option value="Negotiation">Negotiation</option>
                    <option value="Closed Won">Closed Won</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md">Contact Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Tony Stark"
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface dark:text-inverse-on-surface"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-label-md text-label-md">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="px-sm py-2 rounded-lg border border-outline-variant bg-surface-bright dark:bg-surface-container-low focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none text-on-surface dark:text-inverse-on-surface"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
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
                  Create Deal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
