import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext.jsx';
import { LiveMediaTicker } from '../media/LiveMediaTicker.jsx';
import { CourtComplaintModal } from '../judge/CourtComplaintModal.jsx';
import { PartyFundTransferModal } from '../politician/PartyFundTransferModal.jsx';
import { HourlyCollectorWidget } from '../dashboard/HourlyCollectorWidget.jsx';
import { ECILayout } from './ECILayout.jsx';
import {
  Home,
  Megaphone,
  Vote,
  Building2,
  Briefcase,
  Users,
  HeartHandshake,
  TrendingUp,
  Trophy,
  Star,
  ShoppingBag,
  Headphones,
  Crown,
  Bell,
  Mail,
  Settings,
  Zap,
  Gem,
  Coins,
  ChevronRight,
  Plus,
  Scale,
  MessageSquare,
  LogOut,
  Share2,
  Menu,
  X,
} from 'lucide-react';

export const GameLayout = ({ activeTab, setActiveTab, children }) => {
  const {
    playerSalaryBalance,
    supporters,
    energy,
    maxEnergy,
    diamonds,
    parties,
    selectedPartyId,
    userHandle,
    role,
    logoutUser,
  } = useGame();

  // If role is ECI (Election Commission), render separate dedicated ECI interface!
  if (role === 'eci') {
    return <ECILayout />;
  }

  const activeParty = parties.find((p) => p.id === selectedPartyId) || parties[0];

  const [sidebarTab, setSidebarTab] = useState('HOME');
  const [countdown, setCountdown] = useState({ days: 15, hrs: 8, mins: 45, secs: 32 });
  const [isCourtModalOpen, setIsCourtModalOpen] = useState(false);
  const [isPartyFundModalOpen, setIsPartyFundModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Countdown timer tick
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.secs > 0) return { ...prev, secs: prev.secs - 1 };
        return { ...prev, secs: 59, mins: prev.mins > 0 ? prev.mins - 1 : 59 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const navMenuItems = [
    { id: 'HOME', label: 'HOME', icon: Home, tabTarget: 'home' },
    { id: 'CAMPAIGN', label: 'CAMPAIGN', icon: Megaphone, tabTarget: 'campaign' },
    { id: 'BUSINESS', label: 'BUSINESS', icon: Briefcase, tabTarget: 'business' },
    { id: 'TWITTER', label: 'TWITTER / X', icon: Share2, tabTarget: 'twitter' },
    { id: 'PARLIAMENT', label: 'PARLIAMENT', icon: Building2, tabTarget: 'parliament' },
    { id: 'GOVERNMENT', label: 'GOVERNMENT', icon: Briefcase, tabTarget: 'government' },
    { id: 'PARTY', label: 'PARTY HQ', icon: Users, tabTarget: 'party' },
    { id: 'ALLIANCES', label: 'ALLIANCES', icon: HeartHandshake, tabTarget: 'alliances' },
    { id: 'MARKET', label: 'MARKET', icon: TrendingUp, tabTarget: 'market' },
    { id: 'MESSAGING', label: 'MESSAGING', icon: MessageSquare, tabTarget: 'messaging' },
    { id: 'RANKINGS', label: 'RANKINGS', icon: Trophy, tabTarget: 'results' },
    { id: 'STORE', label: 'STORE', icon: ShoppingBag, tabTarget: 'store' },
  ];

  const handleNavClick = (menuItem) => {
    setSidebarTab(menuItem.id);
    setActiveTab(menuItem.tabTarget);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#050810] text-slate-100 font-sans game-bg-grid flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      {/* Main Shell: Left Sidebar (Left) + Right Main Workspace (Right) */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1600px] w-full mx-auto p-2.5 sm:p-4 lg:p-6 gap-4 lg:gap-6">
        
        {/* Mobile Header Bar & Navigation Strip (< lg screens) */}
        <div className="lg:hidden bg-slate-900/90 border border-slate-800/90 rounded-2xl p-3 shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-md shrink-0">
                <div className="w-full h-full bg-[#070a14] rounded-[10px] flex items-center justify-center text-lg font-black text-amber-400">
                  {activeParty.symbol || '☸️'}
                </div>
              </div>
              <div>
                <h1 className="font-black text-xs tracking-wider font-display text-amber-400 uppercase leading-tight">
                  KINGMAKERS
                </h1>
                <span className="text-[9px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded font-mono">
                  {activeParty.shortName} • SOVEREIGN SIM
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-400 hover:text-white transition flex items-center gap-1.5 text-xs font-bold font-mono"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5 text-amber-400" /> : <Menu className="w-5 h-5 text-amber-400" />}
              <span>{isMobileMenuOpen ? 'CLOSE' : 'MENU'}</span>
            </button>
          </div>

          {/* Horizontal Scrollable Quick-Tab Strip for Mobile */}
          <div className="flex items-center gap-1.5 overflow-x-auto custom-scrollbar pb-1 pt-1 -mx-1 px-1">
            {navMenuItems.map((item) => {
              const Icon = item.icon;
              const isActive = sidebarTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item)}
                  className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black transition-all ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 shadow-md font-extrabold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Mobile Collapsible Menu Drawer */}
          {isMobileMenuOpen && (
            <div className="pt-2 border-t border-slate-800 space-y-1 animate-in fade-in duration-200">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = sidebarTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Left Sidebar Navigation Drawer for Desktop (lg:block, 260px wide) */}
        <aside className="hidden lg:flex w-64 bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 shadow-2xl flex-col justify-between shrink-0 space-y-6">
          <div className="space-y-6">
            {/* Top Brand Logo */}
            <div className="flex items-center gap-3 px-2 pt-2 border-b border-slate-800/80 pb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 shrink-0">
                <div className="w-full h-full bg-[#070a14] rounded-[14px] flex items-center justify-center text-2xl font-black text-amber-400">
                  {activeParty.symbol || '☸️'}
                </div>
              </div>
              <div className="overflow-hidden">
                <h1 className="font-black text-sm tracking-wider font-display text-amber-400 leading-tight uppercase">
                  KINGMAKERS OF INDIAN POLITICS
                </h1>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[9px] text-amber-300 font-bold bg-amber-500/20 px-1.5 py-0.2 rounded font-mono">
                    {activeParty.shortName}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono truncate">SOVEREIGN SIM</span>
                </div>
              </div>
            </div>

            {/* Sidebar Navigation Links */}
            <nav className="space-y-1">
              {navMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = sidebarTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-black transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 text-amber-300 border border-amber-500/40 shadow-lg shadow-amber-500/10'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Support & Feedback Button at Bottom */}
          <div className="pt-4 border-t border-slate-800/80">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 font-extrabold text-xs transition">
              <Headphones className="w-4 h-4 text-slate-400" />
              <span>SUPPORT & FEEDBACK</span>
            </button>
          </div>
        </aside>

        {/* Right Main Content Column */}
        <div className="flex-1 space-y-6 overflow-hidden">
          {/* Top Header Controls Bar */}
          <header className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-4 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Season Tagline */}
            <div className="hidden lg:block text-xs font-medium text-slate-400">
              <strong className="text-white font-bold">Season 1 • Republic Era</strong>
              <span className="text-slate-500 block text-[10px]">Serving the Nation, Shaping Tomorrow.</span>
            </div>

            {/* Next Election Countdown Timer */}
            <div className="flex items-center gap-3 bg-slate-950 px-4 py-2 rounded-2xl border border-slate-800">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                NEXT LOK SABHA ELECTION
              </span>

              <div className="flex items-center gap-2 font-mono text-xs font-black text-amber-300">
                <span>{String(countdown.days).padStart(2, '0')}<span className="text-[9px] text-slate-500 ml-0.5">DAYS</span></span>
                <span>{String(countdown.hrs).padStart(2, '0')}<span className="text-[9px] text-slate-500 ml-0.5">HRS</span></span>
                <span>{String(countdown.mins).padStart(2, '0')}<span className="text-[9px] text-slate-500 ml-0.5">MINS</span></span>
                <span>{String(countdown.secs).padStart(2, '0')}<span className="text-[9px] text-slate-500 ml-0.5">SECS</span></span>
              </div>
            </div>

            {/* Right Action Icons & Election Commission Office Button */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsCourtModalOpen(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:text-white font-extrabold text-xs flex items-center gap-1.5 transition shadow-md"
              >
                <Scale className="w-3.5 h-3.5 text-purple-400" />
                <span>⚖️ COURT COMPLAINT</span>
              </button>

              <button
                onClick={() => { setActiveTab('campaign'); setSidebarTab('CAMPAIGN'); }}
                className="btn-gold-action px-4 py-2.5 rounded-2xl text-xs flex items-center gap-2 font-black shadow-lg"
              >
                <span>🗳️ ELECTION COMMISSION OFFICE</span>
              </button>

              <div className="flex items-center gap-1.5 text-slate-400">
                <button className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:text-white transition">
                  <Bell className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:text-white transition">
                  <Mail className="w-4 h-4" />
                </button>
                <button className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:text-white transition">
                  <Settings className="w-4 h-4" />
                </button>
              </div>

              {/* Player Handle Profile Badge & Switch Role Button */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="bg-slate-950 px-3 py-1 rounded-xl border border-amber-500/30 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-[10px] flex items-center justify-center border border-amber-500/40">
                    👑
                  </div>
                  <div>
                    <div className="text-xs font-mono font-black text-white">{userHandle || '@Candidate'}</div>
                    <div className="text-[9px] font-mono text-amber-400 uppercase font-bold">{role}</div>
                  </div>
                </div>

                <button
                  onClick={logoutUser}
                  title="Switch Role / Log Out"
                  className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-red-400 hover:border-red-500/40 transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </header>

          {/* Live Auto Breaking News Broadcast Ticker */}
          <LiveMediaTicker onNavigateTab={(tab) => { setActiveTab(tab); setSidebarTab(tab.toUpperCase()); }} />

          {/* Top Resource HUD Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Treasury Balance */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center justify-between shadow">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold">
                  🪙
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">TREASURY</div>
                  <div className="text-xs font-black text-white font-mono">₹ {(playerSalaryBalance || 1245780).toLocaleString()}</div>
                </div>
              </div>
              <button
                onClick={() => setIsPartyFundModalOpen(true)}
                title="Transfer Funds to Party Treasury"
                className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold text-xs flex items-center justify-center hover:bg-amber-500 hover:text-slate-950 transition"
              >
                +
              </button>
            </div>

            {/* Supporters */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center justify-between shadow">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 text-xs font-bold">
                  👥
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">SUPPORTERS</div>
                  <div className="text-xs font-black text-white font-mono">{(supporters || 28560).toLocaleString()}</div>
                </div>
              </div>
              <button className="w-5 h-5 rounded-full bg-slate-800 text-sky-400 font-bold text-xs flex items-center justify-center hover:bg-sky-500 hover:text-slate-950 transition">
                +
              </button>
            </div>

            {/* Energy */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center justify-between shadow">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  ⚡
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">ENERGY</div>
                  <div className="text-xs font-black text-white font-mono">{energy}/{maxEnergy}</div>
                </div>
              </div>
              <button className="w-5 h-5 rounded-full bg-slate-800 text-emerald-400 font-bold text-xs flex items-center justify-center hover:bg-emerald-500 hover:text-slate-950 transition">
                +
              </button>
            </div>

            {/* Diamonds */}
            <div className="bg-slate-900/90 border border-slate-800 p-3 rounded-2xl flex items-center justify-between shadow">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-bold">
                  💎
                </div>
                <div>
                  <div className="text-[9px] text-slate-400 uppercase font-bold">DIAMONDS</div>
                  <div className="text-xs font-black text-white font-mono">{(diamonds || 1250).toLocaleString()}</div>
                </div>
              </div>
              <button className="w-5 h-5 rounded-full bg-slate-800 text-purple-400 font-bold text-xs flex items-center justify-center hover:bg-purple-500 hover:text-slate-950 transition">
                +
              </button>
            </div>
          </div>

          {/* Children View Slot */}
          <div className="pt-2">{children}</div>
        </div>
      </div>

      {/* Bottom Footer Strip */}
      <footer className="border-t border-slate-800/80 bg-[#050811]/90 backdrop-blur-xl py-3 px-6 text-xs text-slate-400">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 font-sans">
          <div className="text-amber-400 font-bold text-[11px] font-mono flex items-center gap-1.5">
            <span>👑 Kingmakers of Indian Politics</span>
            <span className="text-slate-500">• Official Sovereign Sim</span>
          </div>

          <div className="text-slate-400 italic text-[11px] text-center font-display">
            “Politics isn’t about power. It’s about purpose.”
          </div>

        </div>
      </footer>

      {/* Court & Party Fund Modals */}
      <CourtComplaintModal isOpen={isCourtModalOpen} onClose={() => setIsCourtModalOpen(false)} />
      <PartyFundTransferModal isOpen={isPartyFundModalOpen} onClose={() => setIsPartyFundModalOpen(false)} />
    </div>
  );
};
