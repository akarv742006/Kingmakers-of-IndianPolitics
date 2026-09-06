import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { ECIDashboard } from '../eci/ECIDashboard.jsx';
import { LiveMediaTicker } from '../media/LiveMediaTicker.jsx';
import {
  ShieldCheck,
  Scale,
  Vote,
  Building2,
  CheckSquare,
  FileText,
  AlertOctagon,
  Clock,
  Bot,
  Sparkles,
  LogOut,
  Bell,
  Mail,
  Settings,
  Users,
  MessageSquare
} from 'lucide-react';

export const ECILayout = () => {
  const {
    userHandle,
    logoutUser,
    electionPhase,
    currentPhaseNumber,
    advanceElectionPhase,
    announceGeneralElection,
    aiECIEnabled,
    setAiECIEnabled,
    customApplications,
    publishNewsArticle
  } = useGame();

  const [activeEciTab, setActiveEciTab] = useState('SCHEDULE');
  const [gazetteTitle, setGazetteTitle] = useState('');
  const [gazetteContent, setGazetteContent] = useState('');
  const [gazetteStatusMsg, setGazetteStatusMsg] = useState('');

  const pendingApps = customApplications.filter((a) => a.status === 'PENDING');

  const eciNavMenuItems = [
    { id: 'SCHEDULE', label: 'POLL SCHEDULE & OVERVIEW', icon: Vote },
    { id: 'MCC', label: 'MODEL CODE OF CONDUCT', icon: Scale },
    { id: 'REGISTRATION', label: 'PARTY REGISTRATION & SYMBOLS', icon: Building2, badgeCount: pendingApps.length },
    { id: 'SECURITY', label: 'EVM SECURITY & OBSERVERS', icon: ShieldCheck },
    { id: 'GAZETTE', label: 'GAZETTE NOTIFICATIONS', icon: FileText },
  ];

  const handlePublishGazette = (e) => {
    e.preventDefault();
    if (!gazetteTitle.trim()) return;

    publishNewsArticle({
      headline: `📜 ECI GAZETTE NOTIFICATION: ${gazetteTitle.trim()}`,
      content: gazetteContent.trim() || 'Official order issued by Chief Election Commissioner of India under Article 324 of the Constitution.',
      author: 'ELECTION COMMISSION OF INDIA (NIRVACHAN SADAN)',
      bias: 'NEUTRAL',
    });

    setGazetteStatusMsg(`Gazette Notification '${gazetteTitle}' officially promulgated and broadcasted across India!`);
    setGazetteTitle('');
    setGazetteContent('');
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-100 font-sans game-bg-grid flex flex-col justify-between selection:bg-blue-500 selection:text-slate-950">
      {/* Main Shell: Left ECI Navigation + Right Workspace */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-3 lg:p-6 gap-6">
        {/* Left ECI Sidebar Navigation (Distinctive ECI Theme) */}
        <aside className="w-full lg:w-64 bg-slate-900/90 border border-blue-500/40 rounded-3xl p-4 shadow-2xl flex flex-col justify-between shrink-0 space-y-6">
          <div className="space-y-6">
            {/* ECI Brand Header */}
            <div className="flex items-center gap-3 px-2 pt-2 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 p-0.5 shadow-lg shadow-blue-500/30 shrink-0">
                <div className="w-full h-full bg-[#070a14] rounded-[14px] flex items-center justify-center text-blue-400">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-black text-sm tracking-wider font-display text-blue-400 leading-tight uppercase">
                  ELECTION COMMISSION
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] text-blue-300 font-bold bg-blue-500/20 px-1.5 py-0.2 rounded font-mono">
                    NIRVACHAN SADAN
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">ART. 324</span>
                </div>
              </div>
            </div>

            {/* ECI Navigation Links */}
            <nav className="space-y-1">
              {eciNavMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeEciTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveEciTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/10 text-blue-300 border border-blue-500/40 shadow-lg shadow-blue-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeCount > 0 && (
                      <span className="bg-emerald-500 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full font-mono">
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI ECI Agent Auto-Pilot Status Box */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => setAiECIEnabled(!aiECIEnabled)}
              className={`w-full p-3 rounded-2xl border transition flex items-center justify-between text-xs font-black ${
                aiECIEnabled
                  ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bot className={`w-4 h-4 ${aiECIEnabled ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
                <span>AI ECI Auto-Pilot</span>
              </div>
              <span className="text-[10px] font-mono">{aiECIEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </aside>

        {/* Right Main ECI Content Column */}
        <div className="flex-1 space-y-6 overflow-hidden">
          {/* ECI Top Control Header Bar */}
          <header className="bg-slate-900/90 border border-blue-500/30 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/20 border border-blue-500/40 text-blue-300 px-3 py-1.5 rounded-2xl text-xs font-black font-mono">
                CONSTITUTIONAL DESK
              </div>
              <div className="text-xs text-slate-300 font-bold">
                Chief Commissioner: <strong className="text-white font-mono">{userHandle || '@ECI_Commissioner'}</strong>
              </div>
            </div>

            {/* Phase & Announce Control */}
            <div className="flex flex-wrap items-center gap-2.5 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
              <div className="text-[10px] uppercase font-mono font-bold text-slate-400">
                Phase: <strong className="text-emerald-400">{electionPhase.replace(/_/g, ' ')}</strong>
              </div>
              <button
                onClick={() => announceGeneralElection()}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition shadow flex items-center gap-1.5"
              >
                <span>📢 Announce Election</span>
              </button>
              <button
                onClick={advanceElectionPhase}
                className="bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs px-3.5 py-1.5 rounded-xl transition shadow flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" /> Advance Poll
              </button>
            </div>

            {/* Logout Button */}
            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition text-xs font-bold flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT ECI ROLE</span>
            </button>
          </header>

          {/* Live News Broadcast Ticker */}
          <LiveMediaTicker />

          {/* ECI Active Tab Workspace Content */}
          <main className="space-y-6">
            {activeEciTab === 'SCHEDULE' && <ECIDashboard />}

            {activeEciTab === 'MCC' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 font-display">
                  <Scale className="w-5 h-5 text-blue-400" />
                  Model Code of Conduct (MCC) Compliance & Disqualification Desk
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-amber-400 block">Rally Sound Cutoff (10:00 PM)</span>
                    <p className="text-slate-300">All political rallies must strictly terminate sound systems by 10:00 PM. Violators subject to Campaign Suspension Order.</p>
                  </div>
                  <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 space-y-2">
                    <span className="font-bold text-sky-400 block">Expenditure Cap Audit (₹95 Lakhs/Seat)</span>
                    <p className="text-slate-300">Audit team inspecting candidate campaign accounts across 543 Lok Sabha constituencies.</p>
                  </div>
                </div>
              </div>
            )}

            {activeEciTab === 'REGISTRATION' && <ECIDashboard />}

            {activeEciTab === 'SECURITY' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 font-display">
                  <ShieldCheck className="w-5 h-5 text-blue-400" />
                  EVM Security Audit & Central Observers Deployment
                </h3>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-emerald-400">100% VVPAT Audit Verification Active</span>
                  <p className="text-slate-300">Central Armed Police Forces (CAPF) deployed across all 10.5 Lakh polling booths in 28 States & 8 UTs.</p>
                </div>
              </div>
            )}

            {activeEciTab === 'GAZETTE' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 font-display">
                  <FileText className="w-5 h-5 text-blue-400" />
                  Promulgate Official ECI Gazette Notification
                </h3>

                {gazetteStatusMsg && (
                  <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-bold">
                    {gazetteStatusMsg}
                  </div>
                )}

                <form onSubmit={handlePublishGazette} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Gazette Order Title:</label>
                    <input
                      type="text"
                      value={gazetteTitle}
                      onChange={(e) => setGazetteTitle(e.target.value)}
                      placeholder="e.g. Schedule of 7-Phase Polling in 543 Lok Sabha Seats"
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold p-3 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Official Statutory Text / Terms:</label>
                    <textarea
                      rows={3}
                      value={gazetteContent}
                      onChange={(e) => setGazetteContent(e.target.value)}
                      placeholder="Details of the ECI notification..."
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                  >
                    Promulgate ECI Gazette Notification
                  </button>
                </form>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
