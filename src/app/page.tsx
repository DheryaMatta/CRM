'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Info, Zap, CheckCircle2, ChevronRight } from 'lucide-react';
import { analyticsAPI, dealsAPI, eventsAPI } from '@/lib/api';

export default function Dashboard() {
  const [stats, setStats] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);
  const [deals, setDeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [analyticsRes, dealsRes, eventsRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          dealsAPI.list(),
          eventsAPI.list()
        ]);
        if (analyticsRes.data) setStats(analyticsRes.data);
        if (dealsRes.data) setDeals(dealsRes.data);
        if (eventsRes.data) setTasks(eventsRes.data);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const toggleTask = async (id: string) => {
    await eventsAPI.complete(id);
    const eventsRes = await eventsAPI.list();
    if (eventsRes.data) setTasks(eventsRes.data);
  };

  const mrr = stats?.totalRevenue || 0;
  const activeDealsCount = stats?.dealsByStage?.filter((s: any) => !['won', 'lost'].includes(s.stage)).reduce((acc: number, curr: any) => acc + curr.count, 0) || 0;
  const winRate = stats?.conversionRate || 0;

  const activeTasks = tasks.filter((t) => t.status !== 'completed');
  const recentDeals = deals.slice(0, 3); // show recent active deals

  if (loading) {
    return <div className="p-xl text-center font-body-md text-on-surface-variant animate-pulse">Loading dashboard data...</div>;
  }

  return (
    <div className="flex flex-col gap-xl">
      {/* Welcome Header */}
      <div>
        <h3 className="font-body-md text-body-md text-on-surface-variant">
          Welcome back, Sarah. Here&apos;s what&apos;s happening today.
        </h3>
      </div>

      {/* Metric Cards (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-md">
        {/* MRR Card */}
        <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-lg border border-outline-variant dark:border-outline flex flex-col justify-between hover:border-outline hover:shadow-md transition-all relative overflow-hidden group shadow-sm">

          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
              Monthly Recurring Revenue
            </h3>
            <div className="font-display text-display text-on-surface dark:text-inverse-on-surface">
              ${(mrr / 1000).toFixed(0)}k
            </div>
          </div>
          <div className="flex items-center gap-2 mt-md">
            <span className="inline-flex items-center text-secondary bg-secondary-container/30 dark:bg-secondary-container/10 px-2 py-1 rounded-full font-label-sm text-label-sm">
              <TrendingUp size={14} className="mr-1" />
              +12.5%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">vs last month</span>
          </div>
        </div>

        {/* Active Deals Card */}
        <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-lg border border-outline-variant dark:border-outline flex flex-col justify-between hover:border-outline hover:shadow-md transition-all relative overflow-hidden group shadow-sm">

          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
              Active Deals
            </h3>
            <div className="font-display text-display text-on-surface dark:text-inverse-on-surface">
              {activeDealsCount}
            </div>
          </div>
          <div className="flex items-center gap-2 mt-md">
            <span className="inline-flex items-center text-tertiary bg-tertiary-container/20 dark:bg-tertiary-container/10 px-2 py-1 rounded-full font-label-sm text-label-sm">
              <Info size={14} className="mr-1" />
              {deals.filter((d) => d.priority === 'High').length} High Priority
            </span>
          </div>
        </div>

        {/* Win Rate Card */}
        <div className="bg-surface-container-lowest dark:bg-inverse-surface rounded-xl p-lg border border-outline-variant dark:border-outline flex flex-col justify-between hover:border-outline hover:shadow-md transition-all relative overflow-hidden group shadow-sm">

          <div>
            <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider mb-2">
              Win Rate
            </h3>
            <div className="font-display text-display text-on-surface dark:text-inverse-on-surface">
              {winRate}%
            </div>
          </div>
          <div className="w-full bg-surface-container-high dark:bg-surface-dim h-2 rounded-full mt-auto mb-2">
            <div className="bg-primary h-full rounded-full" style={{ width: `${winRate}%` }}></div>
          </div>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Top quartile performance</span>
        </div>
      </div>

      {/* Main Content Area: Tasks & Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
        {/* Smart Task Feed (AI Prioritized) */}
        <div className="lg:col-span-1 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline flex flex-col h-[500px] shadow-sm">
          <div className="p-md border-b border-outline-variant dark:border-outline flex justify-between items-center bg-surface-container-low dark:bg-surface-dim rounded-t-xl">
            <div className="flex items-center gap-2">
              <Zap className="text-primary fill-primary" size={24} />
              <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface font-bold">
                Smart Tasks
              </h3>
            </div>
            <span className="font-label-sm text-label-sm bg-primary-container text-on-primary-container px-2 py-1 rounded-full">
              AI Sorted
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-sm space-y-sm">
            {activeTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-on-surface-variant">
                <CheckCircle2 size={36} className="text-on-surface-variant mb-2" />
                <p className="font-body-md">All caught up!</p>
              </div>
            ) : (
              activeTasks.map((t) => (
                <div
                  key={t.id}
                  className="p-sm bg-surface dark:bg-surface-dim/30 rounded-lg border border-outline-variant/50 hover:border-primary/30 transition-all cursor-pointer group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-label-sm text-label-sm ${
                        t.category === 'High Intent'
                          ? 'text-error bg-error-container/50 dark:bg-error-container/10'
                          : t.category === 'Action Needed'
                          ? 'text-tertiary bg-tertiary-container/20 dark:bg-tertiary-container/10'
                          : 'text-secondary bg-secondary-container/30 dark:bg-secondary-container/10'
                      }`}
                    >
                      {t.category}
                    </span>
                    <span className="font-label-sm text-label-sm text-on-surface-variant">{t.time}</span>
                  </div>
                  <h4 className="font-body-md text-body-md font-semibold text-on-surface dark:text-inverse-on-surface mb-1 group-hover:text-primary transition-colors">
                    {t.title}
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {t.description}
                  </p>
                  <div className="mt-3 flex gap-2">
                    {t.title.includes('Call') || t.category === 'High Intent' ? (
                      <Link
                        href="/contacts/sarah-chen"
                        className="px-3 py-1 bg-primary text-on-primary rounded-lg font-label-sm text-label-sm hover:bg-primary/95 transition-colors text-center"
                      >
                        Call Now
                      </Link>
                    ) : null}
                    <button
                      onClick={() => toggleTask(t.id)}
                      className="px-3 py-1 bg-surface-container-low dark:bg-surface-dim text-on-surface dark:text-inverse-on-surface border border-outline-variant rounded-lg font-label-sm text-label-sm hover:bg-surface-container-high transition-colors"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pipeline Overview */}
        <div className="lg:col-span-2 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline flex flex-col h-[500px] overflow-hidden shadow-sm">
          <div className="p-md border-b border-outline-variant dark:border-outline flex justify-between items-center bg-surface-container-low dark:bg-surface-dim rounded-t-xl">
            <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface font-bold">
              Active Pipeline
            </h3>
            <Link href="/pipeline" className="font-label-md text-label-md text-primary hover:underline">
              View All
            </Link>
          </div>
          <div className="flex-1 p-md overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-outline-variant dark:border-outline">
                  <th className="pb-3 font-label-md text-label-md text-on-surface-variant font-medium">
                    Deal Name
                  </th>
                  <th className="pb-3 font-label-md text-label-md text-on-surface-variant font-medium">
                    Stage
                  </th>
                  <th className="pb-3 font-label-md text-label-md text-on-surface-variant font-medium">
                    Value
                  </th>
                  <th className="pb-3 font-label-md text-label-md text-on-surface-variant font-medium text-right">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="font-body-md text-body-md">
                {recentDeals.map((deal) => (
                  <tr
                    key={deal.id}
                    className="border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-lowest dark:hover:bg-surface-container-low/20 transition-colors group"
                  >
                    <td className="py-4">
                      <div className="font-semibold text-on-surface dark:text-inverse-on-surface group-hover:text-primary transition-colors">
                        {deal.name}
                      </div>
                      <div className="font-body-sm text-body-sm text-on-surface-variant">
                        {deal.contactName}
                      </div>
                    </td>
                    <td className="py-4">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full font-label-sm text-label-sm ${
                          deal.stage === 'Negotiation'
                            ? 'text-primary bg-primary-container/20 dark:bg-primary-container/10'
                            : deal.stage === 'Proposal'
                            ? 'text-error bg-error-container/50 dark:bg-error-container/10'
                            : 'text-secondary bg-secondary-container/30 dark:bg-secondary-container/10'
                        }`}
                      >
                        {deal.stage}
                      </span>
                    </td>
                    <td className="py-4 font-medium text-on-surface dark:text-inverse-on-surface">
                      ${deal.value.toLocaleString()}
                    </td>
                    <td className="py-4 text-right">
                      <Link
                        href="/pipeline"
                        className="p-2 inline-block rounded-full hover:bg-surface-container-high dark:hover:bg-surface-dim transition-colors text-on-surface-variant"
                      >
                        <ChevronRight size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
