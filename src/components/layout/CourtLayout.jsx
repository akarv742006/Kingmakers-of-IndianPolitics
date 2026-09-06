import React, { useState } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { JudgeDashboard } from '../judge/JudgeDashboard.jsx';
import { LiveMediaTicker } from '../media/LiveMediaTicker.jsx';
import {
  Scale,
  Gavel,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Bot,
  FileText,
  ShieldAlert,
  LogOut,
  Sparkles,
  Users
} from 'lucide-react';

export const CourtLayout = () => {
  const {
    userHandle,
    logoutUser,
    aiChiefJusticeEnabled,
    setAiChiefJusticeEnabled,
    petitions,
    filePetition,
    publishNewsArticle
  } = useGame();

  const [activeCourtTab, setActiveCourtTab] = useState('DOCKET');
  const [pilSubject, setPilSubject] = useState('');
  const [pilDetails, setPilDetails] = useState('');
  const [pilStatusMsg, setPilStatusMsg] = useState('');

  const pendingPetitionsCount = petitions.filter((p) => p.status === 'PENDING').length;

  const courtNavItems = [
    { id: 'DOCKET', label: 'SUPREME COURT DOCKET', icon: Gavel, badgeCount: pendingPetitionsCount },
    { id: 'PIL', label: 'PUBLIC INTEREST LITIGATION (PIL)', icon: FileText },
    { id: 'DEFECTION', label: '10TH SCHEDULE ANTI-DEFECTION', icon: Scale },
    { id: 'STAY', label: 'CONSTITUTIONAL INJUNCTIONS', icon: AlertOctagon },
  ];

  const handlePublishPILOrder = (e) => {
    e.preventDefault();
    if (!pilSubject.trim()) return;

    filePetition({
      petitioner: 'Citizen Public Interest Group',
      respondent: 'Union of India / State Authority',
      subject: pilSubject.trim(),
      category: 'MCC_VIOLATION',
      details: pilDetails.trim() || 'Suo Moto PIL admitted by Chief Justice of India.',
    });

    publishNewsArticle({
      headline: `⚖️ SUPREME COURT ADMITS PIL: ${pilSubject.trim()}`,
      content: `Chief Justice Bench has admitted a Public Interest Litigation: ${pilDetails.trim() || 'Hearing scheduled in Constitutional Bench.'}`,
      author: 'SUPREME COURT PRESS BUREAU / LAW NEWS',
      bias: 'NEUTRAL',
    });

    setPilStatusMsg(`PIL '${pilSubject}' successfully admitted into Judicial Docket!`);
    setPilSubject('');
    setPilDetails('');
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-100 font-sans game-bg-grid flex flex-col justify-between selection:bg-purple-500 selection:text-slate-950">
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-3 lg:p-6 gap-6">
        {/* Left Judiciary Sidebar Navigation */}
        <aside className="w-full lg:w-64 bg-slate-900/90 border border-purple-500/40 rounded-3xl p-4 shadow-2xl flex flex-col justify-between shrink-0 space-y-6">
          <div className="space-y-6">
            {/* Supreme Court Brand Header */}
            <div className="flex items-center gap-3 px-2 pt-2 border-b border-slate-800 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 p-0.5 shadow-lg shadow-purple-500/30 shrink-0">
                <div className="w-full h-full bg-[#080612] rounded-[14px] flex items-center justify-center text-purple-400">
                  <Scale className="w-6 h-6" />
                </div>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-black text-sm tracking-wider font-display text-purple-400 leading-tight uppercase">
                  SUPREME COURT
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] text-purple-300 font-bold bg-purple-500/20 px-1.5 py-0.2 rounded font-mono">
                    CHIEF JUSTICE BENCH
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">ART. 32</span>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="space-y-1">
              {courtNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeCourtTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveCourtTab(item.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/10 text-purple-300 border border-purple-500/40 shadow-lg shadow-purple-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badgeCount > 0 && (
                      <span className="bg-purple-500 text-white font-black text-[10px] px-2 py-0.5 rounded-full font-mono">
                        {item.badgeCount}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* AI Chief Justice Auto-Pilot */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <button
              onClick={() => setAiChiefJusticeEnabled(!aiChiefJusticeEnabled)}
              className={`w-full p-3 rounded-2xl border transition flex items-center justify-between text-xs font-black ${
                aiChiefJusticeEnabled
                  ? 'bg-purple-500/20 border-purple-500/40 text-purple-300'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2">
                <Bot className={`w-4 h-4 ${aiChiefJusticeEnabled ? 'text-purple-400 animate-pulse' : 'text-slate-500'}`} />
                <span>AI Bench Auto-Adjudication</span>
              </div>
              <span className="text-[10px] font-mono">{aiChiefJusticeEnabled ? 'ON' : 'OFF'}</span>
            </button>
          </div>
        </aside>

        {/* Right Main Judiciary Content Column */}
        <div className="flex-1 space-y-6 overflow-hidden">
          {/* Judiciary Header Bar */}
          <header className="bg-slate-900/90 border border-purple-500/30 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500/20 border border-purple-500/40 text-purple-300 px-3 py-1.5 rounded-2xl text-xs font-black font-mono">
                JUDICIAL CHAMBERS
              </div>
              <div className="text-xs text-slate-300 font-bold">
                Chief Justice of India: <strong className="text-white font-mono">{userHandle || '@ChiefJustice_India'}</strong>
              </div>
            </div>

            <button
              onClick={logoutUser}
              className="px-4 py-2 rounded-2xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition text-xs font-bold flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>LOGOUT JUDICIARY ROLE</span>
            </button>
          </header>

          {/* Live News Ticker */}
          <LiveMediaTicker />

          {/* Main Tab Views */}
          <main className="space-y-6">
            {activeCourtTab === 'DOCKET' && <JudgeDashboard />}

            {activeCourtTab === 'PIL' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 font-display">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Admit Public Interest Litigation (PIL) / Suo Moto Bench Hearing
                </h3>

                {pilStatusMsg && (
                  <div className="p-3 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold">
                    {pilStatusMsg}
                  </div>
                )}

                <form onSubmit={handlePublishPILOrder} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-slate-300 font-bold mb-1">PIL Subject / Cause Title:</label>
                    <input
                      type="text"
                      value={pilSubject}
                      onChange={(e) => setPilSubject(e.target.value)}
                      placeholder="e.g. Free and Fair Campaigning Guidelines in State Elections"
                      className="w-full bg-slate-950 border border-slate-800 text-white font-bold p-3 rounded-xl focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-300 font-bold mb-1">Constitutional Grounds & Prayer:</label>
                    <textarea
                      rows={3}
                      value={pilDetails}
                      onChange={(e) => setPilDetails(e.target.value)}
                      placeholder="Factual context and specific directions sought from the Supreme Court Bench..."
                      className="w-full bg-slate-950 border border-slate-800 text-white p-3 rounded-xl focus:outline-none focus:border-purple-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                  >
                    Admit PIL into Supreme Court Docket
                  </button>
                </form>
              </div>
            )}

            {activeCourtTab === 'DEFECTION' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 font-display">
                  <Scale className="w-5 h-5 text-purple-400" />
                  10th Schedule Anti-Defection Disqualification Desk
                </h3>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-amber-400 block">Constitutional Bench Rulings Active</span>
                  <p className="text-slate-300">Presiding over defection petitions against MPs/MLAs switching party affiliation after election victory.</p>
                </div>
              </div>
            )}

            {activeCourtTab === 'STAY' && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2 font-display">
                  <AlertOctagon className="w-5 h-5 text-purple-400" />
                  Constitutional Injunctions & Stay Order Desk
                </h3>
                <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-xs space-y-2">
                  <span className="font-bold text-sky-400 block">Interim Orders & Injunctions</span>
                  <p className="text-slate-300">Issue urgent stay orders against executive actions, campaign bans, or contested bill enforcement.</p>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
