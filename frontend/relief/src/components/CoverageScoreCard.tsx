import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Utensils, 
  Droplets, 
  HeartPulse, 
  Home, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { RegionalCoverageScore } from '../types/relief';

interface CoverageScoreCardProps {
  scoreData: RegionalCoverageScore;
  onResolveGapClick?: () => void;
}

export const CoverageScoreCard: React.FC<CoverageScoreCardProps> = ({
  scoreData,
  onResolveGapClick
}) => {
  const getPillarIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'food': return Utensils;
      case 'water': return Droplets;
      case 'medicine': return HeartPulse;
      case 'shelter': return Home;
      case 'sanitation': return Sparkles;
      default: return ShieldCheck;
    }
  };

  const getScoreColor = (pct: number) => {
    if (pct >= 80) return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    if (pct >= 60) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (pct >= 40) return 'text-orange-700 bg-orange-50 border-orange-200';
    return 'text-rose-700 bg-rose-50 border-rose-200';
  };

  const getProgressColor = (pct: number) => {
    if (pct >= 80) return 'bg-emerald-500';
    if (pct >= 60) return 'bg-amber-500';
    if (pct >= 40) return 'bg-orange-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white border border-sky-100 rounded-2xl p-5 sm:p-6 shadow-sm relative overflow-hidden">
      {/* Subtle light blue background glow */}
      <div className="absolute top-0 right-0 -mt-8 -mr-8 w-48 h-48 bg-sky-100/60 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2 py-0.5 rounded-full border border-sky-200">
              Relief Safety Index
            </span>
            <span className="text-xs text-slate-500 font-medium">North Eastern Region</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-1 flex items-center gap-2">
            <span>"No One Left Without Essentials" Monitor</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic relief safety index across 5 human survival pillars
          </p>
        </div>

        {/* Big Overall Dial */}
        <div className="flex items-center gap-3 self-start md:self-auto bg-sky-50/80 border border-sky-200/80 px-4 py-2.5 rounded-xl shadow-sm">
          <div className="relative flex items-center justify-center">
            <div className="text-3xl font-black text-sky-900 tracking-tight">
              {scoreData.overall_coverage_pct}
              <span className="text-base font-medium text-sky-600">%</span>
            </div>
          </div>
          <div className="text-left border-l border-sky-200 pl-3">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Overall Coverage</div>
            <div className="text-xs font-bold text-sky-700">
              {scoreData.overall_coverage_pct >= 70 ? 'Operational Stability' : 'Relief Deficit Alert'}
            </div>
          </div>
        </div>
      </div>

      {/* Warning Box for the Lowest Gap */}
      <div className="mb-5 bg-rose-50/80 border border-rose-200 rounded-xl p-3.5 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider">
              Critical Relief Gap Identified
            </h4>
            <span className="text-[11px] text-rose-600 font-bold">Immediate Attention Required</span>
          </div>
          <p className="text-xs text-rose-900/90 mt-1 font-medium">
            {scoreData.biggest_gap_message}
          </p>
        </div>
        {onResolveGapClick && (
          <button
            onClick={onResolveGapClick}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-sm shrink-0"
          >
            <span>Resolve Gap</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 5 Essential Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {Object.entries(scoreData.pillars).map(([name, pillar]) => {
          const Icon = getPillarIcon(name);
          const isLowest = name.toLowerCase() === scoreData.lowest_coverage_pillar.toLowerCase();

          return (
            <div
              key={name}
              className={`rounded-xl p-3.5 border transition-all ${
                isLowest
                  ? 'bg-rose-50/70 border-rose-300 shadow-sm ring-1 ring-rose-200'
                  : 'bg-slate-50/70 border-slate-200/80 hover:border-sky-300 hover:bg-sky-50/30'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                  <div className={`p-1.5 rounded-lg ${isLowest ? 'bg-rose-100 text-rose-700' : 'bg-sky-100 text-sky-700'}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">{name}</span>
                </div>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full border ${getScoreColor(pillar.coverage_pct)}`}>
                  {pillar.coverage_pct}%
                </span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-200/80 rounded-full h-1.5 mb-2.5 overflow-hidden">
                <div
                  className={`h-1.5 rounded-full transition-all duration-500 ${getProgressColor(pillar.coverage_pct)}`}
                  style={{ width: `${pillar.coverage_pct}%` }}
                />
              </div>

              <div className="flex justify-between text-[11px] text-slate-500 font-medium">
                <span>Avail: <strong className="text-slate-800">{pillar.available.toLocaleString()}</strong></span>
                <span>Shortage: <strong className={pillar.shortage > 0 ? 'text-rose-600 font-bold' : 'text-slate-600'}>
                  {pillar.shortage > 0 ? pillar.shortage.toLocaleString() : '0'}
                </strong></span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
