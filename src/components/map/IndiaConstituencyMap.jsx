import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import {
  MapPin,
  Search,
  Vote,
  TrendingUp,
  Award,
  Users,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  X,
  Flame,
  ShieldCheck,
  Building2,
  Eye,
  Maximize2,
  ZoomIn
} from 'lucide-react';

const REAL_MAP_HOTSPOTS = [
  { id: 'JK', name: 'Jammu and Kashmir', seats: 5, cx: 33, cy: 11, color: '#6366f1' },
  { id: 'HP', name: 'Himachal Pradesh', seats: 4, cx: 35, cy: 18.5, color: '#8b5cf6' },
  { id: 'PB', name: 'Punjab', seats: 13, cx: 26, cy: 20.5, color: '#ec4899' },
  { id: 'HR', name: 'Haryana', seats: 10, cx: 28.5, cy: 25, color: '#f43f5e' },
  { id: 'DL', name: 'Delhi', seats: 7, cx: 30.5, cy: 26.5, color: '#ef4444' },
  { id: 'UK', name: 'Uttarakhand', seats: 5, cx: 36, cy: 21, color: '#a855f7' },
  { id: 'RJ', name: 'Rajasthan', seats: 25, cx: 20, cy: 32, color: '#f59e0b' },
  { id: 'UP', name: 'Uttar Pradesh', seats: 80, cx: 43, cy: 31, color: '#ff9933' },
  { id: 'GJ', name: 'Gujarat', seats: 26, cx: 12.5, cy: 45, color: '#eab308' },
  { id: 'MP', name: 'Madhya Pradesh', seats: 29, cx: 35, cy: 45, color: '#10b981' },
  { id: 'BH', name: 'Bihar', seats: 40, cx: 58, cy: 31, color: '#14b8a6' },
  { id: 'WB', name: 'West Bengal', seats: 42, cx: 66, cy: 41, color: '#06b6d4' },
  { id: 'JH', name: 'Jharkhand', seats: 14, cx: 58, cy: 40, color: '#0284c7' },
  { id: 'OD', name: 'Odisha', seats: 21, cx: 56, cy: 51, color: '#3b82f6' },
  { id: 'CG', name: 'Chhattisgarh', seats: 11, cx: 46, cy: 47, color: '#6366f1' },
  { id: 'MH', name: 'Maharashtra', seats: 48, cx: 26, cy: 57, color: '#f97316' },
  { id: 'TG', name: 'Telangana', seats: 17, cx: 40, cy: 59, color: '#ef4444' },
  { id: 'AP', name: 'Andhra Pradesh', seats: 25, cx: 39, cy: 70, color: '#84cc16' },
  { id: 'KA', name: 'Karnataka', seats: 28, cx: 27, cy: 73, color: '#eab308' },
  { id: 'TN', name: 'Tamil Nadu', seats: 39, cx: 32, cy: 84, color: '#22c55e' },
  { id: 'KL', name: 'Kerala', seats: 20, cx: 23.5, cy: 86, color: '#14b8a6' },
  { id: 'NE', name: 'Assam', seats: 14, cx: 80, cy: 30, color: '#f43f5e' },
];

export const IndiaConstituencyMap = ({ hideVoteMetrics = true }) => {
  const {
    seats,
    parties,
    castVoteInConstituency,
    postEVMVotesToConstituency,
    collectVotesThroughRally,
    selectedPartyId,
    primeMinisterDetails,
    tallyAllConstituenciesAndElectPM,
  } = useGame();

  const [selectedState, setSelectedState] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [hoveredHotspot, setHoveredHotspot] = useState(null);
  const [votingPartyId, setVotingPartyId] = useState(selectedPartyId || parties[0]?.id);
  const [voteCountInput, setVoteCountInput] = useState(25000);
  const [lastActionMessage, setLastActionMessage] = useState('');
  const [electionDay, setElectionDay] = useState('ALL');

  const stateList = Array.from(new Set(seats.map((s) => s.state))).sort();

  const filteredSeats = seats.filter((seat) => {
    const matchesState = selectedState === 'ALL' || seat.state === selectedState;
    const matchesSearch =
      seat.constituencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      seat.state.toLowerCase().includes(searchTerm.toLowerCase());
    const seatDay = (seat.id % 7) + 1;
    const matchesDay = electionDay === 'ALL' || seatDay === Number(electionDay);
    return matchesState && matchesSearch && matchesDay;
  });

  const handleCastVote = (e) => {
    e.preventDefault();
    if (!selectedSeat) return;

    const partyObj = parties.find((p) => p.id === votingPartyId);
    const result = castVoteInConstituency(selectedSeat.id, votingPartyId, Number(voteCountInput));

    if (result && result.success) {
      setLastActionMessage(`✅ Cast +${Number(voteCountInput).toLocaleString()} votes for ${partyObj?.shortName || 'Party'} in ${selectedSeat.constituencyName}!`);
      const updated = result.state.seats.find((s) => s.id === selectedSeat.id);
      if (updated) setSelectedSeat(updated);
    } else {
      setLastActionMessage(result?.message || 'Vote registration completed.');
    }
  };

  const handleTallyPM = () => {
    const res = tallyAllConstituenciesAndElectPM();
    if (res && res.message) {
      setLastActionMessage(res.message);
    }
  };

  const handleRunCampaignRally = () => {
    if (!selectedSeat) return;
    const res = collectVotesThroughRally({
      constituencyName: selectedSeat.constituencyName,
      costCrores: 5,
      scale: 'MEGA',
    });

    if (res && res.success) {
      setLastActionMessage(`📢 ${res.message}`);
      const updatedSeat = seats.find((s) => s.id === selectedSeat.id);
      if (updatedSeat) setSelectedSeat(updatedSeat);
    }
  };

  return (
    <div className="space-y-6">
      {/* Prime Minister (PM) Automatic Election & Majority Tracker Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border-2 border-indigo-500/40 rounded-3xl p-5 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-3xl shrink-0 shadow-lg">
            👑
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-mono font-bold bg-amber-500/20 text-amber-300 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                Incumbent Prime Minister of India
              </span>
              <span className="text-[10px] text-emerald-400 font-mono font-bold bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Majority Threshold: 272/543 Seats
              </span>
            </div>
            <h3 className="text-xl font-black text-white mt-1 flex items-center gap-2">
              {primeMinisterDetails?.pmName || 'Narendra Modi'}
              <span className="text-xs px-2.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">
                {primeMinisterDetails?.pmPartyShort || 'BJP'} ({primeMinisterDetails?.totalSeatsWon || 285} Seats)
              </span>
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Automatic PM Transition Rule: The party or alliance with the maximum Lok Sabha seats automatically assumes Prime Ministerial power.
            </p>
          </div>
        </div>

        <button
          onClick={handleTallyPM}
          className="w-full md:w-auto px-6 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-amber-500/20 transition flex items-center justify-center gap-2 shrink-0 transform active:scale-95"
        >
          <Award className="w-4 h-4 text-slate-950" />
          <span>🏆 TALLY 543 SEATS & ELECT PM AUTOMATICALLY</span>
        </button>
      </div>

      {lastActionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-extrabold flex items-center justify-between">
          <span>{lastActionMessage}</span>
          <button onClick={() => setLastActionMessage('')} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                Original Political Map of India
              </span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold border border-emerald-500/30">
                543 Clickable Seats Active
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-black text-white mt-2 font-display">
              Interactive Official Political Map of India
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Every state on the official map below is fully interactive and clickable! Click any state or constituency hotspot to inspect live voter sentiment, hold campaign rallies, and collect votes.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-slate-950/80 border border-slate-800 p-3 rounded-2xl shrink-0 font-mono">
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Total Seats</div>
              <div className="text-lg font-black text-amber-400 font-mono">543</div>
            </div>
            <div className="text-center px-3 border-r border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase font-bold">Majority Threshold</div>
              <div className="text-lg font-black text-emerald-400 font-mono">272</div>
            </div>
            <div className="text-center px-3">
              <div className="text-[10px] text-slate-400 uppercase font-bold">States / UTs</div>
              <div className="text-lg font-black text-sky-400 font-mono">36</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Map & Interactive Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Official Clickable Map Image Container (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Clickable Real Political Map
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-bold border border-amber-500/30">
              CLICK ANY STATE HOTSPOT
            </span>
          </div>

          {/* High-Resolution Map Container with Interactive Hotspots */}
          <div className="relative w-full rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl group">
            {/* Real Official Map Image */}
            <img
              src="/india_real_map.jpg"
              alt="Official Political Map of India"
              className="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition duration-300"
            />

            {/* Interactive SVG Hotspot Pins & Overlays */}
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-auto"
            >
              {REAL_MAP_HOTSPOTS.map((st) => {
                const stateSeats = seats.filter((s) => s.state === st.name);
                const leadPartyId = stateSeats[0]?.leadingPartyId;
                const partyObj = parties.find((p) => p.id === leadPartyId);
                const colorHex = partyObj ? partyObj.color : st.color;
                const isSelected = selectedState === st.name;
                const isHovered = hoveredHotspot?.id === st.id;

                return (
                  <g
                    key={st.id}
                    onClick={() => {
                      setSelectedState(st.name);
                      const matchingSeat = seats.find((s) => s.state === st.name);
                      if (matchingSeat) setSelectedSeat(matchingSeat);
                    }}
                    onMouseEnter={() => setHoveredHotspot(st)}
                    onMouseLeave={() => setHoveredHotspot(null)}
                    className="cursor-pointer group/node"
                  >
                    {/* Glowing Outer Ripple Circle */}
                    <circle
                      cx={st.cx}
                      cy={st.cy}
                      r={isHovered || isSelected ? 4.5 : 3.2}
                      fill={colorHex}
                      fillOpacity={isHovered || isSelected ? 0.8 : 0.45}
                      stroke={isSelected ? '#fbbf24' : '#ffffff'}
                      strokeWidth={isSelected ? 1.2 : 0.6}
                      className="transition-all duration-300 animate-pulse"
                    />

                    {/* Center Core Pin */}
                    <circle
                      cx={st.cx}
                      cy={st.cy}
                      r={1.4}
                      fill="#ffffff"
                      className="pointer-events-none"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Hover Tooltip Overlay */}
            {hoveredHotspot && (
              <div
                className="absolute z-30 bg-slate-950/95 border border-amber-500/50 text-white p-3 rounded-2xl shadow-2xl backdrop-blur-md pointer-events-none text-xs space-y-1 animate-in fade-in zoom-in-95"
                style={{
                  top: `${Math.min(75, Math.max(10, hoveredHotspot.cy))}%`,
                  left: `${Math.min(70, Math.max(10, hoveredHotspot.cx))}%`,
                }}
              >
                <div className="font-extrabold text-amber-400 flex items-center justify-between gap-3">
                  <span>📍 {hoveredHotspot.name}</span>
                  <span className="text-[10px] font-mono bg-amber-500/20 px-1.5 py-0.2 rounded text-amber-300">
                    {hoveredHotspot.seats} Seats
                  </span>
                </div>
                <div className="text-[11px] text-slate-300">
                  Click to inspect constituencies & collect votes!
                </div>
              </div>
            )}
          </div>

          {/* Quick Filter State Chips */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            <button
              onClick={() => setSelectedState('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition border ${
                selectedState === 'ALL'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              All India (543)
            </button>
            {['Tamil Nadu', 'Uttar Pradesh', 'Maharashtra', 'West Bengal', 'Bihar', 'Gujarat'].map((st) => (
              <button
                key={st}
                onClick={() => setSelectedState(st)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition border ${
                  selectedState === st
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Search & Interactive Constituency Grid (6 Cols) */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="space-y-3">
            {/* Days Filter */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 custom-scrollbar">
              <span className="text-[10px] font-bold text-slate-400 font-mono uppercase whitespace-nowrap mr-1">
                📅 ELECTION DAYS SCHEDULE:
              </span>
              <button
                onClick={() => setElectionDay('ALL')}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition border ${
                  electionDay === 'ALL'
                    ? 'bg-amber-500 text-slate-950 border-amber-400'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                All Days (543)
              </button>
              {[1, 2, 3, 4, 5, 6, 7].map((d) => (
                <button
                  key={d}
                  onClick={() => setElectionDay(String(d))}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition border ${
                    electionDay === String(d)
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  Day {d} Live Poll
                </button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search constituency or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/50"
                />
              </div>

              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full sm:w-52 bg-slate-950 border border-slate-800 text-amber-300 font-bold text-xs rounded-xl px-3 py-2 focus:outline-none cursor-pointer"
              >
                <option value="ALL" className="bg-slate-950 text-white">All 36 States & UTs (543)</option>
                {stateList.map((st) => (
                  <option key={st} value={st} className="bg-slate-950 text-white">
                    {st} ({seats.filter((s) => s.state === st).length} Seats)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="text-xs text-slate-400 flex items-center justify-between border-b border-slate-800/80 pb-2">
            <span>Showing <strong className="text-white font-mono">{filteredSeats.length}</strong> Seats</span>
            {selectedState !== 'ALL' && (
              <span className="text-amber-400 font-bold text-[10px]">State: {selectedState}</span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[480px] overflow-y-auto custom-scrollbar pr-1">
            {filteredSeats.map((seat) => {
              const leadPartyObj = parties.find((p) => p.id === seat.leadingPartyId) || parties[0];
              const seatDay = (seat.id % 7) + 1;

              return (
                <div
                  key={seat.id}
                  onClick={() => setSelectedSeat(seat)}
                  className={`p-4 rounded-2xl bg-slate-950 border transition cursor-pointer space-y-2 hover:border-amber-500/60 ${
                    selectedSeat?.id === seat.id
                      ? 'border-amber-500 bg-slate-900/90 shadow-lg shadow-amber-500/10'
                      : 'border-slate-800/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono">
                      {seat.state} • Day {seatDay} Poll
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      Seat #{seat.id}
                    </span>
                  </div>

                  <div className="font-extrabold text-sm text-white flex items-center justify-between">
                    <span>{seat.constituencyName}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 rounded-full shadow-md shrink-0 border border-white/20" style={{ backgroundColor: leadPartyObj.color }} />
                      <strong style={{ color: leadPartyObj.color }} className="font-bold">
                        {leadPartyObj.shortName}
                      </strong>
                    </div>
                    <span
                      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono border"
                      style={{
                        backgroundColor: `${leadPartyObj.color}20`,
                        color: leadPartyObj.color,
                        borderColor: `${leadPartyObj.color}40`,
                      }}
                    >
                      Leading Party
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Selected Constituency Polling & Campaign Action Modal */}
      {selectedSeat && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <button
              onClick={() => setSelectedSeat(null)}
              className="absolute top-5 right-5 p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl font-black shrink-0">
                🗳️
              </div>
              <div>
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest font-mono">
                  {selectedSeat.state} • Seat #{selectedSeat.id}
                </span>
                <h3 className="text-2xl font-black text-white font-display">
                  {selectedSeat.constituencyName} Constituency
                </h3>
              </div>
            </div>

            {lastActionMessage && (
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{lastActionMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Total Voters</div>
                <div className="text-white font-black text-sm font-mono mt-0.5">
                  {(selectedSeat.totalVoters || 1850000).toLocaleString()}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Voter Satisfaction</div>
                <div className="text-emerald-400 font-black text-sm font-mono mt-0.5">
                  {selectedSeat.voterSatisfaction || 68}%
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Leading Party</div>
                <div className="text-amber-400 font-black text-sm font-mono mt-0.5">
                  {parties.find((p) => p.id === selectedSeat.leadingPartyId)?.shortName || 'BJP'}
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                <div className="text-slate-400 text-[10px] font-bold uppercase">Victory Margin</div>
                <div className="text-sky-400 font-black text-sm font-mono mt-0.5">
                  +{selectedSeat.marginPercent}%
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="font-extrabold text-sm text-white flex items-center gap-2 border-b border-slate-800 pb-2">
                <Vote className="w-4 h-4 text-emerald-400" />
                Cast Constituency Votes & Polling Action
              </h4>

              <form onSubmit={handleCastVote} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Target Party:</label>
                    <select
                      value={votingPartyId}
                      onChange={(e) => setVotingPartyId(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-amber-300 font-bold text-xs p-2.5 rounded-xl focus:outline-none"
                    >
                      {parties.map((party) => (
                        <option key={party.id} value={party.id} className="bg-slate-950 text-white">
                          {party.symbol} {party.shortName} - {party.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400">Simulate Votes Cast:</label>
                    <input
                      type="number"
                      min="1000"
                      max="200000"
                      step="5000"
                      value={voteCountInput}
                      onChange={(e) => setVoteCountInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 text-white font-mono font-bold text-xs p-2.5 rounded-xl focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
                  >
                    <Vote className="w-4 h-4" /> Cast +{Number(voteCountInput).toLocaleString()} Votes
                  </button>

                  <button
                    type="button"
                    onClick={handleRunCampaignRally}
                    className="w-full sm:w-auto px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2 shrink-0"
                  >
                    <Flame className="w-4 h-4" /> Campaign Rally (₹5 Cr)
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
