import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { STATE_ASSEMBLIES_DATA } from '../../data/stateAssembliesData.js';
import { IndiaConstituencyMap } from '../map/IndiaConstituencyMap.jsx';
import {
  Trophy,
  Search,
  Building2,
  Flame,
  BarChart3,
  Globe2,
} from 'lucide-react';

export const StateElectionsHub = () => {
  const {
    electionScope,
    setElectionScope,
    selectedStateAssemblyId,
    setSelectedStateAssemblyId,
    parties,
    selectedPartyId,
    holdRally,
  } = useGame();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('OVERVIEW');
  const [selectedDemographic, setSelectedDemographic] = useState('ALL');

  const currentAssembly =
    STATE_ASSEMBLIES_DATA.find((a) => a.id === selectedStateAssemblyId) || STATE_ASSEMBLIES_DATA[0];

  const rulingParty = parties.find((p) => p.id === currentAssembly.rulingPartyId) || parties[0];
  const playerParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const seatTally = {};
  currentAssembly.assemblySeats.forEach((seat) => {
    seatTally[seat.leadingPartyId] = (seatTally[seat.leadingPartyId] || 0) + 1;
  });

  const sortedTally = Object.entries(seatTally).sort((a, b) => b[1] - a[1]);
  const leadingPartyInState = parties.find((p) => p.id === (sortedTally[0]?.[0] || currentAssembly.rulingPartyId));

  const filteredSeats = currentAssembly.assemblySeats.filter((seat) => {
    const matchesSearch =
      seat.constituencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(seat.id).includes(searchQuery);
    const matchesDemo = selectedDemographic === 'ALL' || seat.demographicType === selectedDemographic;
    return matchesSearch && matchesDemo;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Interactive Indian Constituency Map */}
      <IndiaConstituencyMap />

      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-black text-orange-400 uppercase tracking-widest">
              <Globe2 className="w-4 h-4" />
              Indian Electoral System • Multi-Tier Elections Hub
            </div>
            <h1 className="text-3xl font-black text-white mt-1">State Legislative Assemblies & Lok Sabha</h1>
            <p className="text-xs text-slate-400 mt-1">
              Switch seamlessly between National Lok Sabha Parliamentary Mode (543 Seats) and major State Assembly (Vidhan Sabha) Elections.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setElectionScope('NATIONAL_LOK_SABHA')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition ${
                electionScope === 'NATIONAL_LOK_SABHA'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇮🇳 Lok Sabha (543 Seats)
            </button>

            <button
              onClick={() => setElectionScope('STATE_ASSEMBLY')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-xs transition ${
                electionScope === 'STATE_ASSEMBLY'
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-slate-950 shadow-lg'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ State Assemblies (Vidhan Sabha)
            </button>
          </div>
        </div>

        {electionScope === 'STATE_ASSEMBLY' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
              <span>Select State Assembly (Vidhan Sabha):</span>
              <span className="text-orange-400 font-mono">10 Major Assemblies Configured</span>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
              {STATE_ASSEMBLIES_DATA.map((asm) => {
                const isSelected = asm.id === selectedStateAssemblyId;
                const asmRuling = parties.find((p) => p.id === asm.rulingPartyId);
                return (
                  <button
                    key={asm.id}
                    onClick={() => setSelectedStateAssemblyId(asm.id)}
                    className={`flex items-center gap-3 px-5 py-3 rounded-2xl border text-xs whitespace-nowrap transition-all transform active:scale-95 shrink-0 ${
                      isSelected
                        ? 'bg-slate-800 text-white border-orange-500 shadow-xl ring-2 ring-orange-500/30'
                        : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-sm shrink-0 border"
                      style={{ backgroundColor: `${asm.bannerColor}20`, borderColor: asm.bannerColor, color: asm.bannerColor }}
                    >
                      {asmRuling?.symbol || '🏛️'}
                    </div>
                    <div className="text-left">
                      <div className="font-extrabold text-white">{asm.stateName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        {asm.totalSeats} Seats • Maj: {asm.majorityThreshold}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {electionScope === 'STATE_ASSEMBLY' ? (
        <div className="space-y-8">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-black shrink-0 border shadow-lg"
                  style={{ backgroundColor: `${rulingParty.color}20`, borderColor: rulingParty.color }}
                >
                  {rulingParty.symbol}
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2.5 py-0.5 rounded font-mono font-extrabold bg-orange-500/20 text-orange-400 border border-orange-500/30">
                      VIDHAN SABHA ELECTION
                    </span>
                    <span className="text-xs text-slate-400">
                      Chief Minister: <strong className="text-white">{currentAssembly.currentChiefMinister}</strong>
                    </span>
                  </div>
                  <h2 className="text-3xl font-black text-white mt-1">
                    {currentAssembly.stateName} Legislative Assembly ({currentAssembly.totalSeats} Seats)
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Ruling Party: <strong className="text-white">{rulingParty.name}</strong> ({rulingParty.shortName}) • Majority Threshold: <strong className="text-yellow-400 font-mono">{currentAssembly.majorityThreshold} Seats</strong>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Majority Mark</span>
                  <span className="text-lg font-black text-yellow-400 font-mono">{currentAssembly.majorityThreshold} Seats</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">State Leader</span>
                  <span className="text-lg font-black text-emerald-400">{leadingPartyInState?.shortName || 'TBD'}</span>
                </div>
                <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800 space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Your Party Seats</span>
                  <span className="text-lg font-black text-orange-400 font-mono">{seatTally[playerParty.id] || 0} Seats</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs font-black text-white">
                <span className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-orange-400" /> Assembly Floor Majority Progression
                </span>
                <span className="text-yellow-400 font-mono">Majority Line: {currentAssembly.majorityThreshold} / {currentAssembly.totalSeats} Seats</span>
              </div>

              <div className="w-full bg-slate-950 h-5 rounded-2xl overflow-hidden flex border border-slate-800 relative">
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-yellow-400 z-10 shadow-[0_0_8px_#facc15]"
                  style={{ left: `${(currentAssembly.majorityThreshold / currentAssembly.totalSeats) * 100}%` }}
                />

                {sortedTally.map(([partyId, count]) => {
                  const partyObj = parties.find((p) => p.id === partyId);
                  const pct = (count / currentAssembly.totalSeats) * 100;
                  return (
                    <div
                      key={partyId}
                      className="h-full transition-all flex items-center justify-center text-[10px] font-black text-slate-950 overflow-hidden"
                      style={{ width: `${pct}%`, backgroundColor: partyObj?.color || '#94a3b8' }}
                      title={`${partyObj?.shortName || partyId}: ${count} seats (${pct.toFixed(1)}%)`}
                    >
                      {pct > 5 && (partyObj?.shortName || partyId)}
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                {sortedTally.map(([partyId, count]) => {
                  const partyObj = parties.find((p) => p.id === partyId);
                  return (
                    <div key={partyId} className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: partyObj?.color || '#94a3b8' }} />
                      <span className="text-slate-300 font-bold">{partyObj?.shortName || partyId}:</span>
                      <span className="text-white font-mono font-black">{count} Seats</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-2">
              <div className="text-xs font-extrabold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" /> Key State Campaign Issues in {currentAssembly.stateName}:
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentAssembly.topIssues.map((issue, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-slate-900 border border-slate-800 rounded-xl text-xs font-semibold text-slate-300"
                  >
                    🔥 {issue}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('OVERVIEW')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition ${
                activeTab === 'OVERVIEW'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏛️ Assembly Overview
            </button>
            <button
              onClick={() => setActiveTab('SEATS')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition ${
                activeTab === 'SEATS'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📍 Constituency Grid ({filteredSeats.length})
            </button>
            <button
              onClick={() => setActiveTab('EXIT_POLL')}
              className={`px-5 py-2.5 rounded-2xl text-xs font-black transition ${
                activeTab === 'EXIT_POLL'
                  ? 'bg-slate-800 text-white border border-slate-700 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Assembly Exit Poll
            </button>
          </div>

          {activeTab === 'OVERVIEW' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-yellow-400" /> Chief Minister Candidate Odds
                  </h3>
                  <span className="text-xs font-mono font-bold text-orange-400">STATE RACE</span>
                </div>

                <div className="space-y-3">
                  {sortedTally.slice(0, 3).map(([partyId, count], idx) => {
                    const partyObj = parties.find((p) => p.id === partyId);
                    const isRuling = partyId === currentAssembly.rulingPartyId;
                    const oddsPct = Math.min(95, Math.round((count / currentAssembly.totalSeats) * 100 + (isRuling ? 10 : 0)));
                    return (
                      <div key={partyId} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                        <div className="flex justify-between items-center text-xs">
                          <div className="flex items-center gap-3">
                            <span className="text-lg font-black font-mono text-slate-500">#{idx + 1}</span>
                            <div>
                              <div className="font-extrabold text-white">{partyObj?.leader || 'Party Candidate'}</div>
                              <div className="text-[10px] text-slate-400">{partyObj?.name} ({partyObj?.shortName})</div>
                            </div>
                          </div>
                          <span className="font-mono font-black text-emerald-400 text-sm">{oddsPct}% Win Odds</span>
                        </div>

                        <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{ width: `${oddsPct}%`, backgroundColor: partyObj?.color || '#3b82f6' }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-4 shadow-xl">
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h3 className="text-lg font-black text-white flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-400" /> Demographic Constituency Mix
                  </h3>
                  <span className="text-xs font-mono font-bold text-slate-400">REGION ANALYSIS</span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-emerald-400 block uppercase">🌾 Rural & Agri Seats</span>
                    <span className="text-2xl font-black text-white font-mono">
                      {currentAssembly.assemblySeats.filter((s) => s.demographicType === 'RURAL_AGRI').length}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Agri Subsidies & Welfare Priority</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-blue-400 block uppercase">🏢 Urban & Metro Seats</span>
                    <span className="text-2xl font-black text-white font-mono">
                      {currentAssembly.assemblySeats.filter((s) => s.demographicType === 'URBAN_METRO').length}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Infra & Tech Employment Priority</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-purple-400 block uppercase">🏭 Industrial Coastal</span>
                    <span className="text-2xl font-black text-white font-mono">
                      {currentAssembly.assemblySeats.filter((s) => s.demographicType === 'INDUSTRIAL_COASTAL').length}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Economy & Trade Priority</span>
                  </div>

                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-1">
                    <span className="text-[10px] font-bold text-amber-400 block uppercase">🏙️ Semi-Urban Seats</span>
                    <span className="text-2xl font-black text-white font-mono">
                      {currentAssembly.assemblySeats.filter((s) => s.demographicType === 'SEMI_URBAN').length}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Education & Youth Skills</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SEATS' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-md">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={`Search ${currentAssembly.stateName} assembly seats...`}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white pl-9 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-400">Demographic:</span>
                  <select
                    value={selectedDemographic}
                    onChange={(e) => setSelectedDemographic(e.target.value)}
                    className="bg-slate-950 border border-slate-700 text-xs text-white p-2.5 rounded-xl font-bold"
                  >
                    <option value="ALL">All Demographics</option>
                    <option value="RURAL_AGRI">Rural & Agri</option>
                    <option value="URBAN_METRO">Urban Metro</option>
                    <option value="INDUSTRIAL_COASTAL">Industrial Coastal</option>
                    <option value="SEMI_URBAN">Semi-Urban</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredSeats.slice(0, 48).map((seat) => {
                  const leadingObj = parties.find((p) => p.id === seat.leadingPartyId) || parties[0];
                  return (
                    <div
                      key={seat.id}
                      className="bg-slate-900 border border-slate-800 hover:border-slate-700 p-4 rounded-2xl shadow-lg space-y-3 transition"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-mono text-slate-400 block font-bold">#{seat.id}</span>
                          <h4 className="text-sm font-extrabold text-white">{seat.constituencyName}</h4>
                        </div>
                        {seat.reservedCategory !== 'GEN' && (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                            {seat.reservedCategory}
                          </span>
                        )}
                      </div>

                      <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: leadingObj.color }}
                          />
                          <span className="font-bold text-white">{leadingObj.shortName}</span>
                        </div>
                        <span className="text-slate-400 text-[10px]">Lead</span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-400">
                        <span>Turnout: <strong className="text-white font-mono">{seat.currentTurnoutPercent}%</strong></span>
                        <button
                          onClick={() => holdRally(seat.id, selectedPartyId)}
                          className="px-2.5 py-1 bg-orange-500/20 hover:bg-orange-500 text-orange-300 hover:text-slate-950 font-bold rounded-lg border border-orange-500/30 transition text-[10px]"
                        >
                          Campaign ⚡
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'EXIT_POLL' && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-xl">
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-xs font-mono font-bold text-orange-400 uppercase">MEDIA EXIT POLL SIMULATION</span>
                  <h3 className="text-xl font-extrabold text-white mt-0.5">{currentAssembly.stateName} Vidhan Sabha Projection</h3>
                </div>
                <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-xl">
                  Sample Size: 85,000 Voters
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {sortedTally.map(([partyId, count]) => {
                  const partyObj = parties.find((p) => p.id === partyId);
                  const projMin = Math.max(0, count - 12);
                  const projMax = count + 14;
                  return (
                    <div key={partyId} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{partyObj?.symbol}</span>
                          <span className="font-extrabold text-white text-sm">{partyObj?.shortName}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-amber-400">
                          {projMin} – {projMax} Seats
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Projected Vote Share: <strong className="text-white font-mono">{(partyObj?.voteSharePercent || 5).toFixed(1)}%</strong>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-orange-500/10 border border-orange-500/30 rounded-3xl flex items-center justify-center mx-auto text-3xl">
            🇮🇳
          </div>
          <h2 className="text-2xl font-black text-white">Lok Sabha National Election Mode Active</h2>
          <p className="text-xs text-slate-400 max-w-xl mx-auto">
            You are currently viewing the 543 Lok Sabha Parliamentary Constituencies. Select "State Assemblies (Vidhan Sabha)" above to switch into state elections mode across UP, Maharashtra, Bengal, Bihar, Tamil Nadu, and more!
          </p>
        </div>
      )}
    </div>
  );
};
