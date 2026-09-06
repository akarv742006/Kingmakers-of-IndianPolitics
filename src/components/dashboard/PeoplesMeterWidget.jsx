import React from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Users, TrendingUp, ShieldCheck, AlertTriangle, Sparkles, MapPin } from 'lucide-react';

export const PeoplesMeterWidget = () => {
  const { governmentApproval, seats } = useGame();

  // Compute average voter satisfaction across 543 seats
  const avgVoterSatisfaction = seats && seats.length > 0
    ? Math.round(seats.reduce((acc, s) => acc + (s.voterSatisfaction || 60), 0) / seats.length)
    : 65;

  const antiIncumbencyRisk = Math.max(5, 100 - avgVoterSatisfaction);

  // Region breakdown calculation
  const regions = [
    { name: 'North India', stateMatch: ['Uttar Pradesh', 'Punjab', 'Haryana', 'Delhi'], score: Math.min(100, avgVoterSatisfaction + 4) },
    { name: 'West India', stateMatch: ['Maharashtra', 'Gujarat', 'Rajasthan'], score: Math.min(100, avgVoterSatisfaction + 2) },
    { name: 'East India', stateMatch: ['West Bengal', 'Bihar', 'Odisha'], score: Math.max(20, avgVoterSatisfaction - 3) },
    { name: 'South India', stateMatch: ['Tamil Nadu', 'Karnataka', 'Kerala', 'Telangana'], score: Math.max(25, avgVoterSatisfaction - 5) },
    { name: 'Central India', stateMatch: ['Madhya Pradesh', 'Chhattisgarh'], score: Math.min(100, avgVoterSatisfaction + 5) },
    { name: 'North-East', stateMatch: ['Assam', 'Tripura'], score: Math.min(100, avgVoterSatisfaction + 1) },
  ];

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
      {/* Widget Title Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
            👥
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider font-display">
              PEOPLE'S SATISFACTION METER
            </h3>
            <p className="text-[10px] text-slate-400 font-mono">Real-time Citizen Sentiment Index</p>
          </div>
        </div>

        <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
          543 Seats Polled
        </span>
      </div>

      {/* Main Gauges Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Public Approval Bar */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">Public Approval Rating</span>
            <span className="text-emerald-400 font-mono font-black">{governmentApproval}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${governmentApproval}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block">Based on Cabinet policies & economic delivery</span>
        </div>

        {/* Voter Satisfaction Bar */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold">Constituency Sentiment</span>
            <span className="text-sky-400 font-mono font-black">{avgVoterSatisfaction}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-sky-500 to-blue-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${avgVoterSatisfaction}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block">Grassroots MP local work score average</span>
        </div>

        {/* Anti-Incumbency Threat Meter */}
        <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              Anti-Incumbency Risk
            </span>
            <span className="text-amber-400 font-mono font-black">{antiIncumbencyRisk}%</span>
          </div>
          <div className="w-full bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
            <div
              className="bg-gradient-to-r from-amber-500 to-rose-500 h-full rounded-full transition-all duration-700"
              style={{ width: `${antiIncumbencyRisk}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-500 block">Voter fatigue against ruling coalition</span>
        </div>
      </div>

      {/* Regional Sentiment Chips Grid */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block font-mono">
          Regional Public Support Breakdown:
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {regions.map((reg) => (
            <div
              key={reg.name}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center justify-between text-[11px]"
            >
              <span className="text-slate-300 font-bold truncate">{reg.name}</span>
              <span
                className={`font-mono font-black ${
                  reg.score >= 60 ? 'text-emerald-400' : reg.score >= 45 ? 'text-amber-400' : 'text-rose-400'
                }`}
              >
                {reg.score}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
