import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { LokSabhaHemicycleChart } from '../parliament/LokSabhaHemicycleChart.jsx';
import { LegislativeBillsPanel } from '../parliament/LegislativeBillsPanel.jsx';
import { PublicMeterPanel } from '../parliament/PublicMeterPanel.jsx';
import { GovernmentRevenueHub } from '../parliament/GovernmentRevenueHub.jsx';
import { CoalitionAlliancesPanel } from '../parliament/CoalitionAlliancesPanel.jsx';
import { ParliamentHansardStream } from '../parliament/ParliamentHansardStream.jsx';

export const ParliamentFloorPage = () => {
  const { speakerDetails } = useGame();

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl sm:text-3xl font-black shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl sm:text-2xl font-black text-white font-display">Parliament of India (Sansad Bhavan)</h2>
              <span className="text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold border border-amber-500/30">
                543 Seat Sovereign Floor
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Constitutional floor for introducing legislation, issuing party 3-line whips, certifying money bills, and voting on national bills.
            </p>
          </div>
        </div>

        {/* Speaker of the Lok Sabha Info Card */}
        <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30 flex items-center gap-3 shrink-0">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-2xl font-bold shrink-0">
            ⚖️
          </div>
          <div>
            <div className="text-[10px] text-slate-400 uppercase font-bold tracking-wider font-mono">
              SPEAKER OF THE LOK SABHA
            </div>
            <div className="text-sm font-black text-white font-display">{speakerDetails.name}</div>
            <div className="text-[10px] text-amber-300 font-bold font-mono">
              Party: {speakerDetails.partyShort}
            </div>
          </div>
        </div>
      </div>

      {/* 543 Seat Hemicycle Diagram */}
      <LokSabhaHemicycleChart />

      {/* Government Earning & Treasury Revenue Hub */}
      <GovernmentRevenueHub />

      {/* Visible Coalition Alliances Panel */}
      <CoalitionAlliancesPanel />

      {/* Parliamentary Hansard Floor Stream & 24H Speaker Election */}
      <ParliamentHansardStream />

      {/* Public Mandate & Executive Approval Panel */}
      <PublicMeterPanel />

      {/* Legislative Bills Panel */}
      <LegislativeBillsPanel />
    </div>
  );
};
