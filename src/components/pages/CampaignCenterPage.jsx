import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { RallyOrganizerModal } from '../politician/RallyOrganizerModal.jsx';
import { IndiaConstituencyMap } from '../map/IndiaConstituencyMap.jsx';
import { LiveMessageDebateModal } from './LiveMessageDebateModal.jsx';
import { Megaphone, Flame, Tv, CheckCircle2, Users, Trophy, MapPin, Send, MessageSquare, Sparkles } from 'lucide-react';

export const CampaignCenterPage = () => {
  const {
    selectedPartyId,
    parties,
    userState,
    userDistrict,
    userConstituency,
    updateUserLocation,
    collectVotesThroughPressMeet,
    collectVotesThroughRally
  } = useGame();

  const [isRallyModalOpen, setIsRallyModalOpen] = useState(false);
  const [isLiveDebateModalOpen, setIsLiveDebateModalOpen] = useState(false);
  const [debateTopic, setDebateTopic] = useState('Economic Growth vs Social Welfare');
  const [pressHeadline, setPressHeadline] = useState('');
  const [pressStatement, setPressStatement] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Location selector state
  const [tempState, setTempState] = useState(userState || 'Tamil Nadu');
  const [tempDistrict, setTempDistrict] = useState(userDistrict || 'Coimbatore');
  const [tempConstituency, setTempConstituency] = useState(userConstituency || 'Coimbatore South');

  const handleUpdateLocationSubmit = (e) => {
    e.preventDefault();
    updateUserLocation({
      state: tempState,
      district: tempDistrict,
      constituency: tempConstituency,
    });
    setStatusMessage(`📍 Location updated! Primary constituency set to ${tempConstituency}, ${tempDistrict} (${tempState}).`);
  };

  const handlePublishPressMeet = (e) => {
    e.preventDefault();
    if (!pressHeadline.trim()) return;

    const res = collectVotesThroughPressMeet({
      headline: pressHeadline.trim(),
      statement: pressStatement.trim(),
    });

    if (res && res.success) {
      setStatusMessage(`🎙️ Press Conference Broadcasted! ${res.message}`);
      setPressHeadline('');
      setPressStatement('');
    }
  };

  const handleQuickMegaRally = () => {
    const res = collectVotesThroughRally({
      constituencyName: userConstituency,
      costCrores: 10,
      scale: 'MEGA',
    });

    if (res && res.success) {
      setStatusMessage(`🔥 Mega Rally Success! ${res.message}`);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner with Politician Profile & Location Badge */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-black shrink-0 shadow-lg">
            📢
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">National Campaign & Vote Collection Center</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                LIVE VOTE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Organize rallies, issue press meets, and participate in simultaneous live message debates to win votes across 543 Lok Sabha seats.
            </p>
          </div>
        </div>

        {/* Current Location Badge */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 shrink-0 text-xs font-mono">
          <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">YOUR PRIMARY CONSTITUENCY</div>
          <div className="text-base font-black text-amber-400 font-display mt-0.5">
            📍 {userConstituency}
          </div>
          <div className="text-[11px] text-slate-400">
            {userDistrict} • {userState}
          </div>
        </div>
      </div>

      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* POLITICIAN DETAILS & LOCATION SELECTOR PANEL */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
            <MapPin className="w-5 h-5 text-amber-400" />
            Politician Avatar Details & State/District/Constituency Setup
          </h3>
          <span className="text-xs text-slate-400 font-mono">Configure Election Base</span>
        </div>

        <form onSubmit={handleUpdateLocationSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="text-slate-400 font-bold block mb-1">Select State:</label>
            <select
              value={tempState}
              onChange={(e) => setTempState(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white font-bold p-2.5 rounded-xl"
            >
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Bihar">Bihar</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Kerala">Kerala</option>
              <option value="Delhi">Delhi</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Select District:</label>
            <input
              type="text"
              value={tempDistrict}
              onChange={(e) => setTempDistrict(e.target.value)}
              placeholder="e.g. Coimbatore / Varanasi / Lucknow"
              className="w-full bg-slate-950 border border-slate-700 text-white font-bold p-2.5 rounded-xl"
            />
          </div>

          <div>
            <label className="text-slate-400 font-bold block mb-1">Select Constituency Seat:</label>
            <input
              type="text"
              value={tempConstituency}
              onChange={(e) => setTempConstituency(e.target.value)}
              placeholder="e.g. Coimbatore South / Varanasi"
              className="w-full bg-slate-950 border border-slate-700 text-amber-300 font-bold p-2.5 rounded-xl"
            />
          </div>

          <div className="sm:col-span-3 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
            >
              Update Politician Base Constituency
            </button>
          </div>
        </form>
      </div>

      {/* Real High-Precision Constituency Map */}
      <IndiaConstituencyMap hideVoteMetrics={true} />

      {/* VOTE COLLECTING CONSOLE GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 1. Simultaneous Live Message TV Debate Mode (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-white flex items-center gap-2 font-display">
                <MessageSquare className="w-5 h-5 text-sky-400" />
                Simultaneous Message TV Debate
              </h3>
              <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded font-mono font-black animate-pulse">
                SIMULTANEOUS
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Face off against rival party chief in a live 45-second simultaneous message chat debate. Use rebuttal stat drops and applause reactions to win vote shares!
            </p>

            <div className="space-y-1 text-xs">
              <label className="text-slate-400 font-bold block">Debate Topic Agenda:</label>
              <select
                value={debateTopic}
                onChange={(e) => setDebateTopic(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-sky-300 font-bold p-2.5 rounded-xl"
              >
                <option value="Economic Growth vs Social Welfare">Economic Growth vs Welfare Guarantees</option>
                <option value="Youth Employment & MSP Relief">Youth Employment & Farmer MSP</option>
                <option value="Uniform Civil Code & Security">Uniform Civil Code & Security</option>
              </select>
            </div>
          </div>

          <button
            onClick={() => setIsLiveDebateModalOpen(true)}
            className="w-full py-3 bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Tv className="w-4 h-4" /> Start Simultaneous Message Debate
          </button>
        </div>

        {/* 2. Press Conference / Pressmeet Vote Collector (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-display">
            <Megaphone className="w-5 h-5 text-emerald-400" />
            Give National Press Conference / Pressmeet
          </h3>

          <form onSubmit={handlePublishPressMeet} className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold block mb-1">Pressmeet Headline:</label>
              <input
                type="text"
                required
                placeholder="e.g. Unveiling 100-Day Development Action Plan"
                value={pressHeadline}
                onChange={(e) => setPressHeadline(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold block mb-1">Statement / Media Policy Pledges:</label>
              <textarea
                rows={2}
                placeholder="Details of the media announcement..."
                value={pressStatement}
                onChange={(e) => setPressStatement(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-white p-2.5 rounded-xl"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-emerald-900/30 transition flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Broadcast Pressmeet (+40,000 Votes)
            </button>
          </form>
        </div>

        {/* 3. Mega Rally Vote Collector (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-extrabold text-white flex items-center gap-2 border-b border-slate-800 pb-3 font-display">
              <Flame className="w-5 h-5 text-amber-400" />
              Campaign Rally Vote Collector
            </h3>
            <p className="text-xs text-slate-400">
              Mobilize cadre ground workers and hold massive public Jan Sabhas in {userConstituency} to gain up to +250,000 votes!
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleQuickMegaRally}
              className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center justify-center gap-2"
            >
              <Flame className="w-4 h-4" /> Quick Mega Rally (₹10 Cr • +250k Votes)
            </button>

            <button
              onClick={() => setIsRallyModalOpen(true)}
              className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-bold text-xs rounded-xl transition"
            >
              Custom Rally Planner Console
            </button>
          </div>
        </div>
      </div>

      {/* Simultaneous Live Message Debate Modal */}
      <LiveMessageDebateModal
        isOpen={isLiveDebateModalOpen}
        onClose={() => setIsLiveDebateModalOpen(false)}
        topic={debateTopic}
      />

      {/* Rally Organizer Modal */}
      <RallyOrganizerModal isOpen={isRallyModalOpen} onClose={() => setIsRallyModalOpen(false)} />
    </div>
  );
};
