import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Crown, Users, PlusCircle, ShieldCheck, Flame, Award, CheckCircle2 } from 'lucide-react';

export const CoalitionAlliancesPanel = () => {
  const {
    role,
    userHandle,
    parties,
    seats,
    alliances,
    createAlliance,
    joinAlliance,
    leaveAlliance,
    selectedPartyId,
  } = useGame();

  const [newAllianceName, setNewAllianceName] = useState('');
  const [allianceColor, setAllianceColor] = useState('#FF9933');
  const [statusMsg, setStatusMsg] = useState('');

  // Calculate seat tallies per party
  const partySeatCounts = {};
  seats.forEach((seat) => {
    partySeatCounts[seat.leadingPartyId] = (partySeatCounts[seat.leadingPartyId] || 0) + 1;
  });

  const handleCreateNewAlliance = (e) => {
    e.preventDefault();
    if (!newAllianceName.trim()) return;

    const res = createAlliance({
      name: newAllianceName.trim(),
      leaderPartyId: selectedPartyId,
      color: allianceColor,
    });
    if (res && res.message) setStatusMsg(res.message);
    setNewAllianceName('');
  };

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-2xl font-bold shrink-0">
            🤝
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-black uppercase text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">
                COALITION DESK
              </span>
              <span className="text-xs text-slate-400 font-mono">Visible to All Real Players Nationwide</span>
            </div>
            <h3 className="text-xl font-black text-white font-display mt-0.5">
              Live National Coalition & Alliance Fronts
            </h3>
          </div>
        </div>

        <div className="p-3 bg-slate-950 rounded-2xl border border-amber-500/30 font-mono text-right">
          <div className="text-[10px] text-slate-400 font-bold uppercase">LOK SABHA MAJORITY LINE</div>
          <div className="text-sm font-black text-amber-400">272 / 543 Seats</div>
        </div>
      </div>

      {statusMsg && (
        <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-xs font-bold text-amber-300 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Alliance Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {alliances && alliances.length > 0 ? (
          alliances.map((all) => {
            const memberPartyObjs = parties.filter((p) => all.memberPartyIds?.includes(p.id));
            const totalAllianceSeats = memberPartyObjs.reduce(
              (sum, p) => sum + (partySeatCounts[p.id] || 0),
              0
            );
            const isMajority = totalAllianceSeats >= 272;
            const isMyPartyMember = all.memberPartyIds?.includes(selectedPartyId);

            return (
              <div
                key={all.id}
                className={`p-5 rounded-3xl bg-slate-950 border transition space-y-4 shadow-xl ${
                  isMajority ? 'border-amber-500 shadow-amber-500/10' : 'border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white/20 shrink-0"
                      style={{ backgroundColor: all.color }}
                    />
                    <div>
                      <h4 className="font-extrabold text-base text-white">{all.name}</h4>
                      <div className="text-[11px] text-slate-400 font-mono">
                        Leader Party: <strong className="text-slate-200">{all.leaderPartyId.toUpperCase()}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-lg font-black font-mono text-white">
                      {totalAllianceSeats} <span className="text-xs text-slate-400 font-normal">/ 543</span>
                    </div>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                        isMajority
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800'
                      }`}
                    >
                      {isMajority ? '👑 GOVERNING MAJORITY' : 'OPPOSITION FRONT'}
                    </span>
                  </div>
                </div>

                {/* Member Parties List */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase font-mono">
                    Member Parties ({memberPartyObjs.length}):
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {memberPartyObjs.map((p) => (
                      <div
                        key={p.id}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-2 text-xs"
                      >
                        <span className="text-sm">{p.symbol || '☸️'}</span>
                        <span className="font-extrabold text-white">{p.shortName}</span>
                        <span className="text-slate-400 font-mono text-[10px]">
                          ({partySeatCounts[p.id] || 0} seats)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Join / Leave Action for Real Players */}
                <div className="pt-2 flex items-center justify-between border-t border-slate-800/80 text-xs">
                  {isMyPartyMember ? (
                    <button
                      onClick={() => {
                        const res = leaveAlliance(all.id);
                        if (res && res.message) setStatusMsg(res.message);
                      }}
                      className="px-4 py-2 bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-300 font-bold rounded-xl transition"
                    >
                      🚪 Leave Coalition Front
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const res = joinAlliance(all.id);
                        if (res && res.message) setStatusMsg(res.message);
                      }}
                      className="px-4 py-2 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-300 font-bold rounded-xl transition"
                    >
                      🤝 Join Alliance ({activeParty.shortName})
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-xs text-slate-400 p-6 text-center bg-slate-950 rounded-2xl border border-slate-800">
            No active coalitions formed yet. Create the first national alliance below!
          </div>
        )}
      </div>

      {/* Form New Coalition Alliance */}
      <form onSubmit={handleCreateNewAlliance} className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-3">
        <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
          <PlusCircle className="w-4 h-4 text-amber-400" /> Form New National Political Alliance Front:
        </h4>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            value={newAllianceName}
            onChange={(e) => setNewAllianceName(e.target.value)}
            placeholder="e.g. United Democratic Front (UDF) or Progressive Alliance..."
            className="flex-1 bg-slate-900 border border-slate-700 text-xs font-bold text-white p-3 rounded-xl focus:outline-none focus:border-amber-500 placeholder-slate-500"
          />

          <div className="flex items-center gap-2 shrink-0">
            <input
              type="color"
              value={allianceColor}
              onChange={(e) => setAllianceColor(e.target.value)}
              className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer"
            />

            <button
              type="submit"
              className="px-5 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs rounded-xl shadow-lg transition"
            >
              👑 Form Alliance Front
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
