import React from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Building2, Award, Users, Flame } from 'lucide-react';

export const LokSabhaHemicycleChart = () => {
  const { seats, parties, governingPartyId } = useGame();

  // Tally seat counts per party
  const partySeatsMap = {};
  seats.forEach((s) => {
    partySeatsMap[s.leadingPartyId] = (partySeatsMap[s.leadingPartyId] || 0) + 1;
  });

  const sortedPartiesWithSeats = Object.entries(partySeatsMap)
    .map(([pId, count]) => {
      const p = parties.find((party) => party.id === pId) || {
        id: pId,
        shortName: pId.toUpperCase(),
        symbol: '🗳️',
        color: '#94a3b8',
      };
      return { ...p, count };
    })
    .sort((a, b) => b.count - a.count);

  const totalSeatsCount = seats.length; // 543
  const majorityNeeded = 272;

  // Treasury Benches (Governing Party & Allies) vs Opposition Benches
  const treasurySeats = seats.filter(
    (s) => s.leadingPartyId === governingPartyId || s.leadingPartyId === 'jdu' || s.leadingPartyId === 'ss' || s.leadingPartyId === 'tdp'
  ).length;

  const oppositionSeats = totalSeatsCount - treasurySeats;

  // Generate 543 dots arranged in 7 semi-circular arcs
  const generateHemicycleDots = () => {
    const dots = [];
    const rows = 9;
    const baseRadius = 60;
    const radiusIncrement = 18;
    let seatIndex = 0;

    // Party colors array matching the order of seats
    const partyColorSequence = [];
    seats.forEach((seat) => {
      const partyObj = parties.find((p) => p.id === seat.leadingPartyId);
      partyColorSequence.push({
        color: partyObj ? partyObj.color : '#94a3b8',
        symbol: partyObj ? partyObj.symbol : '🗳️',
        partyName: partyObj ? partyObj.shortName : 'OTH',
        seatName: seat.constituencyName,
        state: seat.state,
      });
    });

    for (let r = 0; r < rows; r++) {
      const radius = baseRadius + r * radiusIncrement;
      // Number of seats per arc row increases as radius increases
      const seatsInRow = Math.floor(35 + r * 14);

      for (let i = 0; i < seatsInRow; i++) {
        if (seatIndex >= totalSeatsCount) break;

        // Angle from 0 to PI (180 degrees semi-circle)
        const angle = (Math.PI / (seatsInRow - 1)) * i;
        // Convert polar coordinates to Cartesian (center at 200, 220)
        const cx = 220 + radius * Math.cos(Math.PI - angle);
        const cy = 210 - radius * Math.sin(angle);

        const seatData = partyColorSequence[seatIndex] || { color: '#94a3b8', symbol: '🗳️', partyName: 'OTH', seatName: 'Lok Sabha' };

        dots.push({
          id: seatIndex,
          cx,
          cy,
          ...seatData,
        });

        seatIndex++;
      }
      if (seatIndex >= totalSeatsCount) break;
    }

    return dots;
  };

  const dots = generateHemicycleDots();

  return (
    <div className="game-card rounded-3xl p-4 sm:p-6 shadow-2xl space-y-6 border border-amber-500/30 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono font-bold text-amber-400 uppercase tracking-widest">
            <Building2 className="w-4 h-4 text-amber-400" />
            House of the People • New Sansad Bhavan Chamber
          </div>
          <h3 className="text-xl sm:text-2xl font-black mt-1 font-display flex items-center gap-2">
            <span>🏛️</span> Lok Sabha 543 Seat Hemicycle Simulator
          </h3>
          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
            Interactive floor representation of 543 elected MPs. Article 79 Constitutional Legislative Assembly.
          </p>
        </div>

        {/* Majority Status Badge */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-right w-full sm:w-auto">
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Treasury Majority</div>
            <div className="text-base sm:text-lg font-black text-amber-300 font-mono">
              {treasurySeats} / {majorityNeeded} <span className="text-xs text-slate-400 font-normal">Seats</span>
            </div>
            <div className="text-[10px] text-emerald-400 font-bold">
              {treasurySeats >= majorityNeeded ? '✅ Simple Majority Formed' : '⚠️ Coalition Support Required'}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
        {/* SVG Hemicycle Diagram Column */}
        <div className="lg:col-span-2 relative flex flex-col items-center justify-center p-2 sm:p-4 bg-slate-950/60 rounded-3xl border border-slate-800/80 shadow-inner overflow-hidden w-full">
          {/* Speaker Podium Insignia */}
          <div className="absolute bottom-4 sm:bottom-6 text-center z-10">
            <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-base sm:text-xl">
                ⚖️
              </div>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono font-bold text-amber-400 block mt-0.5 sm:mt-1 uppercase tracking-widest">
              SPEAKER CHAIR
            </span>
          </div>

          <svg viewBox="0 0 440 230" className="w-full max-w-full sm:max-w-lg h-auto">
            {/* Center Floor Lines */}
            <line x1="220" y1="210" x2="220" y2="40" stroke="rgba(245, 158, 11, 0.25)" strokeDasharray="3 3" strokeWidth="1.5" />
            <line x1="100" y1="210" x2="340" y2="210" stroke="rgba(245, 158, 11, 0.2)" strokeWidth="1" />

            {/* Render 543 Seat Dots */}
            {dots.map((dot) => (
              <circle
                key={dot.id}
                cx={dot.cx}
                cy={dot.cy}
                r="3.2"
                fill={dot.color}
                className="transition-all duration-300 hover:r-5 hover:stroke-white hover:stroke-1 cursor-pointer"
              >
                <title>{`${dot.symbol} ${dot.partyName}: ${dot.seatName} (${dot.state})`}</title>
              </circle>
            ))}
          </svg>

          <div className="flex items-center justify-between w-full text-[10px] sm:text-[11px] font-mono text-slate-400 px-2 sm:px-4 pt-2 border-t border-slate-900">
            <span className="text-amber-400 font-bold">◄ TREASURY BENCHES</span>
            <span className="text-amber-300 font-extrabold">543 MPs</span>
            <span className="text-indigo-400 font-bold">OPPOSITION BENCHES ►</span>
          </div>
        </div>

        {/* Party Seat Leaderboard Box */}
        <div className="space-y-4">
          <div className="text-xs font-black uppercase text-amber-400 tracking-wider flex items-center gap-2 border-b border-slate-800 pb-2">
            <Award className="w-4 h-4" /> Party Seat Distribution (543 Total):
          </div>

          <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 custom-scrollbar">
            {sortedPartiesWithSeats.map((p) => {
              const pct = Number(((p.count / 543) * 100).toFixed(1));
              const isGovt = p.id === governingPartyId;

              return (
                <div
                  key={p.id}
                  className="p-2.5 rounded-2xl bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">{p.symbol}</span>
                    <div>
                      <div className="font-extrabold flex items-center gap-1.5">
                        <span style={{ color: p.color }}>{p.shortName}</span>
                        {isGovt && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-mono font-bold">
                            RULING
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{pct}% vote share</div>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <strong className="text-base font-black" style={{ color: p.color }}>
                      {p.count}
                    </strong>
                    <span className="text-[10px] text-slate-400 block font-normal">Seats</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
