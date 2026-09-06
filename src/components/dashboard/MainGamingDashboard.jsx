import React from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { HourlyCollectorWidget } from './HourlyCollectorWidget.jsx';
import { PeoplesMeterWidget } from './PeoplesMeterWidget.jsx';
import {
  Megaphone,
  MapPin,
  Users,
  HeartHandshake,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  Trophy,
  Gift,
  Play,
  Share2,
  Tv,
  Coins,
  ShieldCheck,
  Calendar,
} from 'lucide-react';

export const MainGamingDashboard = ({ onNavigateTab }) => {
  const {
    parties,
    selectedPartyId,
    userHandle,
    role,
    userState,
    userDistrict,
    userConstituency,
    playerPopularity,
    playerSalaryBalance,
    leaderLevel,
    levelXpPercent,
    seats,
    partyNominations,
    ministryAnnouncements,
    earningsItems,
    claimEarningItem,
    dailyTasks,
    articles,
  } = useGame();

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const actualHandle = userHandle || '@Candidate';
  const actualRole = role ? role.toUpperCase() : 'POLITICIAN';
  const actualConstituency = userConstituency || 'Coimbatore';
  const actualState = userState || 'Tamil Nadu';

  // Compute actual dynamic post for this player
  let actualPost = 'Party High Command & MP';
  if (activeParty.leader === actualHandle) {
    actualPost = 'Party Supreme Leader 👑';
  } else if (activeParty.president === actualHandle) {
    actualPost = 'Party President 👑';
  } else if (activeParty.posts && activeParty.posts[actualHandle]) {
    actualPost = activeParty.posts[actualHandle];
  } else {
    const isNominated = partyNominations.some((n) => n.candidateName === actualHandle);
    const isMinister = ministryAnnouncements.some((m) => m.ministerName === actualHandle);
    const isMP = seats.some((s) => s.constituencyName === actualConstituency && s.leadingPartyId === activeParty.id);

    if (isMinister) actualPost = 'Designated Cabinet Minister';
    else if (isNominated) actualPost = `Declared Candidate (${actualConstituency})`;
    else if (isMP) actualPost = `Member of Parliament (${actualConstituency})`;
    else actualPost = 'State President & MP';
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Main Section: Hero Banner (Left 8 cols) + Player Profile Card (Right 4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sansad Bhavan Sunset Hero Banner (8 Cols) */}
        <div className="lg:col-span-8 relative rounded-3xl overflow-hidden border border-amber-500/30 shadow-2xl min-h-[300px] flex flex-col justify-end p-8 bg-slate-950">
          {/* Background Sunset Parliament Artwork */}
          <div
            className="absolute inset-0 bg-cover bg-center opacity-40 hover:opacity-50 transition-opacity duration-700 pointer-events-none"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1596176530529-78163a4f7af2?q=80&w=1600&auto=format&fit=crop')`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-[#060913]/60 to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 space-y-3 max-w-xl">
            <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/30 font-mono inline-block">
              Sovereign National Campaign Mode
            </span>

            <h1 className="text-3xl lg:text-4xl font-black text-white font-display tracking-tight drop-shadow-lg">
              BUILD YOUR NATION. WIN THE TRUST.
            </h1>

            <p className="text-xs text-slate-300 font-medium tracking-wide">
              Campaign. Win. Rule. Reform. Lead 543 Lok Sabha seats and steer constitutional policies.
            </p>

            <div className="pt-2">
              <button
                onClick={() => onNavigateTab('elections')}
                className="btn-gold-action px-6 py-3 rounded-xl text-xs flex items-center gap-2"
              >
                <span>VIEW ROADMAP</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Player Profile Card (4 Cols) - Actual Dynamic Player Stats */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-amber-500/30 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-5">
          <div className="flex items-center gap-4">
            {/* Party Flag / Logo Crest Avatar */}
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/30 shrink-0">
              <div className="w-full h-full bg-[#0a0d1a] rounded-[14px] flex items-center justify-center text-3xl">
                {activeParty.symbol || '🦁'}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-1.5">
                <h3 className="font-extrabold text-lg text-white font-display">{actualHandle}</h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-xs text-amber-400 font-extrabold flex items-center gap-1">
                <span>{activeParty.symbol}</span>
                <span>{activeParty.name} ({activeParty.shortName})</span>
              </p>
              <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">{actualRole}</span>
                <span>• 📍 {actualConstituency}, {actualState}</span>
              </div>
            </div>
          </div>

          {/* Active Constitutional Post */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">ACTIVE POST:</span>
            <span className="text-xs font-extrabold text-amber-300 flex items-center gap-1">
              {actualPost}
            </span>
          </div>

          {/* Player Live Stats Grid */}
          <div className="grid grid-cols-2 gap-2 text-center">
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Popularity</div>
              <div className="text-amber-400 font-mono font-black text-xs mt-0.5">{playerPopularity || 78}%</div>
            </div>
            <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Leader Level</div>
              <div className="text-sky-400 font-mono font-black text-xs mt-0.5">Lvl {leaderLevel || 1} ({levelXpPercent || 65}%)</div>
            </div>
          </div>

          {/* Quick Parliamentary Status */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Party Status</div>
              <div className="text-emerald-400 font-mono font-black text-xs mt-0.5">REGISTERED ECI</div>
            </div>
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Constitutional Rank</div>
              <div className="text-amber-400 font-mono font-black text-xs mt-0.5">TOP COALITION</div>
            </div>
          </div>
        </div>
      </div>

      {/* Hourly (1-Hour) Money Revenue Collector Widget */}
      <HourlyCollectorWidget />

      {/* Quick Actions Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Green Card: Start Campaign */}
        <div
          onClick={() => onNavigateTab('elections')}
          className="group cursor-pointer bg-gradient-to-br from-emerald-950/80 via-slate-900 to-slate-950 border border-emerald-500/30 hover:border-emerald-400 p-5 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mb-4 group-hover:scale-110 transition-transform">
            <Megaphone className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-base text-white font-display">START CAMPAIGN</h4>
          <p className="text-xs text-slate-400 mt-1">Use energy to campaign across 543 constituencies</p>
        </div>

        {/* Blue Card: Contest Seat */}
        <div
          onClick={() => onNavigateTab('elections')}
          className="group cursor-pointer bg-gradient-to-br from-sky-950/80 via-slate-900 to-slate-950 border border-sky-500/30 hover:border-sky-400 p-5 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 mb-4 group-hover:scale-110 transition-transform">
            <MapPin className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-base text-white font-display">CONTEST SEAT</h4>
          <p className="text-xs text-slate-400 mt-1">Select a constituency and fight the election</p>
        </div>

        {/* Purple Card: Party Headquarter */}
        <div
          onClick={() => onNavigateTab('workspace')}
          className="group cursor-pointer bg-gradient-to-br from-purple-950/80 via-slate-900 to-slate-950 border border-purple-500/30 hover:border-purple-400 p-5 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-base text-white font-display">PARTY HEADQUARTER</h4>
          <p className="text-xs text-slate-400 mt-1">Manage members, roles and manifesto pledges</p>
        </div>

        {/* Gold Card: Alliances */}
        <div
          onClick={() => onNavigateTab('workspace')}
          className="group cursor-pointer bg-gradient-to-br from-amber-950/80 via-slate-900 to-slate-950 border border-amber-500/30 hover:border-amber-400 p-5 rounded-3xl shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
            <HeartHandshake className="w-6 h-6" />
          </div>
          <h4 className="font-extrabold text-base text-white font-display">ALLIANCES</h4>
          <p className="text-xs text-slate-400 mt-1">Form coalitions and strengthen parliamentary power</p>
        </div>
      </div>

      {/* People's Satisfaction & Sentiment Meter Widget */}
      <PeoplesMeterWidget />

      {/* Main Bottom Gaming Workspace Grid: Earnings Center + Daily Tasks + Latest Updates */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Earnings Center (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-display">
              <Coins className="w-4 h-4 text-amber-400" />
              EARNINGS CENTER
            </h3>
          </div>

          <div className="space-y-2.5">
            {earningsItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800/90 rounded-2xl p-3 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="text-xs font-bold text-white">{item.title}</div>
                  <div className="text-[11px] font-mono font-extrabold text-emerald-400">{item.reward}</div>
                </div>

                <button
                  onClick={() => claimEarningItem(item.id)}
                  disabled={item.claimed}
                  className={`px-3 py-1.5 rounded-xl font-black text-[10px] transition ${
                    item.claimed
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                  }`}
                >
                  {item.btnText}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Tasks (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2 font-display">
                <CheckCircle2 className="w-4 h-4 text-sky-400" />
                DAILY TASKS
              </h3>
              <span className="text-[10px] font-mono text-slate-400">Resets in: 08h 45m</span>
            </div>

            <div className="space-y-2.5 mt-3">
              {dailyTasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-slate-950 border border-slate-800/90 rounded-2xl p-3 flex items-center justify-between gap-2"
                >
                  <div className="flex-1">
                    <div className="text-xs font-bold text-slate-200">{task.title}</div>
                    <div className="flex items-center gap-2 text-[10px] mt-0.5">
                      <span className="text-slate-400 font-mono">{task.progress}</span>
                      <span className="text-amber-400 font-mono font-bold">{task.reward}</span>
                    </div>
                  </div>

                  <button className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-[10px] transition">
                    {task.status}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button className="w-full py-2.5 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-extrabold text-xs rounded-xl transition mt-4">
            VIEW ALL TASKS
          </button>
        </div>

        {/* Right Column: Latest Updates & Progress (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Latest Updates Feed */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-display">LATEST UPDATES</h3>
              <span className="text-[10px] text-amber-400 font-bold cursor-pointer hover:underline">VIEW ALL &gt;</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-xl shrink-0">
                  🏛️
                </div>
                <div className="flex-1 overflow-hidden">
                  <h5 className="font-extrabold text-xs text-white truncate">Parliament Session Begins</h5>
                  <p className="text-[10px] text-slate-400 truncate">New bills are open for discussion and voting.</p>
                  <span className="text-[9px] text-slate-500 font-mono">2h ago</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-950 p-2.5 rounded-2xl border border-slate-800/80">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-xl shrink-0">
                  📢
                </div>
                <div className="flex-1 overflow-hidden">
                  <h5 className="font-extrabold text-xs text-white truncate">Maha Jan Rally in Mumbai</h5>
                  <p className="text-[10px] text-slate-400 truncate">Your rally in Mumbai was a huge success!</p>
                  <span className="text-[9px] text-slate-500 font-mono">5h ago</span>
                </div>
              </div>
            </div>
          </div>

          {/* Constitutional Salary & EOI Business Portfolio Card */}
          <div className="bg-slate-900/90 border border-amber-500/30 rounded-3xl p-5 shadow-xl space-y-3">
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider font-display flex items-center justify-between">
              <span>CONSTITUTIONAL EARNINGS & SALARY</span>
              <span className="text-emerald-400 font-mono text-[10px]">EOI REAL ECONOMIC MODEL</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-bold">Active MP Salary Rate:</span>
                <span className="text-amber-300 font-mono font-black">₹ 1,00,000 / day</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-2xl border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400 font-bold">Business Yield (1-Hr):</span>
                <span className="text-emerald-400 font-mono font-black">₹ 5,00,000 / hour</span>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('market')}
              className="w-full py-2.5 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-extrabold text-xs rounded-xl transition flex items-center justify-center gap-1.5"
            >
              💼 MANAGE BUSINESSES & ASSETS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
