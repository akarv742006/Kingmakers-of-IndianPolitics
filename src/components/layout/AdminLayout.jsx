import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { AdminDashboard } from '../admin/AdminDashboard.jsx';
import { LiveMediaTicker } from '../media/LiveMediaTicker.jsx';
import {
  KeyRound,
  Sliders,
  Flame,
  Zap,
  Landmark,
  LogOut,
  ShieldAlert,
  RotateCcw,
  Sparkles
} from 'lucide-react';

export const AdminLayout = () => {
  const { userHandle, logoutUser, resetGame, triggerEvent } = useGame();

  const [activeAdminTab, setActiveAdminTab] = useState('ENGINE');

  const adminNavItems = [
    { id: 'ENGINE', label: 'SOVEREIGN ENGINE CONSOLE', icon: Sliders },
    { id: 'BUDGET', label: 'UNION & STATE FISCAL DESK', icon: Landmark },
    { id: 'EVENTS', label: 'BREAKING CRISIS INJECTOR', icon: Zap },
  ];

  return (
    <div className="min-h-screen bg-[#050810] text-slate-100 font-sans game-bg-grid flex flex-col justify-between selection:bg-red-500 selection:text-slate-950">
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-3 lg:p-6 gap-6">
        {/* Left Admin Navigation */}
        <aside className="w-full lg:w-64 bg-slate-900/90 border border-red-500/40 rounded-3xl p-4 shadow-2xl flex flex-col justify-between shrink-0 space-y-6">
          <div className="space-y-6">
            {/* Admin Header */}
            <div className="flex items-center gap-3 px-2 pt-2 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 p-0.5 shadow-lg shadow-red-500/30 shrink-0">
                <div className="w-full h-full bg-[#120606] rounded-[14px] flex items-center justify-center text-red-400">
                  <KeyRound className="w-6 h-6" />
                </div>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-black text-sm tracking-wider font-display text-red-400 leading-tight uppercase">
                  SOVEREIGN ADMIN
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] text-red-300 font-bold bg-red-500/20 px-1.5 py-0.2 rounded font-mono">
                    GOD MODE ACTIVE
                  </span>
                </div>
              </div>
            </div>

            {/* Admin Nav */}
            <nav className="space-y-1">
              {adminNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeAdminTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveAdminTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-red-500/20 via-orange-500/20 to-red-500/10 text-red-300 border border-red-500/40 shadow-lg shadow-red-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-red-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Emergency Reset Button */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={resetGame}
              className="w-full p-3 rounded-2xl bg-red-600/20 hover:bg-red-600/40 border border-red-500/50 text-red-300 transition text-xs font-black flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" /> Reset Simulation State
            </button>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className="flex-1 space-y-6 overflow-hidden">
          {/* Header */}
          <header className="bg-slate-900/90 border border-red-500/30 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-red-500/20 border border-red-500/40 text-red-300 px-3 py-1.5 rounded-2xl text-xs font-black font-mono">
                ADMIN CONSOLE
              </div>
              <div className="text-xs text-slate-300 font-bold">
                Game Master: <strong className="text-white font-mono">{userHandle || '@Sovereign_Admin'}</strong>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition text-xs font-bold flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT ADMIN ROLE</span>
            </button>
          </header>

          <LiveMediaTicker />

          <main className="space-y-6">
            <AdminDashboard />
          </main>
        </div>
      </div>
    </div>
  );
};
