import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { PublicMeterPanel } from '../parliament/PublicMeterPanel.jsx';
import { LegislativeBillsPanel } from '../parliament/LegislativeBillsPanel.jsx';
import { GovernmentCrisisDesk } from '../parliament/GovernmentCrisisDesk.jsx';
import { RallyOrganizerModal } from './RallyOrganizerModal.jsx';
import {
  Megaphone,
  Search,
  Coins,
  Award,
  Users,
  Sparkles,
  MapPin,
  Tv,
  Hammer,
  HeartHandshake,
  Building2,
  BarChart3,
  TrendingUp,
  Flame,
  GitBranch,
  GitMerge,
  Wallet,
  CheckCircle2,
  X,
} from 'lucide-react';

export const PoliticianDashboard = ({
  isNewPartyModalOpen,
  onCloseNewPartyModal,
}) => {
  const {
    selectedPartyId,
    parties,
    seats,
    submitCustomPartyApplication,
    holdRally,
    performMPWork,
    hostTVDebate,
    alliances,
    playerSalaryBalance,
    playerPopularity,
    splitParty,
    mergeParties,
  } = useGame();

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const [politicianTab, setPoliticianTab] = useState('seats');
  const [selectedState, setSelectedState] = useState('ALL');
  const [swingFilter, setSwingFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);

  // Modal State Controls
  const [isRallyModalOpen, setIsRallyModalOpen] = useState(false);
  const [isSplitModalOpen, setIsSplitModalOpen] = useState(false);
  const [isMergerModalOpen, setIsMergerModalOpen] = useState(false);

  // Party Split state
  const [splitMemberCount, setSplitMemberCount] = useState(15);
  const [splitPartyName, setSplitPartyName] = useState('Rashtriya Swaraj Party');
  const [splitShortName, setSplitShortName] = useState('RSP');
  const [splitSymbol, setSplitSymbol] = useState('⚡');

  // Party Merger state
  const [targetMergerPartyId, setTargetMergerPartyId] = useState(parties[1]?.id || 'inc');
  const [actionNotice, setActionNotice] = useState('');

  const [debateTopic, setDebateTopic] = useState('Economic Growth vs Welfare Guarantees');
  const [selectedDebateParties, setSelectedDebateParties] = useState(['bjp', 'inc', 'aap']);

  const [partyName, setPartyName] = useState('');
  const [shortName, setShortName] = useState('');
  const [symbol, setSymbol] = useState('⚡');
  const [ideology, setIdeology] = useState('Centrist');
  const [leaderName, setLeaderName] = useState('');
  const [manifesto, setManifesto] = useState('');

  const statesList = Array.from(new Set(seats.map((s) => s.state))).sort();

  const filteredSeats = seats.filter((seat) => {
    if (selectedState !== 'ALL' && seat.state !== selectedState) return false;
    if (swingFilter !== 'ALL' && seat.swingStatus !== swingFilter) return false;
    if (
      searchQuery &&
      !seat.constituencyName.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !seat.state.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  const partyLeadingSeats = seats.filter((s) => s.leadingPartyId === activeParty.id).length;

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    if (!partyName || !shortName || !leaderName) return;

    submitCustomPartyApplication({
      partyName,
      shortName,
      symbol,
      ideology,
      leaderName,
      applicantRole: 'Player Politician',
      manifesto: manifesto || 'Focus on economic growth, social justice, and transparent governance.',
    });

    onCloseNewPartyModal();
    setPartyName('');
    setShortName('');
    setLeaderName('');
    setManifesto('');
  };

  const handleExecuteMPWork = (category, title, cost) => {
    if (!selectedSeat) return;
    performMPWork(selectedSeat.id, category, title, cost);
    const updated = seats.find((s) => s.id === selectedSeat.id);
    if (updated) setSelectedSeat(updated);
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner / Crisis Widget */}
      <GovernmentCrisisDesk />

      {/* Hero Overview Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Active Party Card */}
        <div className="game-card rounded-2xl p-4.5 flex items-center gap-3.5 border border-amber-500/20">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl font-black shadow-md shrink-0 border"
            style={{ backgroundColor: `${activeParty.color}20`, borderColor: activeParty.color }}
          >
            {activeParty.symbol}
          </div>
          <div className="overflow-hidden">
            <div className="flex items-center gap-1.5">
              <h2 className="font-black text-base text-white truncate font-display">{activeParty.name}</h2>
              <span
                className="text-[9px] px-1.5 py-0.5 rounded font-mono font-black text-slate-950 shrink-0"
                style={{ backgroundColor: activeParty.color }}
              >
                {activeParty.shortName}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate">Leader: {activeParty.leader} • {activeParty.ideology}</p>
          </div>
        </div>

        {/* Player Personal Popularity & Daily Salary Card */}
        <div className="game-card rounded-2xl p-4.5 flex items-center gap-3.5 border border-emerald-500/20">
          <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 shrink-0">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-black tracking-wider font-display">Personal Salary & Popularity</div>
            <div className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              ₹{(playerSalaryBalance || 2.5).toFixed(2)} Cr <span className="text-xs text-white">({playerPopularity || 65}% Pop)</span>
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">Daily Salary Dispatched</div>
          </div>
        </div>
      </div>

      {/* Advanced Political Action Toolbar: Rallies, Party Split, Party Merger */}
      <div className="bg-slate-900/90 border border-slate-800 p-4 rounded-3xl flex flex-wrap items-center justify-between gap-3 shadow-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-1.5">
            <Flame className="w-4 h-4 text-amber-400" />
            Political Actions Desk
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsRallyModalOpen(true)}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
          >
            <Flame className="w-3.5 h-3.5" /> Organize Rally
          </button>

          <button
            onClick={() => setIsSplitModalOpen(true)}
            className="px-4 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 font-black text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <GitBranch className="w-3.5 h-3.5 text-rose-400" /> Party Split (10th Sch)
          </button>

          <button
            onClick={() => setIsMergerModalOpen(true)}
            className="px-4 py-2 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-black text-xs rounded-xl transition flex items-center gap-1.5"
          >
            <GitMerge className="w-3.5 h-3.5 text-indigo-400" /> Party Merger
          </button>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 game-card p-1.5 rounded-2xl border border-slate-800">
        <button
          onClick={() => setPoliticianTab('seats')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            politicianTab === 'seats'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          543 Seats & MP Work
        </button>

        <button
          onClick={() => setPoliticianTab('parliament')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            politicianTab === 'parliament'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Parliament & Bills
        </button>

        <button
          onClick={() => setPoliticianTab('public_meter')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            politicianTab === 'public_meter'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          Public Sentiment Meter
        </button>

        <button
          onClick={() => setPoliticianTab('debates')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all ${
            politicianTab === 'debates'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
          }`}
        >
          <Tv className="w-3.5 h-3.5" />
          TV Debates & Fronts
        </button>
      </div>

      {politicianTab === 'parliament' && <LegislativeBillsPanel />}
      {politicianTab === 'public_meter' && <PublicMeterPanel />}

      {politicianTab === 'seats' && (
        <div className="game-card rounded-2xl p-5 space-y-4 border border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-3.5">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2 font-display">
                <MapPin className="w-4 h-4 text-amber-400" />
                543 Lok Sabha Seats & MP Work Center
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Hold rallies, improve MP work score, and conduct Jan Darbars to retain seat margins.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search seat or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-slate-900 text-white text-xs pl-8 pr-3 py-1.5 rounded-xl border border-slate-800 focus:outline-none focus:border-amber-500 w-44 font-medium"
                />
              </div>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-950">All States (543)</option>
                {statesList.map((st) => (
                  <option key={st} value={st} className="bg-slate-950">
                    {st}
                  </option>
                ))}
              </select>

              <select
                value={swingFilter}
                onChange={(e) => setSwingFilter(e.target.value)}
                className="bg-slate-900 text-white text-xs font-semibold px-2.5 py-1.5 rounded-xl border border-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-950">All Swing Types</option>
                <option value="TOSS_UP" className="bg-slate-950">Toss-Up Seats</option>
                <option value="BATTLEGROUND" className="bg-slate-950">Battleground Seats</option>
                <option value="LEANING" className="bg-slate-950">Leaning Seats</option>
                <option value="SAFE" className="bg-slate-950">Safe Seats</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar">
            {filteredSeats.map((seat) => {
              const leadingParty = parties.find((p) => p.id === seat.leadingPartyId) || parties[0];
              const isUserLeading = seat.leadingPartyId === activeParty.id;

              return (
                <div
                  key={seat.id}
                  onClick={() => setSelectedSeat(seat)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between group hover:scale-[1.01] ${
                    isUserLeading
                      ? 'bg-slate-950/80 border-slate-700/80 hover:border-emerald-500/60'
                      : 'bg-slate-950/40 border-slate-800/80 hover:border-amber-500/60'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-400 font-mono text-[10px]">#{seat.id} • {seat.state}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          seat.swingStatus === 'TOSS_UP'
                            ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                            : seat.swingStatus === 'BATTLEGROUND'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-300'
                        }`}
                      >
                        {seat.swingStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="font-extrabold text-sm text-white group-hover:text-amber-400 transition flex items-center justify-between font-display">
                      {seat.constituencyName}
                      {seat.reservedCategory !== 'GEN' && (
                        <span className="text-[9px] bg-slate-800 text-slate-300 px-1 py-0.2 rounded font-mono">{seat.reservedCategory}</span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 truncate">Issue: {seat.keyIssue}</div>

                    <div className="mt-2 grid grid-cols-2 gap-1.5 text-[10px] bg-slate-900/80 p-1.5 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-400 block font-bold">MP Work:</span>
                        <strong className={seat.mpWorkScore >= 60 ? 'text-emerald-400' : 'text-amber-400'}>
                          {seat.mpWorkScore}/100
                        </strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-bold">Voter Retention:</span>
                        <strong className={seat.voterSatisfaction >= 65 ? 'text-sky-400' : 'text-red-400'}>
                          {seat.voterSatisfaction}%
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: leadingParty.color }} />
                      <span className="font-bold text-white text-[11px]">{leadingParty.shortName}</span>
                      <span className="text-slate-400 font-mono text-[10px]">(+{seat.marginPercent}%)</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        holdRally(seat.id, activeParty.id);
                      }}
                      className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-lg transition active:scale-95"
                    >
                      <Megaphone className="w-3 h-3" /> Rally ₹15Cr
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {politicianTab === 'debates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="game-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
              <Tv className="w-4 h-4 text-sky-400" />
              Prime Time National TV Debate Arena
            </h3>
            <p className="text-xs text-slate-400">
              Debate rival leaders on live national television to swing neutral voters and boost approval rating!
            </p>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Debate Topic</label>
                <input
                  type="text"
                  value={debateTopic}
                  onChange={(e) => setDebateTopic(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-medium focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Select Rival Parties to Challenge</label>
                <div className="flex flex-wrap gap-1.5">
                  {parties.map((p) => {
                    const isSelected = selectedDebateParties.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedDebateParties(selectedDebateParties.filter((id) => id !== p.id));
                          } else {
                            setSelectedDebateParties([...selectedDebateParties, p.id]);
                          }
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-slate-800 text-white border border-amber-500/40 shadow-sm'
                            : 'bg-slate-950 text-slate-500 border border-slate-800'
                        }`}
                      >
                        <span>{p.symbol}</span> {p.shortName}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={() => {
                  if (selectedDebateParties.length >= 2) {
                    hostTVDebate(debateTopic, selectedDebateParties);
                  }
                }}
                className="w-full py-2.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-black text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Tv className="w-4 h-4" /> Start Prime Time Debate
              </button>
            </div>
          </div>

          <div className="game-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
              <Users className="w-4 h-4 text-amber-400" />
              National Coalitions & Fronts
            </h3>

            <div className="space-y-2.5">
              {alliances.map((alliance) => {
                const totalSeats = seats.filter((s) => alliance.memberPartyIds.includes(s.leadingPartyId)).length;
                return (
                  <div key={alliance.id} className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800/80 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs text-white" style={{ color: alliance.color }}>
                        {alliance.name}
                      </span>
                      <span className="text-[11px] font-mono bg-slate-900 px-2 py-0.5 rounded text-amber-300 font-bold border border-slate-800">
                        {totalSeats} / 543 Seats
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Members: {alliance.memberPartyIds.map((id) => parties.find((p) => p.id === id)?.shortName).join(', ')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selected Seat Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] text-amber-400 font-mono font-bold">#{selectedSeat.id} • {selectedSeat.state}</span>
                <h3 className="text-base font-black text-white font-display">{selectedSeat.constituencyName} MP Work Desk</h3>
              </div>
              <button
                onClick={() => setSelectedSeat(null)}
                className="text-slate-400 hover:text-white text-xs bg-slate-900 px-2 py-1 rounded-lg border border-slate-800"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs bg-slate-900/90 p-3 rounded-xl border border-slate-800 font-mono">
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">Leading Party:</span>
                <strong className="text-white font-bold">{parties.find((p) => p.id === selectedSeat.leadingPartyId)?.name}</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">Voter Retention:</span>
                <strong className="text-sky-400 font-bold">{selectedSeat.voterSatisfaction}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">MP Work Score:</span>
                <strong className="text-emerald-400 font-bold">{selectedSeat.mpWorkScore}/100</strong>
              </div>
              <div>
                <span className="text-slate-400 block font-sans text-[10px]">MPLAD Fund:</span>
                <strong className="text-amber-400 font-bold">₹{selectedSeat.mpladFundCrores} Cr</strong>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-slate-300 block">Authorize Constituency MP Development Work</span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => handleExecuteMPWork('INFRASTRUCTURE', 'Village Concrete Roads & Rural Highway Nodes', 20)}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition space-y-0.5"
                >
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1 font-display">
                    <Hammer className="w-3.5 h-3.5" /> Roads & Highways
                  </div>
                  <div className="text-[10px] text-slate-400">Cost: ₹20 Cr • +25 Score</div>
                </button>

                <button
                  onClick={() => handleExecuteMPWork('HEALTHCARE', 'Sub-District Emergency Hospital & Dialysis Unit', 15)}
                  className="p-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 rounded-xl text-left transition space-y-0.5"
                >
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 font-display">
                    <HeartHandshake className="w-3.5 h-3.5" /> District Healthcare
                  </div>
                  <div className="text-[10px] text-slate-400">Cost: ₹15 Cr • +20 Score</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* New Party Registration Modal */}
      {isNewPartyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 max-w-md w-full shadow-2xl space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <h3 className="text-base font-black text-white font-display">Register New Party with ECI</h3>
              <button onClick={onCloseNewPartyModal} className="text-slate-400 hover:text-white text-xs">
                ✕
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-2.5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Party Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rashtriya Vikas Sena"
                  value={partyName}
                  onChange={(e) => setPartyName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Short Code</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. RVS"
                    value={shortName}
                    onChange={(e) => setShortName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Party Symbol</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 🦁"
                    value={symbol}
                    onChange={(e) => setSymbol(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Founder / Leader Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Name"
                  value={leaderName}
                  onChange={(e) => setLeaderName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Ideology</label>
                <select
                  value={ideology}
                  onChange={(e) => setIdeology(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                >
                  <option value="Right-Wing">Right-Wing</option>
                  <option value="Center-Right">Center-Right</option>
                  <option value="Centrist">Centrist</option>
                  <option value="Center-Left">Center-Left</option>
                  <option value="Left-Wing">Left-Wing</option>
                  <option value="Regional Populist">Regional Populist</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Manifesto Pledges</label>
                <textarea
                  rows={2}
                  placeholder="Focus on jobs, infrastructure, healthcare..."
                  value={manifesto}
                  onChange={(e) => setManifesto(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-2 text-xs text-white font-medium focus:outline-none focus:border-amber-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl transition shadow mt-1 active:scale-95"
              >
                Submit Registration to ECI ➔
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Interactive Rally Organizer Modal */}
      <RallyOrganizerModal
        isOpen={isRallyModalOpen}
        onClose={() => setIsRallyModalOpen(false)}
      />

      {/* Party Split Modal */}
      {isSplitModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsSplitModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <GitBranch className="w-5 h-5 text-rose-400" />
              Party Split (10th Schedule Rule)
            </h3>

            {actionNotice && (
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
                {actionNotice}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Defecting MP Count:</label>
                <input
                  type="number"
                  min="1"
                  max="300"
                  value={splitMemberCount}
                  onChange={(e) => setSplitMemberCount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 text-white font-mono p-2 rounded-xl"
                />
              </div>

              <div>
                <label className="text-slate-400 font-bold block mb-1">New Faction Party Name:</label>
                <input
                  type="text"
                  value={splitPartyName}
                  onChange={(e) => setSplitPartyName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Short Name:</label>
                  <input
                    type="text"
                    value={splitShortName}
                    onChange={(e) => setSplitShortName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-amber-300 p-2 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="text-slate-400 font-bold block mb-1">Symbol:</label>
                  <input
                    type="text"
                    value={splitSymbol}
                    onChange={(e) => setSplitSymbol(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 text-white p-2 rounded-xl text-center"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const res = splitParty(selectedPartyId, splitMemberCount, splitPartyName, splitShortName, splitSymbol);
                  if (res && res.message) setActionNotice(res.message);
                }}
                className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold rounded-xl transition shadow-lg shadow-rose-950/40"
              >
                Execute Faction Split
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Party Merger Modal */}
      {isMergerModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setIsMergerModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="text-lg font-black text-white flex items-center gap-2">
              <GitMerge className="w-5 h-5 text-indigo-400" />
              Party Merger Desk
            </h3>

            {actionNotice && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs">
                {actionNotice}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-bold block mb-1">Target Merger Partner Party:</label>
                <select
                  value={targetMergerPartyId}
                  onChange={(e) => setTargetMergerPartyId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-amber-300 font-bold p-2.5 rounded-xl"
                >
                  {parties.filter((p) => p.id !== selectedPartyId).map((p) => (
                    <option key={p.id} value={p.id} className="bg-slate-950 text-white">
                      {p.symbol} {p.shortName} - {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  const res = mergeParties(selectedPartyId, targetMergerPartyId);
                  if (res && res.message) setActionNotice(res.message);
                }}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold rounded-xl transition shadow-lg shadow-indigo-950/40"
              >
                Merge Party & Consolidate Seats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
