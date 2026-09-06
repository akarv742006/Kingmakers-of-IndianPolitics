import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { Flame, Play, Pause, FastForward, RotateCcw, Zap, Sliders, ShieldAlert, Landmark, Building2, Coins, CheckCircle2 } from 'lucide-react';

export const AdminDashboard = () => {
  const {
    isSimulationRunning,
    toggleSimulation,
    simulationSpeed,
    setSimulationSpeed,
    triggerEvent,
    resetGame,
    events,
    unionBudgetAllocations,
    stateBudgetAllocations,
    allocateCentralAndStateBudgets,
    triggerSuddenEmergencyCrisis,
  } = useGame();

  const [localUnionBudgets, setLocalUnionBudgets] = useState(unionBudgetAllocations);
  const [localStateBudgets, setLocalStateBudgets] = useState(stateBudgetAllocations);
  const [allocationNotes, setAllocationNotes] = useState('Special Devolution & Infrastructure Grant Package');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  const handleApplyBudget = (e) => {
    e.preventDefault();
    allocateCentralAndStateBudgets({
      unionPortfolios: localUnionBudgets,
      stateDevolutions: localStateBudgets,
      notes: allocationNotes,
    });
    setIsSuccessMessage(true);
    setTimeout(() => setIsSuccessMessage(false), 4000);
  };

  const totalUnionBudget = Object.values(localUnionBudgets).reduce((a, b) => a + Number(b), 0);
  const totalStateBudget = Object.values(localStateBudgets).reduce((a, b) => a + Number(b), 0);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="game-card rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
            <Flame className="w-9 h-9" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">Admin & Simulation Master Engine</h2>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-400 font-mono font-bold border border-red-500/30">
                GOD MODE CONSOLE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Allocate Union & State budgets for PM, Central Cabinet Ministers, and Chief Ministers (CMs).
            </p>
          </div>
        </div>

        <button
          onClick={resetGame}
          className="bg-red-600/80 hover:bg-red-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl transition shadow-lg shadow-red-900/30 flex items-center gap-1.5"
        >
          <RotateCcw className="w-4 h-4" /> Reset Simulation State
        </button>
      </div>

      {/* Main Budget Allocation Console for PM, Central Ministers & State CMs */}
      <div className="game-card rounded-3xl p-6 shadow-2xl space-y-6 border border-amber-500/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
              <Landmark className="w-4 h-4 text-amber-400" /> Union Finance Commission & Central Treasury Allocation Desk
            </div>
            <h3 className="text-xl font-black mt-1">Allocate Union Budget to PM, Central Ministers & All State CMs</h3>
            <p className="text-xs text-slate-400 mt-1">
              Directly distribute central fiscal grants (in ₹ Crores). Allocations boost state development, CM voter satisfaction, and party political capital!
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-amber-500/30 text-amber-300">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Union Cabinet Budget:</span>
              <strong className="text-base font-black">₹{totalUnionBudget.toLocaleString()} Cr</strong>
            </div>
            <div className="p-3 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-emerald-300">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">CM State Grants:</span>
              <strong className="text-base font-black">₹{totalStateBudget.toLocaleString()} Cr</strong>
            </div>
          </div>
        </div>

        {isSuccessMessage && (
          <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in zoom-in-95">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <span>Success! Budget allocated to PM, Central Ministers, and Chief Ministers. Breaking news broadcasted to nation!</span>
          </div>
        )}

        <form onSubmit={handleApplyBudget} className="space-y-6">
          {/* Section 1: Prime Minister & Central Cabinet Ministries */}
          <div className="space-y-3">
            <div className="text-xs font-black uppercase text-amber-400 flex items-center gap-2 tracking-wider">
              <Coins className="w-4 h-4" /> 1. Prime Minister & Central Union Ministry Portfolios (₹ Crores):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
              {[
                { key: 'defence', label: '🛡️ Defence Ministry (PM / Defence Min)' },
                { key: 'infrastructure', label: '🛣️ Road & National Infra (Infra Min)' },
                { key: 'healthcare', label: '🏥 Healthcare & Ayushman (Health Min)' },
                { key: 'agriculture', label: '🌾 Agri & Farmers Welfare (Agri Min)' },
                { key: 'education', label: '🎓 Education & Skill (Education Min)' },
                { key: 'ruralDev', label: '🚜 Rural Development (Rural Min)' },
              ].map((item) => (
                <div key={item.key} className="p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1.5">
                  <label className="font-extrabold block text-slate-300">{item.label}</label>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 font-mono">₹</span>
                    <input
                      type="number"
                      step="5000"
                      min="0"
                      value={localUnionBudgets[item.key] || 0}
                      onChange={(e) =>
                        setLocalUnionBudgets({ ...localUnionBudgets, [item.key]: Number(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-500"
                    />
                    <span className="text-slate-400 font-mono text-[11px]">Cr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Chief Ministers State Devolution (10 States) */}
          <div className="space-y-3 pt-2 border-t border-slate-800">
            <div className="text-xs font-black uppercase text-emerald-400 flex items-center gap-2 tracking-wider">
              <Building2 className="w-4 h-4" /> 2. State Chief Ministers (CMs) Devolution & Special Grant Allocations:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 text-xs">
              {Object.keys(localStateBudgets).map((st) => (
                <div key={st} className="p-3 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-1">
                  <label className="font-extrabold block text-slate-300 truncate">📍 CM {st}</label>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-500 font-mono text-[10px]">₹</span>
                    <input
                      type="number"
                      step="1000"
                      min="0"
                      value={localStateBudgets[st] || 0}
                      onChange={(e) =>
                        setLocalStateBudgets({ ...localStateBudgets, [st]: Number(e.target.value) })
                      }
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl p-1.5 font-mono font-bold text-emerald-300 focus:outline-none focus:border-emerald-500 text-xs"
                    />
                    <span className="text-slate-400 font-mono text-[10px]">Cr</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allocation Directive Note & Submit */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-800">
            <div className="w-full sm:w-2/3">
              <label className="text-xs font-bold text-slate-400 block mb-1">Union Budget Policy Directive Note:</label>
              <input
                type="text"
                value={allocationNotes}
                onChange={(e) => setAllocationNotes(e.target.value)}
                placeholder="e.g. Special Infrastructure & Farmer Support Package 2026..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black text-xs rounded-2xl shadow-xl transition active:scale-95 flex items-center justify-center gap-2"
            >
              <Landmark className="w-4 h-4" /> Dispatch Budget to PM, Central Ministers & CMs
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Simulation Speed & Engine Controls */}
        <div className="game-card rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-extrabold border-b border-slate-800 pb-3 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-red-400" />
            Simulation Clock Controls
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
              <div>
                <span className="text-xs text-slate-400 font-bold block">Engine State</span>
                <span className="text-sm font-extrabold flex items-center gap-1.5 mt-0.5">
                  <span className={`w-2.5 h-2.5 rounded-full ${isSimulationRunning ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
                  {isSimulationRunning ? 'RUNNING (LIVE)' : 'PAUSED'}
                </span>
              </div>

              <button
                onClick={toggleSimulation}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl flex items-center gap-2"
              >
                {isSimulationRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                {isSimulationRunning ? 'Pause Engine' : 'Resume Engine'}
              </button>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 block mb-2">Clock Speed Multiplier</label>
              <div className="grid grid-cols-3 gap-3">
                {[1, 2, 5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setSimulationSpeed(spd)}
                    className={`py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center justify-center gap-1 ${
                      simulationSpeed === spd
                        ? 'bg-red-600 text-white shadow-lg shadow-red-900/40 border border-red-500'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                    }`}
                  >
                    <FastForward className="w-3.5 h-3.5" /> {spd}x Speed
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sudden Emergency Crisis Injector */}
        <div className="game-card rounded-3xl p-6 shadow-xl space-y-4">
          <h3 className="text-lg font-extrabold border-b border-slate-800 pb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-400" />
            Sudden Emergency Crisis Injector
          </h3>

          <p className="text-xs text-slate-400">
            Broadcast high-priority national emergency events (Floods, War, Market Crash, Pandemic) live to all connected players simultaneously!
          </p>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => triggerSuddenEmergencyCrisis('FLOOD')}
              className="p-3 bg-blue-950/60 border border-blue-500/40 hover:bg-blue-900/60 text-blue-200 text-xs font-extrabold rounded-xl transition flex items-center gap-1.5"
            >
              🌊 Flash Flood & Cyclone
            </button>

            <button
              type="button"
              onClick={() => triggerSuddenEmergencyCrisis('WAR')}
              className="p-3 bg-red-950/60 border border-red-500/40 hover:bg-red-900/60 text-red-200 text-xs font-extrabold rounded-xl transition flex items-center gap-1.5"
            >
              ⚔️ War & Border Security
            </button>

            <button
              type="button"
              onClick={() => triggerSuddenEmergencyCrisis('FINANCIAL_CRASH')}
              className="p-3 bg-amber-950/60 border border-amber-500/40 hover:bg-amber-900/60 text-amber-200 text-xs font-extrabold rounded-xl transition flex items-center gap-1.5"
            >
              📉 Stock Market Crash
            </button>

            <button
              type="button"
              onClick={() => triggerSuddenEmergencyCrisis('PANDEMIC')}
              className="p-3 bg-emerald-950/60 border border-emerald-500/40 hover:bg-emerald-900/60 text-emerald-200 text-xs font-extrabold rounded-xl transition flex items-center gap-1.5"
            >
              ☣️ Pandemic Health Alert
            </button>
          </div>

          <button
            onClick={triggerEvent}
            className="w-full py-3 bg-gradient-to-r from-amber-600 to-red-600 hover:from-amber-500 hover:to-red-500 text-white font-black text-xs rounded-2xl shadow-xl transition flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" /> Trigger Random Breaking Event
          </button>

          {/* Triggered Events History */}
          <div className="space-y-2 max-h-[160px] overflow-y-auto pr-1 custom-scrollbar border-t border-slate-800 pt-3">
            <div className="text-[11px] font-bold text-slate-400 uppercase">Recent Emergency & Breaking Triggers</div>
            {events.map((evt) => (
              <div key={evt.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs">
                <div className="font-bold text-red-400">{evt.title}</div>
                <div className="text-[11px] text-slate-400 line-clamp-2">{evt.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
