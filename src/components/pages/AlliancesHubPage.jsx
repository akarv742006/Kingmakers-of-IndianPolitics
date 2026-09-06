import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import {
  HeartHandshake,
  ShieldCheck,
  Trophy,
  Users,
  CheckCircle2,
  Plus,
  LogOut,
  UserCheck,
  Sparkles,
  ChevronRight,
  X,
  AlertCircle
} from 'lucide-react';

export const AlliancesHubPage = () => {
  const {
    parties,
    seats,
    alliances,
    selectedPartyId,
    createAlliance,
    leaveAlliance,
    joinAlliance,
    userHandle,
    role
  } = useGame();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newAllianceName, setNewAllianceName] = useState('');
  const [newAllianceShortName, setNewAllianceShortName] = useState('');
  const [newAllianceColor, setNewAllianceColor] = useState('#FF9933');
  const [newAllianceDescription, setNewAllianceDescription] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];
  const currentAlliance = alliances.find((a) => a.id === activeParty.allianceId);

  // Calculate seat count for each party from 543 seats
  const partySeatCounts = {};
  seats.forEach((seat) => {
    partySeatCounts[seat.leadingPartyId] = (partySeatCounts[seat.leadingPartyId] || 0) + 1;
  });

  // Calculate seat count per alliance
  const getAllianceSeatCount = (alliance) => {
    return alliance.memberPartyIds.reduce((sum, pid) => sum + (partySeatCounts[pid] || 0), 0);
  };

  // Unaligned seats (parties not in any alliance)
  const allAlliancePartyIds = new Set(alliances.flatMap((a) => a.memberPartyIds));
  const unalignedSeats = seats.filter((s) => !allAlliancePartyIds.has(s.leadingPartyId)).length;

  const handleCreateSubmit = (e) => {
    e.preventDefault();
    if (!newAllianceName.trim()) {
      setFeedbackMsg('Please enter a valid alliance name.');
      return;
    }

    const res = createAlliance({
      name: newAllianceName.trim(),
      shortName: newAllianceShortName.trim() || newAllianceName.slice(0, 4).toUpperCase(),
      color: newAllianceColor,
      description: newAllianceDescription.trim(),
    });

    if (res.success) {
      setFeedbackMsg(res.message);
      setIsCreateModalOpen(false);
      setNewAllianceName('');
      setNewAllianceShortName('');
      setNewAllianceDescription('');
    }
  };

  const handleLeaveAlliance = () => {
    const res = leaveAlliance(selectedPartyId);
    if (res) {
      setFeedbackMsg(res.message);
    }
  };

  const handleJoinAlliance = (allianceId) => {
    const res = joinAlliance(allianceId, selectedPartyId);
    if (res) {
      setFeedbackMsg(res.message);
    }
  };

  const colorPresets = [
    { label: 'Saffron / Orange', value: '#FF9933' },
    { label: 'Royal Blue', value: '#1976D2' },
    { label: 'Cyan / Teal', value: '#00BCD4' },
    { label: 'Emerald Green', value: '#2E7D32' },
    { label: 'Imperial Gold', value: '#FFD700' },
    { label: 'Crimson Red', value: '#D32F2F' },
    { label: 'Amethyst Purple', value: '#7B1FA2' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-3xl font-black shrink-0">
            🤝
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black text-white font-display">National Coalition & Alliances Hub</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                272 Majority Threshold
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Form pre-poll alliances, negotiate regional coalitions, or exit alliances to establish independent political sovereignty in the 543 Lok Sabha seats.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-center">
            <div className="text-[10px] text-slate-400 font-bold uppercase">Total Lok Sabha Seats</div>
            <div className="text-2xl font-black text-amber-400 font-mono">543</div>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-gold-action px-5 py-3.5 rounded-2xl text-xs font-black flex items-center gap-2 shadow-xl hover:scale-105 transition transform"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE NEW ALLIANCE</span>
          </button>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMsg && (
        <div className="bg-amber-500/10 border border-amber-500/40 p-4 rounded-2xl text-amber-300 text-xs font-bold flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
          <button
            onClick={() => setFeedbackMsg('')}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Current Player Party Leader Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-2xl">
            {activeParty.symbol || '☸️'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-amber-400 font-mono uppercase">
                YOUR PARTY: {activeParty.name} ({activeParty.shortName})
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                Leader: {userHandle}
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">
              Current Coalition Status:{' '}
              {currentAlliance ? (
                <strong className="text-amber-300 font-extrabold">{currentAlliance.name}</strong>
              ) : (
                <span className="text-emerald-400 font-semibold">Independent / Unaligned 3rd Force</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Controls for Party Leader */}
        <div className="flex items-center gap-2 flex-wrap">
          {currentAlliance ? (
            <button
              onClick={handleLeaveAlliance}
              className="px-4 py-2.5 rounded-xl bg-red-600/20 border border-red-500/40 text-red-300 hover:bg-red-600/30 hover:text-white font-extrabold text-xs flex items-center gap-2 transition shadow-md"
            >
              <LogOut className="w-4 h-4" />
              <span>LEAVE ALLIANCE ({currentAlliance.shortName})</span>
            </button>
          ) : (
            <span className="text-xs text-slate-400 font-mono">Select an alliance below to join coalition:</span>
          )}
        </div>
      </div>

      {/* Alliances Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alliances.map((alliance) => {
          const seatTotal = getAllianceSeatCount(alliance);
          const isMajority = seatTotal >= 272;
          const leaderParty = parties.find((p) => p.id === alliance.leaderPartyId);
          const isMemberOfThis = alliance.memberPartyIds.includes(selectedPartyId);
          const memberParties = parties.filter((p) => alliance.memberPartyIds.includes(p.id));

          return (
            <div
              key={alliance.id}
              className="bg-slate-900 border rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between relative overflow-hidden transition hover:border-slate-700"
              style={{ borderColor: isMemberOfThis ? alliance.color : 'rgba(51, 65, 85, 0.6)' }}
            >
              {/* Header Badge */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <span
                    className="text-xs font-mono font-bold px-2.5 py-1 rounded border uppercase"
                    style={{
                      backgroundColor: `${alliance.color}20`,
                      color: alliance.color,
                      borderColor: `${alliance.color}40`,
                    }}
                  >
                    {alliance.shortName || alliance.name}
                  </span>
                  <span className="text-lg font-black text-white font-mono">{seatTotal} / 543</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xl text-white font-display leading-snug">{alliance.name}</h3>
                  <div className="space-y-1 mt-1.5 text-xs">
                    <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                      <span>👑 Alliance Leader:</span>
                      <span>{leaderParty?.leader ? `${leaderParty.leader} (${leaderParty.shortName})` : (leaderParty?.name || alliance.leaderPartyId)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-emerald-400 font-mono font-bold">
                      <span>🪙 Alliance Treasury:</span>
                      <span>₹{(alliance.treasuryInCrores || (alliance.id === 'nda' ? 2500 : alliance.id === 'india' ? 1800 : 950)).toLocaleString()} Cr</span>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-slate-400">
                    <span>Lok Sabha Share</span>
                    <span>{((seatTotal / 543) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (seatTotal / 543) * 100)}%`,
                        backgroundColor: alliance.color || '#FF9933',
                      }}
                    />
                  </div>
                </div>

                {/* Member Parties list */}
                <div className="space-y-2 pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] uppercase font-mono font-black text-slate-400">
                    Coalition Member Parties ({memberParties.length})
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {memberParties.map((p) => (
                      <span
                        key={p.id}
                        className={`text-xs px-2.5 py-1 rounded-xl border flex items-center gap-1 font-semibold ${
                          p.id === selectedPartyId
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-bold'
                            : 'bg-slate-950 border-slate-800 text-slate-300'
                        }`}
                      >
                        <span>{p.symbol}</span>
                        <span>{p.shortName}</span>
                        <span className="text-[10px] opacity-75 font-mono">({partySeatCounts[p.id] || 0})</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Status & Join Action */}
              <div className="pt-4 border-t border-slate-800/80 space-y-3">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  {isMajority ? (
                    <span className="text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Treasury Government Majority
                    </span>
                  ) : (
                    <span className="text-amber-400 font-medium">Need {272 - seatTotal} more seats for 272 mark</span>
                  )}
                </div>

                {isMemberOfThis ? (
                  <div className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/40 text-amber-300 text-center text-xs font-black uppercase font-mono">
                    ✓ YOUR ALLIANCE MEMBER
                  </div>
                ) : (
                  <button
                    onClick={() => handleJoinAlliance(alliance.id)}
                    className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-amber-500 hover:bg-slate-800 text-slate-200 hover:text-amber-400 text-xs font-black transition flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 text-amber-400" />
                    <span>JOIN {alliance.shortName} COALITION</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* 3rd Force Unaligned Front Card */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                3RD ELEMENT / UNALIGNED KINGMAKERS
              </span>
              <span className="text-lg font-black text-white font-mono">{unalignedSeats} / 543</span>
            </div>

            <div>
              <h3 className="font-extrabold text-xl text-white font-display">Regional Swing Front</h3>
              <p className="text-xs text-slate-400 mt-1">Neutral Regional Parties & Independent Candidates</p>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>Lok Sabha Share</span>
                <span>{((unalignedSeats / 543) * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${(unalignedSeats / 543) * 100}%` }}
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              Uncommitted regional forces can turn the tide in post-poll coalition building and motion of confidence votes.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80">
            {!currentAlliance ? (
              <div className="w-full py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 text-center text-xs font-black uppercase font-mono">
                ✓ YOU ARE CURRENTLY UNALIGNED
              </div>
            ) : (
              <button
                onClick={handleLeaveAlliance}
                className="w-full py-2.5 rounded-xl bg-slate-950 border border-slate-700 hover:border-emerald-500 text-slate-300 text-xs font-black transition"
              >
                GO INDEPENDENT / UNALIGNED
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Create New Alliance */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/50 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
              <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 text-xl">
                🤝
              </div>
              <div>
                <h3 className="text-xl font-black text-white font-display">Create New Political Alliance</h3>
                <p className="text-xs text-slate-400">Establish a new national or regional coalition front.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                  Alliance Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newAllianceName}
                  onChange={(e) => setNewAllianceName(e.target.value)}
                  placeholder="e.g. Federal Democratic Front (FDF)"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                  Alliance Short Code / Abbreviation
                </label>
                <input
                  type="text"
                  value={newAllianceShortName}
                  onChange={(e) => setNewAllianceShortName(e.target.value)}
                  placeholder="e.g. FDF"
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl py-3 px-4 text-white text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-2">
                  Coalition Theme Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorPresets.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setNewAllianceColor(c.value)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        newAllianceColor === c.value
                          ? 'border-white ring-2 ring-amber-500 scale-105'
                          : 'border-slate-800 hover:border-slate-600'
                      }`}
                      style={{ backgroundColor: `${c.value}30`, color: c.value }}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-amber-400 uppercase mb-1">
                  Alliance Manifesto & Vision Statement
                </label>
                <textarea
                  rows={3}
                  value={newAllianceDescription}
                  onChange={(e) => setNewAllianceDescription(e.target.value)}
                  placeholder="State the core ideology and coalition objectives..."
                  className="w-full bg-slate-950 border border-slate-700 focus:border-amber-500 rounded-xl p-3 text-white text-sm focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-3 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs font-bold"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="btn-gold-action px-6 py-3 rounded-xl text-xs font-black shadow-lg"
                >
                  FORM ALLIANCE NOW
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
