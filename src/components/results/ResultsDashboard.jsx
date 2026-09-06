import React, { useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import confetti from 'canvas-confetti';
import { Trophy, Award } from 'lucide-react';
import { LokSabhaHemicycleChart } from '../parliament/LokSabhaHemicycleChart.jsx';

export const ResultsDashboard = () => {
  const { seats, parties, alliances, userHandle } = useGame();

  const partySeatTally = {};
  parties.forEach((p) => (partySeatTally[p.id] = 0));

  seats.forEach((seat) => {
    partySeatTally[seat.leadingPartyId] = (partySeatTally[seat.leadingPartyId] || 0) + 1;
  });

  const sortedParties = [...parties].sort((a, b) => (partySeatTally[b.id] || 0) - (partySeatTally[a.id] || 0));

  const winningParty = sortedParties[0];
  const winningPartySeats = partySeatTally[winningParty?.id || 'bjp'] || 0;
  const isMajorityReached = winningPartySeats >= 272;

  useEffect(() => {
    if (isMajorityReached) {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
      });
    }
  }, [isMajorityReached]);

  const stateBreakdown = {};
  seats.forEach((seat) => {
    if (!stateBreakdown[seat.state]) stateBreakdown[seat.state] = {};
    stateBreakdown[seat.state][seat.leadingPartyId] = (stateBreakdown[seat.state][seat.leadingPartyId] || 0) + 1;
  });

  const topPlayersEOILeaderboard = [
    { rank: 1, handle: userHandle || '@Candidate', party: 'BJP', eoiPoints: 4850, winRate: '78.5%', seatsWon: winningPartySeats || 240, role: 'Prime Minister / Party Leader', badge: '👑 Sovereign Kingmaker' },
    { rank: 2, handle: '@Mallikarjun_INC', party: 'INC', eoiPoints: 4120, winRate: '64.2%', seatsWon: partySeatTally['inc'] || 99, role: 'Leader of Opposition', badge: '⚔️ Opposition Titan' },
    { rank: 3, handle: '@Akhilesh_SP', party: 'SP', eoiPoints: 3750, winRate: '58.9%', seatsWon: partySeatTally['sp'] || 37, role: 'State Coalition Chief', badge: '🚲 Regional Champion' },
    { rank: 4, handle: '@Mamata_TMC', party: 'TMC', eoiPoints: 3480, winRate: '55.1%', seatsWon: partySeatTally['tmc'] || 29, role: 'CM & Federal Strategist', badge: '🌱 Grassroots Fortress' },
    { rank: 5, handle: '@Stalin_DMK', party: 'DMK', eoiPoints: 3290, winRate: '52.4%', seatsWon: partySeatTally['dmk'] || 22, role: 'State Alliance Chief', badge: '☀️ Southern Heavyweight' },
    { rank: 6, handle: '@Naidu_TDP', party: 'TDP', eoiPoints: 3100, winRate: '49.8%', seatsWon: partySeatTally['tdp'] || 16, role: 'Key Coalition Partner', badge: '🚲 Tech Visionary' },
    { rank: 7, handle: '@Kejriwal_AAP', party: 'AAP', eoiPoints: 2890, winRate: '45.0%', seatsWon: partySeatTally['aap'] || 10, role: 'UT Governor / Leader', badge: '🧹 Reform Architect' },
  ];

  return (
    <div className="space-y-6">
      {/* Whole Game Top Players EOI System Leaderboard Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-2xl font-bold shrink-0">
              🏆
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded border border-amber-500/30 uppercase tracking-widest">
                  GLOBAL EOI SYSTEM
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-mono font-bold px-2 py-0.5 rounded">
                  Election Outcome Index Active
                </span>
              </div>
              <h2 className="text-2xl font-black text-white font-display mt-1">Whole Game Top Players EOI Leaderboard</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Global player ranking based on EOI Points accumulated through election victories, rally turnout, parliamentary bills passed, and treasury governance.
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Global Rank</th>
                <th className="p-3">Player Handle</th>
                <th className="p-3">Party</th>
                <th className="p-3">Political Role</th>
                <th className="p-3 text-center">Win Rate</th>
                <th className="p-3 text-center">Seats Won</th>
                <th className="p-3 text-right">EOI Points</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {topPlayersEOILeaderboard.map((p) => (
                <tr key={p.rank} className="hover:bg-slate-950/60 transition">
                  <td className="p-3 font-mono font-black text-amber-400 text-sm">#{p.rank}</td>
                  <td className="p-3 font-bold text-white flex items-center gap-2">
                    {p.rank === 1 && <span>👑</span>}
                    <span>{p.handle}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-amber-300 font-mono">
                      {p.badge}
                    </span>
                  </td>
                  <td className="p-3 font-bold font-mono text-slate-300">{p.party}</td>
                  <td className="p-3 text-slate-400">{p.role}</td>
                  <td className="p-3 text-center font-mono font-bold text-emerald-400">{p.winRate}</td>
                  <td className="p-3 text-center font-mono font-bold text-amber-300">{p.seatsWon} / 543</td>
                  <td className="p-3 text-right font-mono font-black text-base text-amber-400">{p.eoiPoints.toLocaleString()} EOI</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isMajorityReached && (
        <div className="bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 rounded-3xl p-6 shadow-2xl text-slate-950 flex items-center justify-between animate-in zoom-in-95">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-950/20 rounded-2xl">
              <Trophy className="w-10 h-10 text-yellow-200" />
            </div>
            <div>
              <div className="text-xs font-black uppercase tracking-wider opacity-80">Absolute Majority Formed</div>
              <h2 className="text-2xl font-black">{winningParty.name} Wins Lok Sabha Mandate!</h2>
              <p className="text-xs font-semibold mt-0.5">
                Leader {winningParty.leader} commands {winningPartySeats} Seats (Crossed 272 Majority Threshold).
              </p>
            </div>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-3xl font-black">{winningPartySeats}</span>
            <span className="text-xs font-bold block opacity-90">/ 543 Seats</span>
          </div>
        </div>
      )}

      {/* Visual 543 Lok Sabha Chamber Hemicycle */}
      <LokSabhaHemicycleChart />

      <div className="game-card rounded-3xl p-6 shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
              <Award className="w-6 h-6 text-yellow-400" />
              Lok Sabha Parliament House Seat Composition (543)
            </h2>
            <p className="text-xs text-slate-400">272 Seats required for absolute majority to form the Government of India.</p>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
              <span className="w-3 h-3 rounded-full bg-yellow-400" />
              <span className="text-slate-300">Majority Mark: <strong>272 Seats</strong></span>
            </div>
          </div>
        </div>

        <div className="bg-slate-950 p-6 rounded-3xl border border-slate-800/80 space-y-4">
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-slate-400 uppercase">National Seat Share Breakdown</div>
            <div className="h-6 w-full bg-slate-900 rounded-xl overflow-hidden flex border border-slate-800">
              {sortedParties.map((party) => {
                const count = partySeatTally[party.id] || 0;
                if (count === 0) return null;
                const widthPct = (count / 543) * 100;
                return (
                  <div
                    key={party.id}
                    className="h-full font-mono text-[10px] font-bold flex items-center justify-center text-slate-950 overflow-hidden transition-all"
                    style={{ width: `${widthPct}%`, backgroundColor: party.color }}
                    title={`${party.shortName}: ${count} Seats`}
                  >
                    {widthPct > 3 ? `${party.shortName} ${count}` : ''}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {sortedParties.slice(0, 10).map((party) => {
            const count = partySeatTally[party.id] || 0;
            return (
              <div
                key={party.id}
                className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-center flex flex-col justify-between"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-lg">{party.symbol}</span>
                  <span className="font-extrabold text-xs text-white">{party.shortName}</span>
                </div>
                <div className="text-2xl font-black text-white mt-1" style={{ color: party.color }}>
                  {count}
                  <span className="text-[11px] font-normal text-slate-400 block">Seats</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="game-card rounded-3xl p-6 shadow-xl space-y-4">
        <h3 className="text-lg font-extrabold border-b border-slate-800 pb-3">
          State-by-State Seat Results Tally (28 States & 8 UTs)
        </h3>

        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] sticky top-0 z-10 border-b border-slate-800">
              <tr>
                <th className="p-3">State / Union Territory</th>
                <th className="p-3">Leading Party</th>
                <th className="p-3">Runner Up</th>
                <th className="p-3 text-right">Total Seats</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {Object.entries(stateBreakdown).map(([stateName, tally]) => {
                const sortedStateParties = Object.entries(tally).sort((a, b) => b[1] - a[1]);
                const topParty = parties.find((p) => p.id === sortedStateParties[0]?.[0]) || parties[0];
                const runnerParty = parties.find((p) => p.id === sortedStateParties[1]?.[0]);
                const totalStateSeats = Object.values(tally).reduce((a, b) => a + b, 0);

                return (
                  <tr key={stateName} className="hover:bg-slate-950/60 transition">
                    <td className="p-3 font-bold">{stateName}</td>
                    <td className="p-3">
                      <span className="font-extrabold flex items-center gap-1.5" style={{ color: topParty.color }}>
                        <span>{topParty.symbol}</span> {topParty.shortName} ({sortedStateParties[0]?.[1]} Seats)
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">
                      {runnerParty ? (
                        <span className="flex items-center gap-1.5">
                          <span>{runnerParty.symbol}</span> {runnerParty.shortName} ({sortedStateParties[1]?.[1]} Seats)
                        </span>
                      ) : (
                        '—'
                      )}
                    </td>
                    <td className="p-3 text-right font-mono font-bold">{totalStateSeats}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
