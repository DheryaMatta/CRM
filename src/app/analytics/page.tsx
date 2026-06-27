'use client';

import React, { useState } from 'react';
import { TrendingUp, Users, TrendingDown, CircleDollarSign, FileText, Download } from 'lucide-react';

export default function AnalyticsCenter() {
  const [activeRange, setActiveRange] = useState('Last 12 Months');
  const [hoveredPoint, setHoveredPoint] = useState<{ x: string; y: string } | null>(null);

  const mrrDataPoints = [
    { month: 'Jan', val: '$40K', x: 2, y: 80 },
    { month: 'Mar', val: '$60K', x: 20, y: 60 },
    { month: 'May', val: '$75K', x: 40, y: 45 },
    { month: 'Jul', val: '$95K', x: 60, y: 25 },
    { month: 'Sep', val: '$110K', x: 80, y: 15 },
    { month: 'Nov', val: '$124.5K', x: 98, y: 5 },
  ];

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

      {/* Bento Grid KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* Total MRR */}
        <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col justify-between shadow-xs hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Total MRR</span>
            <TrendingUp className="text-secondary" size={24} />
          </div>
          <div className="mt-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">$124.5K</h3>
            <p className="font-label-sm text-label-sm text-secondary mt-1">+12.4% vs last month</p>
          </div>
        </div>

        {/* Active Customers */}
        <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col justify-between shadow-xs hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Active Customers</span>
            <Users className="text-primary" size={24} />
          </div>
          <div className="mt-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">1,492</h3>
            <p className="font-label-sm text-label-sm text-primary mt-1">+5.2% vs last month</p>
          </div>
        </div>

        {/* Churn Rate */}
        <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col justify-between shadow-xs hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Churn Rate</span>
            <TrendingDown className="text-error" size={24} />
          </div>
          <div className="mt-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">1.2%</h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">-0.3% vs last month</p>
          </div>
        </div>

        {/* Average Deal Size */}
        <div className="rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col justify-between shadow-xs hover:border-primary/30 transition-all">
          <div className="flex justify-between items-start">
            <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Avg Deal Size</span>
            <CircleDollarSign className="text-tertiary" size={24} />
          </div>
          <div className="mt-md">
            <h3 className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface font-bold">$8,450</h3>
            <p className="font-label-sm text-label-sm text-tertiary mt-1">+2.1% vs last month</p>
          </div>
        </div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Main Line Graph: MRR Growth */}
        <div className="lg:col-span-8 rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col relative overflow-hidden shadow-xs">
          <div className="flex justify-between items-center mb-6 z-10">
            <h3 className="font-headline-md text-headline-md text-on-surface dark:text-inverse-on-surface font-bold">MRR Growth</h3>
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

          {/* Interactive Line Chart */}
          <div className="flex-1 relative w-full min-h-[300px] flex items-end justify-between px-2 pb-6">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pb-12 pt-8 pointer-events-none">
              <div className="w-full h-px bg-outline-variant/30 dark:bg-outline/20"></div>
              <div className="w-full h-px bg-outline-variant/30 dark:bg-outline/20"></div>
              <div className="w-full h-px bg-outline-variant/30 dark:bg-outline/20"></div>
              <div className="w-full h-px bg-outline-variant/30 dark:bg-outline/20"></div>
              <div className="w-full h-px bg-outline-variant/30 dark:bg-outline/20"></div>
            </div>

            {/* SVG Path */}
            <svg className="absolute inset-0 w-full h-[calc(100%-3rem)] mt-8" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path
                className="text-primary"
                d="M 2 80 C 10 75, 15 65, 20 60 C 25 55, 30 50, 40 45 C 50 40, 55 25, 60 20 C 70 15, 75 16, 80 15 C 90 14, 95 6, 98 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                vectorEffect="non-scaling-stroke"
              />
              <path
                className="text-primary opacity-10"
                d="M 2 80 C 10 75, 15 65, 20 60 C 25 55, 30 50, 40 45 C 50 40, 55 25, 60 20 C 70 15, 75 16, 80 15 C 90 14, 95 6, 98 5 L 98 100 L 2 100 Z"
                fill="currentColor"
              />
            </svg>

            {/* Interactivity Dots */}
            <div className="absolute inset-0 w-full h-[calc(100%-3rem)] mt-8">
              {mrrDataPoints.map((pt) => (
                <button
                  key={pt.month}
                  onMouseEnter={() => setHoveredPoint({ x: pt.month, y: pt.val })}
                  onMouseLeave={() => setHoveredPoint(null)}
                  className="absolute w-3 h-3 bg-primary border-2 border-surface dark:border-inverse-surface rounded-full -translate-x-1/2 -translate-y-1/2 hover:scale-150 transition-transform cursor-pointer"
                  style={{ left: `${pt.x}%`, top: `${pt.y}%` }}
                  aria-label={`MRR for ${pt.month} is ${pt.val}`}
                />
              ))}
            </div>

            {/* Interactive Tooltip */}
            {hoveredPoint && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-inverse-surface dark:bg-surface text-inverse-on-surface dark:text-on-surface px-md py-xs rounded-xl font-label-md text-label-md shadow-md animate-scale-up border border-outline-variant/20">
                {hoveredPoint.x}: <span className="font-bold text-primary">{hoveredPoint.y}</span>
              </div>
            )}

            {/* X Axis Labels */}
            <div className="absolute bottom-0 w-full flex justify-between px-2 text-on-surface-variant font-label-sm text-label-sm">
              {mrrDataPoints.map((pt) => (
                <span key={pt.month}>{pt.month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Vertical Bar Chart: Sales Forecast */}
        <div className="lg:col-span-4 rounded-[20px] border border-outline-variant dark:border-outline bg-surface-container-lowest dark:bg-inverse-surface p-md flex flex-col shadow-xs">
          <div className="mb-6">
            <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface font-bold">
              Sales Forecast
            </h3>
            <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
              Pipeline probability next 4 quarters
            </p>
          </div>

          <div className="flex-1 flex items-end justify-around pb-6 relative h-full min-h-[250px] border-b border-outline-variant/30">
            {/* Chart Bars */}
            <div className="w-5 h-[45%] bg-surface-variant dark:bg-surface-dim/40 rounded-t-full relative group">
              <div className="absolute bottom-0 w-full h-[60%] bg-secondary rounded-t-full"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant font-semibold">Q1</span>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface dark:bg-surface dark:text-on-surface border border-outline-variant/20 font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                $45k / $75k
              </div>
            </div>
            <div className="w-5 h-[65%] bg-surface-variant dark:bg-surface-dim/40 rounded-t-full relative group">
              <div className="absolute bottom-0 w-full h-[75%] bg-secondary rounded-t-full"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant font-semibold">Q2</span>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface dark:bg-surface dark:text-on-surface border border-outline-variant/20 font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                $90k / $120k
              </div>
            </div>
            <div className="w-5 h-[85%] bg-surface-variant dark:bg-surface-dim/40 rounded-t-full relative group">
              <div className="absolute bottom-0 w-full h-[40%] bg-secondary rounded-t-full"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant font-semibold">Q3</span>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface dark:bg-surface dark:text-on-surface border border-outline-variant/20 font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                $70k / $170k
              </div>
            </div>
            <div className="w-5 h-[100%] bg-surface-variant dark:bg-surface-dim/40 rounded-t-full relative group">
              <div className="absolute bottom-0 w-full h-[20%] bg-secondary rounded-t-full"></div>
              <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-label-sm text-label-sm text-on-surface-variant font-semibold">Q4</span>
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface dark:bg-surface dark:text-on-surface border border-outline-variant/20 font-label-sm text-label-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-sm">
                $40k / $200k
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-4 mt-6 font-label-sm text-label-sm">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary"></span> Committed
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-surface-variant dark:bg-surface-dim"></span> Best Case
            </div>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
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
