'use client';

import React, { useState } from 'react';
import { Activity, MessageSquare, Target, TrendingUp, Lightbulb, Mail, Phone, AlertTriangle } from 'lucide-react';

export default function AIInsights() {
  const [forecastRange, setForecastRange] = useState('Next 6 Months');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const forecastData = [
    { month: 'Jan', actual: 40, projected: 40, target: 45 },
    { month: 'Feb', actual: 45, projected: 45, target: 52 },
    { month: 'Mar', actual: 50, projected: 50, target: 60 },
    { month: 'Apr (AI)', actual: 0, projected: 52, target: 60 },
    { month: 'May (AI)', actual: 0, projected: 58, target: 70 },
    { month: 'Jun (AI)', actual: 0, projected: 65, target: 85 },
  ];

  return (
    <div className="space-y-lg animate-fade-in">
      <div className="flex justify-between items-center pb-sm border-b border-outline-variant/50">
        <p className="font-body-md text-body-md text-on-surface-variant">
          Predictive analytics and recommended actions powered by AI.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">
        {/* Predictive Revenue Forecast */}
        <div className="lg:col-span-8 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md flex flex-col shadow-xs">
          <div className="flex justify-between items-center mb-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface flex items-center gap-2 font-bold">
              <Activity className="text-primary" size={28} />
              Predictive Revenue Forecast
            </h3>
            <select
              value={forecastRange}
              onChange={(e) => setForecastRange(e.target.value)}
              className="bg-surface dark:bg-surface-dim border border-outline-variant rounded-lg px-3 py-1 text-label-sm font-label-sm text-on-surface-variant focus:outline-none focus:border-primary outline-none"
            >
              <option>Next 6 Months</option>
              <option>This Year</option>
            </select>
          </div>

          <div className="flex-1 w-full bg-surface dark:bg-surface-dim/20 rounded-lg border border-outline-variant dark:border-outline relative overflow-hidden min-h-[300px] flex items-end p-4 gap-4">
            {forecastData.map((d) => (
              <div
                key={d.month}
                className="flex-1 flex flex-col justify-end gap-1 h-full relative group cursor-pointer"
                onMouseEnter={() => setHoveredBar(d.month)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                {/* Tooltip */}
                {hoveredBar === d.month && (
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-inverse-surface dark:bg-surface text-inverse-on-surface dark:text-on-surface text-label-sm font-semibold px-2 py-1 rounded shadow-md z-10 whitespace-nowrap border border-outline-variant/35">
                    {d.actual > 0 ? `Actual: $${d.actual}k` : `Projected: $${d.projected}k`} / Target: ${d.target}k
                  </div>
                )}

                {/* Target Dashed Bar */}
                <div
                  className="w-full bg-surface-variant dark:bg-outline-variant/20 rounded-t-sm border border-dashed border-outline-variant transition-all duration-500"
                  style={{ height: `${d.target}%` }}
                >
                  {/* Actual or Projected Bar */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ${
                      d.actual > 0
                        ? 'bg-primary h-full'
                        : 'bg-primary/50 h-full'
                    }`}
                    style={{ height: `${(d.actual > 0 ? d.actual : d.projected) / d.target * 100}%` }}
                  />
                </div>
                <div className="text-center text-label-sm font-semibold text-on-surface-variant mt-2 truncate">
                  {d.month}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-md mt-md justify-center flex-wrap">
            <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-primary"></span> Actual MRR
            </div>
            <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-primary/50"></span> Projected MRR
            </div>
            <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-surface-variant border border-dashed border-outline-variant"></span> Target
            </div>
          </div>
        </div>

        {/* Global Sentiment Gauge */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md flex flex-col shadow-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md flex items-center gap-2 font-bold">
            <MessageSquare className="text-secondary" size={28} />
            Global Sentiment
          </h3>
          <div className="flex-1 flex flex-col items-center justify-center py-md">
            <div className="relative w-36 h-36 flex items-center justify-center mb-sm group cursor-pointer">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  className="text-surface-container-highest dark:text-surface-dim"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="45"
                  stroke="currentColor"
                  strokeWidth="8"
                ></circle>
                <circle
                  className="text-secondary transition-all duration-1000 ease-out"
                  cx="50"
                  cy="50"
                  fill="none"
                  r="45"
                  stroke="currentColor"
                  strokeDasharray="282.7"
                  strokeDashoffset="56.5" // 80% circle
                  strokeWidth="8"
                  style={{ strokeDashoffset: 56.5 }}
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface leading-none font-bold">80%</span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold mt-1">Positive</span>
              </div>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant text-center px-sm leading-relaxed">
              Based on automated NLP analysis of 1,204 recent interactions (emails, logged calls, support tickets).
            </p>
          </div>
        </div>

        {/* High Probability Deals */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md flex flex-col shadow-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md flex items-center gap-2 font-bold">
            <Target className="text-primary" size={28} />
            High Probability Deals
          </h3>
          <div className="space-y-sm flex-1 overflow-y-auto">
            <div className="p-sm bg-surface dark:bg-surface-dim/30 rounded-lg border border-outline-variant/50 hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold">Acme Corp Enterprise</h4>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">$120k ARR</span>
                </div>
                <div className="bg-secondary-container/40 dark:bg-secondary-container/10 text-secondary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                  85% <TrendingUp size={16} />
                </div>
              </div>
              <p className="text-label-sm font-label-sm text-on-surface-variant leading-relaxed">
                <span className="font-semibold text-on-surface">Factor:</span> High executive engagement in last 7 days.
              </p>
            </div>

            <div className="p-sm bg-surface dark:bg-surface-dim/30 rounded-lg border border-outline-variant/50 hover:border-primary transition-colors cursor-pointer">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold">Globex Expansion</h4>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">$85k ARR</span>
                </div>
                <div className="bg-secondary-container/40 dark:bg-secondary-container/10 text-secondary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                  78% <TrendingUp size={16} />
                </div>
              </div>
              <p className="text-label-sm font-label-sm text-on-surface-variant leading-relaxed">
                <span className="font-semibold text-on-surface">Factor:</span> Budget approval keywords detected in email thread.
              </p>
            </div>
          </div>
        </div>

        {/* Next Best Action Recommender */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md flex flex-col shadow-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md flex items-center gap-2 font-bold">
            <Lightbulb className="text-tertiary-container" size={28} />
            Next Best Actions
          </h3>
          <div className="space-y-sm flex-1 overflow-y-auto">
            <div className="p-sm bg-surface dark:bg-surface-dim/30 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors">
              <div className="flex gap-sm">
                <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold mb-1">Follow up with Sarah Chen</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                    Sentiment indicator dropped after last Support ticket. Recommend proactive reach out.
                  </p>
                  <button
                    onClick={() => alert('Opening AI assistant to draft email reply...')}
                    className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                  >
                    Draft Email
                  </button>
                </div>
              </div>
            </div>

            <div className="p-sm bg-surface dark:bg-surface-dim/30 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors">
              <div className="flex gap-sm">
                <div className="w-8 h-8 rounded-full bg-secondary-container/20 flex items-center justify-center text-secondary shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold mb-1">Call TechCorp Decision Maker</h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                    They visited the enterprise pricing page 3 times today.
                  </p>
                  <button
                    onClick={() => alert('Simulating call logging...')}
                    className="font-label-sm text-label-sm text-primary hover:underline cursor-pointer"
                  >
                    Log Call
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Churn Risk Alerts */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md flex flex-col shadow-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md flex items-center gap-2 font-bold">
            <AlertTriangle className="text-error" size={28} />
            Churn Risk Alerts
          </h3>
          <div className="space-y-sm flex-1 overflow-y-auto">
            <div className="p-sm bg-error-container/20 dark:bg-error-container/10 rounded-lg border border-error-container hover:bg-error-container/30 transition-colors">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold">Initech Systems</h4>
                  <span className="font-body-sm text-[11px] text-on-surface-variant font-semibold">Renewal in 30 days</span>
                </div>
                <span className="bg-error text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  High Risk
                </span>
              </div>
              <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">
                <span className="font-semibold text-error">Risk Check:</span> Product API usage volume dropped 40% this month.
              </p>
              <button
                onClick={() => alert('Opening AI Customer Success retention playbook for Initech Systems...')}
                className="w-full bg-surface dark:bg-surface-dim/50 text-on-surface dark:text-inverse-on-surface border border-outline-variant/80 rounded-md py-1.5 font-label-sm text-label-sm hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                View CS Retention Plan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
