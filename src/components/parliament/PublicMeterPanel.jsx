import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { ShieldAlert, Award, BarChart3 } from 'lucide-react';

export const PublicMeterPanel = () => {
  const { governmentApproval, governingPartyId, parties, statePopularity } = useGame();
  const [selectedState, setSelectedState] = useState('NATIONAL');

  const governingParty = parties.find((p) => p.id === governingPartyId) || parties[0];

  // Mandate status badge determination
  let statusBadge = { label: 'Stable Governance', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' };
  if (governmentApproval >= 65) {
    statusBadge = { label: '🌟 Strong National Mandate', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40' };
  } else if (governmentApproval >= 45) {
    statusBadge = { label: '⚖️ Strained Governance & Coalition', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
  } else {
    statusBadge = { label: '🚨 Critical Anti-Incumbency Surge', color: 'bg-red-500/20 text-red-400 border-red-500/40' };
  }

  const statesList = Object.keys(statePopularity);

  // Get party popularity depending on selected state or national average
  const getPartyRating = (partyId) => {
    if (selectedState !== 'NATIONAL' && statePopularity[selectedState]) {
      return statePopularity[selectedState][partyId] || 35;
    }
    const party = parties.find((p) => p.id === partyId);
    return party ? party.approvalRating : 40;
  };

  const sortedParties = [...parties].sort((a, b) => getPartyRating(b.id) - getPartyRating(a.id));

  // Opposition surge index calculation
  const oppositionParties = parties.filter((p) => p.id !== governingPartyId && p.allianceId !== 'nda');
  const avgOppositionRating = Math.round(
    oppositionParties.reduce((acc, p) => acc + getPartyRating(p.id), 0) / (oppositionParties.length || 1)
  );

  return (
    <div className="space-y-6">
      {/* Top Banner: Government Approval & Public Sentiment */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Gauge Card */}
        <div className="lg:col-span-2 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Award className="w-4 h-4 text-orange-400" />
                Union Executive & Government Approval
              </div>
              <h2 className="text-2xl font-black text-white mt-1 flex items-center gap-3">
                <span>{governingParty.symbol}</span> {governingParty.name} Government
              </h2>
            </div>
            <div className={`px-3 py-1.5 rounded-xl border text-xs font-extrabold uppercase tracking-wide ${statusBadge.color}`}>
              {statusBadge.label}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 my-6 items-center">
            {/* Approval Score Circle Meter */}
            <div className="flex flex-col items-center justify-center p-4 bg-slate-950/60 rounded-2xl border border-slate-800/60 shadow-inner">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-800"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={
                      governmentApproval >= 60
                        ? 'text-emerald-500'
                        : governmentApproval >= 45
                        ? 'text-amber-500'
                        : 'text-red-500'
                    }
                    strokeDasharray={`${governmentApproval}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-4xl font-black text-white">{governmentApproval}%</span>
                  <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">Approval Rate</span>
                </div>
              </div>
            </div>

            {/* Metrics Breakdown & Regional Demographic Sentiment */}
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1.5">
                <div className="text-slate-400 font-extrabold text-[11px] uppercase tracking-wider">
                  Differentiated Demographic Sentiment:
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                    <span>🌾 Rural Agri:</span>
                    <strong className="text-emerald-400 font-mono">+{Math.round(governmentApproval * 0.9)}%</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                    <span>🏢 Urban Metro:</span>
                    <strong className="text-sky-400 font-mono">+{Math.round(governmentApproval * 1.05)}%</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                    <span>🏭 Industrial:</span>
                    <strong className="text-amber-400 font-mono">+{Math.round(governmentApproval * 0.95)}%</strong>
                  </div>
                  <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 flex justify-between items-center">
                    <span>🏙️ Semi-Urban:</span>
                    <strong className="text-purple-400 font-mono">+{Math.round(governmentApproval * 1.0)}%</strong>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 space-y-1">
                <div className="text-slate-400 font-bold flex justify-between">
                  <span>Anti-Incumbency Risk:</span>
                  <span className={governmentApproval < 45 ? 'text-red-400 font-bold' : 'text-amber-400'}>
                    {governmentApproval < 45 ? 'HIGH' : 'MODERATE'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  Harmful or rejected bills transfer voter sentiment directly to opposition parties.
                </p>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 bg-slate-950/40 px-4 py-2 rounded-xl border border-slate-800/40 flex items-center justify-between">
            <span>Leader: <strong>{governingParty.leader}</strong></span>
            <span>Parliament Majority Threshold: <strong>272 / 543 Seats</strong></span>
          </div>
        </div>

        {/* Opposition Anti-Incumbency Tracker */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 uppercase tracking-widest">
              <ShieldAlert className="w-4 h-4" />
              Opposition Anti-Incumbency Pulse
            </div>
            <h3 className="text-lg font-extrabold text-white mt-1">Opposition Momentum</h3>
            <p className="text-xs text-slate-400 mt-1">
              Average opposition party sentiment index when government policy falters or unpopular bills pass.
            </p>
          </div>

          <div className="p-5 bg-slate-950 rounded-2xl border border-slate-800 text-center space-y-2">
            <div className="text-3xl font-black text-amber-400">{avgOppositionRating}%</div>
            <div className="text-xs font-bold text-slate-400">Avg Opposition Popularity Index</div>
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden mt-2">
              <div className="bg-amber-400 h-full transition-all duration-500" style={{ width: `${avgOppositionRating}%` }} />
            </div>
          </div>

          <div className="text-xs text-slate-400 space-y-2">
            <div className="flex justify-between items-center border-b border-slate-800 pb-1.5">
              <span>Leading Opposition:</span>
              <span className="font-bold text-white">INC (Indian National Congress)</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Public Meter Effect:</span>
              <span className="text-emerald-400 font-semibold">Dynamic Election Factor</span>
            </div>
          </div>
        </div>
      </div>

      {/* Party Popularity Leaderboard with State Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-orange-400" />
              National & Regional Party Popularity Meter (0–100)
            </h3>
            <p className="text-xs text-slate-400">
              Popularity forms a core factor in multi-factor constituency voter retention, margins, and election turnout.
            </p>
          </div>

          {/* State Filter Selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-bold">Region:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-950 border border-slate-700 text-xs font-semibold text-white px-3 py-2 rounded-xl focus:outline-none focus:border-orange-500 shadow-sm"
            >
              <option value="NATIONAL">🇮🇳 National Average</option>
              {statesList.map((st) => (
                <option key={st} value={st}>
                  📍 {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Popularity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedParties.map((party) => {
            const rating = getPartyRating(party.id);
            const isGovt = party.id === governingPartyId;

            return (
              <div
                key={party.id}
                className="bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 rounded-2xl p-4 transition-all duration-200 shadow-md space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold shadow-inner"
                      style={{ backgroundColor: `${party.color}20`, border: `1.5px solid ${party.color}` }}
                    >
                      {party.symbol}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-sm text-white">{party.shortName}</span>
                        {isGovt && (
                          <span className="text-[10px] bg-orange-500/20 border border-orange-500/40 text-orange-400 px-1.5 py-0.5 rounded font-mono font-bold">
                            GOVT
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[150px]">{party.name}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xl font-black text-white">{rating}%</div>
                    <div className="text-[10px] text-slate-500 font-mono">Popularity</div>
                  </div>
                </div>

                {/* Meter Bar */}
                <div className="space-y-1">
                  <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${rating}%`, backgroundColor: party.color }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500">
                    <span>Ideology: {party.ideology}</span>
                    <span>Leader: {party.leader}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
