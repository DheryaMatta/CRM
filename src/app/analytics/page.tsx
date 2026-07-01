'use client';

import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, TrendingDown, CircleDollarSign, FileText, Download } from 'lucide-react';
import { analyticsAPI } from '@/lib/api';

interface DashboardStats {
  totalContacts: number;
  totalDeals: number;
  totalRevenue: number;
  wonDeals: number;
  conversionRate: number;
  monthlyRevenue: { month: string; revenue: number }[];
  dealsByStage: { stage: string; count: number; value: number }[];
  contactsByStatus: { status: string; count: number }[];
}

// Format a number as currency: 124500 → "$124.5K"
function formatCurrency(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}

export default function AnalyticsCenter() {
  const [activeRange, setActiveRange] = useState('Last 12 Months');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: string; y: string } | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      const result = await analyticsAPI.getDashboard();
      if (result.error) {
        setError(result.error);
      } else {
        setStats(result.data as DashboardStats);
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  // Build chart data points from real monthlyRevenue data
  const mrrDataPoints = stats?.monthlyRevenue?.map((item, i, arr) => {
    const maxRevenue = Math.max(...arr.map((d) => d.revenue), 1);
    const x = arr.length === 1 ? 50 : (i / (arr.length - 1)) * 96 + 2;
    const y = 85 - ((item.revenue / maxRevenue) * 75);
    return {
      month: item.month.split(' ')[0], // "Jun 2026" → "Jun"
      val: formatCurrency(item.revenue),
      x: Math.round(x),
      y: Math.round(y),
    };
  }) ?? [];

  // Build SVG path from data points
  const svgPath = mrrDataPoints.length > 1
    ? mrrDataPoints
        .map((pt, i) =>
          i === 0 ? `M ${pt.x} ${pt.y}` : `L ${pt.x} ${pt.y}`
        )
        .join(' ')
    : 'M 2 80 L 98 5';

  const svgFill = mrrDataPoints.length > 1
    ? `${svgPath} L ${mrrDataPoints[mrrDataPoints.length - 1].x} 100 L ${mrrDataPoints[0].x} 100 Z`
    : 'M 2 80 L 98 5 L 98 100 L 2 100 Z';

  // Derived KPI values
  const totalRevenue = stats?.totalRevenue ?? 0;
  const totalContacts = stats?.totalContacts ?? 0;
  const conversionRate = stats?.conversionRate ?? 0;
  const wonDeals = stats?.wonDeals ?? 0;
  const totalDeals = stats?.totalDeals ?? 0;
  const avgDealSize = wonDeals > 0 ? totalRevenue / wonDeals : 0;

  // Churn rate from contactsByStatus
  const churned = stats?.contactsByStatus?.find((s) => s.status === 'churned')?.count ?? 0;
  const customers = stats?.contactsByStatus?.find((s) => s.status === 'customer')?.count ?? 0;
  const churnRate = customers + churned > 0
    ? ((churned / (customers + churned)) * 100).toFixed(1)
    : '0.0';

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[20px] border border-error/30 bg-error-container/10 p-md text-error text-center">
        Failed to load analytics: {error}
        <br />
        <span className="text-on-surface-variant text-sm">Make sure your Python backend is running at {process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000'}</span>
      </div>
    );
  }

  return (
    <div className="space-y-lg">
      {/* Top Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md pb-sm border-b border-outline-variant/50">
        <div>
          <p className="font-body-md text-body-md text-on-surface-variant">Performance &amp; Growth Insights</p>
        </div>
        <div className="flex gap-sm w-full sm:w-auto">
          <button
            onClick={() => alert('Exporting analytics data to CSV...')}
            className="flex-1 sm:flex-none h-12 px-6 rounded-[20px] border border-outline-variant text-on-surface dark:text-inverse-on-surface font-label-md text-label-md hover:bg-surface-container-low transition-colors cursor-pointer"
          >
            Export CSV
          </button>
          <button
            onClick={() => alert('Generating complete analytics report PDF...')}
            className="flex-1 sm:flex-none h-12 px-6 rounded-[20px] bg-primary text-on-primary font-label-md text-label-md hover:bg-primary-container transition-colors shadow-xs cursor-pointer"
          >
            Generate Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Total Revenue */}
        <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col justify-between shadow-xs hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total Revenue</span>
            <TrendingUp className="text-secondary" size={24} />
          </div>
          <div className="mt-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">
              {formatCurrency(totalRevenue)}
            </h3>
            <p className="font-label-sm text-label-sm text-secondary mt-1">From {wonDeals} won deals</p>
          </div>
        </div>

        {/* Active Customers */}
        <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col justify-between shadow-xs hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Contacts</span>
            <Users className="text-primary" size={24} />
          </div>
          <div className="mt-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">
              {totalContacts.toLocaleString()}
            </h3>
            <p className="font-label-sm text-label-sm text-primary mt-1">{customers} customers</p>
          </div>
        </div>

        {/* Churn Rate */}
        <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col justify-between shadow-xs hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Churn Rate</span>
            <TrendingDown className="text-error" size={24} />
          </div>
          <div className="mt-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">
              {churnRate}%
            </h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">{churned} churned contacts</p>
          </div>
        </div>

        {/* Avg Deal Size */}
        <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col justify-between shadow-xs hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Avg Deal Size</span>
            <CircleDollarSign className="text-tertiary" size={24} />
          </div>
          <div className="mt-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">
              {formatCurrency(avgDealSize)}
            </h3>
            <p className="font-label-sm text-label-sm text-tertiary mt-1">{conversionRate}% win rate</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* MRR Growth Line Chart */}
        <div className="lg:col-span-8 rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col relative overflow-hidden shadow-xs">
          <div className="flex justify-between items-center mb-6 z-10">
            <h3 className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface font-bold">Revenue Growth</h3>
            <select
              value={activeRange}
              onChange={(e) => setActiveRange(e.target.value)}
              className="rounded-[20px] border border-outline-variant dark:border-outline bg-transparent font-label-sm text-label-sm text-on-surface-variant focus:border-primary focus:ring-1 focus:ring-primary h-8 py-0 pl-3 pr-8 outline-none"
            >
              <option>Last 12 Months</option>
              <option>Year to Date</option>
              <option>All Time</option>
            </select>
          </div>

          <div className="flex-1 relative w-full min-h-[300px] flex items-end justify-between px-2 pb-6">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-12 pt-8 pointer-events-none">
              {[0,1,2,3,4].map((i) => (
                <div key={i} className="w-full h-px bg-outline-variant/30 dark:bg-outline/20" />
              ))}
            </div>

            {mrrDataPoints.length > 0 ? (
              <>
                {/* SVG Path */}
                <svg className="absolute inset-0 w-full h-[calc(100%-3rem)] mt-8" preserveAspectRatio="none" viewBox="0 0 100 100">
                  <path
                    className="text-primary"
                    d={svgPath}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    vectorEffect="non-scaling-stroke"
                  />
                  <path
                    className="text-primary opacity-10"
                    d={svgFill}
                    fill="currentColor"
                  />
                </svg>

                {/* Interactive Dots */}
                <div className="absolute inset-0 w-full h-[calc(100%-3rem)] mt-8">
                  {mrrDataPoints.map((pt) => (
                    <button
                      key={pt.month}
                      onMouseEnter={() => setHoveredPoint({ x: pt.month, y: pt.val })}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="absolute w-3 h-3 bg-primary border-2 border-surface dark:border-inverse-surface rounded-full -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer"
                      style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                      aria-label={`Revenue for ${pt.month} is ${pt.val}`}
                    />
                  ))}
                </div>

                {/* Tooltip */}
                {hoveredPoint && (
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-inverse-surface dark:bg-surface text-inverse-on-surface dark:text-on-surface px-md py-xs rounded-xl font-label-md text-label-md shadow-md border border-outline-variant/20 z-10">
                    {hoveredPoint.x}: <span className="font-bold text-primary">{hoveredPoint.y}</span>
                  </div>
                )}

                {/* X Axis Labels */}
                <div className="absolute bottom-0 w-full flex justify-between px-2 text-on-surface-variant font-label-sm text-label-sm">
                  {mrrDataPoints.map((pt) => (
                    <span key={pt.month}>{pt.month}</span>
                  ))}
                </div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant font-label-md">
                No revenue data yet. Close some deals to see the chart!
              </div>
            )}
          </div>
        </div>

        {/* Sales Forecast Bar Chart — pipeline by stage */}
        <div className="lg:col-span-4 rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col shadow-xs">
          <div className="mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface font-bold">
              Pipeline by Stage
            </h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Deal count per pipeline stage
            </p>
          </div>

          <div className="flex-1 flex items-end justify-around pb-6 relative h-full min-h-[250px] border-b border-outline-variant/30">
            {(stats?.dealsByStage ?? [])
              .filter((s) => !['won', 'lost'].includes(s.stage))
              .map((stage) => {
                const maxCount = Math.max(
                  ...(stats?.dealsByStage ?? [])
                    .filter((s) => !['won', 'lost'].includes(s.stage))
                    .map((s) => s.count),
                  1
                );
                const heightPct = Math.max((stage.count / maxCount) * 85, 8);
                const labels: Record<string, string> = {
                  lead: 'Lead', qualified: 'Qual', proposal: 'Prop', negotiation: 'Neg',
                };
                return (
                  <div
                    key={stage.stage}
                    className="w-5 bg-surface-variant dark:bg-surface-dim/40 rounded-t-full relative group"
                    style={{ height: `${heightPct}%` }}
                  >
                    <div className="absolute bottom-0 w-full bg-secondary rounded-t-full" style={{ height: '100%' }} />
                    <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant font-semibold whitespace-nowrap">
                      {labels[stage.stage] ?? stage.stage}
                    </span>
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface dark:bg-surface dark:text-on-surface border border-outline-variant/20 font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                      {stage.count} deal{stage.count !== 1 ? 's' : ''} · {formatCurrency(stage.value)}
                    </div>
                  </div>
                );
              })}
            {(stats?.dealsByStage ?? []).filter((s) => !['won', 'lost'].includes(s.stage)).length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center text-on-surface-variant font-label-md text-center px-4">
                No active pipeline deals yet
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 mt-6 font-label-sm text-label-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary" /> Active Deals
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-variant dark:bg-surface-dim" /> Target
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports */}
      <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface overflow-hidden shadow-xs">
        <div className="p-md border-b border-outline-variant dark:border-outline bg-surface-container-low dark:bg-surface-dim">
          <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface font-bold">
            Recent Analytics Reports
          </h3>
        </div>
        <div className="flex flex-col">
          <div
            onClick={() => alert('Downloading report: Q3 Regional Sales Performance...')}
            className="flex items-center justify-between p-md border-b border-outline-variant/30 last:border-0 hover:bg-surface-container-low/20 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-primary-container/20 flex items-center justify-center text-primary">
                <FileText size={24} />
              </div>
              <div>
                <p className="font-body-md text-body-md font-semibold text-on-surface dark:text-inverse-on-surface">
                  Q3 Regional Sales Performance
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  Generated Jun 12, 2026 by Sarah Jenkins
                </p>
              </div>
            </div>
            <Download className="text-outline group-hover:text-primary transition-colors" size={24} />
          </div>

          <div
            onClick={() => alert('Downloading report: Churn Analysis - Enterprise Tier...')}
            className="flex items-center justify-between p-md hover:bg-surface-container-low/20 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-md">
              <div className="w-10 h-10 rounded-full bg-tertiary-container/20 flex items-center justify-center text-tertiary">
                <FileText size={24} />
              </div>
              <div>
                <p className="font-body-md text-body-md font-semibold text-on-surface dark:text-inverse-on-surface">
                  Churn Analysis - Enterprise Tier
                </p>
                <p className="font-label-sm text-label-sm text-on-surface-variant mt-0.5">
                  Generated Jun 05, 2026 by Mike Chen
                </p>
              </div>
            </div>
            <Download className="text-outline group-hover:text-primary transition-colors" size={24} />
          </div>
        </div>
      </div>
    </div>
  );
}
