'use client';

import React, { useState, useEffect } from 'react';
import { Activity, MessageSquare, Target, TrendingUp, Lightbulb, Mail, Phone, AlertTriangle } from 'lucide-react';
import { aiAPI } from '@/lib/api';

export default function AIInsights() {
  const [forecastRange, setForecastRange] = useState('Next 90 Days');
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [pipelineForecast, setPipelineForecast] = useState<any>(null);
  const [churnRisk, setChurnRisk] = useState<any>(null);

  useEffect(() => {
    async function fetchInsights() {
      setLoading(true);
      try {
        const [pf, cr] = await Promise.all([
          aiAPI.pipelineForecast(),
          aiAPI.churnRisk(),
        ]);
        if (pf.data) setPipelineForecast(pf.data);
        if (cr.data) setChurnRisk(cr.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    }
    fetchInsights();
  }, []);

  if (loading) {
    return <div className="p-xl text-center font-body-md text-on-surface-variant animate-pulse">Running AI Analysis models, please wait...</div>;
  }

  const forecastData = [
    { month: '30 Days', actual: 0, projected: pipelineForecast?.forecast_30_days || 40, target: (pipelineForecast?.forecast_30_days || 40) * 1.2 },
    { month: '60 Days', actual: 0, projected: pipelineForecast?.forecast_60_days || 60, target: (pipelineForecast?.forecast_60_days || 60) * 1.2 },
    { month: '90 Days', actual: 0, projected: pipelineForecast?.forecast_90_days || 80, target: (pipelineForecast?.forecast_90_days || 80) * 1.2 },
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
              <option>Next 90 Days</option>
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
                    {d.actual > 0 ? `Actual: $${d.actual}k` : `Projected: $${d.projected.toLocaleString()}`} / Target: ${d.target.toLocaleString()}
                  </div>
                )}

                {/* Target Dashed Bar */}
                <div
                  className="w-full bg-surface-variant dark:bg-outline-variant/20 rounded-t-sm border border-dashed border-outline-variant transition-all duration-500"
                  style={{ height: '100%' }}
                >
                  {/* Actual or Projected Bar */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-700 ${
                      d.actual > 0
                        ? 'bg-primary h-full'
                        : 'bg-primary/50 h-full'
                    }`}
                    style={{ height: `${((d.actual > 0 ? d.actual : d.projected) / (d.target || 1)) * 100}%` }}
                  />
                </div>
                <div className="text-center text-label-sm font-semibold text-on-surface-variant mt-2 truncate">
                  {d.month}
                </div>
              </div>
            ))}
          </div>
          
          {pipelineForecast?.summary && (
            <p className="mt-4 font-body-sm text-on-surface-variant italic">
              AI Summary: {pipelineForecast.summary}
            </p>
          )}

          <div className="flex gap-md mt-md justify-center flex-wrap">
            <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-primary/50"></span> Projected Revenue
            </div>
            <div className="flex items-center gap-xs text-label-sm font-label-sm text-on-surface-variant">
              <span className="w-3 h-3 rounded-full bg-surface-variant border border-dashed border-outline-variant"></span> Target
            </div>
          </div>
        </div>

        {/* Global Sentiment Gauge (Static for now but could be wired) */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md flex flex-col shadow-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md flex items-center gap-2 font-bold">
            <MessageSquare className="text-secondary" size={28} />
            Win Probability
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
                  strokeDashoffset={282.7 - (282.7 * (pipelineForecast?.win_probability_avg || 50) / 100)}
                  strokeWidth="8"
                ></circle>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-headline-lg text-headline-lg text-on-surface dark:text-inverse-on-surface leading-none font-bold">
                  {pipelineForecast?.win_probability_avg || 50}%
                </span>
                <span className="font-label-sm text-label-sm text-secondary font-semibold mt-1">Average</span>
              </div>
            </div>
            <p className="text-body-sm font-body-sm text-on-surface-variant text-center px-sm leading-relaxed">
              Based on AI analysis of active pipeline deals and historic win patterns.
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
            {pipelineForecast?.hot_deals?.map((deal: any, idx: number) => (
              <div key={idx} className="p-sm bg-surface dark:bg-surface-dim/30 rounded-lg border border-outline-variant/50 hover:border-primary transition-colors cursor-pointer">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold">{deal.title}</h4>
                  </div>
                  <div className="bg-secondary-container/40 dark:bg-secondary-container/10 text-secondary font-label-sm text-label-sm px-2 py-1 rounded-full flex items-center gap-1">
                    Hot <TrendingUp size={16} />
                  </div>
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant leading-relaxed">
                  <span className="font-semibold text-on-surface">Factor:</span> {deal.reason}
                </p>
              </div>
            ))}
            {(!pipelineForecast?.hot_deals || pipelineForecast.hot_deals.length === 0) && (
              <div className="text-on-surface-variant text-sm p-4 text-center">No hot deals detected at the moment.</div>
            )}
          </div>
        </div>

        {/* Next Best Action Recommender */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md flex flex-col shadow-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md flex items-center gap-2 font-bold">
            <Lightbulb className="text-tertiary-container" size={28} />
            AI Recommendations
          </h3>
          <div className="space-y-sm flex-1 overflow-y-auto">
            {pipelineForecast?.recommendations?.map((rec: string, idx: number) => (
              <div key={idx} className="p-sm bg-surface dark:bg-surface-dim/30 rounded-lg border border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                <div className="flex gap-sm">
                  <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center text-primary shrink-0">
                    <Lightbulb size={18} />
                  </div>
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold mb-1">Recommendation</h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
                      {rec}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {(!pipelineForecast?.recommendations || pipelineForecast.recommendations.length === 0) && (
              <div className="text-on-surface-variant text-sm p-4 text-center">No recommendations at the moment.</div>
            )}
          </div>
        </div>

        {/* Churn Risk Alerts */}
        <div className="lg:col-span-4 bg-surface-container-lowest dark:bg-inverse-surface rounded-xl border border-outline-variant dark:border-outline p-md flex flex-col shadow-xs">
          <h3 className="font-headline-sm text-headline-sm text-on-surface dark:text-inverse-on-surface mb-md flex items-center gap-2 font-bold">
            <AlertTriangle className="text-error" size={28} />
            Churn Risk Alerts
          </h3>
          <div className="space-y-sm flex-1 overflow-y-auto">
            {churnRisk?.high_risk?.map((risk: any, idx: number) => (
              <div key={idx} className="p-sm bg-error-container/20 dark:bg-error-container/10 rounded-lg border border-error-container hover:bg-error-container/30 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-label-md text-label-md text-on-surface dark:text-inverse-on-surface font-bold">{risk.name}</h4>
                  </div>
                  <span className="bg-error text-on-primary font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    High Risk
                  </span>
                </div>
                <p className="text-label-sm font-label-sm text-on-surface-variant mb-2">
                  <span className="font-semibold text-error">Risk Check:</span> {risk.reason}
                </p>
              </div>
            ))}
            {(!churnRisk?.high_risk || churnRisk.high_risk.length === 0) && (
              <div className="text-on-surface-variant text-sm p-4 text-center">No high risk customers detected!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
